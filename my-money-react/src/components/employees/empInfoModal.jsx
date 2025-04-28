import { useState, useEffect } from "react";
import { X, Pencil, Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom";

import { format, parse } from 'date-fns';


function EmployeeModal({ employee, onClose }) {
    const url = 'https://mymoney-production-c8a6.up.railway.app'
    const navigate = useNavigate();

    const [shifts, setShifts] = useState([]);
    const [filter, setFilter] = useState("week");
    const [editShift, setEditShift] = useState(null);

    useEffect(() => {
        const fetchShifts = async () => {
            const token = localStorage.getItem("access_token");
            const res = await fetch(`${url}/getEmployeeShifts/${employee.id}?period=${filter}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setShifts(data);
        };

        console.log("Shifts rendering:", shifts);
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
        const res = await fetch(`${url}/assign_shift`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newShift),
        });

        if (res.ok) {
            const addedShift = await res.json();

            console.log("Added shift:", addedShift);

            setShifts((prev) => [...prev, addedShift]);
            setShowAddForm(false);
            setNewShift({ employee_id: employee.id, date: "", start_time: "", end_time: "" });
        }
        else {
            const errorData = await res.json();
            alert(errorData.message || "Failed to add shift.");
        }
    };

    const [editingShift, setEditingShift] = useState(null);

    const handleEditShift = (shift) => {

        setEditingShift({
            ...shift,
            date: format(new Date(shift.date), 'yyyy-MM-dd'),
        });

    };

    const handleUpdateShift = async () => {
        if (!editingShift) return;
        const token = localStorage.getItem("access_token");
        const res = await fetch(`${url}/edit_shift/${editingShift.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                date: editingShift.date,
                start_time: editingShift.start_time,
                end_time: editingShift.end_time
            }),
        });

        if (res.ok) {
            const updatedShift = await res.json();
            setShifts((prev) =>
                prev.map((shift) =>
                    shift.id === updatedShift.id ? updatedShift : shift
                )
            );
            setEditingShift(null);
            setNewShift({ date: "", start_time: "", end_time: "" });
        } else {
            const errorData = await res.json();
            alert(errorData.message || "Failed to update shift.");
        }
    };

    const handleDeleteShift = async (shiftId) => {
        const token = localStorage.getItem("access_token");
        const res = await fetch(`${url}/delete_shift/${shiftId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
            setShifts((prevShifts) => prevShifts.filter((shift) => shift.id !== shiftId));
        } else {
            const errorData = await res.json();
            alert(errorData.message || "Failed to delete shift.");
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
                                        shifts.map((shift, i) => {
                                            let startFormatted = "Invalid";
                                            let endFormatted = "Invalid";

                                            try {
                                                startFormatted = format(parse(shift.start_time, "HH:mm", new Date()), "h:mmaaa");
                                                endFormatted = format(parse(shift.end_time, "HH:mm", new Date()), "h:mmaaa");
                                            } catch (err) {
                                                console.error("Invalid time format:", err);
                                            }
                                            return (
                                                <tr key={i}>
                                                    <td>{format(new Date(shift.date), 'MMM dd, yyyy')}</td>
                                                    <td>{startFormatted}</td>
                                                    <td>{endFormatted}</td>
                                                    <td>{shift.hours}</td>
                                                    <td>
                                                        <button onClick={() => handleEditShift(shift)}><Pencil size={16} /></button>
                                                        <button onClick={() => handleDeleteShift(shift.id)}><Trash2 size={16} /></button>
                                                    </td>
                                                </tr>)
                                        })
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

                    {editingShift && (
                        <div className="edit-shift-form">
                            <form onSubmit={(e) => { e.preventDefault(); handleUpdateShift(); }}>
                                <div>
                                    <label>Date</label>
                                    <input
                                        type="date"
                                        value={editingShift.date}
                                        onChange={e => setEditingShift({ ...editingShift, date: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label>Start Time</label>
                                    <input
                                        type="time"
                                        value={editingShift.start_time}
                                        onChange={e => setEditingShift({ ...editingShift, start_time: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label>End Time</label>
                                    <input
                                        type="time"
                                        value={editingShift.end_time}
                                        onChange={e => setEditingShift({ ...editingShift, end_time: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <button type="submit">Save Changes</button>
                                    <button onClick={() => setEditingShift(null)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}

export default EmployeeModal;