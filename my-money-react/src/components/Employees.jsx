import { useState } from "react";
import Header from "./header";
import Footer from "./footer";
import Sidebar from "./Sidebar";
import EmployeeList from "./employees/employeelist";

function Employees() {
    return (
        <>
            <Header />

            <div className="main-content">

                <div className="emp-content">

                    <aside className="sidebar">
                        <Sidebar />
                    </aside>

                    <div className="emp-main">
                        <EmployeeList />
                    </div>

                </div>
            </div>


            <Footer />

        </>
    )

};

export default Employees;