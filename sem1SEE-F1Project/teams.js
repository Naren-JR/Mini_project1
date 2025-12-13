let links = document.querySelectorAll("nav button");

//get File location, pop() removes last element in array and then return it
let current = window.location.pathname.split("/").pop();
for(i = 0; i < 5; i++){
    if(links[i].innerText.toLowerCase() + ".html" == current){
        let page = document.getElementById(links[i].innerText.toLowerCase());

        page.style.padding = "10px 25px";
        page.style.backgroundColor = "rgba(255, 30, 0, 0.9)";
        page.style.borderRadius = "10px";
    }
}

let car;

function mclaren(){
    car = document.getElementById("r1c1");
    car.classList.toggle("active");

    if(car.classList.contains("active")) {
            car.style.backgroundColor = "#f47600ed";
            car.style.boxShadow = "0 0 25px #ff7b00";

            car.style.transform = "scale(1.1)";

    } else {
            car.style.backgroundColor = "#F47600ba";
            car.style.boxShadow = "";

            car.style.transform = "scale(1)";
    }
}

function ferarri(){
    car = document.getElementById("r1c2");
    car.classList.toggle("active");

    if(car.classList.contains("active")) {
            car.style.backgroundColor = "#ED1131ed";
            car.style.boxShadow = "0 0 25px #ff0026ff";

            car.style.transform = "scale(1.1)";

    } else {
            car.style.backgroundColor = "#ED1131ba";
            car.style.boxShadow = "";

            car.style.transform = "scale(1)";
    }
}

function mercedes(){
    car = document.getElementById("r2c1");
    car.classList.toggle("active");

    if(car.classList.contains("active")) {
            car.style.backgroundColor = "#C8CCCEed";
            car.style.boxShadow = "0 0 25px #c8ccceff";

            car.style.transform = "scale(1.1)";

    } else {
            car.style.backgroundColor = "#C8CCCEba";
            car.style.boxShadow = "";

            car.style.transform = "scale(1)";
    }
}

function redbull(){
    car = document.getElementById("r2c2");
    car.classList.toggle("active");

    if(car.classList.contains("active")) {
            car.style.backgroundColor = "#4781D7ed";
            car.style.boxShadow = "0 0 25px #4590ffff";

            car.style.transform = "scale(1.1)";

    } else {
            car.style.backgroundColor = "#4781D7ba";
            car.style.boxShadow = "";

            car.style.transform = "scale(1)";
    }
}

function aston(){
    car = document.getElementById("r3c1");
    car.classList.toggle("active");

    if(car.classList.contains("active")) {
            car.style.backgroundColor = "#037a68ff";
            car.style.boxShadow = "0 0 25px #00d1b1ff";

            car.style.transform = "scale(1.1)";

    } else {
            car.style.backgroundColor = "#037A68ba";
            car.style.boxShadow = "";

            car.style.transform = "scale(1)";
    }
}

function racingbull(){
    car = document.getElementById("r3c2");
    car.classList.toggle("active");

    if(car.classList.contains("active")) {
            car.style.backgroundColor = "#6C98FFed";
            car.style.boxShadow = "0 0 25px #3a75ffff";

            car.style.transform = "scale(1.1)";

    } else {
            car.style.backgroundColor = "#6C98FFba";
            car.style.boxShadow = "";

            car.style.transform = "scale(1)";
    }
}

function williams(){
    car = document.getElementById("r4c1");
    car.classList.toggle("active");

    if(car.classList.contains("active")) {
            car.style.backgroundColor = "#1868DBed";
            car.style.boxShadow = "0 0 25px #006affff";

            car.style.transform = "scale(1.1)";

    } else {
            car.style.backgroundColor = "#1868DBba";
            car.style.boxShadow = "";

            car.style.transform = "scale(1)";
    }
}

function alpine(){
    car = document.getElementById("r4c2");
    car.classList.toggle("active");

    if(car.classList.contains("active")) {
            car.style.backgroundColor = "#00A1E8ed";
            car.style.boxShadow = "0 0 25px #00b3ffff";

            car.style.transform = "scale(1.1)";

    } else {
            car.style.backgroundColor = "#00A1E8ba";
            car.style.boxShadow = "";

            car.style.transform = "scale(1)";
    }
}

function haas(){
    car = document.getElementById("r5c1");
    car.classList.toggle("active");

    if(car.classList.contains("active")) {
            car.style.backgroundColor = "#9C9FA2ed";
            car.style.boxShadow = "0 0 25px #9c9fa2ff";

            car.style.transform = "scale(1.1)";

    } else {
            car.style.backgroundColor = "#9C9FA2ba";
            car.style.boxShadow = "";

            car.style.transform = "scale(1)";
    }
}

function sauber(){
    car = document.getElementById("r5c2");
    car.classList.toggle("active");

    if(car.classList.contains("active")) {
            car.style.backgroundColor = "#01C00Eed";
            car.style.boxShadow = "0 0 25px #00e30fff";

            car.style.transform = "scale(1.1)";

    } else {
            car.style.backgroundColor = "#01C00Eba";
            car.style.boxShadow = "";

            car.style.transform = "scale(1)";
    }
}