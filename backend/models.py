from sqlalchemy import Column, Integer, String, BigInteger, ForeignKey
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

    id = Column(Integer, primary_key=True, index=True) # Primary key column
    firstname = Column(String, nullable=False) # First name column
    lastname = Column(String, nullable=False) # Last name column
    email = Column(String, unique=True, index=True, nullable=False) # Email column with unique constraint
    password = Column(String, nullable=False) # Password column

class UserJobRoles(Base):
    __tablename__ = 'user_job_roles' # Table name in the database

    user_id = Column(Integer, ForeignKey('users.id'), primary_key=True, nullable=False) # Foreign key to users table, part of composite PK
    job_role_id = Column(Integer, ForeignKey('job_roles.id'), primary_key=True, nullable=False) # Foreign key to job_roles table, part of composite PK


class job_roles(Base):
    __tablename__ = 'job_roles' # Table name in the database

    id = Column(Integer, primary_key=True, index=True) # Primary key column
    job_title = Column(String, nullable=False) # Job title column