import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import interactionPlugin from '@fullcalendar/interaction';
import { format, parse } from 'date-fns';
import { X } from "lucide-react";


import 'bootstrap/dist/css/bootstrap.min.css';
import '@fullcalendar/bootstrap5'; // applies Bootstrap theme

import './sched.css'

const Calendar = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');

    const [shifts, setShifts] = useState([]);

    useEffect(() => {
        const getShifts = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const res = await fetch("http://localhost:5000/getShifts", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch shifts");
                }

                const data = await res.json();

                const formatShifts = data.map(shift => ({
                    title: shift.title || "Shift",
                    start: `${shift.shift_date}`,
                    end: `${shift.shift_date}`,
                    start_time: shift.start_time,
                    end_time: shift.end_time
                    // allDay: false
                }))

                // console.log("Shifts", data);
                // console.log("formatted shifts", formatShifts);

                setShifts(formatShifts);
            } catch (err) {
                console.error("Error getting shifts", err)
            }
        };

        getShifts();

    }, []);

    const openModal = (info) => {
        // console.log("Date clicked:", info.dateStr);
        setSelectedDate(info.dateStr);
        // console.log(info.dateStr)
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedDate('');
    };

    const getShiftsForDate = (dateStr) => {
        return shifts.filter(shift => shift.start.startsWith(dateStr));
    };

    const handleEventClick = (info) => {
        const dateStr = info.event.startStr.slice(0, 10); // e.g. "2025-04-25"
        setSelectedDate(dateStr);
        setModalOpen(true);
    };

    return (
        <div className="cal-content">
            <FullCalendar
                plugins={[dayGridPlugin, bootstrap5Plugin, interactionPlugin]}
                themeSystem="bootstrap5"
                initialView="dayGridMonth"
                events={shifts}
                eventClick={handleEventClick}
                dateClick={openModal}

            // eventColor="#ccc"
            // eventTextColor="black"
            />
            {modalOpen && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{format(parse(selectedDate, "yyyy-MM-dd", new Date()), "MMMM d, yyyy")}</h5>

                            </div>
                            <div className="modal-body">
                                {getShiftsForDate(selectedDate).length > 0 ? (
                                    <div className='dshift'>
                                        {getShiftsForDate(selectedDate).map((shift, i) => (
                                            <div key={i}>
                                                {format(parse(shift.start_time, "HH:mm", new Date()), "h:mm a")} - {format(parse(shift.end_time, "HH:mm", new Date()), "h:mm a")}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>No shifts on this day.</p>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn-btn-primary"
                                    onClick={closeModal}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;
