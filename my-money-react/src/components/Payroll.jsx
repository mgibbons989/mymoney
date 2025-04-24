import { useState } from "react";
import Header from "./header";
import Footer from "./footer";
import Sidebar from "./Sidebar";
import DropDown from "./payroll/dropdown";
import ShiftList from "./payroll/shiftlist";
import "./payroll/pay.css"

function Payroll() {
    return (
        <>
            <Header />

            <div className="main-content">

                <div className="pay-content">

                    <aside className="sidebar">
                        <Sidebar />
                    </aside>

                    <div className="pay-main">
                        <h2>Payroll Earnings</h2>

                        <div className="pay-period-select">
                            <DropDown />
                        </div>

                        <div className="shifts">
                            <ShiftList />
                        </div>

                    </div>
                </div>

            </div>


            <Footer />
        </>
    )
};

export default Payroll;