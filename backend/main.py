from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import jobs
from routes import auth

# Create FastAPI app instance
app = FastAPI()

# Allow frontend (Next.js) to access backend APIs
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React/Next.js port
    allow_credentials=True, # Allow cookies to be sent
    allow_methods=["*"], # Allow all HTTP methods
    allow_headers=["*"], # Allow all headers
)

app.include_router(jobs.router)
app.include_router(auth.router)
# Root endpoint