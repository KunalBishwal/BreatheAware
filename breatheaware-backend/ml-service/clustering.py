import logging
from typing import Dict, List, Tuple
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

from schemas import ClusterCentroidSummary, ClusterRequest, ClusterResponse, StationFeature

logger = logging.getLogger("breatheaware-ml")

FEATURE_NAMES = ["pm25", "pm10", "no2", "so2", "o3", "co"]


def assign_labels_to_centroids(
    centroids: np.ndarray,
    feature_names: List[str]
) -> Dict[int, str]:
    """
    Maps cluster centroids to human-readable labels based on domain heuristics:
    - Low across all -> "Clean/Background"
    - High SO2 + High NO2 -> "Industrial/Power"
    - High NO2 + High PM2.5 -> "Traffic/Industrial"
    - High PM2.5/PM10 + Low NO2 -> "Biomass/Crop Burning"
    """
    n_clusters = len(centroids)
    if n_clusters == 1:
        return {0: "Mixed/General"}

    pm25_idx = feature_names.index("pm25")
    pm10_idx = feature_names.index("pm10")
    no2_idx = feature_names.index("no2")
    so2_idx = feature_names.index("so2")

    # Overall pollutant load (sum of normalized values or raw concentrations)
    total_load = np.sum(centroids, axis=1)

    labels: Dict[int, str] = {}
    assigned_clusters = set()

    # 1. Clean/Background: Cluster with lowest total pollution load
    clean_cluster = int(np.argmin(total_load))
    labels[clean_cluster] = "Clean/Background"
    assigned_clusters.add(clean_cluster)

    remaining_clusters = [c for c in range(n_clusters) if c not in assigned_clusters]

    if not remaining_clusters:
        return labels

    # 2. Industrial/Power: Highest SO2 among remaining clusters
    so2_scores = [centroids[c, so2_idx] for c in remaining_clusters]
    industrial_cluster = remaining_clusters[int(np.argmax(so2_scores))]
    labels[industrial_cluster] = "Industrial/Power"
    assigned_clusters.add(industrial_cluster)

    remaining_clusters = [c for c in range(n_clusters) if c not in assigned_clusters]
    if not remaining_clusters:
        return labels

    # 3. Traffic/Industrial: Highest NO2 among remaining
    no2_scores = [centroids[c, no2_idx] for c in remaining_clusters]
    traffic_cluster = remaining_clusters[int(np.argmax(no2_scores))]
    labels[traffic_cluster] = "Traffic/Industrial"
    assigned_clusters.add(traffic_cluster)

    remaining_clusters = [c for c in range(n_clusters) if c not in assigned_clusters]
    if not remaining_clusters:
        return labels

    # 4. Biomass/Crop Burning: Highest PM / NO2 ratio or highest PM2.5
    for c in remaining_clusters:
        labels[c] = "Biomass/Crop Burning"

    return labels


def perform_clustering(request: ClusterRequest) -> ClusterResponse:
    """
    Performs KMeans clustering on station 30-day average pollutant levels.
    """
    valid_stations: List[StationFeature] = []
    dropped_stations: List[str] = []

    # Drop stations with missing critical data (PM2.5 or PM10)
    for st in request.stations:
        if st.pm25 is None or st.pm10 is None or np.isnan(st.pm25) or np.isnan(st.pm10):
            dropped_stations.append(st.station_id)
        else:
            valid_stations.append(st)

    logger.info(
        f"Processing clustering for {len(valid_stations)} valid stations. Dropped: {len(dropped_stations)}"
    )

    if not valid_stations:
        return ClusterResponse(
            assignments={},
            clusters={},
            dropped_stations=dropped_stations,
        )

    # Build feature matrix
    # Features: ["pm25", "pm10", "no2", "so2", "o3", "co"]
    raw_matrix = []
    for st in valid_stations:
        row = [
            float(st.pm25),
            float(st.pm10),
            float(st.no2 if st.no2 is not None else 30.0),
            float(st.so2 if st.so2 is not None else 15.0),
            float(st.o3 if st.o3 is not None else 25.0),
            float(st.co if st.co is not None else 1.0),
        ]
        raw_matrix.append(row)

    X = np.array(raw_matrix, dtype=float)

    # Choose number of clusters: default 4, or min(4, len(valid_stations))
    k = min(4, len(valid_stations))

    # Apply StandardScaler
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Apply KMeans
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    cluster_labels = kmeans.fit_predict(X_scaled)

    # Calculate actual centroids in original feature space (unscaled)
    centroids = np.zeros((k, len(FEATURE_NAMES)))
    for c_id in range(k):
        members_mask = (cluster_labels == c_id)
        if np.any(members_mask):
            centroids[c_id] = np.mean(X[members_mask], axis=0)
        else:
            centroids[c_id] = scaler.inverse_transform(kmeans.cluster_centers_[c_id : c_id + 1])[0]

    label_map = assign_labels_to_centroids(centroids, FEATURE_NAMES)

    assignments: Dict[str, str] = {}
    cluster_summaries: Dict[str, ClusterCentroidSummary] = {}

    for c_id in range(k):
        cluster_key = f"cluster-{c_id}"
        member_indices = np.where(cluster_labels == c_id)[0]
        member_ids = [valid_stations[idx].station_id for idx in member_indices]

        for s_id in member_ids:
            assignments[s_id] = cluster_key

        centroid_dict = {
            feat: round(float(centroids[c_id, i]), 2)
            for i, feat in enumerate(FEATURE_NAMES)
        }

        cluster_summaries[cluster_key] = ClusterCentroidSummary(
            label=label_map.get(c_id, f"Cluster {c_id}"),
            centroid=centroid_dict,
            memberCount=len(member_ids),
            memberStations=member_ids,
        )

    return ClusterResponse(
        assignments=assignments,
        clusters=cluster_summaries,
        droppedStations=dropped_stations,
    )
