import os
os.environ["PYTORCH_CUDA_ALLOC_CONF"] = "expandable_segments:True"
os.environ["CUDA_LAUNCH_BLOCKING"] = "1"
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

import pandas as pd
from PIL import Image
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader, random_split
from torchvision import transforms, models
from tqdm import tqdm
from time import time
import numpy as np
import torch.cuda.amp as amp
from torch.utils.checkpoint import checkpoint_sequential
from torch.utils.tensorboard import SummaryWriter

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
        label_list = [int(x) for x in label_str.split('|')]
        label_vector = np.zeros(15)  
        for label in label_list:
            label_vector[label] = 1
        return label_vector

    def __len__(self):
        return len(self.file_paths)
    
    def __getitem__(self, idx):
        img_path = self.file_paths[idx]
        image = Image.open(img_path).convert('RGB')
        
        if self.transform:
            image = self.transform(image)
        
        labels = self.labels[idx]
        labels = torch.tensor(labels, dtype = torch.float)  
        
        return image, labels

image_width, image_height = 512, 512
transform = transforms.Compose([
    transforms.Resize((image_width, image_height)),
    transforms.ToTensor(),
])

def custom_collate(batch):
    images, labels = zip(*batch)
    images = torch.stack(images, dim = 0)
    labels = torch.stack(labels, dim = 0)
    return images, labels

class DenseNet121(nn.Module):   
    def __init__(self, num_classes):
        super(DenseNet121, self).__init__()
        self.densenet121 = models.densenet121(weights = models.DenseNet121_Weights.DEFAULT)
        num_ftrs = self.densenet121.classifier.in_features
        self.densenet121.classifier = nn.Linear(num_ftrs, num_classes)
        self.num_segments = 4 
    
    def forward(self, x):
        x = checkpoint_sequential(self.densenet121.features, self.num_segments, x, use_reentrant = False)
        x = nn.functional.adaptive_avg_pool2d(x, (1, 1))
        x = torch.flatten(x, 1)
        x = self.densenet121.classifier(x)
        return x


if __name__ == "__main__":
    log_dir = "./logs"
    os.makedirs(log_dir, exist_ok=True)
    writer = SummaryWriter(log_dir=log_dir)

    csv_file = r'C:\Users\Nerds Of Prey 1\Documents\GitHub\PostgreSQL-RESTful-Auth\model\nih_xrays\data.csv'
    root_dir = r'C:\Users\Nerds Of Prey 1\Documents\GitHub\PostgreSQL-RESTful-Auth\model\nih_xrays\images'
    train_val_split_file = r'C:\Users\Nerds Of Prey 1\Documents\GitHub\PostgreSQL-RESTful-Auth\model\nih_xrays\train_val_list.txt'

    epochs = 50
    learning_rate = 0.001
    batch_size = 16

    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Using device: {device}")    

    print("Creating datasets and loaders...")
    train_val_dataset = XrayDataset(csv_file=csv_file, root_dir=root_dir, split_file=train_val_split_file, transform=transform)

    generator = torch.Generator('cuda')

    train_size = int(0.9 * len(train_val_dataset))
    val_size = len(train_val_dataset) - train_size
    train_dataset, val_dataset = random_split(train_val_dataset, [train_size, val_size], generator=generator)

    print("Creating data loaders...")
    train_loader = DataLoader(train_dataset, batch_size = batch_size, shuffle = True, generator=generator, collate_fn=custom_collate, num_workers=4, persistent_workers=True)
    val_loader = DataLoader(val_dataset, batch_size = batch_size, shuffle = False, generator=generator, collate_fn=custom_collate, num_workers=4, persistent_workers=True)

    model = DenseNet121(num_classes=15).to(device)
    criterion = nn.BCEWithLogitsLoss()
    optimizer = optim.Adam(model.parameters(), lr = learning_rate)
    scaler = amp.GradScaler()

    print('Allocated:', round(torch.cuda.memory_allocated(0)/1024**3,1), 'GB')
    print('Cached:   ', round(torch.cuda.memory_reserved(0)/1024**3,1), 'GB')

    # Early stopping parameters
    best_val_loss = float('inf')
    patience = 5
    patience_counter = 0

    print("Starting training loop...")
    for epoch in range(epochs):
        torch.cuda.empty_cache()
        print(f"Epoch {epoch + 1}/{epochs}")

        start = time()
        model.train()
        running_loss = 0.0
        correct_predictions = 0
        total_predictions = 0

        tqdm_loader = tqdm(train_loader)
        for images, labels in tqdm_loader:
            labels = labels.to(device) 
            images = images.to(device)

            optimizer.zero_grad()

            with amp.autocast():
                outputs = model(images)
                loss = criterion(outputs, labels)

            scaler.scale(loss).backward()
            scaler.step(optimizer)
            scaler.update()

            running_loss += loss.item() * images.size(0)

            predicted_labels = (torch.sigmoid(outputs) > 0.5).float()
            correct_predictions += (predicted_labels == labels).sum().item()
            total_predictions += labels.numel()

            tqdm_loader.set_description(f"Epoch [{epoch+1}/{epochs}], Loss: {loss.item():.4f}")

        end = time()
        print(f'Epoch training time: {end - start}s')

        epoch_loss = running_loss / len(train_loader.dataset)
        accuracy = correct_predictions / total_predictions

        writer.add_scalar('Train Loss', epoch_loss, epoch)
        writer.add_scalar('Train Accuracy', accuracy, epoch)

        print(f'Train Loss: {epoch_loss:.4f}, Accuracy: {accuracy:.4f}')

        # Validation loop
        model.eval()
        val_loss = 0.0
        val_correct_predictions = 0
        val_total_predictions = 0

        with torch.no_grad():
            for images, labels in val_loader:
                labels = labels.to(device) 
                images = images.to(device)

                with amp.autocast():
                    outputs = model(images)
                    loss = criterion(outputs, labels)

                val_loss += loss.item() * images.size(0)

                predicted_labels = (torch.sigmoid(outputs) > 0.5).float()
                val_correct_predictions += (predicted_labels == labels).sum().item()
                val_total_predictions += labels.numel()

        val_loss /= len(val_loader.dataset)
        val_accuracy = val_correct_predictions / val_total_predictions

        writer.add_scalar('Validation Loss', val_loss, epoch)
        writer.add_scalar('Validation Accuracy', val_accuracy, epoch)

        print(f'Validation Loss: {val_loss:.4f}, Validation Accuracy: {val_accuracy:.4f}')

        # Early stopping check
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            patience_counter = 0
            # Save the best model
            best_model_path = "best_model.pt"
            torch.save(model.state_dict(), best_model_path)
            print("Model saved as best model.")
        else:
            patience_counter += 1
            if patience_counter >= patience:
                print("Early stopping triggered.")
                break

    print("Training completed.")
    writer.close()