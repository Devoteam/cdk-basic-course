"""Controllers for Vehicle-API"""

from uuid import uuid4

from datetime import datetime
from pydantic import ValidationError

from aws_lambda_powertools import Logger, event_handler

from models import (
  VehicleCreateRequest,
  VehicleUpdateRequest,
  Vehicle,
)

import json

from dynamo import Dynamo
from mapper import Mapper

logger = Logger()
dynamo = Dynamo()
mapper = Mapper()

cors_config = event_handler.CORSConfig(allow_origin="*", max_age=86400) # TODO: Improve

# https://docs.powertools.aws.dev/lambda/python/latest/core/event_handler/api_gateway/#lambda-function-url
# LambdaFunctionUrlResolver

# https://docs.powertools.aws.dev/lambda/python/latest/core/event_handler/api_gateway/#api-gateway-rest-api
# APIGatewayRestResolver

# https://docs.powertools.aws.dev/lambda/python/latest/core/event_handler/api_gateway/#api-gateway-http-api
# APIGatewayHttpResolver

api = event_handler.APIGatewayRestResolver(cors=cors_config)

@api.exception_handler(ValidationError)
def handle_validation_error(ex: ValidationError) -> dict:
  """Handler for Validation Error"""
  return event_handler.Response(status_code=400, body=ex.json())

@api.delete("/vehicle/v1/<id>")
def delete(id: str) -> dict:
  """
  1. Pull out Path-Parameter
  2. Validate Path-Parameter
  3. Delete Vehicle
  """
  dynamo.delete(id) # Always returns 204, idempotent call
  return None, 204

@api.get("/vehicle/v1/<id>")
def findByID(id: str) -> dict:
  """
  1. Pull out Path-Parameter
  2. Validate Path-Parameter
  3. Find Vehicle by ID
  """
  vehicle = dynamo.findByID(id)
  if vehicle is None:
    return None, 404
  return (
    mapper.as_DTO(vehicle),
    200
  )

def __update(request: VehicleUpdateRequest, vehicle: Vehicle) -> Vehicle:
  """
  Process Vehicle and update in DynamoDB
  """
  timestamp = datetime.now().isoformat()
  vehicle.__dict__.update({
  # "createdAt": timestamp,
    "updatedAt": timestamp,
  # Pass all Attributes from UpdateRequest into Entity.
    **request.dict(exclude_none=True),
  })
  dynamo.put(vehicle)
  return vehicle

@api.put("/vehicle/v1/<id>")
def update(id: str) -> dict:
  """
  1. Pull out data
  2. Validate data
  3. Update Vehicle
  """
  body = api.current_event.body
  if body is None or body == "":
    return None, 400
  request = VehicleUpdateRequest(**json.loads(body))
  vehicle = dynamo.findByID(id)
  if vehicle is None:
    return None, 404
  updated = mapper.as_DTO(__update(request, vehicle))
  return (
    updated,
    200,
  )

def __create(request: VehicleCreateRequest) -> Vehicle:
  """
  Process Vehicle and create in DynamoDB
  """
  timestamp = datetime.now().isoformat()
  vehicle   = Vehicle(**{
    "createdAt": timestamp,
    "updatedAt": timestamp,
    "id":        str(uuid4()),
  # Pass all Attributes from CreateRequest into Entity.
    **request.dict(),
  })
  dynamo.put(vehicle)
  return vehicle

@api.post("/vehicle/v1")
def create() -> dict:
  """
  1. Pull out data
  2. Validate data
  3. Create Vehicle
  """
  body = api.current_event.body
  if body is None or body == "":
    return None, 400
  request = VehicleCreateRequest(**json.loads(body))
  vehicle = mapper.as_DTO(__create(request))
  return (
    vehicle,
    201,
  )

@api.get("/all-vehicles/v1")
def findAll() -> dict:
  """"""
  vehicles = dynamo.findAll()
  vehicles = [mapper.as_DTO(vehicle) for vehicle in vehicles]
  return (
    vehicles,
    200
  )

def lambda_handler(event: dict, _) -> dict:
  """Main Entrypoint"""
  logger.info("Event received = %s", event)
  return api.resolve(
    event,
    _
  )
