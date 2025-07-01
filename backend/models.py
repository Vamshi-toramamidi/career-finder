from sqlalchemy import Column, Integer, String, BigInteger, ForeignKey, Text, ARRAY, TIMESTAMP
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy import create_engine
from dotenv import load_dotenv
import os

load_dotenv('.env.local') # Load .env.local file

database_url = os.getenv("DATABASE_URL") # Get the DATABASE_URL from the environment variables
engine = create_engine(database_url) # Create the database engine using the DATABASE_URL from .env.local
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) # SessionLocal is a session factory that will be used to create new Session objects
Base = declarative_base() # Base class for declarative models - this is where all models will inherit from

class User(Base):
    __tablename__ = 'users' # Table name in the database

    id = Column(BigInteger, primary_key=True, index=True) # Primary key column
    firstname = Column(Text, nullable=False) # First name column
    lastname = Column(Text, nullable=False) # Last name column
    email = Column(Text, unique=True, index=True, nullable=False) # Email column with unique constraint
    password = Column(Text, nullable=False) # Password column
    resume = Column(BigInteger, nullable=True)
    job_roles = Column(ARRAY(Text), nullable=True)
    # Relationships
    sessions = relationship('Session', back_populates='user', cascade="all, delete-orphan")
    applications = relationship('Application', back_populates='user', cascade="all, delete-orphan")

class Session(Base):
    __tablename__ = 'sessions'

    id = Column(BigInteger, primary_key=True, index=True)
    user_id = Column(BigInteger, ForeignKey('users.id'), nullable=False)
    session_token = Column(Text, unique=True, nullable=False, index=True)
    session_expiry = Column(TIMESTAMP(timezone=True), nullable=False)
    user = relationship('User', back_populates='sessions')

class Company(Base):
    __tablename__ = 'companies'
    id = Column(BigInteger, primary_key=True, index=True)
    company_name = Column(Text, nullable=False)
    company_url = Column(Text, nullable=True)
    jobs = relationship('Job', back_populates='company', cascade="all, delete-orphan")

class Job(Base):
    __tablename__ = 'jobs'
    id = Column(BigInteger, primary_key=True, index=True)
    job_title = Column(Text, nullable=False)
    job_link = Column(Text, nullable=False)
    company_id = Column(BigInteger, ForeignKey('companies.id'))
    company = relationship('Company', back_populates='jobs')
    applications = relationship('Application', back_populates='job', cascade="all, delete-orphan")

class Application(Base):
    __tablename__ = 'applications'
    id = Column(BigInteger, primary_key=True, index=True)
    user_id = Column(BigInteger, ForeignKey('users.id'))
    job_id = Column(BigInteger, ForeignKey('jobs.id'))
    application_date = Column(TIMESTAMP(timezone=True), nullable=False, server_default="now()")
    user = relationship('User', back_populates='applications')
    job = relationship('Job', back_populates='applications')