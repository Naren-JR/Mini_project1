import { useEffect } from "react";

import "../css-pages/nxtrace.css"

function NxtRace() {
    useEffect(() => {
        fetch("https://v1.formula-1.api-sports.io/teams", {
            "method": "GET",
            "headers": {
                "x-apisports-key": "XxXxXxXxXxXxXxXxXxXxXxXx"
            }
        })
            .then(response => {
                console.log(response);
            })
            .catch(err => {
                console.log(err);
            });

    }, []);

    return (
        <div className="raceTime-container">
            <h3>Race: </h3>
        </div>
    );
}

export default NxtRace;