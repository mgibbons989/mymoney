import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import TimeClock from "./dashboard/timeclock";
import CurrentPayPeriod from "./dashboard/currentpayp";
import UpcomingShifts from "./dashboard/upcoming";
import Sidebar from "./Sidebar";

import "./dashboard/dash.css"

function Dashboard() {
    return (
        <>
            <Header />
            <div className="main-content">

                <div className="dashcontent">

                    <aside className="sidebar">
                        <Sidebar />
                    </aside>

                    <div className="dashmain">
                        <div className="dashheader"><h2>Welcome to Your Dashboard /name/!</h2></div>

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