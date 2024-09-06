import csv
import json

def csv_to_json(csv_file_path, json_file_path):
    # Initialize a list to store the data
    data = {"years": [], "data": []}

    # Open the CSV file
    with open(csv_file_path, mode='r', newline='', encoding='utf-8') as csv_file:
        # Use the CSV reader to read the file
        csv_reader = csv.reader(csv_file)
        
        # Extract the headers (years) from the first row
        headers = next(csv_reader)[1:]  # Skip the first column, which is for categories
        data["years"] = headers

        # Read the data rows
        for row in csv_reader:
            category = row[0]
            values = list(map(float, row[1:]))  # Convert values to float
            data["data"].append({"category": category, "values": values})

    # Write the data to a JSON file
    with open(json_file_path, mode='w', encoding='utf-8') as json_file:
        json.dump(data, json_file, indent=4)

    print(f"Data successfully converted to {json_file_path}")

# Use the function
csv_file_path = './data/expenditure.csv'  # Replace with your CSV file path
json_file_path = './data/expenditure.json'  # Desired output JSON file path
csv_to_json(csv_file_path, json_file_path)