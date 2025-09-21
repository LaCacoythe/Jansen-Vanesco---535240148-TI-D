// Jansen Vanesco - 53524148 | TI D
document.addEventListener('DOMContentLoaded', function() {
    const daftarFormulir = document.getElementById('daftarForm');
    const namaInput = document.getElementById('namaLengkap');
    const emailInput = document.getElementById('email');
    const teleponInput = document.getElementById('telepon');
    const passwordInput = document.getElementById('password');
    const konfirmasiInput = document.getElementById('konfirmasiPassword');
    const namaError = document.getElementById('namaError');
    const emailError = document.getElementById('emailError');
    const teleponError = document.getElementById('teleponError');
    const passwordError = document.getElementById('passwordError');
    const konfirmasiError = document.getElementById('konfirmasiError');
    const daftarPesan = document.getElementById('daftarPesan');

    function tampilkanError(elemen, pesan) {
        elemen.textContent = pesan;
        elemen.style.display = 'block';
    }

    function hapusError(elemen) {
        elemen.textContent = '';
        elemen.style.display = 'none';
    }

    function tampilkanPesan(pesan, jenis) {
        daftarPesan.textContent = pesan;
        daftarPesan.className = `wadah-pesan ${jenis}`;
        daftarPesan.style.display = 'block';

        setTimeout(() => {
            daftarPesan.style.display = 'none';
        }, 5000);
    }

    namaInput.addEventListener('input', function() {
        hapusError(namaError);
    });
    
    emailInput.addEventListener('input', function() {
        hapusError(emailError);
    });
    
    teleponInput.addEventListener('input', function() {
        hapusError(teleponError);
    });
    
    passwordInput.addEventListener('input', function() {
        hapusError(passwordError);
        hapusError(konfirmasiError);
    });
    
    konfirmasiInput.addEventListener('input', function() {
        hapusError(konfirmasiError);
    });

    daftarFormulir.addEventListener('submit', function(e) {
        e.preventDefault();

        hapusError(namaError);
        hapusError(emailError);
        hapusError(teleponError);
        hapusError(passwordError);
        hapusError(konfirmasiError);

        const formData = {
            nama: namaInput.value.trim(),
            email: emailInput.value.trim(),
            telepon: teleponInput.value.trim(),
            password: passwordInput.value,
            konfirmasi: konfirmasiInput.value
        };
        
        let valid = true;

        if (!formData.nama) {
            tampilkanError(namaError, 'Nama lengkap harus diisi');
            valid = false;
        } else if (!auth.isValidName(formData.nama)) {
            tampilkanError(namaError, 'Nama harus 3-32 karakter dan tidak boleh mengandung angka');
            valid = false;
        }

        if (!formData.email) {
            tampilkanError(emailError, 'Email harus diisi');
            valid = false;
        } else if (!auth.isValidEmail(formData.email)) {
            tampilkanError(emailError, 'Format email tidak valid');
            valid = false;
        }

        if (!formData.telepon) {
            tampilkanError(teleponError, 'Nomor handphone harus diisi');
            valid = false;
        } else if (!auth.isValidPhone(formData.telepon)) {
            tampilkanError(teleponError, 'Format nomor handphone tidak valid. Harus diawali 08 dan 10-16 digit angka');
            valid = false;
        }

        if (!formData.password) {
            tampilkanError(passwordError, 'Kata sandi harus diisi');
            valid = false;
        } else if (!auth.isValidPassword(formData.password)) {
            tampilkanError(passwordError, 'Kata sandi minimal 8 karakter');
            valid = false;
        }

        if (!formData.konfirmasi) {
            tampilkanError(konfirmasiError, 'Konfirmasi kata sandi harus diisi');
            valid = false;
        } else if (formData.password !== formData.konfirmasi) {
            tampilkanError(konfirmasiError, 'Kata sandi dan konfirmasi tidak sesuai');
            valid = false;
        }

        if (valid) {
            const result = auth.register(formData);
            
            if (result.success) {
                tampilkanPesan('Pendaftaran berhasil! Mengarahkan ke halaman login...', 'sukses');

                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                tampilkanPesan(result.message, 'error');
            }
        }
    });

    if (auth.isLoggedIn()) {
        window.location.href = '../index.html';
    }
});