from fastapi import FastAPI
import boto3

app = FastAPI()

dynamodb = boto3.resource(
    "dynamodb",
    region_name="eu-north-1"
)

table = dynamodb.Table("AmazeOnUsers")

@app.get("/user/{user_id}")
def get_user(user_id: str):
    response = table.get_item(
        Key={"userId": user_id}
    )

    return response.get("Item", {})