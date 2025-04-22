
import "../styles.css";
import { Link } from "react-router-dom";

import Header from "./header";
import Footer from "./footer";


function LandingPage() {

    return (
        <>
            <Header />
            <main className="main-content">

                <section className="form-section">
                    <div className="form-card">
                        <h2>Login</h2>
                        <form>
                            <div className="form-group">
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password:</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
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