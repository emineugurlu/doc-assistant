from fastapi import APIRouter,UploadFile,File,Depends,HTTPException
from sqlalchemy.orm import Session
from database import get_db, Dokuman
from services.file_processor import dosyayi_isle

router = APIRouter(
    prefix="/upload",
    tags=["Dosya Yükleme"]
)

@router.post("/")   #post isteği gelince burayı çalıştır
async def dosya_yukle(   #asekron fonksiyon dosya yüklenirken başka istekleri bekletme demek
    dosya:UploadFile = File(...),  #gelen dosyayı bu değişkede tut
    db: Session = Depends(get_db) 
):
    if not dosya.filename.endswith((".pdf",".txt")):  #dosyanın sonu pdf yafa txt mi değilse hata fırlat 
        raise HTTPException(
            status_code=400,  #yanlış istek 
            detail="Sadece PDF ve TXT dosyaları kabul edilir"
        )
    try :
        icerik = await dosya.read()  #içerği binary oku işlem bitene kadar bekle
        sonuc = dosyayi_isle(dosya.filename,icerik) #file_processor da ki fonksiyonu çağırdık

        yeni_dokuman = Dokuman (
            dosya_adi=dosya.filename,
            dosya_turu = sonuc["dosya_turu"],
            icerik=sonuc["metin"]
        )

        db.add(yeni_dokuman)  #nesneyi kaydet
        db.commit()  # gerçekten veritabanına yaz
        db.refresh(yeni_dokuman)  #veritabanından geri oku id gibi otomatik değerleri al

        return{
            "mesaj" : "Dosya başarıyla yükledi",
            "id" : yeni_dokuman.id,
            "dosya_adi": yeni_dokuman.dosya_adi,
            "parca_sayisi": sonuc["parca_sayisi"]
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sunucu hatasi:{str(e)}")
    
@router.get("/listele")
async def dokumanlari_listele(db: Session=Depends(get_db)): #veritabanının kapısını açtık
    try:
        dokumanlar=db.query(Dokuman).all() #vereitabanındaki tüm dokumanları sorgula yoksa boş liste döner

        return{
            "toplam_kayit": len(dokumanlar),
            "veriler":[
                {
                "id": d.id,
                "dosya_adi": d.dosya_adi,
                "dosya_turu": d.dosya_turu,
                "icerik_ozet": d.icerik[:100] + "..." if d.icerik else ""
                }
                for d in dokumanlar
            ]
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Listeleme sırasında hata oluştu : {str(e)}"
        )


@router.delete("/sil/{id}") # Adresi temizledik: /upload/sil/{id} olacak
async def dokuman_sil(id: int, db: Session = Depends(get_db)):
    try:
        # 1. Dokümanı veritabanında ara
        dokuman = db.query(Dokuman).filter(Dokuman.id == id).first()
        
        # 2. Eğer doküman yoksa hata döndür
        if not dokuman:
            raise HTTPException(
                status_code=404, 
                detail=f"ID: {id} olan doküman bulunamadı"
            )
        
        # 3. Veritabanından sil ve kaydet (COMMIT ŞART!)
        db.delete(dokuman)
        db.commit() 
        
        print(f"BAŞARILI: {id} ID'li döküman veritabanından silindi.")
        
        return {
            "status": "success", 
            "message": f"ID {id} olan doküman başarıyla silindi."
        }
        
    except Exception as e:
        db.rollback() # Bir hata olursa işlemi geri al
        print(f"HATA OLUŞTU: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Silme sırasında sunucu hatası: {str(e)}"
        )
