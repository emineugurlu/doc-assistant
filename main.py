from fastapi import FastAPI   #fastapi kütüphanesinin içinden fastApı sınıfını al yani pip install ile indirdiğimiz paketi kullanıyoruz.
from database import veritabani_olustur
from routers import upload,search,ai_chat

app = FastAPI (       #swagger da görünecek
    title="Doc Assistant",
    description="Al destekli doküman analiz aracı",
    version="0.1.0"
)

veritabani_olustur()

app.include_router(upload.router)
app.include_router(search.router)
app.include_router(ai_chat.router)
@app.get("/")   #tarayıcıdan get isteği gelirse ana_sayfa() fonksiyonu çalışır
def ana_sayfa():
    return{"mesaj" : "Doc Assistant çalışıyor", "durum" : "aktif"} #ve buna geri döndür