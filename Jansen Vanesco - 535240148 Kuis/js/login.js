// Jansen Vanesco - 53524148 | TI D
document.addEventListener('DOMContentLoaded', function() {
    const loginFormulir = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const loginPesan = document.getElementById('loginPesan');

    function tampilkanError(elemen, pesan) {
        elemen.textContent = pesan;
        elemen.style.display = 'block';
    }

    function hapusError(elemen) {
        elemen.textContent = '';
        elemen.style.display = 'none';
    }

    function tampilkanPesan(pesan, jenis) {
        loginPesan.textContent = pesan;
        loginPesan.className = `wadah-pesan ${jenis}`;
        loginPesan.style.display = 'block';

        setTimeout(() => {
            loginPesan.style.display = 'none';
        }, 5000);
    }

    emailInput.addEventListener('input', function() {
        hapusError(emailError);
    });
    
    passwordInput.addEventListener('input', function() {
        hapusError(passwordError);
    });

    loginFormulir.addEventListener('submit', function(e) {
        e.preventDefault();

        hapusError(emailError);
        hapusError(passwordError);

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const rememberMe = document.getElementById('remember').checked;
        
        let valid = true;

        if (!email) {
            tampilkanError(emailError, 'Email harus diisi');
            valid = false;
        } else if (!auth.isValidEmail(email)) {
            tampilkanError(emailError, 'Format email tidak valid');
            valid = false;
        }

        if (!password) {
            tampilkanError(passwordError, 'Kata sandi harus diisi');
            valid = false;
        }

        if (valid) {
            const result = auth.login(email, password, rememberMe);
            
            if (result.success) {
                tampilkanPesan('Login berhasil! Mengarahkan ke halaman beranda...', 'sukses');

                setTimeout(() => {
                    const redirectUrl = localStorage.getItem('redirectAfterLogin') || '../index.html';
                    localStorage.removeItem('redirectAfterLogin');
                    window.location.href = redirectUrl;
                }, 2000);
            } else {
                tampilkanPesan(result.message, 'error');
            }
        }
    });
    
    window.addEventListener('load', function() {
        const rememberMe = localStorage.getItem('rememberMe') === 'true';
        const savedUser = auth.loadUserFromStorage();
        
        if (rememberMe && savedUser && savedUser.email) {
            emailInput.value = savedUser.email;
            document.getElementById('remember').checked = true;
        }
        
        if (auth.isLoggedIn()) {
            window.location.href = '../index.html';
        }
    });
});