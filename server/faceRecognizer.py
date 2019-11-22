import cv2
import os
import numpy as np

subjects = {0: ""}

face_recognizer = cv2.face.LBPHFaceRecognizer_create()

def detect_face(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    face_cascade = cv2.CascadeClassifier(
        'opencv-files/lbpcascade_frontalface_improved.xml')

    faces = face_cascade.detectMultiScale(
        gray, scaleFactor=1.2, minNeighbors=0)

    if (len(faces) == 0):
        return None, None

    (x, y, w, h) = faces[0]

    return gray[y:y+w, x:x+h], faces[0]

def prepare_training_data(data_folder_path):

    dirs = os.listdir(data_folder_path)

    faces = []
    labels = []

    for dir_name in dirs:
        print("traning for " + dir_name)
        if dir_name.startswith("."):
            continue

        label = int(dir_name.split("-")[0])
        name = dir_name.split("-")[-1]
        subjects[label] = name
        subject_dir_path = data_folder_path + "/" + dir_name
        subject_images_names = os.listdir(subject_dir_path)

        for image_name in subject_images_names:

            if image_name.startswith("."):
                continue

            image_path = subject_dir_path + "/" + image_name

            image = cv2.imread(image_path)
            
            face, rect = detect_face(image)

            if face is not None:
                faces.append(face)
                labels.append(label)

    return faces, labels

def retrain():   
    print("Preparing data...")
    faces, labels = prepare_training_data("training-data")
    print("Data prepared")

    print("Total faces: ", len(faces))
    print("Total labels: ", labels)

    face_recognizer.train(faces, np.array(labels))

retrain()

def predict(test_img):
    img = test_img.copy()
    # # # detect face from the image
    # face, rect = detect_face(img)
    # print(face is None)
    # if face is not None:
    #     # predict the image using our face recognizer
    #     label, confidence = face_recognizer.predict(face)
    #     # get name of respective label returned by face recognizer
    #     label_text = subjects[label]

    #     return str(label) + "-" + label_text
    label, confidence = face_recognizer.predict(img)
    print(str(label) + ' - ' + str(confidence)  )
    if (confidence<100):
        label_text = subjects[label]
        return str(str(label) + '-' + label_text)
    return None
def checkValidFolderName(forderName, listCurrentFolder):
    for x in listCurrentFolder:
        if (x == forderName):
            return 0
        else:
            return 1

def createNewStudent(files,folderName):
    dirs = os.listdir("training-data")
    print(files)
    currentFolder = os.path.join("training-data",folderName)
    if os.path.exists(currentFolder) == False:
        os.makedirs(os.path.join("training-data",folderName))       
        i=0
        for file in files:
            print(file)
            fileHandle = open(os.path.join("training-data/"+folderName+"/",str(i)+'.jpg'),'wb')
            fileHandle.write(files["file"+str(i)].read())
            fileHandle.close()
            i=i+1
        return 1
    else:
        return 0
