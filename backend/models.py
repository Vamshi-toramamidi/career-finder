from sqlalchemy import Column, Integer, String, BigInteger, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from psycopg2 import create_engine

from dotenv import load_dotenv
import os

load_dotenv('.env.local') # Load .env.local file

database_url = os.getenv("DATABASE_URL") # Get the DATABASE_URL from the environment variables
engine = create_engine(database_url) # Create the database engine using the DATABASE_URL from .env.local
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) # SessionLocal is a session factory that will be used to create new Session objects
Base = declarative_base() # Base class for declarative models - this is where all models will inherit from