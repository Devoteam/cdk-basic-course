"""Mapper for Vehicle-API"""

from models import Vehicle

# ToExclude = []

class Mapper:
  """"""
  def as_DTO(self, vehicle: Vehicle) -> dict | None:
    """
    Vehicle-Entity => DTO
    """
    return (
      vehicle.dict() if vehicle != None
      else None
    )
