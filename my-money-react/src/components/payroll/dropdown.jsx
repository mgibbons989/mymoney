import React, { useState, useEffect } from 'react';
import { format, endOfMonth, isBefore, isAfter, startOfMonth } from 'date-fns';


function PayPeriod() {
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [payPeriods, setPayPeriods] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        if (year && month) {
            const startOfMonthDate = new Date(year, month - 1, 1);
            const endOfMonthDate = endOfMonth(startOfMonthDate);
            const today = new Date();

            let periods = [];

            const firstHalfEnd = isBefore(today, new Date(year, month - 1, 15)) ? today : new Date(year, month - 1, 15);
            const firstHalf = {
                label: `1st - ${format(firstHalfEnd, 'do MMMM yyyy')}`,
                start: startOfMonthDate,
                end: firstHalfEnd,
            };
            periods.push(firstHalf);

            if (isAfter(today, new Date(year, month - 1, 15))) {
                const secondHalfEnd = isAfter(today, endOfMonthDate) ? endOfMonthDate : today;
                const secondHalf = {
                    label: `16th - ${format(secondHalfEnd, 'do MMMM yyyy')}`,
                    start: new Date(year, month - 1, 16),
                    end: secondHalfEnd,
                };
                periods.push(secondHalf);
            }
            setPayPeriods(periods);
        }
    }, [year, month, currentDate]);

    return (
        <>
            <label className="pay-label">Select Pay Period:</label>

            <div className='pays'>
                <form className='payPeriodCont'>
                    <label htmlFor="year">Year:</label>
                    <input
                        type="number"
                        id="year"
                        name="year"
                        min="1900"
                        max="2100"
                        value={year}
                        onChange={(e) => setYear(parseInt(e.target.value))}
                        required
                    />

                    <label htmlFor="month">Month:</label>
                    <input
                        type="number"
                        id="month"
                        name="month"
                        min="1"
                        max="12"
                        value={month}
                        onChange={(e) => setMonth(parseInt(e.target.value))}
                        required
                    />
                </form>
                <div className='paydate'>
                    <label>Date:</label>

                    <select className="dropdown-select">
                        {payPeriods.map((period, index) => (
                            <option key={index} value={index}>
                                {period.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </>
    )
}

export default PayPeriod;