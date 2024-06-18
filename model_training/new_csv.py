import csv

# Define the mapping of class labels to indexes
class_index = {
    "No Finding": 0,
    "Atelectasis": 1,
    "Cardiomegaly": 2,
    "Effusion": 3,
    "Infiltration": 4,
    "Mass": 5,
    "Nodule": 6,
    "Pneumonia": 7,
    "Pneumothorax": 8,
    "Consolidation": 9,
    "Edema": 10,
    "Emphysema": 11,
    "Fibrosis": 12,
    "Pleural_Thickening": 13,
    "Hernia": 14
}

# Read the original CSV file
input_file = r'C:\Users\Nerds Of Prey 1\Documents\GitHub\PostgreSQL-RESTful-Auth\model\nih_xrays\Data_Entry_2017.csv'
output_file = r'C:\Users\Nerds Of Prey 1\Documents\GitHub\PostgreSQL-RESTful-Auth\model\nih_xrays\data.csv'

with open(input_file, 'r') as infile, open(output_file, 'w', newline='') as outfile:
    reader = csv.reader(infile)
    writer = csv.writer(outfile)
    
    # Read the header
    header = next(reader)
    
    # Write the new header to the output file
    writer.writerow([header[0], header[1]])
    
    # Process each row in the input file
    for row in reader:
        file_path = row[0]
        labels = row[1]
        
        # Add /images/ to the file path
        new_file_path = '/nih_xrays/images/' + file_path
        
        # Convert labels to indexes
        label_indexes = [str(class_index[label]) for label in labels.split('|')]
        new_labels = '|'.join(label_indexes)
        
        # Write the modified row to the output file
        writer.writerow([new_file_path, new_labels])

print(f"Data processing complete. New file saved as {output_file}")