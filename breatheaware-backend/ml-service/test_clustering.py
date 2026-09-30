import numpy as np
from clustering import perform_clustering
from schemas import ClusterRequest, StationFeature

def test_clustering_workflow():
    print("Testing ML KMeans clustering workflow...")

    # Mock station data covering the 4 domain archetypes:
    # 1. High PM2.5/PM10, Low NO2 -> Biomass/Crop Burning
    # 2. High NO2, High PM2.5 -> Traffic/Industrial
    # 3. High SO2, High NO2 -> Industrial/Power
    # 4. Low across all -> Clean/Background
    stations = [
        # Biomass candidates
        StationFeature(stationId="punjab-st-1", pm25=280.0, pm10=420.0, no2=25.0, so2=10.0, o3=30.0, co=1.2),
        StationFeature(stationId="haryana-st-2", pm25=260.0, pm10=390.0, no2=28.0, so2=12.0, o3=28.0, co=1.1),
        
        # Traffic candidates
        StationFeature(stationId="delhi-ito-3", pm25=190.0, pm10=290.0, no2=120.0, so2=25.0, o3=35.0, co=3.2),
        StationFeature(stationId="mumbai-bkc-4", pm25=170.0, pm10=260.0, no2=110.0, so2=22.0, o3=32.0, co=2.8),
        
        # Industrial / Power candidates
        StationFeature(stationId="singrauli-5", pm25=140.0, pm10=230.0, no2=75.0, so2=145.0, o3=40.0, co=1.8),
        StationFeature(stationId="korba-6", pm25=150.0, pm10=240.0, no2=70.0, so2=130.0, o3=38.0, co=1.9),
        
        # Clean candidates
        StationFeature(stationId="shillong-7", pm25=18.0, pm10=32.0, no2=12.0, so2=6.0, o3=20.0, co=0.4),
        StationFeature(stationId="munnar-8", pm25=15.0, pm10=28.0, no2=10.0, so2=5.0, o3=18.0, co=0.3),

        # Station with missing critical data (should be dropped)
        StationFeature(stationId="faulty-sensor-9", pm25=None, pm10=150.0),
    ]

    req = ClusterRequest(stations=stations)
    resp = perform_clustering(req)

    print(f"Total assignments: {len(resp.assignments)}")
    print(f"Dropped stations: {resp.dropped_stations}")
    assert "faulty-sensor-9" in resp.dropped_stations, "Missing PM2.5 should trigger drop"
    assert len(resp.assignments) == 8, "Expected 8 valid stations clustered"
    assert len(resp.clusters) == 4, "Expected 4 distinct clusters"

    assigned_labels = [c.label for c in resp.clusters.values()]
    print(f"Assigned Cluster Labels: {assigned_labels}")

    # Check that Clean/Background cluster contains Shillong or Munnar
    clean_clusters = [k for k, v in resp.clusters.items() if v.label == "Clean/Background"]
    assert len(clean_clusters) == 1, "Must have exactly 1 Clean/Background cluster"
    clean_members = resp.clusters[clean_clusters[0]].member_stations
    assert "shillong-7" in clean_members or "munnar-8" in clean_members, "Clean stations should be in Clean cluster"

    print("ML Clustering tests PASSED successfully!")


if __name__ == "__main__":
    test_clustering_workflow()
