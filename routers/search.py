from fastapi import APIRouter,Depends,HTTPException 
from sqlalchemy.orm import Session
from database import get_db, Dokuman

router = APIRouter (
    prefix="/search",
    tags=["Arama"]
)

@router.get("/")
async def ara(
    kelime: str,
    db: Session = Depends(get_db)
):
    if not kelime or len(kelime.strip()) < 2: #not kelime boş string ise ve 2 karakter kısaysa hata ver .strip() baştaki ve sondaki boşlukları temizle
        raise HTTPException(
            status_code=400,
            detail="Aranan kelime en az 2 karakter olmalıdır"
        )
    try:
        arama_terimi =f"%{kelime}%"
        
        sonuclar = db.query(Dokuman).filter(
            Dokuman.icerik.like(arama_terimi)   #sql like sorgusu
        ).all()

        if not sonuclar:
            return{
                "aranan_kelime":kelime,
                "bulunan_dokuman_sayisi":0,
                "sonuclar":[]
            }
        islenmis_sonuclar = []
        for dokuman in sonuclar:
            parcalar = _ilgili_parcayi_bul(dokuman.icerik, kelime)
            islenmis_sonuclar.append({
                "id":dokuman.id,
                "dosya_adi":dokuman.dosya_adi,
                "dosya_turu": dokuman.dosya_turu,
                "eslesen_parcalar": parcalar 
            })
        return {
            "aranan_kelime":kelime,
            "bulunan_dokuman_sayisi":len(sonuclar),
            "sonuclar": islenmis_sonuclar
        }    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Arama sırasında hata: {str(e)}"
        )
def _ilgili_parcayi_bul(metin: str, kelime: str, etraf: int = 150) -> list[str]:
    metin_kucuk = metin.lower()
    kelime_kucuk = kelime.lower()
    parcalar = []
    baslangic = 0
    
    while True:
        konum = metin_kucuk.find(kelime_kucuk, baslangic)
        
        if konum == -1:
            break
            
        parca_baslangic = max(0, konum - etraf)
        parca_bitis = min(len(metin), konum + len(kelime) + etraf)
        
        parca = metin[parca_baslangic:parca_bitis].strip()
        parcalar.append(parca)
        
        baslangic = konum + 1
        
        if len(parcalar) >= 3:
            break
    
    return parcalar