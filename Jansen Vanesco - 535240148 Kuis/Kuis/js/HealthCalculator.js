let PrimeValue = document.getElementById("Prime");
let Birth = document.getElementById("Tanggal");
let Now = new Date()

function CalculatePrime(){
    let BirthDate = new Date(Birth.value);
    let age = Now.getFullYear() - BirthDate.getFullYear();
    let BirthDay = Now.getMonth() > BirthDate.getMonth() || (Now.getMonth() === BirthDate.getMonth() && Now.getDate() >= BirthDate.getDate());
    if(!BirthDay) age--;
    let Prime = 20000000;

    let smoker = document.querySelector('input[name="Smoker"]:checked');
    let hipertensi = document.querySelector('input[name="Hipertensi"]:checked');
    let diabetes = document.querySelector('input[name="Diabetes"]:checked');

    let DiabetesPrime = diabetes ? Number(diabetes.value) * (0.5 * Prime) : 0;
    let SmokerPrime = smoker ? Number(smoker.value) * (0.4 * Prime) : 0;
    let HipertensiPrime = hipertensi ? Number(hipertensi.value) * (0.5 * Prime) : 0;

    let AgePrime;
    if(age<=20) AgePrime = 0.1 * Prime;
    else if(age<=35) AgePrime = 0.2 * Prime;
    else if(age<=50) AgePrime = 0.25 * Prime;
    else AgePrime = 0.4 * Prime;

    PrimeValue.value = Prime + AgePrime + DiabetesPrime + SmokerPrime + HipertensiPrime;
    
    sessionStorage.setItem("Health", "true");
    sessionStorage.setItem("HealthPrime", PrimeValue.value);
}

Birth.addEventListener("input", CalculatePrime);
document.querySelectorAll('input[name="Smoker"]').forEach(el => el.addEventListener("change", CalculatePrime));
document.querySelectorAll('input[name="Hipertensi"]').forEach(el => el.addEventListener("change", CalculatePrime));
document.querySelectorAll('input[name="Diabetes"]').forEach(el => el.addEventListener("change", CalculatePrime));