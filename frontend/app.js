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

        toastGoster("Önce bir döküman seç!", 'hata')

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

                toastGoster("Dosya başarıyla yüklendi!", 'basari')

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



    const wrapper = document.createElement('div');

    wrapper.className = kimden === 'user' ? 'flex flex-col items-end w-full mb-6' : 'flex flex-col items-start w-full mb-6';



    // Markdown'ı HTML'e çeviriyoruz

    const htmlIcerik = marked.parse(metin);



    if (kimden === 'user') {

        wrapper.innerHTML = `

            <span class="text-[10px] text-gray-500 mb-1 mr-2 font-medium uppercase tracking-widest">Kullanıcı</span>

            <div class="bg-[#5b36d6] text-white p-4 rounded-2xl rounded-tr-none shadow-xl max-w-[75%] border border-white/10">

                <p class="text-sm leading-relaxed">${metin}</p>

            </div>

        `;

    } else {

        wrapper.innerHTML = `

            <div class="flex items-center gap-2 mb-2">

                 <span class="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full flex items-center gap-1 border border-purple-500/30">

                    <span class="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></span> Gemini 2.5

                </span>

            </div>

            <div class="bg-[#1e1e2f] text-gray-200 p-5 rounded-2xl rounded-tl-none border border-gray-800 shadow-2xl max-w-[85%] prose prose-invert prose-sm">

                <div class="markdown-body">${htmlIcerik}</div>

            </div>

        `;

    }



    chatMessages.appendChild(wrapper);



    // Kod bloklarını renklendir (highlight.js tetikle)

    wrapper.querySelectorAll('pre code').forEach((el) => {

        hljs.highlightElement(el);

    });



    chatMessages.scrollTo({ top: chatMessages.scrollHeight, behavior: 'smooth' });

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



async function hızlıAksiyon(tip) {

    if (!seciliDokumanId) { toastGoster("Önce bir döküman seç!", 'hata'); return; }

   

    let prompt = "";

    if (tip === 'ozet') prompt = "Bu dokümanı 3 kısa maddede özetler misin?";

    if (tip === 'anahtar') prompt = "Bu dokümandaki en önemli 5 teknik terimi açıklar mısın?";



    // Kullanıcıya ne yapıldığını göstermek için input alanına yazalım veya direkt gönderelim

    const userInput = document.getElementById('user-input');

    userInput.value = prompt;

   

    // Direkt gönder butonunu tetikleyelim

    document.getElementById('send-btn').click();

}

function toastGoster(metin, tip = 'bilgi') {
    const renkler = {
        'basari': 'bg-green-500/20 border-green-500/30 text-green-400',
        'hata': 'bg-red-500/20 border-red-500/30 text-red-400',
        'bilgi': 'bg-purple-500/20 border-purple-500/30 text-purple-400'
    }
    
    const toast = document.createElement('div');
    toast.className = `fixed bottom-6 right-6 px-4 py-3 rounded-xl border text-sm font-medium z-50 animate-fade-in ${renkler[tip]}`;
    toast.textContent = metin;
    
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
}