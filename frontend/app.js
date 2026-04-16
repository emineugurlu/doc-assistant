// --- DURUM YÖNETİMİ ---
let seciliDokumanId = null;

window.onload = dokumanlariGetir;

// --- 1. LİSTELEME ---
async function dokumanlariGetir() {
    try {
        const response = await fetch('http://127.0.0.1:8000/upload/listele');
        const data = await response.json();
        const listeContainer = document.getElementById('dokuman-listesi');
        if (!listeContainer) return;

        listeContainer.innerHTML = ''; 

        data.veriler.forEach(d => {
            const ikon = d.dosya_turu === 'pdf' ? 'fa-file-pdf' : 'fa-file-lines';
            const renk = d.dosya_turu === 'pdf' ? 'text-purple-400' : 'text-blue-400';
            const bg = d.dosya_turu === 'pdf' ? 'bg-purple-900/20' : 'bg-blue-900/20';

            const kart = `
                <div onclick="dokumanSec(${d.id}, '${d.dosya_adi}', this)" 
                     class="group relative dokuman-kart bg-[#2a2a3d] p-3 rounded-xl flex items-center gap-3 border-2 border-transparent hover:border-purple-500/30 cursor-pointer transition-all mb-2">
                    <div class="${bg} ${renk} p-2 rounded-lg shrink-0">
                        <i class="fas ${ikon}"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-white truncate pr-6">${d.dosya_adi}</p>
                        <p class="text-[9px] text-gray-500 font-mono uppercase">ID: ${d.id}</p>
                    </div>
                    <button onclick="event.stopPropagation(); dokumanSil(${d.id})" 
                            class="absolute right-2 opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-500 transition-all">
                        <i class="fas fa-trash-alt text-xs"></i>
                    </button>
                </div>`;
            listeContainer.innerHTML += kart;
        });
    } catch (error) {
        console.error('Liste yüklenemedi:', error);
    }
}

// --- 2. SEÇME ---
function dokumanSec(id, ad, element) {
    seciliDokumanId = id;

    document.querySelectorAll('.dokuman-kart').forEach(k => {
        k.classList.remove('border-purple-500', 'bg-[#35354d]');
        k.classList.add('border-transparent', 'bg-[#2a2a3d]');
    });

    element.classList.remove('border-transparent', 'bg-[#2a2a3d]');
    element.classList.add('border-purple-500', 'bg-[#35354d]');

    document.getElementById('selected-doc-name').textContent = ad;
    document.getElementById('quick-actions').classList.remove('hidden');
}

// --- 3. MESAJLAŞMA ---
async function mesajGonder() {
    const input = document.getElementById('user-input');
    const soru = input.value.trim();
    if (!soru || !seciliDokumanId) return;

    mesajEkle(soru, 'user');
    input.value = '';

    try {
        const response = await fetch('http://127.0.0.1:8000/chat/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dokuman_id: seciliDokumanId, soru: soru })
        });
        const data = await response.json();
        mesajEkle(data.cevap || "Cevap alınamadı.", 'ai');
    } catch (error) {
        mesajEkle("Bağlantı hatası!", 'ai');
    }
}

// --- 4. GÖRSELLEŞTİRME (Markdown & Highlight) ---
function mesajEkle(metin, kimden) {
    const container = document.getElementById('chat-messages');
    const wrapper = document.createElement('div');
    wrapper.className = kimden === 'user' ? 'flex flex-col items-end w-full animate-fade-in' : 'flex flex-col items-start w-full animate-fade-in';

    const htmlContent = marked.parse(metin);

    if (kimden === 'user') {
        wrapper.innerHTML = `
            <span class="text-[9px] text-gray-600 mb-1 mr-2 font-bold uppercase">Kullanıcı</span>
            <div class="bg-[#5b36d6] text-white p-4 rounded-2xl rounded-tr-none shadow-lg max-w-[80%] text-sm">${metin}</div>`;
    } else {
        wrapper.innerHTML = `
            <span class="text-[9px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full mb-2 font-bold uppercase">AI Assistant</span>
            <div class="bg-[#1e1e2f] text-gray-200 p-5 rounded-2xl rounded-tl-none border border-gray-800 shadow-2xl max-w-[90%] w-full">
                <div class="markdown-body">${htmlContent}</div>
            </div>`;
    }

    container.appendChild(wrapper);
    wrapper.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
}

// --- 5. DİĞER FONKSİYONLAR ---
async function hızlıAksiyon(tip) {
    const prompt = tip === 'ozet' ? "Bu dokümanı 3 maddede özetle." : "Bu dokümandaki anahtar terimleri açıkla.";
    document.getElementById('user-input').value = prompt;
    mesajGonder();
}

async function dokumanSil(id) {
    if(!confirm("Silmek istediğine emin misin?")) return;
    const response = await fetch(`http://127.0.0.1:8000/upload/sil/${id}`, { method: 'DELETE' });
    if (response.ok) dokumanlariGetir();
}

// Dosya Yükleme Eventleri
document.getElementById('upload-btn').addEventListener('click', () => document.getElementById('file-input').click());
document.getElementById('file-input').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('dosya', file);
    const response = await fetch('http://127.0.0.1:8000/upload/', { method: 'POST', body: formData });
    if (response.ok) { alert("Yüklendi!"); dokumanlariGetir(); }
});

// Klavye Desteği
document.getElementById('user-input').addEventListener('keypress', (e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); mesajGonder(); } });
document.getElementById('send-btn').addEventListener('click', mesajGonder);