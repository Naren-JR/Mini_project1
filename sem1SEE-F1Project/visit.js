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

function validateForm() {

    //Prevents Page refresh
    event.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let contact = document.getElementById("contact").value.trim();
    let gender = document.getElementById("gender").value.trim();
    let dob = document.getElementById("dob");

    if (contact.length != 10) return alert("Enter a valid phone number.");

    // create message
    let done = document.createElement("div");
    done.style.textAlign = "center";
    done.style.margin = "150px 0";
    done.style.fontSize = "40px";
    done.style.color = "#ff1e00";
    done.innerText = "Your form has been submitted successfully!";

    // clear only the main section
    const main = document.getElementById("main");
    main.innerHTML = "";

    // insert message into main
    main.appendChild(done);

}