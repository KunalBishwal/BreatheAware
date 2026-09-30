import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from clustering import perform_clustering
from schemas import ClusterRequest, ClusterResponse

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("breatheaware-ml-app")

app = FastAPI(
    title="BreatheAware ML Clustering Service",
    description="Stateless KMeans clustering microservice for air quality monitoring stations",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "service": "breatheaware-ml-clustering"}


@app.post("/cluster", response_model=ClusterResponse)
def cluster_stations(data: ClusterRequest) -> ClusterResponse:
    try:
        logger.info(f"Received clustering request with {len(data.stations)} stations")
        result = perform_clustering(data)
        return result
    except Exception as exc:
        logger.exception("Error processing clustering request")
        raise HTTPException(
            status_code=500,
            detail=f"Clustering execution failed: {str(exc)}",
        ) from exc


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
