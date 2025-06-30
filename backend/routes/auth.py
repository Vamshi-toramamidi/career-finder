from fastapi import APIRouter, Request, Response, HTTPException, status, Depends, Cookie
from pydantic import BaseModel
from sqlalchemy.orm import Session as DBSession
from models import User, Session as UserSession, SessionLocal
import secrets
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone

router = APIRouter(prefix="/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SESSION_COOKIE_NAME = "session_token"
SESSION_EXPIRE_SECONDS = 60 * 60 * 24 * 7  # 1 week

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class SignupRequest(BaseModel):
    firstname: str
    lastname: str
    email: str
    password: str
    job_roles: list[str] = []
    resume: str | None = None

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/signup")
def signup(data: SignupRequest, response: Response, db: DBSession = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_pw = pwd_context.hash(data.password)
    user = User(
        firstname=data.firstname,
        lastname=data.lastname,
        email=data.email,
        password=hashed_pw,
        job_roles=data.job_roles,
        resume=data.resume
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    # Create session
    session_token = secrets.token_urlsafe(32)
    session_expiry = datetime.now(timezone.utc) + timedelta(seconds=SESSION_EXPIRE_SECONDS)
    session = UserSession(user_id=user.id, session_token=session_token, session_expiry=session_expiry)
    db.add(session)
    db.commit()
    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=session_token,
        httponly=True,
        max_age=SESSION_EXPIRE_SECONDS,
        samesite="lax"
    )
    return {"message": "Signup successful", "user": {"id": user.id, "email": user.email, "firstname": user.firstname, "lastname": user.lastname, "job_roles": user.job_roles, "resume": user.resume}}

@router.post("/login")
def login(data: LoginRequest, response: Response, db: DBSession = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not pwd_context.verify(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    # Create session
    session_token = secrets.token_urlsafe(32)
    session_expiry = datetime.now(timezone.utc) + timedelta(seconds=SESSION_EXPIRE_SECONDS)
    session = UserSession(user_id=user.id, session_token=session_token, session_expiry=session_expiry)
    db.add(session)
    db.commit()
    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=session_token,
        httponly=True,
        max_age=SESSION_EXPIRE_SECONDS,
        samesite="lax"
    )
    return {"message": "Login successful", "user": {"id": user.id, "email": user.email, "firstname": user.firstname, "lastname": user.lastname, "job_roles": user.job_roles, "resume": user.resume}}

@router.post("/logout")
def logout(response: Response, session_token: str = Cookie(None), db: DBSession = Depends(get_db)):
    if session_token:
        db.query(UserSession).filter(UserSession.session_token == session_token).delete()
        db.commit()
    response.delete_cookie(SESSION_COOKIE_NAME)
    return {"message": "Logged out"}

@router.get("/me")
def get_me(session_token: str = Cookie(None), db: DBSession = Depends(get_db)):
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    session = db.query(UserSession).filter(UserSession.session_token == session_token).first()
    if not session or session.session_expiry < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired or invalid")
    user = db.query(User).filter(User.id == session.user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return {"id": user.id, "email": user.email, "firstname": user.firstname, "lastname": user.lastname, "job_roles": user.job_roles, "resume": user.resume}
