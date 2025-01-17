import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import './RegistrationForm.css';
import LockIcon from '../../assets/images/Password.png';

const RegistrationForm = ({ tournamentID, closeForm, onSubmit }) => {
    const [fullName, setFullName] = useState('');
    const [age, setAge] = useState('');
    const [nationality, setNationality] = useState('');
    const [email, setEmail] = useState('');
    const [authId, setAuthId] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            const authId = user.uid;
            setAuthId(authId);
        } else {
            console.error('No user is signed in.');
        }
    }, []);

    useEffect(() => {
        if (authId) {
            fetchUserDetails(authId);
        }
    }, [authId]);

    const fetchUserDetails = async (authId) => {
        try {
            const response = await axios.get(
                `http://localhost:9090/user/getUser/${authId}`
            );
            const userData = response.data;

            setFullName(userData.name || '');
            setEmail(userData.email || '');
            setNationality(userData.nationality || '');

            const birthDate = new Date(userData.dateOfBirth.seconds * 1000);
            const currentAge = calculateAge(birthDate);
            setAge(currentAge);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const calculateAge = (birthDate) => {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleSubmit = async () => {
        try {
            // Register the user using the PUT endpoint
            const playerServiceResponse = await axios.put(
                `http://localhost:9090/user/registerTournament/${tournamentID}/${authId}`
            );

            if (playerServiceResponse.status !== 200) {
                throw new Error("Failed to register in player service");
            }

            // Register the user in the tournament service
            const tournamentServiceResponse = await axios.post(
                `http://localhost:8080/api/tournaments/${tournamentID}/players`,
                null,
                { params: { userID: authId } } 
            );

            if (tournamentServiceResponse.status !== 200) {
                throw new Error("Failed to register in tournament service");
            }

            // Show success message
            alert("Registration successful!");
            onSubmit({ authId });

            const event = new Event('registrationSuccess');
            window.dispatchEvent(event);

            closeForm();
        } catch (error) {
            console.error("Error registering user:", error);
            alert("Failed to register. Please try again.");
        }
    };

    return (
        <div className="registration-overlay" onClick={closeForm}>
            <div className="registration-modal" onClick={(e) => e.stopPropagation()}>
                <div className="registration-header">
                    <h2>Registration</h2>
                    <button className="close-button" onClick={closeForm}>
                        &times;
                    </button>
                </div>

                <div className="registration-body">
                    <div className="form-group">
                        <label className="verify-label">Verify your personal details.</label>
                        <label className="verify-label">If you wish to change any information, please proceed to your profile page to do so.</label>

                        <div className="input-with-icon">
                            <label>Full Name</label>
                            <input type="fullName" value={fullName} readOnly />
                        </div>

                        <div className="input-row">
                            <div className="input-with-icon">
                                <label>Age</label>
                                <input type="age" value={age} readOnly />
                            </div>

                            <div className="input-with-icon">
                                <label>Nationality</label>
                                <input type="nationality" value={nationality} readOnly />
                            </div>
                        </div>

                        <div className="input-with-icon">
                            <label>Email</label>
                            <input type="email" value={email} readOnly />
                        </div>
                    </div>
                </div>

                <div className="registration-footer">
                    <button className="registration-button" onClick={handleSubmit}>
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegistrationForm;
