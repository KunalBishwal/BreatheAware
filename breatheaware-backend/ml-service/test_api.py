from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_endpoint():
    print("Testing GET /health...")
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    print("GET /health PASSED:", data)

def test_cluster_endpoint():
    print("Testing POST /cluster...")
    payload = {
        "stations": [
            {"stationId": "st-1", "pm25": 280.0, "pm10": 420.0, "no2": 25.0, "so2": 10.0, "o3": 30.0, "co": 1.2},
            {"stationId": "st-2", "pm25": 260.0, "pm10": 390.0, "no2": 28.0, "so2": 12.0, "o3": 28.0, "co": 1.1},
            {"stationId": "st-3", "pm25": 190.0, "pm10": 290.0, "no2": 120.0, "so2": 25.0, "o3": 35.0, "co": 3.2},
            {"stationId": "st-4", "pm25": 170.0, "pm10": 260.0, "no2": 110.0, "so2": 22.0, "o3": 32.0, "co": 2.8},
            {"stationId": "st-5", "pm25": 140.0, "pm10": 230.0, "no2": 75.0, "so2": 145.0, "o3": 40.0, "co": 1.8},
            {"stationId": "st-6", "pm25": 150.0, "pm10": 240.0, "no2": 70.0, "so2": 130.0, "o3": 38.0, "co": 1.9},
            {"stationId": "st-7", "pm25": 18.0, "pm10": 32.0, "no2": 12.0, "so2": 6.0, "o3": 20.0, "co": 0.4},
            {"stationId": "st-8", "pm25": 15.0, "pm10": 28.0, "no2": 10.0, "so2": 5.0, "o3": 18.0, "co": 0.3},
            {"stationId": "st-drop", "pm25": None, "pm10": 45.0}
        ]
    }
    response = client.post("/cluster", json=payload)
    assert response.status_code == 200, f"Error: {response.text}"
    data = response.json()
    assert "st-drop" in data["droppedStations"]
    assert len(data["assignments"]) == 8
    assert len(data["clusters"]) == 4
    print("POST /cluster PASSED:")
    for k, v in data["clusters"].items():
        print(f"  {k} -> {v['label']} (members: {v['memberCount']})")

if __name__ == "__main__":
    test_health_endpoint()
    test_cluster_endpoint()
    print("All FastAPI endpoints verified successfully!")
