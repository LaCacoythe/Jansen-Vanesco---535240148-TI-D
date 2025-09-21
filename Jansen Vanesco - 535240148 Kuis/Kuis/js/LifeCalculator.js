let Birth = document.getElementById("Tanggal");
let Prime = document.getElementById("Prime");
let Now = new Date()

function CalculatePrime(){
    let Pert = document.querySelector('input[name="Pertanggungan"]:checked').value;
    let BirthDate = new Date(Birth.value);
    let age = Now.getFullYear() - BirthDate.getFullYear();
    let BirthDay = Now.getMonth() > BirthDate.getMonth() || (Now.getMonth() === BirthDate.getMonth() && Now.getDate() >= BirthDate.getDate());
    if(!BirthDay) age--;

    if(age<=30) Prime.value = 0.002 * Number(Pert);
    else if(age<=50) Prime.value = 0.004 * Number(Pert);
    else Prime.value = 0.01 * Number(Pert);

    sessionStorage.setItem("Life", "true");
    sessionStorage.setItem("LifePrime", Prime.value);
}

Birth.addEventListener("input", CalculatePrime);
document.querySelectorAll('input[name="Pertanggungan"]').forEach(el => el.addEventListener("change", CalculatePrime));