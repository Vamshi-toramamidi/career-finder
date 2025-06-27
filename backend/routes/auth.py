from fastapi import APIRouter, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from models import SessionLocal, User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto") # Password hashing context

router = APIRouter() # Authentication router

def get_db():
    db = SessionLocal() # Create a new database session
    try:
        yield db # Yield the session to the route handler
    finally:
        db.close() # Close the session after the request is completed

@router.post("/login")
def login(email: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)): # Login endpoint
    user = db.query(User).filter(User.email == email).first() # Query the user by email
    if not user or not pwd_context.verify(password, user.password): # Verify the user exists and the password is correct
        raise HTTPException(status_code=401, detail="Invalid credentials") # Raise an error if credentials are invalid
    return {"message": "Login successful", "user_id": user.id} # Return success message and user ID

@router.post("/signup")
def signup(
    firstname: str = Form(...),
    lastname: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    hashed_password = pwd_context.hash(password) # Hash the password
    new_user = User(
        firstname=firstname,
        lastname=lastname,
        email=email,
        password=hashed_password
    )
    db.add(new_user) # Add the new user to the database
    db.commit() # Commit the transaction
    db.refresh(new_user) # Refresh the user instance to get the new ID
    return {"message": "User created successfully", "user_id": new_user.id} # Return success message and user ID