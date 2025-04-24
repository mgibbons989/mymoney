import { useState } from "react";
import Header from "./header";
import Footer from "./footer";
import Sidebar from "./Sidebar";
import PayPeriod from "./payroll/dropdown";
import ShiftWorkedList from "./payroll/shiftworkedlist";
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
                            <PayPeriod />
                        </div>

                        <div className="shifts">
                            <ShiftWorkedList />
                        </div>

                    </div>
                </div>

            </div>


            <Footer />
        </>
    )
};

export default Payroll;