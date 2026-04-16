// --- DEĞİŞKENLER VE DURUM YÖNETİMİ ---
let seciliDokumanId = null;

// Sayfa ilk yüklendiğinde listeyi getir
window.onload = dokumanlariGetir;

// --- 1. DOKÜMANLARI LİSTELEME ---
async function dokumanlariGetir() {
    try {
        const response = await fetch('http://127.0.0.1:8000/upload/listele');
        const data = await response.json();

        const listeContainer = document.getElementById('dokuman-listesi');
        if (!listeContainer) return;

        listeContainer.innerHTML = ''; // Eski listeyi temizle

        data.veriler.forEach(d => {
            const ikon = d.dosya_turu === 'pdf' ? 'fa-file-pdf' : 'fa-file-lines';
            const renk = d.dosya_turu === 'pdf' ? 'text-purple-400' : 'text-blue-400';
            const bg = d.dosya_turu === 'pdf' ? 'bg-purple-900/30' : 'bg-blue-900/30';

            // DİKKAT: 'this' parametresi seçilen kartı parlatmak için şart!
           const kart = `
                <div onclick="dokumanSec(${d.id}, '${d.dosya_adi}', this)" 
                     class="group relative dokuman-kart bg-[#2a2a3d] p-3 rounded-xl flex items-center gap-3 border-2 border-transparent hover:border-purple-500/50 cursor-pointer transition-all mb-2">
                    
                    <div class="${bg} ${renk} p-2 rounded-lg shrink-0">
                        <i class="fas ${ikon}"></i>
                    </div>
                    
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-white truncate pr-6">${d.dosya_adi}</p>
                        <p class="text-[10px] text-gray-500 font-mono">ID: ${d.id}</p>
                    </div>

                    <button 
                        onclick="event.stopPropagation(); dokumanSil(${d.id})" 
                        class="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all z-10"
                    >
                        <i class="fas fa-trash-alt text-sm"></i>
                    </button>
                </div>
            `;
            listeContainer.innerHTML += kart;
        });
    } catch (error) {
        console.error('Liste yüklenirken hata:', error);
    }
}

// --- 2. DOKÜMAN SEÇME VE GÖRSEL EFEKT ---
function dokumanSec(id, ad, element) {
    seciliDokumanId = id;

    // Önce tüm kartların seçili stilini temizle
    const tumKartlar = document.querySelectorAll('.dokuman-kart');
    tumKartlar.forEach(k => {
        k.classList.remove('border-purple-500', 'bg-[#35354d]');
        k.classList.add('border-transparent', 'bg-[#2a2a3d]');
    });

    // Sadece tıkladığımız kartı seçili yap (Mor çerçeve)
    element.classList.remove('border-transparent', 'bg-[#2a2a3d]');
    element.classList.add('border-purple-500', 'bg-[#35354d]');

    // Üstteki başlığı güncelle
    const headerTitle = document.getElementById('seleceted-doc-name');
    if (headerTitle) {
        headerTitle.textContent = `${ad} - aktif`;
    }
}

// --- 3. MESAJ GÖNDERME ---
async function mesajGonder() {
    const userInput = document.getElementById('user-input');
    const soru = userInput.value.trim();
    
    if (!soru) return;
    
    if (!seciliDokumanId) {
        alert("Lütfen önce listeden bir belge seç!");
        return;
    }

    // Kullanıcı mesajını ekrana ekle ve kutuyu boşalt
    mesajEkle(soru, 'user');
    userInput.value = '';

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
            mesajEkle("Hata: " + (data.detail || "Sunucu hatası"), 'ai');
        }
    } catch (error) {
        mesajEkle("Sunucuya bağlanılamadı. FastAPI çalışıyor mu?", 'ai');
    }
}

// --- 4. DOSYA YÜKLEME ---
const uploadBtn = document.getElementById('upload-btn');
const fileInput = document.getElementById('file-input');

if (uploadBtn) {
    uploadBtn.addEventListener('click', () => fileInput.click());
}

if (fileInput) {
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
                dokumanlariGetir(); // Listeyi otomatik yenile
            }
        } catch (error) {
            console.error("Yükleme hatası:", error);
        }
    });
}

// --- 5. MESAJI EKRANA YAZDIRMA ---
function mesajEkle(metin, kimden) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;

    const div = document.createElement('div');
    
    // Mesajın kullanıcıdan mı yoksa AI'dan mı geldiğine göre stil ver
    if (kimden === 'user') {
        // KULLANICI MESAJI (Sağa Yaslı, Mor)
        div.className = 'flex flex-col items-end w-full mb-6'; // mb-6 ile arayı açtık
        div.innerHTML = `
            <span class="text-[10px] text-gray-600 mb-1 mr-2">Sen</span>
            <div class="bg-[#5b36d6] text-white p-4 rounded-3xl rounded-tr-none max-w-[70%] shadow-lg">
                <p class="text-sm leading-relaxed">${metin}</p>
            </div>
        `;
    } else {
        // AI MESAJI (Sola Yaslı, Koyu Gri + Etiket)
        div.className = 'flex flex-col items-start w-full mb-6';
        div.innerHTML = `
            <span class="text-[10px] bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-full mb-2 flex items-center gap-1.5 border border-blue-500/10">
                <span class="w-1.5 h-1.5 bg-blue-400 rounded-full"></span> Gemini 2.5
            </span>
            <div class="bg-[#1e1e2f] text-gray-200 p-4 rounded-3xl rounded-tl-none border border-gray-800 max-w-[80%] shadow-lg">
                <p class="text-sm leading-relaxed">${metin}</p>
            </div>
        `;
    }

    chatMessages.appendChild(div);
    
    // En alta kaydır (smooth bir şekilde)
    chatMessages.scrollTo({
        top: chatMessages.scrollHeight,
        behavior: 'smooth'
    });
}

// --- EVENT LISTENERS (DİĞER) ---
const sendBtn = document.getElementById('send-btn');
if (sendBtn) {
    sendBtn.addEventListener('click', mesajGonder);
}

const inputAlan = document.getElementById('user-input');
if (inputAlan) {
    inputAlan.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') mesajGonder();
    });
}

async function dokumanSil(id) {
    // Adresin Swagger'dakiyle birebir aynı olması şart!
    const url = `http://127.0.0.1:8000/upload/sil/${id}`;
    
    try {
        const response = await fetch(url, { method: 'DELETE' });

        if (response.ok) {
            console.log("Silme başarılı, liste yenileniyor...");
            // LİSTEYİ YENİLE (Bu olmazsa silindiğini göremezsin)
            await dokumanlariGetir(); 
        } else {
            console.error("Sunucu silme isteğini reddetti.");
        }
    } catch (error) {
        console.error("Bağlantı hatası:", error);
    }
}