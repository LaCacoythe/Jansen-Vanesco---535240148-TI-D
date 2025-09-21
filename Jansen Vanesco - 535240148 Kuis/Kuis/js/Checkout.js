let carDiv = document.getElementById("CarPrime");
let lifeDiv = document.getElementById("LifePrime");
let healthDiv = document.getElementById("HealthPrime");

function renderCheckout() {
    if(sessionStorage.getItem("Car") === "true") {
        let carPrime = sessionStorage.getItem("CarPrime");
        carDiv.innerHTML = `
        <strong>Asuransi Mobil</strong>
        <span>Prime: Rp ${carPrime}/Tahun</span>
        <label for="Payment">Metode Pembayaran</label>
        <select name="Payment" id="Payment">
            <option value="Bank">Transfer Bank</option>
            <option value="Kredit">Kartu Kredit</option>
        </select>
        <br>
        <button type="button" class="Cancel">Hapus</button>`;
        carDiv.style.display = "flex";

        let Cancel = carDiv.querySelector(".Cancel");
        Cancel.addEventListener("click", () => {
            sessionStorage.removeItem("Car");
            sessionStorage.removeItem("CarPrime");
            
            carDiv.style.display = "none";
            carDiv.innerHTML = "";
        });
    }
    else{
        carDiv.style.display = "none";
        carDiv.innerHTML = "";
    }
    if(sessionStorage.getItem("Life") === "true") {
        let lifePrime = sessionStorage.getItem("LifePrime");
        lifeDiv.innerHTML = `
        <strong>Asuransi Jiwa</strong>
        <span>Prime: Rp ${lifePrime}/Tahun</span>
        <label for="Payment">Metode Pembayaran</label>
        <select name="Payment" id="Payment">
            <option value="Bank">Transfer Bank</option>
            <option value="Kredit">Kartu Kredit</option>
        </select>
        <br>
        <button type="button" class="Cancel">Hapus</button>`;
        lifeDiv.style.display = "flex";

        let Cancel = lifeDiv.querySelector(".Cancel");
        Cancel.addEventListener("click", () => {
            sessionStorage.removeItem("Life");
            sessionStorage.removeItem("LifePrime");
            
            lifeDiv.style.display = "none";
            lifeDiv.innerHTML = "";
        });
    }
    else {
        lifeDiv.style.display = "none";
        lifeDiv.innerHTML = "";
    }

    if(sessionStorage.getItem("Health") === "true") {
        let healthPrime = sessionStorage.getItem("HealthPrime");
        healthDiv.innerHTML = `
        <strong>Asuransi Kesehatan</strong>
        <span>Prime: Rp ${healthPrime}/Tahun</span>
        <label for="Payment">Metode Pembayaran</label>
        <select name="Payment" id="Payment">
            <option value="Bank">Transfer Bank</option>
            <option value="Kredit">Kartu Kredit</option>
        </select>
        <br>
        <button type="button" class="Cancel">Hapus</button>`;
        healthDiv.style.display = "flex";

        let Cancel = healthDiv.querySelector(".Cancel");
        Cancel.addEventListener("click", () => {
            sessionStorage.removeItem("Health");
            sessionStorage.removeItem("HealthPrime");
            
            healthDiv.style.display = "none";
            healthDiv.innerHTML = "";
        });
    }
    else{
        healthDiv.style.display = "none";
        healthDiv.innerHTML = "";
    }
}

renderCheckout();