import './emp.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import EmployeeModal from './empInfoModal';

function EmployeeList() {
    const url = 'https://mymoney-production-c8a6.up.railway.app'

    const [employeeList, setEmployeeList] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("access_token");

        const fetchData = async () => {
            const resEmployees = await fetch(`${url}/employeesOnly`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (resEmployees.ok) {
                setEmployeeList(await resEmployees.json());
            } else {
                console.error('Failed to fetch employees:', resEmployees.status);
            }
        };

        fetchData();
    }, []);

    return (
        <>

            <div className="card">
                <table className="emp-table">
                    <thead>
                        <tr><th>Name</th><th>ID Number</th></tr>
                    </thead>
                    <tbody>
                        {employeeList.length === 0 ? (
                            <tr><td colSpan={2}>No Employees</td></tr>
                        ) : (
                            employeeList.map(emp => (
                                <tr key={emp.id} className='employee' onClick={() => setSelectedEmployee(emp)}>
                                    <td className="empName">{emp.fname} {emp.lname}</td>
                                    <td>{emp.id}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {selectedEmployee && (
                    <EmployeeModal
                        employee={selectedEmployee}
                        onClose={() => setSelectedEmployee(null)}
                    />
                )}
            </div>
        </>
    );
}

export default EmployeeList;