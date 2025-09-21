// Jansen Vanesco - 53524148 | TI D
document.addEventListener('DOMContentLoaded', function() {
    if (!auth.requireAuth()) {
        localStorage.setItem('redirectAfterLogin', window.location.pathname);
        return;
    }
    
    const user = auth.getCurrentUser();
    console.log('User logged in:', user);

    const form = document.getElementById('healthInsuranceForm');
    const calculateBtn = document.getElementById('calculateBtn');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const premiResult = document.getElementById('premiResult');
    const premiAmount = document.getElementById('premiAmount');
    const premiDetails = document.getElementById('premiDetails');

    const BASE_PREMIUM = 2000000;

    function formatRupiah(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    }

    function calculateAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    }
    
    function getAgeMultiplier(age) {
        if (age <= 20) return 0.1;
        if (age <= 35) return 0.2;
        if (age <= 50) return 0.25;
        return 0.4;
    }
    
    function calculatePremium() {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], select[required]');
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                const errorElement = document.getElementById(input.name + 'Error');
                if (errorElement) {
                    errorElement.style.display = 'block';
                }
            } else {
                const errorElement = document.getElementById(input.name + 'Error');
                if (errorElement) {
                    errorElement.style.display = 'none';
                }
            }
        });
        
        if (!isValid) {
            alert('Harap isi semua field yang wajib diisi.');
            return;
        }
        
        const birthDate = document.getElementById('birthDate').value;
        const smoking = parseInt(document.getElementById('smoking').value);
        const hypertension = parseInt(document.getElementById('hypertension').value);
        const diabetes = parseInt(document.getElementById('diabetes').value);
        
        const age = calculateAge(birthDate);
        
        const ageMultiplier = getAgeMultiplier(age);
        
        const premium = BASE_PREMIUM + 
                       (ageMultiplier * BASE_PREMIUM) + 
                       (smoking * 0.5 * BASE_PREMIUM) + 
                       (hypertension * 0.4 * BASE_PREMIUM) + 
                       (diabetes * 0.5 * BASE_PREMIUM);

        premiAmount.textContent = formatRupiah(premium);
        
        premiDetails.innerHTML = `
            <p>Detail Perhitungan:</p>
            <ul>
                <li>Premi dasar: ${formatRupiah(BASE_PREMIUM)}</li>
                <li>Faktor usia (${age} tahun): ${ageMultiplier} × ${formatRupiah(BASE_PREMIUM)} = ${formatRupiah(ageMultiplier * BASE_PREMIUM)}</li>
                <li>Merokok: ${smoking ? 'Ya' : 'Tidak'} → ${smoking ? formatRupiah(0.5 * BASE_PREMIUM) : 'Rp 0'}</li>
                <li>Hipertensi: ${hypertension ? 'Ya' : 'Tidak'} → ${hypertension ? formatRupiah(0.4 * BASE_PREMIUM) : 'Rp 0'}</li>
                <li>Diabetes: ${diabetes ? 'Ya' : 'Tidak'} → ${diabetes ? formatRupiah(0.5 * BASE_PREMIUM) : 'Rp 0'}</li>
            </ul>
            <p><strong>Total: ${formatRupiah(premium)} per tahun</strong></p>
        `;
        
        premiResult.style.display = 'block';
        checkoutBtn.style.display = 'block';
        
        premiResult.scrollIntoView({ behavior: 'smooth' });
        
        return premium;
    }
    
    function checkout() {
        const premium = calculatePremium();
        if (!premium) return;
        
        const id = 'health_' + Date.now();
        
        const birthDate = document.getElementById('birthDate').value;
        const age = calculateAge(birthDate);
        
        const insuranceData = {
            id: id,
            jenis: 'kesehatan',
            namaLengkap: document.getElementById('fullName').value,
            usia: age,
            pekerjaan: document.getElementById('occupation').value,
            merokok: document.getElementById('smoking').value === '1',
            hipertensi: document.getElementById('hypertension').value === '1',
            diabetes: document.getElementById('diabetes').value === '1',
            premi: premium,
            dibayar: false,
            createdAt: new Date().toISOString()
        };

        let asuransi = JSON.parse(localStorage.getItem('asuransi')) || [];
        
        asuransi.push(insuranceData);
        
        localStorage.setItem('asuransi', JSON.stringify(asuransi));

        alert('Data asuransi kesehatan berhasil disimpan! Mengarahkan ke halaman checkout...');
        window.location.href = 'checkout.html';
    }
    
    calculateBtn.addEventListener('click', calculatePremium);
    checkoutBtn.addEventListener('click', checkout);
    
    const birthDateInput = document.getElementById('birthDate');
    const today = new Date();
    const hundredYearsAgo = new Date();
    hundredYearsAgo.setFullYear(today.getFullYear() - 100);
    
    birthDateInput.max = today.toISOString().split('T')[0];
    birthDateInput.min = hundredYearsAgo.toISOString().split('T')[0];

    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach(error => {
        error.style.display = 'none';
    });

    if (user) {
        document.getElementById('userName').textContent = user.nama;
    }
    
    document.getElementById('logoutBtn').addEventListener('click', function() {
        auth.logout();
        window.location.href = 'login.html';
    });
});