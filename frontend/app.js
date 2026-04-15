async function dokumanlariGetir() {
    try {
        // FastAPI'deki listeleme endpoint'ine istek atıyoruz
        const response = await fetch('http://127.0.0.1:8000/upload/listele');
        const data = await response.json();
        
        const listeContainer = document.getElementById('dokuman-listesi');
        if (!listeContainer) return; // Eğer HTML'de o ID yoksa dur

        listeContainer.innerHTML = ''; // Önce temizle

        data.veriler.forEach(d => {
            // PDF mi TXT mi kontrolü
            const ikon = d.dosya_turu === 'pdf' ? 'fa-file-pdf' : 'fa-file-lines';
            const renk = d.dosya_turu === 'pdf' ? 'text-purple-400' : 'text-blue-400';
            const bg = d.dosya_turu === 'pdf' ? 'bg-purple-900/30' : 'bg-blue-900/30';

           const kart = `
             <div onclick="dokumanSec(${d.id}, '${d.dosya_adi}')" 
                class="bg-[#2a2a3d] p-3 rounded-xl flex items-center gap-3 border border-transparent hover:border-purple-500 cursor-pointer transition-all active:scale-95">
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

// Sayfa yüklendiğinde listeyi getir
window.onload = dokumanlariGetir;
const uploadBtn = document.getElementById('upload-btn');
const fileInput = document.getElementById('file-input');

// 1. Mor butona basınca gizli dosya seçiciyi aç
uploadBtn.addEventListener('click', () => fileInput.click());

// 2. Dosya seçildiği anda yükleme işlemini başlat
fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // FastAPI'nin beklediği "form-data" yapısını hazırlıyoruz
    const formData = new FormData();
    formData.append('dosya', file); // FastAPI router'daki "dosya" ismiyle aynı olmalı

    try {
        const response = await fetch('http://127.0.0.1:8000/upload/', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert("Dosya başarıyla yüklendi!");
            dokumanlariGetir(); // Listeyi yenile ki yeni dosya hemen görünsün
        } else {
            const error = await response.json();
            alert("Hata: " + error.detail);
        }
    } catch (error) {
        console.error("Yükleme hatası:", error);
    }
});
let seciliDokumanId = null;

function dokumanSec(id,ad){
    seciliDokumanId = id;
    console.log("Seçilen Doküman ID : ",id);

    const headerTitle = document.querySelector('header input');
    if(headerTitle){
        headerTitle.ariaPlaceholder=`${ad} içinde ara ...`;
    }

    alert(ad + "doküman seçildi! Artık buna göre soru sorabilirsiniz.");
}