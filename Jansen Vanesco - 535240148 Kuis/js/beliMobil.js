// Jansen Vanesco - 53524148 | TI D
document.addEventListener('DOMContentLoaded', function() {
    if (!auth.requireAuth()) {
        localStorage.setItem('redirectAfterLogin', window.location.pathname);
        return;
    }

    const user = auth.getCurrentUser();
    console.log('User logged in:', user);

  const form = document.getElementById('insuranceForm');
  const calculateBtn = document.getElementById('calculateBtn');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const premiResult = document.getElementById('premiResult');
  const premiAmount = document.getElementById('premiAmount');
  const premiDetails = document.getElementById('premiDetails');

  let savedInsurances = JSON.parse(localStorage.getItem('asuransi')) || [];

  function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  }

  function calculatePremium() {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required]');

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

    const carPrice = parseInt(document.getElementById('carPrice').value);
    const manufactureYear = parseInt(document.getElementById('manufactureYear').value);
    const currentYear = new Date().getFullYear();
    const carAge = currentYear - manufactureYear;

    let premiumRate = 0;

    if (carAge >= 0 && carAge <= 3) {
      premiumRate = 0.025;
    } else if (carAge > 3 && carAge <= 5) {
      if (carPrice < 200000000) {
        premiumRate = 0.04;
      } else {
        premiumRate = 0.03;
      }
    } else if (carAge > 5) {
      premiumRate = 0.05;
    }

    const premium = carPrice * premiumRate;

    premiAmount.textContent = formatRupiah(premium);

    premiDetails.innerHTML = `
      <p>Detail Perhitungan:</p>
      <ul>
        <li>Harga mobil: ${formatRupiah(carPrice)}</li>
        <li>Usia mobil: ${carAge} tahun</li>
        <li>Rate premi: ${premiumRate * 100}%</li>
        <li>Perhitungan: ${formatRupiah(carPrice)} × ${premiumRate} = ${formatRupiah(premium)}</li>
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

    const id = 'mobil_' + Date.now();
    
    const insurance = {
      id: id,
      jenis: 'mobil',
      merek: document.getElementById('carBrand').value,
      tipe: document.getElementById('carType').value,
      tahun: document.getElementById('manufactureYear').value,
      harga: parseInt(document.getElementById('carPrice').value),
      plat: document.getElementById('plateNumber').value,
      nomorMesin: document.getElementById('engineNumber').value,
      nomorRangka: document.getElementById('chassisNumber').value,
      pemilik: document.getElementById('ownerName').value,
      premi: premium,
      dibayar: false,
      createdAt: new Date().toISOString()
    };

    savedInsurances.push(insurance);
    localStorage.setItem('asuransi', JSON.stringify(savedInsurances));

    alert('Asuransi mobil berhasil disimpan! Mengarahkan ke halaman checkout...');
    
    window.location.href = 'checkout.html';
  }

  calculateBtn.addEventListener('click', calculatePremium);
  checkoutBtn.addEventListener('click', checkout);

  document.getElementById('manufactureYear').addEventListener('input', function() {
    const currentYear = new Date().getFullYear();
    if (this.value > currentYear) {
      this.value = currentYear;
    }
  });

  document.getElementById('carPrice').addEventListener('input', function() {
    if (this.value < 0) {
      this.value = 0;
    }
  });

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