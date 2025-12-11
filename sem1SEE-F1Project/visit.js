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