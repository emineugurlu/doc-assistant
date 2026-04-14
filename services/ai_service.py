import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()  # .env dosyasını oku 

GEMİNİ_API_KEY = os.getenv("GEMINI_API_KEY")  # .env dosyasının içindeki gemini_pi_key değerini al
genai.configure(api_key=GEMİNİ_API_KEY)  #geminiye bu key ile bağlan

model = genai.GenerativeModel("gemini-1.5-flash")
def ai_ile_konyc(dokuman_icerigi: str, kullanici_sorusu: str)-> str: # context yaptık sınırlandırdık
    if not GEMİNİ_API_KEY:
        raise ValueError("GEMINI_API_KEY bulunamadi, .env dosyasını kontrol et")
    try :
        prompt = f"""
Sen bir teknik doküman asistanısın. 
Sana bir doküman veriyorum, sadec bu dokümana göre cevap ver.
Dokümanda olmayan bir şey sorulursa "Bu bilgi dokümanda yok" de. 

DOKÜMAN :
{dokuman_icerigi}
KULLANICI SORUSU :
{kullanici_sorusu}

CEVAP 
"""
        cevap = model.generate_content(prompt) # promptu geminiye gönder
        return cevap.text #gelen cevebın metin kısmını al ve döndür
    except Exception as e:
        raise ValueError(f"AL hatası : {str(e)}")