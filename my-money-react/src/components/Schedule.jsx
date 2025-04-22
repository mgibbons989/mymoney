import { useState } from "react";
import Header from "./header";
import Footer from "./footer";
import Calendar from "./schedule/calendar";
import Sidebar from "./Sidebar";

import "./schedule/sched.css"

function Schedule() {
    return (
        <>
            <Header />

            <div className="main-content">

                <div className="sched-content">

                    <aside className="sidebar">
                        <Sidebar />
                    </aside>

                    <div className="sched-main">
                        <h2>Schedule</h2>

                        <div className="cal">
                            <Calendar />
                        </div>

                    </div>

                </div>
            </div>

            <Footer />
        </>
    )
};

export default Schedule;