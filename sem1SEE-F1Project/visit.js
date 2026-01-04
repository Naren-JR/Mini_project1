const links = document.querySelectorAll("nav button");
const current = window.location.pathname.split("/").pop();

for (let i = 0; i < Math.min(links.length, 5); i++) {
  try {
    if (links[i].innerText.toLowerCase() + ".html" === current) {
      const page = document.getElementById(links[i].innerText.toLowerCase());
      if (page) {
        page.style.padding = "10px 25px";
        page.style.backgroundColor = "rgba(255, 30, 0, 0.9)";
        page.style.borderRadius = "10px";
      }
    }
  } catch (e) { /* ignore missing items */ }
}

function validateForm() {

    //Prevents Page refresh
    event.preventDefault();

    let name = document.getElementById("name").value.trim();
    if (!name) return alert("Name is required.");

    let email = document.getElementById("email").value.trim();
    let emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!email.match(emailPattern)) return alert("Enter a valid email address.");

    let contact = document.getElementById("contact").value.trim();
    if (contact.length != 10) return alert("Enter a valid phone number.");

    let gender = document.getElementById("gender").value.trim();
    if (!gender) return alert("Gender is required.");

    let dob = document.getElementById("dob").value;
    if (!dob) return alert("Date of Birth is required.");

    let dept = document.querySelectorAll("input[name='department']:checked");
    if (dept.length === 0) return alert("Select at least one Program Department.");

    let vDate = document.getElementById("vDate").value;
    if (!vDate) return alert("Please select your preferred date.");

    let duration = document.querySelector("input[name='duration']:checked");
    if (!duration) return alert("Select a tour duration.");

    let govID = document.getElementsByClassName("myID")[0].files.length;
    if (!govID) return alert("Upload a valid government ID.");

    let orgName = document.getElementById("orgName").value.trim();
    if (!orgName) return alert("Enter organization name.");

    let clgID = document.getElementsByClassName("myID")[1].files.length;
    if (!clgID) return alert("Upload organization ID.");


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