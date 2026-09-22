from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from routes.report_routes import router as report_router
from routes.repair_routes import router as repair_router
from routes.upload_routes import router as upload_router
from routes.verification_routes import router as verification_router
from routes.status_routes import router as status_router
from routes.map_routes import router as map_router
from routes.approval_routes import router as approval_router
from routes.dashboard_routes import router as dashboard_router


app = FastAPI(
    title="PaveTrack API",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)


@app.get("/")
def root():

    return {
        "message": "PaveTrack backend is running!"
    }


@app.get("/health")
def health_check():

    return {
        "status": "healthy",
        "database": "PaveTrack local database"
    }


app.include_router(report_router)
app.include_router(repair_router)
app.include_router(upload_router)
app.include_router(verification_router)
app.include_router(status_router)
app.include_router(map_router)
app.include_router(approval_router)