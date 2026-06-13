from utils.aws import table

def create_or_update_user(data: dict):
    table.put_item(Item=data)
    return data


def get_user(clerk_id: str):
    response = table.get_item(Key={"clerk_id": clerk_id})
    return response.get("Item")