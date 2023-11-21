"""Repository for Vehicle-API"""

from models import Vehicle

class Dynamo:
  """"""
  def __init__(self) -> None:
    """
    https://docs.aws.amazon.com/cli/latest/reference/dynamodb
    """
    import os
    ENDPOINT = os.environ.get("ENDPOINT", None)
    TABLE    = os.environ.get("TABLE",    "Vehicle")

    # config=Config(tcp_keepalive=True)
    import boto3
    self.table = (
      boto3.resource("dynamodb", endpoint_url=ENDPOINT)
      .Table(TABLE)
    )

  def delete(self, id: str) -> None:
    """
    https://docs.aws.amazon.com/cli/latest/reference/dynamodb/delete-item.html
    """
    self.table.delete_item(Key={"id": id})

  def put(self, vehicle: Vehicle) -> None:
    """
    https://docs.aws.amazon.com/cli/latest/reference/dynamodb/put-item.html
    """
    item = vehicle.dict()
    self.table.put_item(Item=item)

  def findAll(self) -> list[Vehicle]:
    """
    https://docs.aws.amazon.com/cli/latest/reference/dynamodb/scan.html
    """
    items = (
      self.table
      .scan()
      .get("Items" , None)
    )
    items = [Vehicle(**item) for item in items]
    return items

  def findByID(self, id: str) -> Vehicle | None:
    """
    https://docs.aws.amazon.com/cli/latest/reference/dynamodb/get-item.html
    """
    item = (
      self.table
      .get_item(Key={"id": id})
      .get("Item", None)
    )
    return (
      Vehicle(**item) if item != None
      else None
    )
