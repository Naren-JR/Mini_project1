import '../css-pages/home.css'
//import TelemetryPanel from "../components/TelemetryPanel";

function Home() {
    const news = [
        "Ferrari announces major aero upgrade",
        "McLaren leads constructors",
        "FIA releases 2025 regulations",
        "Mercedes power unit breakthrough"];

    return (
        <div className="home-container">

            <section className="news-section">
                <div className="news-headline">
                    <img src="https://images.unsplash.com/photo-1541447271487-09612b3f49f7?q=80&w=2000" alt="featured news" />

                    <div className="news-overlay">
                        <h2>Ferrari announces major aero upgrade.</h2>
                    </div>
                </div>

                <div className="news-side">
                    <div className="news-card">
                        <img src="https://randomuser.me/api/portraits/men/32.jpg" />
                        <p>McLaren takes Constructors' lead.</p>
                    </div>

                    <div className="news-card">
                        <img src="https://randomuser.me/api/portraits/men/32.jpg" />
                        <p>FIA releases new 2025 regulation draft.</p>
                    </div>

                    <div className="news-card">
                        <img src="https://randomuser.me/api/portraits/men/32.jpg" />
                        <p>Mercedes confirms power unit breakthrough.</p>
                    </div>

                    <div className="news-card">
                        <img src="https://randomuser.me/api/portraits/men/32.jpg" />
                        <p>Mercedes confirms power unit breakthrough.</p>
                    </div>
                </div>
            </section>

            <section className="champions-section">
                <div className="champion-card driver-champion">
                    <div className="dcleft">
                        <div className="pos-season">1st • 2025 Season</div>

                        <div className="driver-name">
                            <span className="driver-first">Lando</span>
                            <span className="driver-last">Norris</span>
                        </div>

                        <div className="driver-meta">
                            McLaren &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 423pts
                        </div>
                    </div>
                    <img src="https://media.formula1.com/image/upload/c_fill,w_720/q_auto/v1740000000/common/f1/2025/mclaren/lannor01/2025mclarenlannor01right.webp" alt="Driver Champion" className='dcright' />
                </div>

                <div className="champion-card constructor-champion">
                    <h2>Constructor Champion</h2>

                    <img src="https://upload.wikimedia.org/wikipedia/en/thumb/6/66/McLaren_Racing_logo.svg/512px-McLaren_Racing_logo.svg.png" alt="Constructor Champion" />

                    <h3>McLaren</h3>
                    <p>Total Points: 750</p>
                    <p>Season: 2025</p>
                </div>

            </section>


            {/* ================= TELEMETRY ================= 
            <section className="telemetry-section">
                <h2>Live Telemetry</h2>
                <Telemetry />
            </section>
            */}

        </div>
    )
}

export default Home