import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import TimeClock from "./dashboard/timeclock";
import CurrentPayPeriod from "./dashboard/currentpayp";
import UpcomingShifts from "./dashboard/upcoming";
import Sidebar from "./Sidebar";

import "./dashboard/dash.css"

function Dashboard() {
    const url = 'https://mymoney-production-c8a6.up.railway.app'

    const [name, setName] = useState("user");

    useEffect(() => {
        const token = localStorage.getItem("access_token");

        fetch(`${url}/api/employee`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
            .then(res => res.json())
            .then(data => {
                // console.log("Employee data:", data);
                setName(data.first_name);
            })
            .catch(err => {
                console.error("failed to get employee data", err);
            });
    }, []);

    return (
        <>
            <Header />
            <div className="main-content">

                <div className="content">

                    <aside className="sidebar">
                        <Sidebar />
                    </aside>

                    <div className="main">
                        <div className="dashheader"><h2>Welcome to Your Dashboard, {name}!</h2></div>

                        <div className="dash-middle">
                            <div className="dash-grid">

                                <div className="card">
                                    <TimeClock />
                                </div>

                                <div className="card">
                                    <CurrentPayPeriod />
                                </div>

                                <div className="card full">
                                    <UpcomingShifts />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
};

export default Dashboard;