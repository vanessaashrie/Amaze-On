import boto3
import os

dynamodb = boto3.resource(
    "dynamodb",
    region_name=os.getenv("AWS_REGION")
)

users_table = dynamodb.Table("AmazeOnUsers")