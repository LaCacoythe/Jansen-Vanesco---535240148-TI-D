// Jansen Vanesco - 53524148 | TI D
document.addEventListener('DOMContentLoaded', function() {
    if (!auth.requireAuth()) {
        localStorage.setItem('redirectAfterLogin', window.location.pathname);
        return;
    }

    const user = auth.getCurrentUser();
    console.log('User logged in:', user);

    const kosongCheckout = document.getElementById('kosongCheckout');
    const checkoutIsi = document.getElementById('checkoutIsi');
    const kartuContainer = document.querySelector('.kartu-container');
    const totalPremiElement = document.getElementById('totalPremi');
    const totalPembayaranElement = document.getElementById('totalPembayaran');
    const tombolBayarSemua = document.getElementById('tombolBayarSemua');
    const checkoutPesan = document.getElementById('checkoutPesan');
    
    const BIAYA_ADMIN = 10000;

    function formatRupiah(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    }

    function muatAsuransi() {
        const asuransi = JSON.parse(localStorage.getItem('asuransi')) || [];
        const asuransiBelumDibayar = asuransi.filter(item => !item.dibayar);
        
        if (asuransiBelumDibayar.length === 0) {
            kosongCheckout.style.display = 'block';
            checkoutIsi.style.display = 'none';
            return;
        }
        
        kosongCheckout.style.display = 'none';
        checkoutIsi.style.display = 'block';

        kartuContainer.innerHTML = '';
        
        let totalPremi = 0;

        asuransiBelumDibayar.forEach((item, index) => {
            totalPremi += item.premi;
            
            const kartu = document.createElement('div');
            kartu.className = 'kartu-asuransi';
            
            let detailHtml = '';
            
            if (item.jenis === 'jiwa') {
                detailHtml = `
                    <div class="detail-item">
                        <span class="detail-label">Pemilik:</span>
                        <span class="detail-nilai">${item.namaLengkap}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Usia:</span>
                        <span class="detail-nilai">${item.usia} tahun</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Pertanggungan:</span>
                        <span class="detail-nilai">${formatRupiah(item.nilaiPertanggungan)}</span>
                    </div>
                `;
            } else if (item.jenis === 'kesehatan') {
                detailHtml = `
                    <div class="detail-item">
                        <span class="detail-label">Pemilik:</span>
                        <span class="detail-nilai">${item.namaLengkap}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Usia:</span>
                        <span class="detail-nilai">${item.usia} tahun</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Merokok:</span>
                        <span class="detail-nilai">${item.merokok ? 'Ya' : 'Tidak'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Hipertensi:</span>
                        <span class="detail-nilai">${item.hipertensi ? 'Ya' : 'Tidak'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Diabetes:</span>
                        <span class="detail-nilai">${item.diabetes ? 'Ya' : 'Tidak'}</span>
                    </div>
                `;
            } else if (item.jenis === 'mobil') {
                detailHtml = `
                    <div class="detail-item">
                        <span class="detail-label">Mobil:</span>
                        <span class="detail-nilai">${item.merek} ${item.tipe}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Tahun:</span>
                        <span class="detail-nilai">${item.tahun}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Plat:</span>
                        <span class="detail-nilai">${item.plat}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Pemilik:</span>
                        <span class="detail-nilai">${item.pemilik}</span>
                    </div>
                `;
            }
            
            kartu.innerHTML = `
                <div class="kartu-header">
                    <div class="nama-asuransi">Asuransi ${item.jenis}</div>
                    <div class="jenis-asuransi">${(item.jenis || 'UNKNOWN').toUpperCase()}</div>
                </div>
                <div class="detail-asuransi">
                    ${detailHtml}
                </div>
                <div class="premi-jumlah">
                    ${formatRupiah(item.premi)}
                </div>
                <div class="tombol-aksi">
                    <button class="tombol tombol-bayar-satuan" data-index="${index}">
                        <i class="fas fa-check-circle"></i> Bayar Sekarang
                    </button>
                    <button class="tombol tombol-hapus" data-index="${index}">
                        <i class="fas fa-trash"></i> Hapus
                    </button>
                </div>
            `;
            
            kartuContainer.appendChild(kartu);
        });

        totalPremiElement.textContent = formatRupiah(totalPremi);
        totalPembayaranElement.textContent = formatRupiah(totalPremi);

        document.querySelectorAll('.tombol-bayar-satuan').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                bayarAsuransi(index);
            });
        });

        document.querySelectorAll('.tombol-hapus').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                hapusAsuransi(index);
            });
        });
    }

    function hapusAsuransi(index) {
        let asuransi = JSON.parse(localStorage.getItem('asuransi')) || [];
        const asuransiBelumDibayar = asuransi.filter(item => !item.dibayar);
        
        if (index >= 0 && index < asuransiBelumDibayar.length) {
            const idHapus = asuransiBelumDibayar[index].id;
            asuransi = asuransi.filter(item => item.id !== idHapus);
            localStorage.setItem('asuransi', JSON.stringify(asuransi));
            muatAsuransi();
            tampilkanPesan('Asuransi berhasil dihapus.', 'sukses');
        }
    }

    function bayarAsuransi(index) {
        const asuransi = JSON.parse(localStorage.getItem('asuransi')) || [];
        const asuransiBelumDibayar = asuransi.filter(item => !item.dibayar);
        
        if (index >= 0 && index < asuransiBelumDibayar.length) {

            const asuransiDibayar = asuransiBelumDibayar[index];
            const indexLengkap = asuransi.findIndex(item => item.id === asuransiDibayar.id);
            
            if (indexLengkap !== -1) {

                asuransi[indexLengkap].dibayar = true;
                asuransi[indexLengkap].waktuDibayar = new Date().toLocaleString('id-ID');
                asuransi[indexLengkap].metodePembayaran = document.querySelector('input[name="metodePembayaran"]:checked').value;

                localStorage.setItem('asuransi', JSON.stringify(asuransi));

                muatAsuransi();
                
                tampilkanPesan('Pembayaran berhasil! Mengarahkan ke histori...', 'sukses');

                setTimeout(() => {
                    window.location.href = 'histori.html';
                }, 2000);
            }
        }
    }

    function bayarSemuaAsuransi() {
        const asuransi = JSON.parse(localStorage.getItem('asuransi')) || [];
        const asuransiBelumDibayar = asuransi.filter(item => !item.dibayar);
        
        if (asuransiBelumDibayar.length === 0) {
            tampilkanPesan('Tidak ada asuransi yang perlu dibayar.', 'error');
            return;
        }
        
        if (confirm(`Apakah Anda yakin ingin membayar semua ${asuransiBelumDibayar.length} asuransi?`)) {
            const waktuSekarang = new Date().toLocaleString('id-ID');
            const metodePembayaran = document.querySelector('input[name="metodePembayaran"]:checked').value;
            
            const asuransiDiperbarui = asuransi.map(item => {
                if (!item.dibayar) {
                    return {
                        ...item,
                        dibayar: true,
                        waktuDibayar: waktuSekarang,
                        metodePembayaran: metodePembayaran
                    };
                }
                return item;
            });

            localStorage.setItem('asuransi', JSON.stringify(asuransiDiperbarui));

            muatAsuransi();
            
            tampilkanPesan('Semua pembayaran berhasil! Mengarahkan ke histori...', 'sukses');

            setTimeout(() => {
                window.location.href = 'histori.html';
            }, 2000);
        }
    }

    function tampilkanPesan(pesan, jenis) {
        checkoutPesan.textContent = pesan;
        checkoutPesan.className = `wadah-pesan ${jenis}`;
        checkoutPesan.style.display = 'block';

        setTimeout(() => {
            checkoutPesan.style.display = 'none';
        }, 5000);
    }

    tombolBayarSemua.addEventListener('click', bayarSemuaAsuransi);

    muatAsuransi();

    if (user) {
        document.getElementById('userName').textContent = user.nama;
    }
    
    document.getElementById('logoutBtn').addEventListener('click', function() {
        auth.logout();
        window.location.href = '../index.html';
    });
});