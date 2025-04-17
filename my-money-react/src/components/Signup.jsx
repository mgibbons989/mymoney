import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import "../register.css";

function Signup() {
    return (
        <>
            <Header />
            <main className="main-content">
                <div className="center">
                    <h2>Register</h2>
                    <div className="form">
                        <form >
                            <div>
                                <div className="form-group">
                                    <label>First Name:</label>
                                    <input
                                        type="text"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Last Name:</label>
                                    <input
                                        type="text"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="form-group">
                                    <label>Email:</label>
                                    <input
                                        type="email"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Password:</label>
                                    <input
                                        type="password"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label>Type:</label>
                                <label>
                                    <input
                                        type="radio"
                                        value="buyer"
                                    />
                                    Buyer
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        value="seller"
                                    />
                                    Seller
                                </label>
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