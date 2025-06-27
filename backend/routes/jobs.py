from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()

@router.get("/search")
def search_jobs():
    sample_jobs = [
        {
            "id": 1,
            "title": "Software Engineer",
            "company": "TechCorp",
            "location": "Remote",
            "description": "Develop and maintain web applications."
        },
        {
            "id": 2,
            "title": "Data Scientist",
            "company": "DataWorks",
            "location": "New York, NY",
            "description": "Analyze data and build predictive models."
        },
        {
            "id": 3,
            "title": "Product Manager",
            "company": "InnovateX",
            "location": "San Francisco, CA",
            "description": "Lead product development teams."
        }
    ]
    return JSONResponse(content={"jobs": sample_jobs})
