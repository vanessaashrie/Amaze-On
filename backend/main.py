from fastapi import FastAPI
from dotenv import load_dotenv
import os
import boto3

load_dotenv()
REGION = os.getenv("AWS_REGION")
TABLE_NAME = os.getenv("DYNAMODB_TABLE")
BUCKET = os.getenv("S3_BUCKET")

app = FastAPI()

dynamodb = boto3.resource(
    "dynamodb",
    region_name="eu-north-1"
)

table = dynamodb.Table("AmazeOnUsers")

@app.get("/user/{user_id}")
def get_user(user_id: str):
    response = table.get_item(
        Key={
            "userId": user_id
        }
    )

    return response.get("Item", {})

