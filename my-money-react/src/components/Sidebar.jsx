import {
    DollarSign, Calendar, Home, Users, Settings, BookText, LogOut, User
} from "lucide-react"
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Sidebar() {

    return (
        <>
            <div className="side-header">
                <span className="icon"><User /></span>
                <span>Employee Portal</span>
            </div>
            <nav className="side">

                <Link to="/dashboard">
                    <button><span className="icon"><Home /></span> Dashboard</button>
                </Link>

                <Link to="/payroll">
                    <button><span className="icon"><DollarSign /></span> Earnings</button>
                </Link>

                <Link to="/schedule">
                    <button><span className="icon"><Calendar /></span> Schedule</button>
                </Link>

                {/* TO DOOOOO if the user has extra privileges then display this tab */}
                <Link to="/employees">
                    <button><span className="icon"><Users /></span> Employees</button>
                </Link>

                <Link to="/adminpage">
                    <button><span className="icon"><BookText /></span> System Management</button>
                </Link>

                <Link to="/">
                    <button><span className="icon"><Settings /></span> Settings</button>
                </Link>
            </nav>
            <div className="side-footer">
                <Link to="/">
                    <button><span className="icon"><LogOut /></span>Logout</button>
                </Link>
            </div>
        </>
    )
}

export default Sidebar;