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
let click = null;
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

        console.log(car);
    } else {
            car.style.backgroundColor = bg;
            car.style.boxShadow = "";

            car.style.transform = "scale(1)";
    }
}


function carReset(curCar){
    if (!curCar) return;

    let carList = document.getElementsByClassName("team-card");
    let car = null;

    for (let i = 0; i < carList.length; i++){
        if (carList[i].classList[1] === curCar){
            car = carList[i];
            break;
        }
    }

    if (!car) return;

    carClickOFF(car, car.style.backgroundColor.split("0.")[0]);
}


function mclaren(){
    carClick(document.getElementById("r1c1"), "#f47600ed", "#ff7b00", "#F47600ba");
}

function ferarri(){
    carClick(document.getElementById("r1c2"), "#ED1131ed", "#ED1131", "#ED1131ba");
}

function mercedes(){
    carClick(document.getElementById("r2c1"), "#00D7B6ed", "#00D7B6", "#00f1cdc9");
}

function redbull(){
    carClick(document.getElementById("r2c2"), "#4781D7ed", "#4781D7", "#4781D7ba");
}

function aston(){
    carClick(document.getElementById("r3c1"), "#229971ed", "#229971", "#229971ba");
}

function racingbull(){
    carClick(document.getElementById("r3c2"), "#6C98FFed", "#6C98FF", "#6C98FFba");
}

function williams(){
    carClick(document.getElementById("r4c1"), "#1868DBed", "#1868DB", "#1868DBba");
}

function alpine(){
    carClick(document.getElementById("r4c2"), "#00A1E8ed", "#00A1E8", "#00A1E8ba");
}

function haas(){
    carClick(document.getElementById("r5c1"), "#9C9FA2ed", "#9C9FA2", "#9C9FA2ba");
}

function sauber(){
    carClick(document.getElementById("r5c2"), "#01C00Eed", "#01C00E", "#01C00Eba");
}



document.addEventListener("click", function(e) {
    
    click = e.srcElement.classList[1];
    
    if(cars.includes(click)){
        if (curCar == null) {
            curCar = e.srcElement.classList[1];
        } else if(click == curCar){
            if(curCar == "mclaren") window.open("https://www.mclaren.com/racing/formula-1/", "_blank");
            else if(curCar == "ferarri") window.open("https://www.ferrari.com/en-EN/formula1", "_blank");
            else if(curCar == "redbull") window.open("https://www.redbullracing.com/int-en", "_blank");
            else if(curCar == "racingbull") window.open("https://www.visacashapprb.com/int-en", "_blank");
            else if(curCar == "mercedes") window.open("https://www.mercedesamgf1.com/", "_blank");
            else if(curCar == "aston") window.open("https://www.astonmartinf1.com/en-GB", "_blank");
            else if(curCar == "williams") window.open("https://www.williamsf1.com/?srsltid=AfmBOoq78g_DUNEXf_ZoMWInyUodlSqcNt1XYhnjcfgLXNPWoDGv_LLR", "_blank");
            else if(curCar == "alpine") window.open("https://www.alpinef1.com/", "_blank");
            else if(curCar == "haas") window.open("https://www.haasf1team.com/", "_blank");
            else if(curCar == "sauber") window.open("https://www.sauber-group.com/", "_blank");

        } else {
            carReset(curCar);
            curCar = click;
        }
    } else {
        carReset(curCar);
        curCar = null;
    }

});