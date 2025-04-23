import { useState } from "react";

function AddPosition({ isOpen, onClose, onAdd }) {
    const [formData, setFormData] = useState({
        positionName: "",
        privs: false,
        hourly_wage: "",
    })

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onAdd({
            ...formData,
            hourly_wage: parseFloat(formData.hourly_wage),
        });
        onClose();
        setFormData({ positionName: "", privs: false, hourly_wage: "" });
    };

    if (!isOpen) return null;


    return (
        <>
            <div className="back" onClick={onClose}>
                <div className="addPosition" onClick={(e) => e.stopPropagation()}>
                    <h4>Add New Position</h4>
                    <form onSubmit={handleSubmit} className="posForm">
                        <div>
                            <label className="posLabel">Position Name:</label>
                            <input
                                type="text"
                                name="positionName"
                                value={formData.positionName}
                                onChange={handleChange}
                                className="postext"
                                required
                            />
                        </div>

                        <div>
                            <label className="posLabel">Hourly Wage:</label>
                            <input
                                type="number"
                                step="0.01"
                                name="hourly_wage"
                                value={formData.hourly_wage}
                                onChange={handleChange}
                                className="postext"
                                required
                            />
                        </div>

                        <div className="posPrivs">
                            <input
                                type="checkbox"
                                name="privs"
                                checked={formData.privs}
                                onChange={handleChange}
                            />
                            <label>Grant Privileges</label>
                        </div>

                        <div className="posbtns">
                            <button
                                type="submit"
                                className="submitbtn"
                            >
                                Add
                            </button>

                            <button
                                type="button"
                                onClick={onClose}
                                className="closeBtn"
                            >
                                Cancel
                            </button>

                        </div>

                    </form>
                </div>
            </div>
        </>
    );
}

export default AddPosition;