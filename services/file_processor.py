import PyPDF2  #pdf okumak için
import io  #binary veri dosyası gibi davranır

def txt_oku(dosya_icregi : bytes) -> str:  #bytes veri geleceğini söyledik ve str ile stringe çeviriyoruz
    try:
        metin = dosya_icregi.decode("utf-8")  #binary veriyi metne çeviriyoruz
        return metin
    except UnicodeDecodeError:  #utf-8 olmazsa latin-1 i dene
        return dosya_icregi.decode("latin-1")

def pdf_oku(dosya_icerigi: bytes) -> str :
    try :
        pdf_dosyasi = io.BytesIO(dosya_icerigi)   #binary veriyi hafızasında sanal bir dosyaya çeviriyor
        pdf_okuyucu=PyPDF2.PdfReader(pdf_dosyasi) #pdf sayfalarına ayırıyor

        metin = ""
        for sayfa in pdf_okuyucu.pages:  #her safayı tek tek gez
            metin += sayfa.extract_text()  #o sayfadaki metni çıkar ve birleştir

        return metin     
    except Exception as e:
        raise ValueError(f"PDF okunamadi : {str(e)}")
    
def metni_parcala(metin : str, parca_boyutu: int = 1000) -> list[str]:
    metin=metin.strip()
    parcalar=[]

    while len(metin) > parca_boyutu:
        kes_noktasi = metin.rfind(" ",0, parca_boyutu)

        if kes_noktasi == -1:
            kes_noktasi = parca_boyutu
        parcalar.append(metin[:kes_noktasi].strip())
        metin=metin[:kes_noktasi].strip()
    if metin :
        parcalar.append(metin)

    return parcalar    


def dosyayi_isle(dosya_adi: str, dosya_icerigi: bytes) -> dict:
    dosya_turu = dosya_adi.split(".")[-1].lower()

    if dosya_turu == "pdf":
        metin = pdf_oku(dosya_icerigi)
    elif dosya_turu == "txt":
        metin = txt_oku(dosya_icerigi)
    else:
        raise ValueError(f"Desteklenmeyen dosya turu: {dosya_turu}")
    
    parcalar = metni_parcala(metin)

    return{
        "dosya_turu" : dosya_turu,
        "metin" : metin,
        "parca_sayisi" : len(parcalar),
        "parcalar": parcalar
    }