import boto_client_configure as conf
import boto_upload_S3
import expressJson
import os
import cropy

if __name__ == "__main__":
    
    #bucket name  
    croppedBucket = 'hjkim-serverless-cropped'
    jsonBucket = 'hjkim-serverless-jsonbucket'

    #boto client configuration for AWS_Access
    #class overriding.
    aws = conf.AWSManager()
    s3 = boto_upload_S3.S3()

    client = aws.config('s3')
    exp = expressJson.ExpressJson()
    exp.run()

    #upload cropped Image
    bucketList = s3.get_bucketList(client)
    myBucket = s3.selection_bucket(bucketList, croppedBucket)
    
    isTrue = s3.upload_bucket_all_img(client,myBucket)

    #upload Json
    if(isTrue == 1):
        myBucket = s3.selection_bucket(bucketList, jsonBucket)
        isTrue = s3.upload_bucket_all_jsonZip(client, myBucket)

        # delete json backup file on local
        for zipfile in os.listdir('.'):
            if zipfile.rfind('.zip') > 0:
                os.remove(zipfile)

