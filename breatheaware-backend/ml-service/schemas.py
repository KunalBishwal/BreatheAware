from typing import Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field


class StationFeature(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    station_id: str = Field(..., alias="stationId")
    pm25: Optional[float] = None
    pm10: Optional[float] = None
    no2: Optional[float] = None
    so2: Optional[float] = None
    o3: Optional[float] = None
    co: Optional[float] = None


class ClusterRequest(BaseModel):
    stations: List[StationFeature]


class ClusterCentroidSummary(BaseModel):
    label: str
    centroid: Dict[str, float]
    member_count: int = Field(..., alias="memberCount")
    member_stations: List[str] = Field(..., alias="memberStations")


class ClusterResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    assignments: Dict[str, str]  # stationId -> "cluster-0", etc.
    clusters: Dict[str, ClusterCentroidSummary]
    dropped_stations: List[str] = Field(default_factory=list, alias="droppedStations")
