from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from datetime import datetime

VERITABANI_URL = "sqlite:///./doc_assistant.db"

engine = create_engine(
    VERITABANI_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

class Base(DeclarativeBase):
    pass

class Dokuman(Base):
    __tablename__ = "dokumanlar"

    id = Column(Integer, primary_key=True, index=True)
    dosya_adi = Column(String(255), nullable=False)
    dosya_turu = Column(String(10), nullable=False)
    icerik = Column(Text, nullable=False)
    yuklenme_tarihi = Column(DateTime, default=datetime.now)

def veritabani_olustur():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()