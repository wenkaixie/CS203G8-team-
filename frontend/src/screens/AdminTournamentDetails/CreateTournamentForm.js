import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import './CreateTournamentForm.css';

const CreateTournamentForm = ({ onClose, onSuccess }) => {
    const [page, setPage] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        ageLimit: 0,
        eloRequirement: 0,
        startDatetime: '',
        endDatetime: '',
        prize: 0,
        capacity: 0,
        type: '',
        openRegistration: '',
        closeRegistration: '',
    });
    const [error, setError] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const auth = getAuth();

    useEffect(() => {
        const now = new Date();
        setFormData((prevData) => ({
            ...prevData,
            openRegistration: now.toISOString().slice(0, 16),
        }));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        if (name === 'startDatetime') {
            const startDate = new Date(value);
            const closeRegDate = new Date(startDate.getTime() - 24 * 60 * 60 * 1000);
            setFormData((prevData) => ({
                ...prevData,
                closeRegistration: closeRegDate.toISOString().slice(0, 16),
            }));
        }
    };

    const handleNext = () => setPage(2);
    const handleBack = () => setPage(1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = auth.currentUser;

        if (!user) {
            setError("User is not authenticated.");
            return;
        }

        try {
            const formattedData = {
                ...formData,
                ageLimit: Number(formData.ageLimit),
                eloRequirement: Number(formData.eloRequirement),
                prize: Number(formData.prize),
                capacity: Number(formData.capacity),
                startDatetime: formData.startDatetime + ":00Z",
                endDatetime: formData.endDatetime + ":00Z",
                openRegistration: formData.openRegistration + ":00Z",
                closeRegistration: formData.closeRegistration + ":00Z",
            };

            await axios.post(
                `http://localhost:7070/admin/createTournament/${user.uid}`,
                formattedData
            );

            setShowConfirmation(true); // Show confirmation popup
            setTimeout(() => {
                setShowConfirmation(false);
                onClose();
                if (onSuccess) onSuccess();
            }, 2000); // Hide popup and close form after 2 seconds
        } catch (error) {
            console.error("Error creating tournament:", error);
            setError("Failed to create tournament. Please try again.");
        }
    };

    return (
        <div className="registration-overlay">
            <div className="registration-modal">
                <div className="registration-header">
                    <h2>Create Tournament</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <form onSubmit={handleSubmit}>
                    {error && <p className="error-message">{error}</p>}
                    {page === 1 ? (
                        <div className="registration-body">
                            <label>Tournament Name</label>
                            <input type="text" className="full-width" name="name" value={formData.name} onChange={handleChange} required />

                            <label>Description</label>
                            <textarea name="description" className="full-width" value={formData.description} onChange={handleChange}></textarea>

                            <div className="input-row">
                                <div className="form-group half-width">
                                    <label>Start Date</label>
                                    <input type="datetime-local" name="startDatetime" value={formData.startDatetime} onChange={handleChange} required />
                                </div>
                                <div className="form-group half-width">
                                    <label>End Date</label>
                                    <input type="datetime-local" name="endDatetime" value={formData.endDatetime} onChange={handleChange} required />
                                </div>
                            </div>

                            <label>Tournament Type</label>
                            <select name="tournamentType" className="full-width" value={formData.type} onChange={handleChange}>
                                <option value="Elimination">Elimination</option>
                                <option value="Round Robin">Round Robin</option>
                            </select>
                        </div>
                    ) : (
                        <div className="registration-body">
                            <label>Location</label>
                            <input type="text" className="full-width" name="location" value={formData.location} onChange={handleChange} required />

                            <div className="input-row">
                                <div className="form-group half-width">
                                    <label>Age Limit</label>
                                    <input type="number" name="ageLimit" value={formData.ageLimit} onChange={handleChange} />
                                </div>
                                <div className="form-group half-width">
                                    <label>ELO Requirement</label>
                                    <input type="number" name="eloRequirement" value={formData.eloRequirement} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="input-row">
                                <div className="form-group half-width">
                                    <label>Open Registration</label>
                                    <input type="datetime-local" name="openRegistration" value={formData.openRegistration} readOnly />
                                </div>
                                <div className="form-group half-width">
                                    <label>Close Registration</label>
                                    <input type="datetime-local" name="closeRegistration" value={formData.closeRegistration} readOnly />
                                </div>
                            </div>

                            <div className="input-row">
                                <div className="form-group half-width">
                                    <label>Prize Pool</label>
                                    <input type="number" name="prize" value={formData.prize} onChange={handleChange} />
                                </div>
                                <div className="form-group half-width">
                                    <label>Slots</label>
                                    <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="registration-footer">
                        {page === 1 ? (
                            <button type="button" className="navigation-button next-button" onClick={handleNext}>
                                &gt;
                            </button>
                        ) : (
                            <>
                                <button type="button" className="navigation-button back-button" onClick={handleBack}>
                                    &lt;
                                </button>
                                <button type="submit" className="navigation-button create-button">
                                    Create
                                </button>
                            </>
                        )}
                    </div>
                </form>
            </div>

            {/* Confirmation Popup */}
            {showConfirmation && (
                <div className="confirmation-popup">
                    <p>Tournament created successfully!</p>
                </div>
            )}
        </div>
    );
};

export default CreateTournamentForm;