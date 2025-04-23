import { useState, useEffect } from "react";


function Employees() {
    const [employees, setEmployees] = useState([]);
    useEffect(() => {
        const token = localStorage.getItem("access_token");

        const fetchData = async () => {
            const resEmployees = await fetch("http://localhost:5000/employees");
            setEmployees(await resEmployees.json());
        };

        fetchData();
    }, []);

    return (
        <>
            <div className="emps">
                <h3>Employees</h3>
                {employees.map(emp => (
                    <div key={emp.id} className="man-employee">
                        <div>
                            <p className="empName">{emp.fname} {emp.lname}</p>
                            <p>Email: {emp.email}</p>
                            <p>Positon: {emp.position}</p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Employees;