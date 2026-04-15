// --- DEĞİŞKENLER ---
let seciliDokumanId = null;
const uploadBtn = document.getElementById('upload-btn');
const fileInput = document.getElementById('file-input');
const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatMessages = document.getElementById('chat-messages');

// --- 1. DOKÜMAN LİSTELEME ---
async function dokumanlariGetir() {
    try {
        const response = await fetch('http://127.0.0.1:8000/upload/listele');
        const data = await response.json();

        const listeContainer = document.getElementById('dokuman-listesi');
        if (!listeContainer) return;

        listeContainer.innerHTML = ''; // Listeyi temizle

        data.veriler.forEach(d => {
            const ikon = d.dosya_turu === 'pdf' ? 'fa-file-pdf' : 'fa-file-lines';
            const renk = d.dosya_turu === 'pdf' ? 'text-purple-400' : 'text-blue-400';
            const bg = d.dosya_turu === 'pdf' ? 'bg-purple-900/30' : 'bg-blue-900/30';

            const kart = `
                <div onclick="dokumanSec(${d.id}, '${d.dosya_adi}')" 
                     class="bg-[#2a2a3d] p-3 rounded-xl flex items-center gap-3 border border-transparent hover:border-purple-500 cursor-pointer transition-all active:scale-95 mb-2">
                    <div class="${bg} ${renk} p-2 rounded-lg">
                        <i class="fas ${ikon}"></i>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-white">${d.dosya_adi}</p>
                        <p class="text-[10px] text-gray-500">ID: ${d.id}</p>
                    </div>
                </div>
            `;
            listeContainer.innerHTML += kart;
        });
    } catch (error) {
        console.error('Veri çekerken hata oluştu:', error);
    }
}

// --- 2. DOKÜMAN SEÇME ---
function dokumanSec(id, ad, element) {
    seciliDokumanId = id;

    // 1. Önce daha önce seçilmiş olan kartların stilini temizle
    const tumKartlar = document.querySelectorAll('.dokuman-kart');
    tumKartlar.forEach(kart => {
        kart.classList.remove('border-purple-500', 'bg-[#35354d]');
        kart.classList.add('border-transparent', 'bg-[#2a2a3d]');
    });

    // 2. Tıklanan karta seçili stilini ekle
    element.classList.remove('border-transparent', 'bg-[#2a2a3d]');
    element.classList.add('border-purple-500', 'bg-[#35354d]');

    // 3. Başlığı güncelle
    const headerTitle = document.getElementById('seleceted-doc-name');
    if (headerTitle) {
        headerTitle.textContent = `${ad} - aktif doküman`;
    }
    
    console.log("Seçilen Doküman ID:", id);
}

// --- 3. DOSYA YÜKLEME ---
uploadBtn.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('dosya', file);

    try {
        const response = await fetch('http://127.0.0.1:8000/upload/', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert("Dosya başarıyla yüklendi!");
            dokumanlariGetir(); // Listeyi yenile
        } else {
            const error = await response.json();
            alert("Hata: " + error.detail);
        }
    } catch (error) {
        console.error("Yükleme hatası:", error);
    }
});

// --- 4. MESAJ GÖNDERME ---
async function mesajGonder() {
    const soru = userInput.value.trim(); // DÜZELTİLDİ: .value kullanıldı
    
    if (!soru) return;
    
    if (!seciliDokumanId) {
        alert("Önce bir doküman seç!");
        return;
    }

    // Kullanıcı mesajını ekrana ekle
    mesajEkle(soru, 'user');
    userInput.value = ''; // Inputu temizle

    try {
        const response = await fetch('http://127.0.0.1:8000/chat/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                dokuman_id: seciliDokumanId,
                soru: soru
            })
        });

        const data = await response.json();

        if (response.ok) {
            mesajEkle(data.cevap, 'ai');
        } else {
            mesajEkle("Hata: " + (data.detail || "Bir sorun oluştu"), 'ai');
        }
    } catch (error) {
        console.error("Chat Hatası:", error);
        mesajEkle("Sunucuya bağlanılamadı.", 'ai');
    }
}

// Buton tıklama ve Enter tuşu desteği
sendBtn.addEventListener('click', mesajGonder);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') mesajGonder();
});

// --- 5. MESAJI EKRANA YAZDIRMA ---
function mesajEkle(metin, kimden) {
    if (!chatMessages) return;

    const div = document.createElement('div');
    div.className = 'mb-4 flex flex-col'; // Mesajlar arası boşluk ve yönlendirme

    if (kimden === 'user') {
        div.innerHTML = `
            <div class="bg-[#5b36d6] text-white p-4 rounded-2xl max-w-[80%] self-end ml-auto">
                <p class="text-sm">${metin}</p>
            </div>
        `;
    } else {
        div.innerHTML = `
            <div class="bg-[#1e1e2f] text-white p-4 rounded-2xl max-w-[80%] self-start border border-gray-800">
                <p class="text-sm">${metin}</p>
            </div>
        `;
    }

    chatMessages.appendChild(div);
    
    // Otomatik aşağı kaydır
    chatMessages.scrollTo({
        top: chatMessages.scrollHeight,
        behavior: 'smooth'
    });
}

// Sayfa ilk açıldığında dokümanları listele
window.onload = dokumanlariGetir;