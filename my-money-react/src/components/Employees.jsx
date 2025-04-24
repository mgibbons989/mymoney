import { useState } from "react";
import Header from "./header";
import Footer from "./footer";
import Sidebar from "./Sidebar";
import EmployeeList from "./employees/employeelist";
import "./employees/emp.css"

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
                        <h2>Employees</h2>
                        <small>Click on an employee name to display their information.</small>
                        <EmployeeList />
                    </div>

                </div>
            </div>


            <Footer />

        </>
    )

};

export default Employees;