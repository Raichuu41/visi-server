from os import listdir
import os.path as path
import json

if __name__ == '__main__':
    files = [f for f in listdir(path.abspath(path.join(__file__, '../images/images_3000')))]
    with open('images_3000.json', 'w') as f:
        json.dump(files, f, indent=4)

