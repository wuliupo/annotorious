from PIL import Image as CROPPER
import simplejson as JSON
import os, sys
import datetime

class CropImage():
        def start_crop(self, imgSrc, jsnSrc):
                #Openning image file use to PIL lib.
                img = CROPPER.open(imgSrc)
                gen = self.crop(jsnSrc, img)
                for r in gen:
                    print("generate")
                

        def crop(self, jsonSrc, img):
                lines = open(jsonSrc)

                width = img.getbbox()[2]
                height = img.getbbox()[3]
                #print("pixel : " + str(img.getbbox()))
                for line in lines:

                        jsonData = JSON.loads(line) #JSON.loads(line, dict) #json to str.
                        tag = jsonData['tag']
                        
                        x = jsonData["imageLocation"].split("/")
                        rowSize = len(x)
                        imgName = x[rowSize - 1].split(".")[0]
                        perX = jsonData['anno']['x']
                        perY = jsonData['anno']['y']
                        
                        setX = perX * width
                        setY = perY * height
                        #print(setX,setY)
                        #print(str(int(setWidth)) + "  " + str(int(setHeight)))
                        
                        yield self.annotation(img, tag, imgName, setX, setY) #generate function.

        def annotation(self, img, tag, name, X, Y):
                time = datetime.datetime.now()
                a = (X,Y,X+64,Y+64)
                cropping = img.crop(a)
                now = str(time.year) + str(time.month) + str(time.day) + str(time.hour) + str(time.minute);
                
                i = 0
                while True:
                        path = "/var/www/html/cropy/"
                        naming = name + "_" + now + "_" + tag + "_" + str(i) + ".jpg";
                        isFile = os.path.exists(path + naming)
                        if isFile != True:
                                ## check for ducplication name.
                                print("no exists")
                                return cropping.save("/var/www/html/cropy/"+naming,"JPEG")
                        
                        i = i + 1

                #cropping.save(jsonData['tag'], "JPEG")

        def run(self, arrays):
                imgpath = "/var/www/html/Images/example_folder/"
                jsonpath = "/var/www/html/jsondata/"

                img = arrays[0]
                json = arrays[1]

                #print("crop run \n",imgpath + img, jsonpath + json)
                self.start_crop(imgpath + img, jsonpath + json)


def image_list(argv):
        imgFiles = os.listdir("/var/www/html/Images/example_folder/")
        getFileName = str(argv + ".jpg")
        for img in imgFiles:
                if(img.rfind(getFileName) >= 0):
                        #print(argv + ".jpg")
                        ImageAndJsonArray.append(img)

def json_list(argv):
        jsonFiles = os.listdir("/var/www/html/jsondata/")
        getFileName = str(argv + ".json")
        for json in jsonFiles:
                if(json.rfind(getFileName) >= 0):
                        #print(argv+".json")
                        ImageAndJsonArray.append(json)



ImageAndJsonArray = []
if __name__ == "__main__":
        crop = CropImage()
        #test image src

        image_list(sys.argv[1])
        json_list(sys.argv[1])
        crop.run(ImageAndJsonArray)
        print(os.system("python3 runScript.py"))

