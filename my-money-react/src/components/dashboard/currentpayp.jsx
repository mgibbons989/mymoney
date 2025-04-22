import "./dash.css"


function CurrentPayPeriod() {
    return (
        <>
            <div>
                <h2>Current Pay Period</h2>
                <div className="wages">
                    <div>Total Wages:</div>
                    <div className="sumwage">$55</div>
                </div>
                <div className="shift-list">
                    DISPLAY SHIFT LIST HERE
                </div>
            </div>
        </>
    )
};


export default CurrentPayPeriod;