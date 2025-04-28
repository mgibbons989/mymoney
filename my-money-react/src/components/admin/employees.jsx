import { useState, useEffect } from "react";


function Employees() {
    const url = 'https://mymoney-production-c8a6.up.railway.app'

    const [employees, setEmployees] = useState([]);
    useEffect(() => {
        const token = localStorage.getItem("access_token");

        const fetchData = async () => {
            const resEmployees = await fetch(`${url}/employees`, {
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

                {employees.length === 0 ? (
                    <p>No Employees Available.</p>
                ) : (
                    <table className="admin-emp-list">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Position</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map(emp => (
                                <tr key={emp.id} className="empName">
                                    <td>{emp.fname} {emp.lname}</td>
                                    <td>{emp.email}</td>
                                    <td>{emp.position}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    )
}

export default Employees;