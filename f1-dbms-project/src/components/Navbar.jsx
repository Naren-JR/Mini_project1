import { Link } from "react-router-dom";
import f1logo from "../assets/F1-logo.svg";

import "../css-pages/navbar.css"

function Navbar() {

    return (
        <div className="navbar">

            <div className="logo">
                <Link to="/"><img src={f1logo} /></Link>
            </div>
            <div className="links">
                <Link to="/" className="link">Home</Link>
                <Link to="/Teams" className="link">Teams</Link>
                <Link to="/Drivers" className="link">Drivers</Link>
                <Link to="/Races" className="link">Races</Link>
                <Link to="/Stats" className="link">Stats</Link>
                <Link to="/Visit" className="link">Visit</Link>
                <Link to="/About" className="link">About</Link>
            </div>

        </div>
    )
}

export default Navbar