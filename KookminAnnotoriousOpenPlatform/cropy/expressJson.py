import zipfile
import datetime
import os

class ExpressJson():
    def express(self, zp, path, img):
        zp.write(path + "/" + img)

    def express_all_json(self, zp):
        path = "/var/www/html/jsondata"
        for json in os.listdir(path):
            if json.rfind('.json') > 0:
                #print(path + "/" + img)
                self.express(zp,path,json)
                
        return 1

    def run(self):
        time = datetime.datetime.now()
        now = str(time.year) + str(time.month) + \
              str(time.day) + str(time.hour) + str(time.minute)
        
        zp = zipfile.ZipFile(now + "_jsonExpr.zip", "w")
        isTrue = self.express_all_json(zp)
        zp.close()

        if isTrue != 1:
            print("error")
        
        # let you consider to.
        try:
            self.delete_orginal_file_all()
        except Exception as delErr:
            print("json delete error\n", delErr)

    def delete_orginal_file_all(self):
        path = "/var/www/html/jsondata/"
        for json in os.listdir(path):
            if json.rfind('.json') > 0:
                os.remove(path+json)
        
