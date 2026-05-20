import os
import shutil
from pathlib import Path
from ultralytics import YOLO
import cv2
from matplotlib import pyplot as plt
import matplotlib
matplotlib.use("Agg")


#----------------------
#1. Importing model and getting label
#----------------------
def get_label(image_path, model):
    folder_path = 'predict'

    # Check if the folder exists
    if os.path.exists(folder_path):
        try:
            shutil.rmtree(folder_path)
            print(f"Folder '{folder_path}' and all its contents have been deleted.")
        except OSError as e:
            print(f"Error: {e.strerror}")
    else:
        print(f"Folder '{folder_path}' does not exist.")

    output_folder = 'AI\OmrPredict\ForInstructor\predict'

    # Run YOLO prediction and save results (image + label)
    results = model.predict(
    image_path,
    conf=0.6,
    save=True,
    save_txt=True,
    project=output_folder,
    name='results',
    exist_ok=True
)


    # Paths where YOLO saves outputs
    saved_image_folder = Path(f"{output_folder}/results")
    saved_label_folder = saved_image_folder / 'labels'

    
    saved_labels = list(saved_label_folder.glob('*.txt'))

    if saved_labels:
        label_file_path = saved_labels[0]  
        with open(label_file_path, 'r') as file:
            label_data = file.read()
        # print("Label Data:\n", label_data)
    else:
        label_data = None
        print("No label files found.")

    return label_data






#----------------------
#2. Show score for each subject
#----------------------

def crop_left_strip(image): 
    height, width = image.shape[:2]
    crop =  height - 12
    cropped_image = image[5:crop,:]
    return cropped_image



def detect_filled_bubbles(roi, show=False):
    

    """Detect and visualize shaded bubbles within a cropped column image."""
    # Convert to grayscale
    gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)

    
    # Apply thresholding
    _, binary = cv2.threshold(gray, 90, 255, cv2.THRESH_BINARY_INV)

    # Find contours
    contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    detected_answers = []

    # Define bubble detection parameters
    min_area = 50  # Minimum area of a bubble contour
    max_area = 500  # Maximum area of a bubble contour
    fill_threshold = 0.5  # Percentage of area that needs to be filled to consider it marked

    any_bubble_detected = False

    for contour in contours:
        area = cv2.contourArea(contour)
        if min_area < area < max_area:
            x, y, w, h = cv2.boundingRect(contour)
            bubble_roi = binary[y:y + h, x:x + w]
            filled_area = cv2.countNonZero(bubble_roi)
            if filled_area / (w * h) > fill_threshold:
                cx, cy = x + w // 2, y + h // 2
                detected_answers.append((cx, cy))
                # Draw circle around detected bubble
                cv2.circle(roi, (cx, cy), 5, (0, 255, 0), 2)
                any_bubble_detected = True

    # If no bubble was detected, append placeholder
    if not any_bubble_detected:
        detected_answers.append((0, 0))

    # ✅ Show image with detected bubbles
    

    return detected_answers

# Convert the string to a 2D list
def convert_to_2d_list(data_str):
    # Split the input string into lines
    
    lines = data_str.strip().split('\n')
    # Split each line into a list of values and convert to float
    data_list = [list(map(float, line.split())) for line in lines]
    return data_list


# Convert the data and print the result
def final_answers(image_path, data_str):
   
    image = cv2.imread(image_path)

    # Get image dimensions
    height, width, _ = image.shape

    # Labels (example)
    labels = convert_to_2d_list(data_str)

    # Filter class 0 boxes and sort by x_center to get them in horizontal order
    boxes = sorted([label for label in labels if label[0] == 0], key=lambda x: x[1])

    target_width = 95
    target_height = 750

    # Define option ranges
    option_ranges = {
        'A': (1, 20),
        'B': (22, 42),
        'C': (44, 64),
        'D': (66, 100)
    }
    # Traverse through each box and process them
    detected_options = []
    for idx, label in enumerate(boxes):
        # Unpack the label
        
        class_id, center_x, center_y, w, h = label
       
        # Convert normalized coordinates to pixel values
        x_center = int(center_x * width)
        y_center = int(center_y * height)
        box_width = int(w * width)
        box_height = int(h * height)

        # Calculate the top-left and bottom-right corners of the bounding box
        x1 = int(x_center - box_width / 2)
        y1 = int(y_center - box_height / 2)
        x2 = int(x_center + box_width / 2)
        y2 = int(y_center + box_height / 2)

        # Extract the region of interest (ROI)
        roi = image[y1:y2, x1:x2].copy()
        roi_resize = cv2.resize(roi, (target_width, target_height))
        roi = crop_left_strip(roi_resize)
        
        # Calculate the height of each section
        section_height = roi.shape[0] / 50.0

        #Draw horizontal lines to divide the image into 50 parts
        for j in range(1, 50):
            y_line = int(j * section_height)
            cv2.line(roi, (0, y_line), (roi.shape[1], y_line), (0, 255, 0), 1)

        # Ensure the last line is drawn at the bottom
        cv2.line(roi, (0, roi.shape[0] - 1), (roi.shape[1], roi.shape[0] - 1), (0, 255, 0), 1)

        # Iterate through each section of the ROI
        for j in range(50):
            y_start = int(j * section_height)
            y_end = int((j + 1) * section_height)

            # Make sure the last section reaches the bottom of the image
            if j == 49:
                y_end = roi.shape[0]

            section = roi[y_start:y_end, :]

            # Detect filled bubbles within each section
            detected_answers = detect_filled_bubbles(section)

            # Map detected x-coordinates to options based on predefined ranges
            for cx, cy in detected_answers:
                for option, (min_x, max_x) in option_ranges.items():
                    if min_x <= cx < max_x:
                        detected_options.append(option)
                        break
                else:
                    # If no option matches, append '0'
                    detected_options.append('0')

        
    return detected_options





def show_score_for_each_subject(result):
    Bio = {}
    Phy = {}
    Chem = {}

    for k, v in enumerate(result):
        s = k + 1   # question number

        if s <= 50:
            Chem[s] = v
        elif s <= 100:
            Phy[s] = v
        elif s <= 201:
            Bio[s] = v

    return Bio, Phy, Chem


# === Example usage ===
image_path = r"..\ForStudent\predict\results\omr_10.jpg" #This the image path for the Instructor
model = YOLO(r"..\ForStudent\OmrModel\rectangleOmrOri_yolo_model.pt") 

labels = get_label(image_path, model)
result = final_answers(image_path, labels)
print(show_score_for_each_subject(result))#This the dictionary showing score for each subject