from sqlalchemy import create_engine , Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime


VERITABANI_URL = "sqlite:///./doc_assistant.db"

engine = create_engine(
    VERITABANI_URL,
    connect_args={"chech_same_thread": False} # birden fazla istek gelince çökmemesi için

)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) # veritabanıyla her konuşmada açılan geçici bağlantı 

Base = declarative_base() #tabloların atası tüm tablolalarımız miras alacak

class Dokuman(Base) :
    class Dokuman(Base) :
        __tablename__  =   "dokumanlar"

        id = Column(Integer, primary_key=True, index=True)
        dosya_adi = Column(String(255), nullable=False)
        dosya_turu =  Column(String(10), nullable=False)
        icerik = Column(Text, nullable=False)
        yuklenme_tarihi=Column(DateTime,default=datetime.now)
    
    def veritabani_olustur():
        Base.metadata.create_all(bind=engine) #sql yazmadan tablo oluşturuyor 