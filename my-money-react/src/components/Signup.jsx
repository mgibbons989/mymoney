import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import { useNavigate } from "react-router-dom";

import "../register.css";

function Signup() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [fname, setFname] = useState("")
    const [lname, setLname] = useState("")
    const [position, setPosition] = useState("")
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        const res = await fetch("http://localhost:5000/signup", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, fname, lname, position }),
        });

        const data = await res.json();
        if (res.ok) {
            navigate("/");
        }
        else {
            alert(data.message);
        }
    }

    return (
        <>
            <Header />
            <main className="main-content">
                <div className="center">
                    <h2>Register</h2>
                    <div className="form">
                        <form onSubmit={handleSignup}>
                            <div>
                                <div className="form-group">
                                    <label>First Name:</label>
                                    <input
                                        type="text"
                                        id='fname'
                                        name='fname'
                                        onChange={e => setFname(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Last Name:</label>
                                    <input
                                        type="text"
                                        id='lname'
                                        name='lname'
                                        onChange={e => setLname(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="form-group">
                                    <label>Email:</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                    />
                                </div>


                                <div className="form-group">
                                    <label>Password:</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Confirm Password:</label>
                                    <input
                                        type="password"
                                        id="cpassword"
                                        name="cpassword"

                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="form-group">
                                    <label>Position:</label>
                                    <select>
                                        <option>--Choose--</option>
                                        <option>General Employee</option>
                                        <option>Manager</option>
                                        <option>Placeholder</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit">Register</button>
                        </form>
                        <p>
                            Already have an account? <Link to="/">Login here</Link>
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default Signup;