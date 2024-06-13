import os
os.environ["PYTORCH_CUDA_ALLOC_CONF"] = "expandable_segments:True"
os.environ["CUDA_LAUNCH_BLOCKING"] = "1"
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

import pandas as pd
from PIL import Image
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms, models
from tqdm import tqdm
from time import time
import numpy as np
import torch.cuda.amp as amp
from torch.utils.checkpoint import checkpoint_sequential
from torch.utils.tensorboard import SummaryWriter  # Add this import for TensorBoard

torch.set_default_device("cuda")
torch.cuda.empty_cache()

class XrayDataset(Dataset):
    def __init__(self, csv_file, root_dir, split_file, transform=None):
        print("Initializing dataset...")
        self.data = pd.read_csv(csv_file)
        self.root_dir = root_dir
        self.split_file = split_file
        self.transform = transform
        self.file_paths, self.labels = self._load_split_data()
        
    def _load_split_data(self):
        print("Loading split data...")
        with open(self.split_file, 'r') as f:
            split_paths = [line.strip() for line in f]
        
        file_paths = []
        labels = []
        
        for path in split_paths:
            path_with_prefix = os.path.join(self.root_dir, path)
            if path_with_prefix in self.data.iloc[:, 0].values:
                idx = self.data[self.data.iloc[:, 0] == path_with_prefix].index[0]
                file_paths.append(path_with_prefix)
                labels.append(self._process_labels(self.data.iloc[idx, 1]))
        
        return file_paths, labels
    
    def _process_labels(self, label_str):
        return [int(x) for x in label_str.split('|')]
    
    def __len__(self):
        return len(self.file_paths)
    
    def __getitem__(self, idx):
        img_path = self.file_paths[idx]
        image = Image.open(img_path).convert('RGB')
        
        if self.transform:
            image = self.transform(image)
        
        labels = self.labels[idx]
        labels = torch.tensor(labels, dtype=torch.float)  # Use float for BCEWithLogitsLoss
        
        return image, labels

image_width, image_height = 512, 512
# Set image parameters (unchanged)
transform = transforms.Compose([
    transforms.Resize((image_width, image_height)),
    transforms.ToTensor(),
])

# def custom_collate(batch):
#     images, labels = zip(*batch)
    
#     # Resize images to a common size (e.g., (1024, 1024)) and convert to tensor
#     images = [transforms.Resize((image_width, image_height))(img) for img in images]
#     images = torch.stack(images, dim=0)
    
#     # Pad labels to a fixed length (assuming max length is known or calculated)
#     max_label_length = max(len(label) for label in labels)
#     padded_labels = torch.zeros(len(labels), max_label_length, dtype=torch.float)
    
#     for i, label in enumerate(labels):
#         padded_labels[i, :len(label)] = torch.tensor(label, dtype=torch.float)
    
#     return images, padded_labels

def custom_collate(batch):
    images, labels = zip(*batch)
    
    # Convert images to a tensor and stack them
    images = torch.stack(images, dim=0)
    
    # Convert labels to a tensor
    labels_tensor = []
    for label in labels:
        labels_tensor.append(torch.tensor(label, dtype=torch.float))
    
    return images, labels_tensor

# Define the DenseNet121 model (unchanged)
class DenseNet121(nn.Module):
    def __init__(self, num_classes):
        super(DenseNet121, self).__init__()
        self.densenet121 = models.densenet121(weights = models.DenseNet121_Weights.DEFAULT)  # Use pretrained weights
        num_ftrs = self.densenet121.classifier.in_features
        self.densenet121.classifier = nn.Linear(num_ftrs, num_classes).to(device)
        self.num_segments = 4  # Number of segments for checkpointing
    
    def forward(self, x):
        x = checkpoint_sequential(self.densenet121.features, self.num_segments, x)
        x = self.densenet121.classifier(x)
        return x


