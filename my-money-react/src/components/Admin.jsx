import { useState, useEffect } from "react";

import Header from "./header";
import Footer from "./footer";
import Sidebar from "./Sidebar";
import "./admin/ad.css"
import Positions from "./admin/positions"
import Employees from "./admin/employees"


function Management() {
    return (
        <>
            <Header />

            <div className="main-content">
                <div className="content">

                    <aside className="sidebar">
                        <Sidebar />
                    </aside>

                    <div className="main">
                        <h2>System Management</h2>

                        <div className="admingr">

                            <div className="section">
                                <Positions />
                            </div>

                            <div className="section">
                                <Employees />
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <Footer />
        </>
    )
};

export default Management;