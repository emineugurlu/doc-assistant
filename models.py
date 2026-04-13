from pydantic import BaseModel  # miras alacağız ekledik
from datetime import datetime  # tarih/saat tipini alıyoruz 
from typing import Optional #opsiyonel olur da olmaz da

class DokumaYukle(BaseModel):  #miras aldık 
    dosya_adi: str   # zorunlu alan str olacak
    yuklenme_tarihi : datetime = datetime.now() # opsiyonel gönderilmezse otomatik şu anki zamanı alır
    dosya_turu : str   # zorunlu pdf mi txt vb mi olacak

class DokumanCevap(BaseModel):
    id: int
    dosya_adi: str
    dosya_turu : str
    yuklenme_tarihi : datetime
    mesaj : str