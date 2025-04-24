import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import interactionPlugin from '@fullcalendar/interaction';
import { format, parse, parseISO } from 'date-fns';


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
                    title: shift.title,
                    start: `${shift.shift_date}T${shift.start_time}`,
                    end: `${shift.shift_date}T${shift.end_time}`,
                    allDay: false
                }))

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
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedDate('');
    };

    const getShiftsForDate = (dateStr) => {
        return shifts.filter(shift => shift.start.startsWith(dateStr));
    };

    return (
        <div className="cal-content">
            <FullCalendar
                plugins={[dayGridPlugin, bootstrap5Plugin, interactionPlugin]}
                themeSystem="bootstrap5"
                initialView="dayGridMonth"
                events={shifts}
                dateClick={openModal}

            // eventColor="#ccc"
            // eventTextColor="black"
            />
            {modalOpen && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{selectedDate}</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={closeModal}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {getShiftsForDate(selectedDate).length > 0 ? (
                                    <ul>
                                        {getShiftsForDate(selectedDate).map((shift, i) => (
                                            <li key={i}>
                                                {shift.title}/<br />
                                                {shift.start}/<br />
                                                {shift.end}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No shifts on this day.</p>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-primary"
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