if __name__ == "__main__":
    # Initialize TensorBoard writer
    log_dir = "./logs"  # Specify your preferred log directory
    os.makedirs(log_dir, exist_ok=True)
    writer = SummaryWriter(log_dir=log_dir)

    # Paths and files (unchanged)
    csv_file = r'C:\Users\Nerds Of Prey 1\Documents\GitHub\PostgreSQL-RESTful-Auth\model\nih_xrays\data.csv'
    root_dir = r'C:\Users\Nerds Of Prey 1\Documents\GitHub\PostgreSQL-RESTful-Auth\model\nih_xrays\images'
    train_val_split_file = r'C:\Users\Nerds Of Prey 1\Documents\GitHub\PostgreSQL-RESTful-Auth\model\nih_xrays\train_val_list.txt'
    test_split_file = r'C:\Users\Nerds Of Prey 1\Documents\GitHub\PostgreSQL-RESTful-Auth\model\nih_xrays\test_list.txt'

    # Parameters (unchanged)
    epochs = 50
    learning_rate = 0.001
    batch_size = 32

    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Using device: {device}")    

    # Create dataset and dataset loaders (unchanged)
    print("Creating datasets and loaders...")
    train_val_dataset = XrayDataset(csv_file=csv_file, root_dir=root_dir, split_file=train_val_split_file, transform=transform)
    test_dataset = XrayDataset(csv_file=csv_file, root_dir=root_dir, split_file=test_split_file, transform=transform)

    print("Creating data loaders...")
    train_val_loader = DataLoader(train_val_dataset, batch_size=batch_size, shuffle=True, generator=torch.Generator('cuda'), collate_fn=custom_collate, num_workers=4, persistent_workers=True)
    test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False, generator=torch.Generator('cuda'), collate_fn=custom_collate, num_workers=4, persistent_workers=True)

    # Initialize model, criterion, optimizer, and mixed precision scaler
    model = DenseNet121(num_classes=15).to(device)
    criterion = nn.BCEWithLogitsLoss()
    optimizer = optim.Adam(model.parameters(), lr=learning_rate)
    scaler = amp.GradScaler()  # Initialize GradScaler for mixed precision

    print('Allocated:', round(torch.cuda.memory_allocated(0)/1024**3,1), 'GB')
    print('Cached:   ', round(torch.cuda.memory_reserved(0)/1024**3,1), 'GB')

    # Training loop with gradient checkpointing and mixed precision
    print("Starting training loop...")
    for epoch in range(epochs):
        torch.cuda.empty_cache()
        print(f"Epoch {epoch + 1}/{epochs}")

        start = time()
        model.train()
        running_loss = 0.0
        correct_predictions = 0
        total_predictions = 0

        # Wrap train_val_loader with tqdm for progress bar
        tqdm_loader = tqdm(train_val_loader)
        for images, labels in tqdm_loader:
            labels = torch.stack(labels).to(device)  # Stack the labels list into a tensor and move to device
            images = images.to(device)

            optimizer.zero_grad()

            with amp.autocast():  # Enable mixed precision
                outputs = model(images)
                loss = criterion(outputs, labels)

            scaler.scale(loss).backward()  # Scale loss and backpropagate
            scaler.step(optimizer)  # Update weights
            scaler.update()  # Update scaler for next iteration

            running_loss += loss.item() * images.size(0)

            # Convert logits to probabilities and compute accuracy
            predicted_labels = (torch.sigmoid(outputs) > 0.5).float()  # Thresholding at 0.5
            correct_predictions += (predicted_labels == labels).sum().item()
            total_predictions += labels.numel()

            # Update tqdm progress bar description
            tqdm_loader.set_description(f"Epoch [{epoch+1}/{epochs}], Loss: {loss.item():.4f}")

        end = time()

        print(f'Epoch training time: {end - start}s')

        # Calculate epoch-level metrics
        epoch_loss = running_loss / len(train_val_dataset)
        accuracy = correct_predictions / total_predictions

        # Log to TensorBoard
        writer.add_scalar('Train Loss', epoch_loss, epoch)
        writer.add_scalar('Train Accuracy', accuracy, epoch)

        print(f'Train Loss: {epoch_loss:.4f}, Accuracy: {accuracy:.4f}')

    # Save the model after training
    model_path = "model_final.pt"
    torch.save(model.state_dict(), model_path)

    print("Model saved")

    # Close TensorBoard writer
    writer.close()