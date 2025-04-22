import {
    Clock, DollarSign, Calendar, Home, Users, Settings, HelpCircle, LogOut, Menu
} from "lucide-react"


function Sidebar() {
    return (
        <>
            <div className="side-header">
                <span className="icon"><DollarSign /></span>
                <span>Employee Portal</span>
            </div>
            <nav className="side">
                <button><span className="icon"><Home /></span> Dashboard</button>
                <button><span className="icon"><Clock /></span> Time Sheet</button>
                <button><span className="icon"><Calendar /></span> Schedule</button>

                {/* TO DOOOOO if the user has extra privileges then display this tab */}
                <button><span className="icon"><Users /></span> Employees</button>

                <button><span className="icon"><Settings /></span> Dashboard</button>
            </nav>
            <div className="side-footer">
                <button><span className="icon"><HelpCircle /></span>Help</button>
                <button><span className="icon"><LogOut /></span>Logout</button>
            </div>
        </>
    )
}

export default Sidebar;