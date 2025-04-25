import { useState, useEffect } from "react";
import AddPosition from "./addPosModal";

function Positions() {
    const [modalOpen, setModalOpen] = useState(false);
    const [positions, setPositions] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("access_token");

        const fetchData = async () => {
            const resPositions = await fetch("http://localhost:5000/positions", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setPositions(await resPositions.json());
        };

        fetchData();
    }, []);

    const handleAddPosition = async (formData) => {
        const token = localStorage.getItem("access_token");
        const res = await fetch("http://localhost:5000/addPosition", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            const newPos = await res.json();
            setPositions((prev) => [...prev, newPos]);
        }
    };

    return (
        <div className="pos-list">
            <h3>Positions</h3>

            {positions.length === 0 ? (
                <p>No positions available.</p>
            ) : (
                <table className="positionlist">
                    <thead>
                        <tr>
                            <th>Position Name</th>
                            <th>Hourly Wage</th>
                            <th>Granted Privileges?</th>
                        </tr>
                    </thead>
                    <tbody>
                        {positions.map((pos) => (
                            <tr key={pos.id}>
                                <td className="posName">{pos.positionName}</td>
                                <td>${pos.hourly_wage.toFixed(2)}/hr</td>
                                <td>{pos.privs ? "Yes" : "No"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <button onClick={() => setModalOpen(true)} className="posAdd">Add Position</button>

            <AddPosition
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onAdd={handleAddPosition}
            />
        </div>
    );
}

export default Positions;
