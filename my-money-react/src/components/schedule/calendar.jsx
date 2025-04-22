import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from 'react-modal';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@fullcalendar/bootstrap5'; // applies Bootstrap theme

import './sched.css'
Modal.setAppElement('#root');

const Calendar = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    // TO DOOOOOOOOOOOOOOOOOO
    // GET SHIFTS FROM THE SHIFTS TABLE INSTEAD OF HARD CODING HERE
    const [shifts, setShifts] = useState([
        { title: 'Morning Shift - 6 hrs', date: '2025-04-21' },
        { title: 'Evening Shift - 4 hrs', date: '2025-04-22' },
        { title: 'Scheduled Shift - 8 hrs', date: '2025-04-24' }
    ]);

    const openModal = (info) => {
        setSelectedDate(info.dateStr);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedDate('');
    };

    const getShiftsForDate = (dateStr) => {
        return shifts.filter(shift => shift.date === dateStr);
    };

    return (
        <div className="cal-content">
            <h2>Schedule</h2>
            <FullCalendar
                plugins={[dayGridPlugin, bootstrap5Plugin, interactionPlugin]}
                themeSystem="bootstrap5"
                initialView="dayGridMonth"
                events={shifts}
                dateClick={openModal}

            // eventColor="#ccc"
            // eventTextColor="black"
            />

            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal" overlayClassName="overlay">
                <h3>{selectedDate}</h3>
                {getShiftsForDate(selectedDate).length > 0 ? (
                    <ul>
                        {getShiftsForDate(selectedDate).map((shift, i) => (
                            <li key={i}>{shift.title}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No shifts on this day.</p>
                )}
                <button onClick={closeModal}>Close</button>
            </Modal>
        </div>
    );
};

export default Calendar;
