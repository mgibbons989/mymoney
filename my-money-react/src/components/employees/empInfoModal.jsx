import { useState, useEffect } from "react";
import { X, Pencil, Trash2 } from "lucide-react"

import { format, parse } from 'date-fns';


function EmployeeModal({ employee, onClose }) {

    const [shifts, setShifts] = useState([]);
    const [filter, setFilter] = useState("week");

    useEffect(() => {
        const fetchShifts = async () => {
            const token = localStorage.getItem("access_token");
            const res = await fetch(`http://localhost:5000/getEmployeeShifts/${employee.id}?period=${filter}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setShifts(data);
        };

        fetchShifts();
    }, [employee.id, filter]);


    const [showAddForm, setShowAddForm] = useState(false);
    const [newShift, setNewShift] = useState({
        employee_id: employee.id,
        date: "",
        start_time: "",
        end_time: ""
    });

    const handleAddShift = async (newShift) => {
        const token = localStorage.getItem("access_token")
        const res = await fetch("http://localhost:5000/assign_shift", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newShift),
        });

        if (res.ok) {
            const addedShift = await res.json();
            setShifts((prev) => [...prev, addedShift]);
            setShowAddForm(false);
            setNewShift({ date: "", start_time: "", end_time: "" });
        }
        else {
            const errorData = await res.json();
            alert(errorData.message || "Failed to add shift.");
        }
    };

    const isValidShift = newShift.date && newShift.start_time && newShift.end_time;

    return (
        <>
            <div className="modal-overlay">
                <div className="modal-content">
                    <button className="close-btn" onClick={onClose}><X /></button>

                    <h2>{employee.fname} {employee.lname}</h2>
                    <p><strong>ID:</strong> {employee.id}</p>
                    <p><strong>Email:</strong> {employee.email}</p>
                    <p><strong>Position:</strong> {employee.position}</p>

                    <div className="empShifts">
                        <div className="sh"><h5>Shifts</h5></div>
                        <label className="tp">
                            <span className="tptitle">Time Period:</span>
                            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="tpdrop">
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                                <option value="all">All</option>
                            </select>
                        </label>

                        <table >
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Start</th>
                                    <th>End</th>
                                    <th>Hours</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {shifts.length === 0 ?
                                    (
                                        <tr>
                                            <td colSpan={5}>No shifts available.</td>
                                        </tr>
                                    ) : (
                                        shifts.map((shift, i) => (
                                            <tr key={i}>
                                                <td>{format(new Date(shift.date), 'MMM dd, yyyy')}</td>
                                                <td>{format(parse(shift.start_time, 'HH:mm', new Date()), 'h:mmaaa')}</td>
                                                <td>{format(parse(shift.end_time, 'HH:mm', new Date()), 'h:mmaaa')}</td>
                                                <td>{shift.hours}</td>
                                                <td>
                                                    <button><Pencil size={16} /></button>
                                                    <button><Trash2 size={16} /></button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                            </tbody>
                        </table>

                        {!showAddForm ? (
                            <button onClick={() => setShowAddForm(true)}>Add Shift</button>
                        ) : (
                            <form onSubmit={(e) => { e.preventDefault(); handleAddShift(newShift) }}>
                                <div>
                                    <label>Date</label>
                                    <input
                                        type="date"
                                        value={newShift.date}
                                        onChange={e => setNewShift({ ...newShift, date: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label>Start Time</label>
                                    <input
                                        type="time"
                                        value={newShift.start_time}
                                        onChange={e => setNewShift({ ...newShift, start_time: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label>End Time</label>
                                    <input
                                        type="time"
                                        value={newShift.end_time}
                                        onChange={e => setNewShift({ ...newShift, end_time: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <button type="submit" disabled={!isValidShift}>Add</button>
                                    <button onClick={() => {
                                        setShowAddForm(false);
                                        setNewShift({ date: "", start_time: "", end_time: "" });
                                    }}>Cancel</button>
                                </div>
                            </form>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
}

export default EmployeeModal;