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

(function teamPanel(){
  const drivers = {
        oscar: {
            name: "Oscar Piastri",
            country: "Australia",
            team: "McLaren",
            number: "81",
            color: "linear-gradient(180deg,rgba(163, 79, 0, 1) 5%, rgba(255, 123, 0, 1) 50%);",
            seasonWins: 7,
            seasonPodis: 16,
            seasonPos: "3rd",
            seasonPoints: 410
        },
        lando: {
            name: "Lando Norris",
            country: "United Kingdom",
            team: "McLaren",
            number: "4",
            color: "linear-gradient(180deg,rgba(163, 79, 0, 1) 5%, rgba(244, 118, 0, 1) 50%);",
            seasonWins: 7,
            seasonPodis: 18,
            seasonPos: "1st",
            seasonPoints: 423
        },

        charles: {
            name: "Charles Leclerc",
            country: "Monaco",
            team: "Ferrari",
            number: "16",
            color: "linear-gradient(180deg,rgba(113, 0, 6, 1) 5%, rgba(223, 0, 11, 1) 50%);",
            seasonWins: 0,
            seasonPodis: 7,
            seasonPos: "5th",
            seasonPoints: 242
        },
        lewis: {
            name: "Lewis Hamilton",
            country: "United Kingdom",
            team: "Ferrari",
            number: "44",
            color: "linear-gradient(180deg,rgba(113, 0, 6, 1) 5%, rgba(223, 0, 11, 1) 50%);",
            seasonWins: 0,
            seasonPodis: 0,
            seasonPos: "6th",
            seasonPoints: 156
        },

        george: {
            name: "George Russell",
            country: "United Kingdom",
            team: "Mercedes",
            number: "63",
            color: "linear-gradient(180deg,rgba(0, 117, 96, 1) 5%, rgba(0, 255, 208, 1) 50%);",
            seasonWins: 2,
            seasonPodis: 9,
            seasonPos: "4th",
            seasonPoints: 319
        },
        kimi: {
            name: "Kimi Antonelli",
            country: "Italy",
            team: "Mercedes",
            number: "12",
            color: "linear-gradient(180deg,rgba(0, 117, 96, 1) 5%, rgba(0, 255, 208, 1) 50%);",
            seasonWins: 0,
            seasonPodis: 3,
            seasonPos: "7th",
            seasonPoints: 150
        },

        max: {
            name: "Max Verstappen",
            country: "Netherlands",
            team: "Red Bull Racing",
            number: "1",
            color: "linear-gradient(180deg,rgba(0, 59, 148, 1) 5%, rgba(83, 146, 241, 1) 50%);",
            seasonWins: 8,
            seasonPodis: 15,
            seasonPos: "2nd",
            seasonPoints: 421
        },
        yuki: {
            name: "Yuki Tsunoda",
            country: "Japan",
            team: "Red Bull Racing",
            number: "22",
            color: "linear-gradient(180deg,rgba(0, 59, 148, 1) 5%, rgba(83, 146, 241, 1) 50%);",
            seasonWins: 0,
            seasonPodis: 0,
            seasonPos: "17th",
            seasonPoints: 33
        },

        fernando: {
            name: "Fernando Alonso",
            country: "Spain",
            team: "Aston Martin",
            number: "14",
            color: "linear-gradient(180deg,rgba(0, 117, 78, 1) 5%, rgba(52, 232, 172, 1) 50%);",
            seasonWins: 0,
            seasonPodis: 0,
            seasonPos: "10th",
            seasonPoints: 56
        },
        stroll: {
            name: "Lance Stroll",
            country: "Canada",
            team: "Aston Martin",
            number: "18",
            color: "linear-gradient(180deg,rgba(0, 117, 78, 1) 5%, rgba(52, 232, 172, 1) 50%);",
            seasonWins: 0,
            seasonPodis: 0,
            seasonPos: "16th",
            seasonPoints: 33
        },

        hadjar: {
            name: "Isack Hadjar",
            country: "France",
            team: "Racing Bulls",
            number: "6",
            color: "linear-gradient(180deg,rgba(56, 78, 130, 1) 5%, rgba(117, 157, 251, 1) 50%);",
            seasonWins: 0,
            seasonPodis: 1,
            seasonPos: "12th",
            seasonPoints: 51
        },
        lawson: {
            name: "Liam Lawson",
            country: "New Zealand",
            team: "Racing Bulls",
            number: "30",
            color: "linear-gradient(180deg,rgba(56, 78, 130, 1) 5%, rgba(117, 157, 251, 1) 50%);",
            seasonWins: 0,
            seasonPodis: 0,
            seasonPos: "14th",
            seasonPoints: 38
        },

        albon: {
            name: "Alex Albon",
            country: "Thailand",
            team: "Williams",
            number: "23",
            color: "linear-gradient(180deg,rgba(15, 60, 122, 1) 5%, rgba(18, 115, 252, 1) 50%);",
            seasonWins: 0,
            seasonPodis: 0,
            seasonPos: "8th",
            seasonPoints: 73
        },
        sainz: {
            name: "Carlos Sainz",
            country: "Spain",
            team: "Williams",
            number: "55",
            color: "linear-gradient(180deg,rgba(15, 60, 122, 1) 5%, rgba(18, 115, 252, 1) 50%);",
            seasonWins: 0,
            seasonPodis: 2,
            seasonPos: "9th",
            seasonPoints: 64
        },

        gasly: {
            name: "Pierre Gasly",
            country: "France",
            team: "Alpine",
            number: "10",
            color: "linear-gradient(180deg,,rgba(1, 93, 133, 1) 5%, rgba(0, 179, 255, 1) 50%);",
            seasonWins: 0,
            seasonPodis: 0,
            seasonPos: "20th",
            seasonPoints: 0
        },
        colapinto: {
            name: "Franco Colapinto",
            country: "Argentina",
            team: "Alpine",
            number: "43",
            color: "linear-gradient(180deg,,rgba(1, 93, 133, 1) 5%, rgba(0, 179, 255, 1) 50%);",
            seasonWins: 0,
            seasonPodis: 0,
            seasonPos: "18th",
            seasonPoints: 55
        },

        ocon: {
            name: "Esteban Ocon",
            country: "France",
            team: "Haas",
            number: "31",
            color: "linear-gradient(180deg,rgba(86, 86, 87, 1) 5%, rgba(171, 172, 173, 1) 50%);",
            seasonWins: 0,
            seasonPodis: 0,
            seasonPos: "15th",
            seasonPoints: 38
        },
        bearman: {
            name: "Oliver Bearman",
            country: "United Kingdom",
            team: "Haas",
            number: "87",
            color: "linear-gradient(180deg,rgba(86, 86, 87, 1) 5%, rgba(171, 172, 173, 1) 50%);",
            seasonWins: 0,
            seasonPodis: 0,
            seasonPos: "13th",
            seasonPoints: 41
        },

        nico: {
            name: "Nico Hülkenberg",    
            country: "Germany",
            team: "Kick Sauber",
            number: "27",
            color: "linear-gradient(180deg,rgba(2, 92, 8, 1) 5%, rgba(0, 223, 15, 1) 50%);",
            seasonWins: 0,
            seasonPodis: 1,
            seasonPos: "11th",
            seasonPoints: 51
        },
        bortoleto: {
            name: "Gabriel Bortoleto",
            country: "Brazil",
            team: "Kick Sauber",
            number: "5",
            color: "linear-gradient(180deg,rgba(2, 92, 8, 1) 5%, rgba(0, 223, 15, 1) 50%);",
            seasonWins: 0,
            seasonPodis: 0,
            seasonPos: "19th",
            seasonPoints: 19
        }
    };

  const buttons = document.querySelectorAll(".driver-card button");
  const card = document.getElementById("statsBox");



})();