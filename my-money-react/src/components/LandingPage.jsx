import { useState } from "react";
import "../styles.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Header from "./header";
import Footer from "./footer";


function LandingPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const result = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await result.json();
        if (result.ok) {
            localStorage.setItem("access_token", data.access_token);
            navigate("/dashboard");
        } else {
            alert(data.message);
        }
    }

    return (
        <>
            <Header />
            <main className="main-content">

                <section className="form-section">
                    <div className="form-card">
                        <h2>Login</h2>
                        <form onSubmit={handleLogin}>
                            <div className="form-group">
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password:</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit">Login</button>
                        </form>

                        <p>Don't have an account? Sign up <Link to="/register">here</Link></p>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}

export default LandingPage;