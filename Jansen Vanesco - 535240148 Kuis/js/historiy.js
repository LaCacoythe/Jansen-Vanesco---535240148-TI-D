// Jansen Vanesco - 53524148 | TI D
document.addEventListener('DOMContentLoaded', function() {
    if (!auth.requireAuth()) {
        localStorage.setItem('redirectAfterLogin', window.location.pathname);
        return;
    }
    
    const user = auth.getCurrentUser();
    console.log('User logged in:', user);

    const emptyHistory = document.getElementById('emptyHistory');
    const historyList = document.getElementById('historyList');
    const filterJenis = document.getElementById('filterJenis');
    const filterStatus = document.getElementById('filterStatus');
    const searchInput = document.getElementById('searchInput');

    function muatHistori() {
        const asuransi = JSON.parse(localStorage.getItem('asuransi')) || [];

        const historiPembelian = asuransi.filter(item => item.dibayar);
        
        if (historiPembelian.length === 0) {
            emptyHistory.style.display = 'block';
            historyList.style.display = 'none';
            return;
        }
        
        emptyHistory.style.display = 'none';
        historyList.style.display = 'block';

        historyList.innerHTML = '';

        historiPembelian.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        historiPembelian.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';

            let iconClass = '';
            let productName = '';
            
            if (item.jenis === 'jiwa') {
                iconClass = 'jiwa';
                productName = 'Asuransi Jiwa';
            } else if (item.jenis === 'kesehatan') {
                iconClass = 'kesehatan';
                productName = 'Asuransi Kesehatan';
            } else if (item.jenis === 'mobil') {
                iconClass = 'mobil';
                productName = 'Asuransi Mobil';
            }
            
            let details = '';
            
            if (item.jenis === 'jiwa') {
                details = `
                    <div class="history-meta">
                        <span><i class="fas fa-user"></i> ${item.namaLengkap}</span>
                        <span><i class="fas fa-birthday-cake"></i> ${item.usia} tahun</span>
                        <span><i class="fas fa-calendar"></i> ${item.periode} tahun</span>
                    </div>
                `;
            } else if (item.jenis === 'kesehatan') {
                details = `
                    <div class="history-meta">
                        <span><i class="fas fa-user"></i> ${item.namaLengkap}</span>
                        <span><i class="fas fa-birthday-cake"></i> ${item.usia} tahun</span>
                        <span><i class="fas fa-smoking"></i> ${item.merokok ? 'Merokok' : 'Tidak Merokok'}</span>
                    </div>
                `;
            } else if (item.jenis === 'mobil') {
                details = `
                    <div class="history-meta">
                        <span><i class="fas fa-car"></i> ${item.merek} ${item.tipe}</span>
                        <span><i class="fas fa-calendar"></i> ${item.tahun}</span>
                        <span><i class="fas fa-id-card"></i> ${item.pemilik}</span>
                    </div>
                `;
            }

            const itemId = item.id || Date.now();
            
            historyItem.innerHTML = `
                <div class="history-icon ${iconClass}">
                    <i class="fas ${item.jenis === 'jiwa' ? 'fa-heart' : item.jenis === 'kesehatan' ? 'fa-heartbeat' : 'fa-car'}"></i>
                </div>
                <div class="history-details">
                    <div class="history-product">${productName}</div>
                    ${details}
                    <div class="history-meta">
                        <span><i class="fas fa-calendar-check"></i> ${item.waktuDibayar || item.createdAt}</span>
                        <span><i class="fas fa-credit-card"></i> ${item.metodePembayaran || 'Transfer Bank'}</span>
                    </div>
                </div>
                <div class="history-price">${formatRupiah(item.premi)}</div>
                <div class="history-status status-lunas">LUNAS</div>
                <div class="history-actions">
                    <button class="btn-delete" data-id="${itemId}">
                        <i class="fas fa-trash"></i> Hapus
                    </button>
                </div>
            `;
            
            historyList.appendChild(historyItem);
        });

        terapkanFilter();
    }

    function formatRupiah(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    }

    function terapkanFilter() {
        const jenisValue = filterJenis.value;
        const statusValue = filterStatus.value;
        const searchValue = searchInput.value.toLowerCase();
        
        const items = historyList.querySelectorAll('.history-item');
        
        items.forEach(item => {
            const productName = item.querySelector('.history-product').textContent.toLowerCase();
            const jenis = item.querySelector('.history-icon').classList[1];
            const status = item.querySelector('.history-status').textContent;
            
            let showItem = true;

            if (jenisValue !== 'semua' && jenis !== jenisValue) {
                showItem = false;
            }

            if (statusValue !== 'semua') {
                const statusTarget = statusValue === 'lunas' ? 'LUNAS' : 'BELUM LUNAS';
                if (status !== statusTarget) {
                    showItem = false;
                }
            }

            if (searchValue && !productName.includes(searchValue)) {
                showItem = false;
            }

            item.style.display = showItem ? 'flex' : 'none';
        });
    }

    function hapusHistori(id) {
        if (!confirm('Apakah Anda yakin ingin menghapus item ini dari histori?')) {
            return;
        }
        
        const asuransi = JSON.parse(localStorage.getItem('asuransi')) || [];
        const updatedAsuransi = asuransi.filter(item => {
            if (!item.id) return true;
            return item.id !== id;
        });
        
        localStorage.setItem('asuransi', JSON.stringify(updatedAsuransi));
        muatHistori();
    }

    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-delete')) {
            const id = parseInt(e.target.closest('.btn-delete').dataset.id);
            hapusHistori(id);
        }
    });

    filterJenis.addEventListener('change', terapkanFilter);
    filterStatus.addEventListener('change', terapkanFilter);
    searchInput.addEventListener('input', terapkanFilter);

    muatHistori();

    if (user) {
        document.getElementById('userName').textContent = user.nama;
    }
    
    document.getElementById('logoutBtn').addEventListener('click', function() {
        auth.logout();
        window.location.href = 'login.html';
    });
});