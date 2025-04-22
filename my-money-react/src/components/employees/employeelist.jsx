// TO DOOOOOOOOOOOOOO
// LOOP THROUGH EXISTING EMPLOYEES
// LINK EACH EMPLOYEE TO AN EMPLOYEE INFORMATION SHEET
import './emp.css';
import { Link } from 'react-router-dom';

function EmployeeList() {
    return (
        <>
            <div className="card">
                <ul className="emp-list">
                    {/* Loop through employees here */}
                    <Link to="/">
                        <li className="employee">
                            <span>John Doe</span>
                            <span>1</span>
                        </li>
                    </Link>
                </ul>
            </div>
        </>
    );
}

export default EmployeeList;