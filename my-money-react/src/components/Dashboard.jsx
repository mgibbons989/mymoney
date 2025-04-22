import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import TimeClock from "./parts/timeclock";
import CurrentPayPeriod from "./parts/currentpayp";
import UpcomingShifts from "./parts/upcoming";

function Dashboard() {
    return (
        <>
            <Header />
            <div className="main-content">
                <div className="sidebar">
                    {/* SIDEBAR */}
                </div>

                <div className="dashmain">
                    <div className="top left">
                        <TimeClock />
                    </div>

                    <div className="top right">
                        <CurrentPayPeriod />
                    </div>

                    <div className="bottom">
                        <UpcomingShifts />

                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
};

export default Dashboard;