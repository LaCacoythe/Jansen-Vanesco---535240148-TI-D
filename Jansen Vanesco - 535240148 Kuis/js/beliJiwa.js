document.addEventListener('DOMContentLoaded', function() {
    // Cek autentikasi
    if (!auth.requireAuth()) {
        localStorage.setItem('redirectAfterLogin', window.location.pathname);
        return;
    }

    const user = auth.getCurrentUser();
    console.log('User logged in:', user);

    const form = document.getElementById('lifeInsuranceForm');
    const calculateBtn = document.getElementById('calculateBtn');
    const saveBtn = document.getElementById('saveBtn');
    const premiResult = document.getElementById('premiResult');
    const premiAmount = document.getElementById('premiAmount');
    const premiDetails = document.getElementById('premiDetails');

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

    function getPremiumRate(age) {
        if (age <= 30) return 0.002;
        if (age <= 50) return 0.004;
        return 0.01;
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
        const coverageAmount = Number(document.getElementById('coverageAmount').value);  
        const age = calculateAge(birthDate); 
        const premiumRate = getPremiumRate(age);
        const monthlyPremium = premiumRate * coverageAmount;
        
        premiAmount.textContent = formatRupiah(monthlyPremium);

        const ratePercentage = (premiumRate * 100).toFixed(2);
        premiDetails.innerHTML = `
            <p>Detail Perhitungan:</p>
            <ul>
                <li>Usia: ${age} tahun</li>
                <li>Tarif premi: ${ratePercentage}% per bulan</li>
                <li>Besaran pertanggungan: ${formatRupiah(coverageAmount)}</li>
                <li>Perhitungan: ${ratePercentage}% × ${formatRupiah(coverageAmount)} = ${formatRupiah(monthlyPremium)}</li>
            </ul>
            <p><strong>Total: ${formatRupiah(monthlyPremium)} per bulan</strong></p>
        `;
        
        premiResult.style.display = 'block';
        saveBtn.style.display = 'block';

        premiResult.scrollIntoView({ behavior: 'smooth' });
        
        return {
            monthlyPremium,
            age,
            premiumRate,
            coverageAmount
        };
    }

    function saveInsurance() {
        const result = calculatePremium();
        
        if (!result) return;

        const insuranceData = {
            id: Date.now(),
            jenis: 'jiwa',
            namaLengkap: document.getElementById('fullName').value,
            birthDate: document.getElementById('birthDate').value,
            usia: result.age,
            nilaiPertanggungan: result.coverageAmount,
            premi: result.monthlyPremium,
            createdAt: new Date().toLocaleString('id-ID')
        };

        let asuransi = JSON.parse(localStorage.getItem('asuransi')) || [];

        asuransi.push(insuranceData);

        localStorage.setItem('asuransi', JSON.stringify(asuransi));

        alert('Data asuransi jiwa berhasil disimpan! Mengarahkan ke halaman checkout...');
        window.location.href = 'checkout.html';
    }

    calculateBtn.addEventListener('click', calculatePremium);
    saveBtn.addEventListener('click', saveInsurance);

    const birthDateInput = document.getElementById('birthDate');
    const today = new Date();
    const hundredYearsAgo = new Date();
    hundredYearsAgo.setFullYear(today.getFullYear() - 100);
    
    birthDateInput.max = today.toISOString().split('T')[0];
    birthDateInput.min = hundredYearsAgo.toISOString().split('T')[0];

    if (user) {
        document.getElementById('userName').textContent = user.nama;
    }
    
    document.getElementById('logoutBtn').addEventListener('click', function() {
        auth.logout();
        window.location.href = 'login.html';
    });
});