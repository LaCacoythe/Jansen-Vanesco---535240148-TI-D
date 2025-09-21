let price = document.getElementById("Price");
let CarYear = document.getElementById("Year");
let Prime = document.getElementById("Prime");
let Year = new Date().getFullYear();

function CalculatePrime(){
    let age = Year - Number(CarYear.value);
    if(age<=3) Prime.value = 0.025 * price.value;
    else if(age>=4 && age<=5 && price.value>200000000) Prime.value = 0.03 * price.value;
    else if(age>=4 && age<=5) Prime.value = 0.04 * price.value;
    else if(age>5) Prime.value = 0.05 * price.value;

    sessionStorage.setItem("Car", "true");
    sessionStorage.setItem("CarPrime", Prime.value);
}

price.addEventListener("input",CalculatePrime);
CarYear.addEventListener("input",CalculatePrime);