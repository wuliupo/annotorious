import boto3 as bt
import os,sys

class AWSManager():

    def config(self, app):
        #is hardcoding.
        client = bt.client(
            app,
            region_name = 'ap-northeast-2',
        )
        return client




    
        
