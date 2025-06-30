from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import jobs, resume, auth
from scraper import linkedin, indeed

# Create FastAPI app instance
app = FastAPI()

# Add CORS middleware (debug: allow all origins temporarily)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Use your frontend's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Include routers
app.include_router(jobs.router)
app.include_router(resume.router)
app.include_router(auth.router)

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Career Finder API is running", "auth": "/auth/* available"}