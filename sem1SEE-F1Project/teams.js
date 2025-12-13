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

let curCar = null;
cars = ["mclaren", "ferarri", "mercedes", "redbull", "aston", "racingbull", "williams", "alpine", "haas", "sauber"];

function carClickOFF(car, bg){

    car.classList.toggle("active");

            car.style.backgroundColor = (bg + "0.73);");
            car.style.boxShadow = "";

            car.style.transform = "scale(1)";
}

function carClick(car, newBg, glow, bg){

    car.classList.toggle("active");

    if(car.classList.contains("active")) {
        car.style.backgroundColor = newBg;
        car.style.boxShadow = `0 0 25px ${glow}`;

        car.style.transform = "scale(1.1)";
    } else {
            car.style.backgroundColor = bg;
            car.style.boxShadow = "";

            car.style.transform = "scale(1)";
    }
}


function carReset(curCar){
    carList = document.getElementsByClassName("team-card");

    let car;

    for(i = 0; i < 10; i++){
        
        if(carList[i].classList[1] == curCar){
            car = carList[i].id;
            car = document.getElementById(car);
            break;
        }
    }

    carClickOFF(car, car.style.backgroundColor.split("0.")[0]);
}


function mclaren(){
    carClick(document.getElementById("r1c1"), "#f47600ed", "#ff7b00", "#F47600ba");
}

function ferarri(){
    carClick(document.getElementById("r1c2"), "#ED1131ed", "#ff0026ff", "#ED1131ba");
}

function mercedes(){
    carClick(document.getElementById("r2c1"), "#C8CCCEed", "#c8ccceff", "#C8CCCEba");
}

function redbull(){
    carClick(document.getElementById("r2c2"), "#4781D7ed", "#4590ffff", "#4781D7ba");
}

function aston(){
    carClick(document.getElementById("r3c1"), "#037a68ff", "#00d1b1ff", "#037A68ba");
}

function racingbull(){
    carClick(document.getElementById("r3c2"), "#6C98FFed", "#3a75ffff", "#6C98FFba");
}

function williams(){
    carClick(document.getElementById("r4c1"), "#1868DBed", "#006affff", "#1868DBba");
}

function alpine(){
    carClick(document.getElementById("r4c2"), "#00A1E8ed", "#00b3ffff", "#00A1E8ba");
}

function haas(){
    carClick(document.getElementById("r5c1"), "#9C9FA2ed", "#9c9fa2ff", "#9C9FA2ba");
}

function sauber(){
    carClick(document.getElementById("r5c2"), "#01C00Eed", "#00e30fff", "#01C00Eba");
}


let click = null;
document.addEventListener("click", function(e) {
    
    click = e.srcElement.classList[1];
    
    if(cars.includes(click)){
        if (curCar == null) {
            curCar = e.srcElement.classList[1];
        } else if(click == curCar){
            console.log("Changeing page to drivers");
        } else {
            carReset(curCar);
            curCar = click;
        }
    } else {
        carReset(curCar);
        curCar = null;
    }

});