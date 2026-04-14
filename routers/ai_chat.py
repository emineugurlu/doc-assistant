from fastapi import APIRouter, Depends,HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db, Dokuman
from services.ai_service import ai_ile_konyc

router = APIRouter(
    prefix="/chat",
    tags=["AI Sohbet"]
)

class SohbetIstegi(BaseModel): #yüklediğimiz dosyadan id ve soru base class da örnek aldık 
    dokuman_id: int
    soru :str
@router.post("/")
async def sohbet_et(
    istek: SohbetIstegi,
    db: Session= Depends(get_db)
):
    if not istek.soru or len(istek.soru.strip()) < 5:
        raise HTTPException(
            status_code=400,
            detail="Soru en az 5 karakter olmalıdır"
        )
    try:
        dokuman = db.query(Dokuman).filter(
            Dokuman.id== istek.dokuman_id
        ).first() #ilk bulunanı getir

        if not dokuman:  #eğer yoksa 404 hatası 
            raise HTTPException(
                status_code=404,
                detail=f"{istek.dokuman_id} ID'li dokuman bulunamadı"
            )
        cevap = ai_ile_konyc(dokuman.icerik, istek.soru) #kullanıcıdan gelen soru ve veritabanından geleni al gönderiyoruz

        return{
            "dokuman_adi": dokuman.dosya_adi,
            "soru": istek.soru,
            "cevap":cevap
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Sunucu hatası : {str(e)}"
        )
    