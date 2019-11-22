from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from flask_cors import CORS
import faceRecognizer as face
import cv2
# import os module for reading training data directories and paths
import os
# import numpy to convert python lists to numpy arrays
import numpy as np

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])

app = Flask(__name__)
CORS(app)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/", methods=['GET', 'PUT'])
def hello():
    if request.method == 'PUT':        
        print('hello')
        if 'file' not in request.files:
            return "File not found"
        else:
            temp = request.files['file'].read()
            img = cv2.imdecode(np.fromstring(temp, np.uint8), cv2.IMREAD_GRAYSCALE)
            # cv2.imshow('put',img)
            # cv2.waitKey(0)
            predicted_img1 = face.predict(img)
            print((predicted_img1))
            if predicted_img1 is not None:
                return jsonify(predicted_img1)
            else:
                return  jsonify("")
    else:
        print('Get')
        test_img1 = cv2.imread("test-data/4.jpg")
        predicted_img1 = face.predict(test_img1)
        if predicted_img1 is not None:
            # display both images
            # print(predicted_img1)
            return jsonify(predicted_img1)
        else:
            return  jsonify("")
@app.route("/retrain", methods=['GET'])
def reTrainData():
    face.retrain()
    return  jsonify("Retraining finish successfully")

@app.route("/<string:folderName>/", methods=['PUT'])
def createNewStudent(folderName):
    if request.method == 'PUT':
        if face.createNewStudent(request.files,folderName) == 1:
            face.retrain()
            return jsonify('Add new student successfully!')
        else:
            return jsonify('Add new student fail!')

if __name__ == '__main__':
    app.run(debug=True)