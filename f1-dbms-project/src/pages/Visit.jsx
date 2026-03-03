import { useState } from "react";
import '../css-pages/visit.css'

export default function Visit() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contact: "",
        gender: "",
        dob: "",
        department: [],
        team: "Any",
        date: "",
        visitors: "1",
        duration: "",
        req: "",
        orgName: "",
        myGovID: null,
        myClgID: null,
    });

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === "checkbox" && name === "department") {
            setFormData((prev) => ({
                ...prev,
                department: checked
                    ? [...prev.department, value]
                    : prev.department.filter((d) => d !== value),
            }));
        } else if (type === "file") {
            setFormData((prev) => ({
                ...prev,
                [name]: files[0],
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <div id="main">
            <form id="formbox" onSubmit={handleSubmit}>
                <fieldset>
                    <legend>Personal Details</legend>

                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="contact">Phone Number</label>
                        <input type="tel" name="contact" id="contact" value={formData.contact} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="gender">Gender</label>
                        <input type="text" name="gender" id="gender" value={formData.gender} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="dob">Date of Birth</label>
                        <input type="date" name="dob" id="dob" value={formData.dob} onChange={handleChange} />
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Visit Details</legend>

                    <div className="form-group">
                        <label>Program Department</label>

                        <label className="txt">
                            <input type="checkbox" name="department" value="research" onChange={handleChange} />
                            Research
                        </label>

                        <label className="txt">
                            <input type="checkbox" name="department" value="development" onChange={handleChange} />
                            Development
                        </label>

                        <label className="txt">
                            <input type="checkbox" name="department" value="testing" onChange={handleChange} />
                            Testing
                        </label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="team">Team</label>
                        <select name="team" id="team" value={formData.team} onChange={handleChange}>
                            <option value="Any">No Preference</option>
                            <option value="McLaren">McLaren</option>
                            <option value="Ferrari">Ferrari</option>
                            <option value="Mercedes">Mercedes</option>
                            <option value="Red Bull Racing">Red Bull Racing</option>
                            <option value="Williams">Williams</option>
                            <option value="Racing Bulls">Racing Bulls</option>
                            <option value="Aston Martin">Aston Martin</option>
                            <option value="Hass F1 Team">Hass F1 Team</option>
                            <option value="Audi">Audi (Kick Sauber)</option>
                            <option value="Alpine">Alpine</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="vDate">Preferred Date</label>
                        <input type="date" name="date" id="vDate" value={formData.date} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="visitors">Number of Visitors</label>
                        <select name="visitors" id="visitors" value={formData.visitors} onChange={handleChange}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Tour Duration</label>

                        <label className="txt">
                            <input type="radio" name="duration" value="halfday" onChange={handleChange} />
                            Half-Day
                        </label>

                        <label className="txt">
                            <input type="radio" name="duration" value="fullday" onChange={handleChange} />
                            Full-Day
                        </label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="req">Special Requests/Comments or Medical Issues</label>
                        <input type="text" name="req" id="req" value={formData.req} onChange={handleChange} />
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Documents</legend>

                    <div className="form-group">
                        <label htmlFor="myGovID">Upload Valid Identification:</label>
                        <input type="file" name="myGovID" className="myID" onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="orgName">Institution/Organization Name:</label>
                        <input type="text" name="orgName" id="orgName" value={formData.orgName} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor="myClgID">Upload Valid Institution/Organization ID:</label>
                        <input type="file" name="myClgID" className="myID" onChange={handleChange} />
                    </div>
                </fieldset>

                <input type="submit" value="Submit" id="submit" />
            </form>
        </div>
    );
}