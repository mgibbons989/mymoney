import { useState, useEffect } from "react";


function Employees() {
    const [employees, setEmployees] = useState([]);
    useEffect(() => {
        const token = localStorage.getItem("access_token");

        const fetchData = async () => {
            const resEmployees = await fetch("http://localhost:5000/employees", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEmployees(await resEmployees.json());
        };

        fetchData();
    }, []);

    return (
        <>
            <div className="emps">
                <h3>Employees</h3>

                <div className="admin-emp-list">

                    <ul className="man-employee">
                        {employees.length === 0 ? (
                            <li>No Employees</li>
                        ) : (
                            employees.map(emp => (
                                <li key={emp.id} className="empName">
                                    <span>Name: {emp.fname} {emp.lname}</span>  <span>Email: {emp.email}</span>  <span>Position: {emp.position}</span>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
        </>
    )
}

export default Employees;