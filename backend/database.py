# ← PostgreSQL connection
from sqlalchemy import create_engine, Column, Integer, Float, String
from sqlalchemy.orm import declarative_base, sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()
engine = create_engine(os.getenv("DATABASE_URL"))
Base = declarative_base()

class Patient(Base):
    __tablename__ = "patients"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    age = Column(Integer)
    hba1c = Column(Float)
    risk_score = Column(Float)
    risk_level = Column(String)

Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
print("Database connected!")