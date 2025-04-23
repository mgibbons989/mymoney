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
                <div className="admincont">

                    <aside className="sidebar">
                        <Sidebar />
                    </aside>

                    <div className="adminmain">
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
                {/* Control the database
                    add positions
                    edit privileges
                    control privileges for every employee including managers
                     */}
            </div>

            <Footer />
        </>
    )
};

export default Management;