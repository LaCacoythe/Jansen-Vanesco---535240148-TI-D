// Jansen Vanesco - 53524148 | TI D
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadUserFromStorage();
    }

    isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    isValidPassword(password) {
        return password.length >= 8;
    }

    isValidName(name) {
        const namePattern = /^[a-zA-Z\s]{3,32}$/;
        return namePattern.test(name);
    }

    isValidPhone(phone) {
        const phonePattern = /^08\d{8,14}$/;
        return phonePattern.test(phone);
    }

    login(email, password, rememberMe = false) {
        const users = JSON.parse(localStorage.getItem('pengguna') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = { ...user };
            this.saveUserToStorage(rememberMe);
            return { success: true, user: this.currentUser };
        } else {
            return { success: false, message: 'Email atau password salah' };
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        localStorage.removeItem('rememberMe');
        return { success: true, message: 'Logout berhasil' };
    }

    register(userData) {
        if (!this.isValidName(userData.nama)) {
            return { 
                success: false, 
                message: 'Nama harus 3-32 karakter dan tidak boleh mengandung angka' 
            };
        }

        if (!this.isValidEmail(userData.email)) {
            return { success: false, message: 'Format email tidak valid' };
        }

        if (!this.isValidPhone(userData.telepon)) {
            return { 
                success: false, 
                message: 'Format nomor handphone tidak valid. Harus diawali 08 dan 10-16 digit angka' 
            };
        }

        if (!this.isValidPassword(userData.password)) {
            return { 
                success: false, 
                message: 'Password minimal 8 karakter' 
            };
        }

        if (userData.password !== userData.konfirmasi) {
            return { success: false, message: 'Konfirmasi password tidak sesuai' };
        }

        const existingUsers = JSON.parse(localStorage.getItem('pengguna') || '[]');
        if (existingUsers.some(u => u.email === userData.email)) {
            return { success: false, message: 'Email sudah terdaftar' };
        }

        const newUser = {
            nama: userData.nama,
            email: userData.email,
            telepon: userData.telepon,
            password: userData.password
        };

        existingUsers.push(newUser);
        localStorage.setItem('pengguna', JSON.stringify(existingUsers));
        
        return { success: true, message: 'Pendaftaran berhasil', user: newUser };
    }

    saveUserToStorage(rememberMe = false) {
        const userData = JSON.stringify(this.currentUser);
        if (rememberMe) {
            localStorage.setItem('currentUser', userData);
            localStorage.setItem('rememberMe', 'true');
        } else {
            sessionStorage.setItem('currentUser', userData);
            localStorage.removeItem('rememberMe');
        }
    }

    loadUserFromStorage() {
        const rememberMe = localStorage.getItem('rememberMe') === 'true';
        const userData = rememberMe 
            ? localStorage.getItem('currentUser') 
            : sessionStorage.getItem('currentUser');
        
        if (userData) {
            this.currentUser = JSON.parse(userData);
        }
        return this.currentUser;
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    requireAuth() {
        if (!this.isLoggedIn()) {
            localStorage.setItem('redirectAfterLogin', window.location.pathname);
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

const auth = new AuthSystem();