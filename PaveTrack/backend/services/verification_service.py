from pathlib import Path
import math
import os


def calculate_distance(
    lat1,
    lon1,
    lat2,
    lon2
):

    R = 6371000

    lat1 = math.radians(lat1)
    lat2 = math.radians(lat2)

    dlat = lat2 - lat1
    dlon = math.radians(lon2 - lon1)

    a = (
        math.sin(dlat / 2) ** 2
        +
        math.cos(lat1)
        * math.cos(lat2)
        * math.sin(dlon / 2) ** 2
    )

    c = 2 * math.atan2(
        math.sqrt(a),
        math.sqrt(1 - a)
    )

    return R * c


def gps_score(
    before_lat,
    before_lon,
    after_lat,
    after_lon
):

    distance = calculate_distance(
        before_lat,
        before_lon,
        after_lat,
        after_lon
    )

    # Excellent if within 20 m
    if distance <= 20:
        score = 100

    elif distance <= 50:
        score = 85

    elif distance <= 100:
        score = 60

    elif distance <= 250:
        score = 30

    else:
        score = 0

    return {
        "distance_meters": round(distance, 2),
        "score": score
    }


def image_similarity(
    before_path,
    after_path
):

    try:
        import cv2

        before = cv2.imread(before_path)
        after = cv2.imread(after_path)

        if before is None or after is None:
            return {
                "score": 0,
                "matches": 0
            }

        before_gray = cv2.cvtColor(
            before,
            cv2.COLOR_BGR2GRAY
        )

        after_gray = cv2.cvtColor(
            after,
            cv2.COLOR_BGR2GRAY
        )

        orb = cv2.ORB_create(
            nfeatures=1000
        )

        kp1, des1 = orb.detectAndCompute(
            before_gray,
            None
        )

        kp2, des2 = orb.detectAndCompute(
            after_gray,
            None
        )

        if des1 is None or des2 is None:
            return {
                "score": 0,
                "matches": 0
            }

        matcher = cv2.BFMatcher(
            cv2.NORM_HAMMING,
            crossCheck=True
        )

        matches = matcher.match(
            des1,
            des2
        )

        matches = sorted(
            matches,
            key=lambda x: x.distance
        )

        good_matches = [
            m for m in matches
            if m.distance < 60
        ]

        score = min(
            100,
            len(good_matches) * 5
        )

        return {
            "score": score,
            "matches": len(good_matches)
        }

    except Exception:
        return {
            "score": 0,
            "matches": 0
        }


def verify_repair(
    before_media,
    after_media,
    before_lat,
    before_lon,
    after_lat,
    after_lon
):

    gps = gps_score(
        before_lat,
        before_lon,
        after_lat,
        after_lon
    )

    before_path = before_media.replace(
        "/uploads/",
        "uploads/"
    ) if before_media else None

    after_path = after_media.replace(
        "/uploads/",
        "uploads/"
    ) if after_media else None

    visual = image_similarity(
        before_path,
        after_path
    ) if before_path and after_path else {
        "score": 0,
        "matches": 0
    }

    # For MVP:
    # visual score contributes to angle/background/road similarity.
    angle_score = visual["score"]
    background_score = visual["score"]
    road_region_score = visual["score"]

    overall = round(
        (
            gps["score"]
            + angle_score
            + background_score
            + road_region_score
        ) / 4
    )

    if overall >= 70:
        status = "verified"

    elif overall >= 45:
        status = "manual_review"

    else:
        status = "rejected"

    return {
        "gps_match": gps["score"],
        "gps_distance_meters": gps["distance_meters"],

        "angle_match": angle_score,

        "background_match": background_score,

        "road_region_match": road_region_score,

        "overall_score": overall,

        "verification_status": status,

        "visual_matches": visual["matches"]
    }