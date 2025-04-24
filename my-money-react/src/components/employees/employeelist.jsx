import './emp.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";

function EmployeeList() {
    const [employeeList, setEmployeeList] = useState([]);
    useEffect(() => {
        const token = localStorage.getItem("access_token");

        const fetchData = async () => {
            const resEmployees = await fetch("http://localhost:5000/employeesOnly", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEmployeeList(await resEmployees.json());
        };

        fetchData();
    }, []);

    return (
        <>
            <div className="card">
                <ul className="emp-list">
                    {employeeList.length === 0 ? (
                        <li>No Employees</li>
                    ) : (
                        employeeList.map(emp => (
                            <Link to='/info/'>
                                <li key={emp.id} className="empName">
                                    <span>{emp.id}: {emp.fname} {emp.lname}</span>
                                </li>
                            </Link>
                        ))
                    )}
                </ul>
            </div>
        </>
    );
}

export default EmployeeList;