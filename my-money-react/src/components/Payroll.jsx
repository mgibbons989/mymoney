import { useState } from "react";
import Header from "./header";
import Footer from "./footer";
import Sidebar from "./Sidebar";
import PayPeriod from "./payroll/dropdown";
import ShiftWorkedList from "./payroll/shiftworkedlist";
import "./payroll/pay.css"

function Payroll() {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    return (
        <>
            <Header />

            <div className="main-content">

                <div className="content">

                    <aside className="sidebar">
                        <Sidebar />
                    </aside>

                    <div className="pay-main">
                        <h2>Payroll Earnings</h2>

                        <div className="pay-period-select">
                            <PayPeriod onSelect={(start, end) => {
                                setStartDate(start);
                                setEndDate(end);
                            }} />
                        </div>

                        <div className="shifts">
                            <ShiftWorkedList startDate={startDate} endDate={endDate} />
                        </div>

                    </div>
                </div>

            </div>

            <Footer />
        </>
    )
};

export default Payroll;
