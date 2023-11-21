"""Models for Vehicle-API"""

from uuid import UUID
from enum import Enum

from pydantic import BaseModel

class Vendor(
  str,
  Enum,
):
  """Enum for Vendor"""
  MERCEDES = "Mercedes"
  PORSCHE  = "Porsche"
  AUDI     = "Audi"
  # ...

def optional(*fields) -> any:
  """
  Taken from: https://github.com/samuelcolvin/pydantic/issues/1223#issuecomment-775363074
  """
  def func(_class):
    # It loops over Class-Fields and sets Pydantic-Attribute "required" = False
    for field in fields:
      _class.__fields__[field].required = False
    return _class

  import inspect
  if fields and inspect.isclass(fields[0]) and issubclass(fields[0], BaseModel):
    _class = fields[0]
    fields = _class.__fields__
    return func(_class)

  return func

class Shared(BaseModel):
  """
  Attributes shared across all Vehicle-Objects
  """
  vendor: Vendor
  model:  str
  image:  str
  # ...

@optional
class VehicleUpdateRequest(Shared):
  """
  Model used to update a Vehicle
  """

class VehicleCreateRequest(Shared):
  """
  Model used to create a Vehicle
  """

class Vehicle(Shared):
  """
  Model used to represent a stored Vehicle
  """
  createdAt: str
  updatedAt: str
  id:        str
