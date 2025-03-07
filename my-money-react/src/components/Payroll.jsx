import { useState } from "react";

const Payroll = ({ employeeID, positionName }) => {
    const [earnings, setEarnings] = useState(null);

    const calulate = async () => {
        try {
            const wageResult = await fetch(`http://127.0.0.1:5000/get_wage/${positionName}`);
            const wageData = await wageResult.json();
            if (!wageResult.ok) throw new Error(wageData.error || "Failed to get wage");

            const hoursResult = await fetch(`http://127.0.0.1:5000/get_wage/${employeeID}`);
            const hoursData = await hoursResult.json();
            if (!hoursResult.ok) throw new Error(hoursData.error || "Failed to get hours");

            const totalWages = wageData.hourly_wage * hoursData.total_hours;
            setEarnings(totalWages);
        }
        catch (error) {
            console.error("Error:", error);
            setEarnings(null);
        }
    };
    /* 
    app.route('/get_wage/<position_name>', methods = ['GET'])
    def get_wage(position_name):
        position = Position.query.filter_by(name = position_name).first()
        if position:
            return jsonify({'hourly_wage' : position.hourly_wage})
        return jsonify({'error': 'Position not found'}), 404
    
    
    app.route('/get_hours/<int:employee_id>', methods=['GET'])
    def get_hours(employee_id):
        timesheet = Timesheet.query.filter_by(employee_id=employee_id).all()
        total_hours = sum(entry.hours_worked for entry in timesheet)
        return jsonify({'total_hours': total_hours})
    */
    return (
        <div>
            <h2>Payroll</h2>
            <div className="wageDisplay">
                Display Wages Here Thanks
            </div>
        </div>
    )

};

export default Payroll;