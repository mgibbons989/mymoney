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

                <div className="content">

                    <aside className="sidebar">
                        <Sidebar />
                    </aside>

                    <div className="main">
                        <h2>Schedule</h2>
                        <small>Select a date to display shift information.</small>

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