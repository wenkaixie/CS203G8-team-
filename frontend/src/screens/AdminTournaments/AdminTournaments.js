import React, { useState, useEffect } from "react";
import './AdminTournaments.css';
import filterIcon from '../../assets/images/Adjust.png';
import searchIcon from '../../assets/images/Search.png';
import AdminNavbar from "../../components/adminNavbar/AdminNavbar";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAuth } from "firebase/auth";

const AdminTournaments = () => {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [tournaments, setTournaments] = useState([]);
    const [sortedTournaments, setSortedTournaments] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [filteredTournaments, setFilteredTournaments] = useState([]);

    const navigate = useNavigate();
    const auth = getAuth();

    // Fetch tournaments from the API
    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const response = await axios.get(`http://localhost:7070/admin/getAdminTournaments/${auth.currentUser.uid}`);
                setTournaments(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching tournaments:", error);
            }
        };

        fetchTournaments();
    }, []);

    // Determine if a tournament is upcoming, ongoing, or past
    const getTournamentStatus = (tournament) => {
        const currentDateTime = new Date();
        const startDateTime = new Date(tournament.startDatetime);
        const endDateTime = new Date(tournament.endDatetime);

        if (startDateTime > currentDateTime) {
            return 'upcoming';
        } else if (currentDateTime >= startDateTime && currentDateTime <= endDateTime) {
            return 'ongoing';
        } else {
            return 'past';
        }
    };

    const handleRowClick = (tournamentId) => {
        navigate(`/admin/tournament/${tournamentId}/overview`);
    };

    // Filter tournaments based on active tab (upcoming, ongoing, past)
    useEffect(() => {
        let filteredList = tournaments;

        if (activeTab === 'upcoming') {
            filteredList = tournaments.filter(tournament => getTournamentStatus(tournament) === 'upcoming');
        } else if (activeTab === 'ongoing') {
            filteredList = tournaments.filter(tournament => getTournamentStatus(tournament) === 'ongoing');
        } else if (activeTab === 'past') {
            filteredList = tournaments.filter(tournament => getTournamentStatus(tournament) === 'past');
        }

        // Filter by search term
        if (searchTerm) {
            filteredList = filteredList.filter(tournament =>
                tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tournament.location.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredTournaments(filteredList);
        setSortBy('');
        setSortedTournaments(null);
    }, [activeTab, tournaments, searchTerm]);

    // Handle search input
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Toggle dropdown visibility
    const toggleDropdown = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    // Sorting the tournaments
    const handleSortChange = (criteria) => {
        let sortedList = [...filteredTournaments]; // Use the filtered tournaments array
        if (criteria === 'Name') {
            sortedList.sort((a, b) => a.name.localeCompare(b.name));
        } else if (criteria === 'Date') {
            sortedList.sort((a, b) => new Date(a.startDatetime) - new Date(b.startDatetime));
        } else if (criteria === 'Slots') {
            sortedList.sort((a, b) => a.capacity - b.capacity);
        } else if (criteria === 'EloRequirement') {
            sortedList.sort((a, b) => a.eloRequirement - b.eloRequirement);
        } else if (criteria === 'Prize') {
            sortedList.sort((a, b) => a.prizePool - b.prizePool);
        }
        setSortedTournaments(sortedList); // Set the sorted tournaments
        setSortBy(criteria);
        setIsDropdownVisible(false);
    };

    // Display the full list of tournaments
    const tournamentsToDisplay = sortedTournaments || filteredTournaments;

    return (
        <div>
            {/* Navbar at the top */}
            <AdminNavbar />

            {/* Tournament Content */}
            <div className="tournament-upcoming">
                <div className="header-subtask-container">
                    <h1>My Tournaments</h1>
                    <div className="subtask-bar">
                        <button
                            className={`subtask-button ${activeTab === 'upcoming' ? 'active' : ''}`}
                            onClick={() => setActiveTab('upcoming')}
                        >
                            Upcoming
                        </button>
                        <button
                            className={`subtask-button ${activeTab === 'ongoing' ? 'active' : ''}`}
                            onClick={() => setActiveTab('ongoing')}
                        >
                            Ongoing
                        </button>
                        <button
                            className={`subtask-button ${activeTab === 'past' ? 'active' : ''}`}
                            onClick={() => setActiveTab('past')}
                        >
                            Past
                        </button>
                    </div>
                </div>

                {/* Search and Filter Controls */}
                <div className="controls-container">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search for a tournament"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <img src={searchIcon} alt="Search Icon" className="search-icon" />
                    </div>

                    <div className="buttons-container">
                        {/* <button className="filter-button">
                            <img src={filterIcon} alt="Filter Icon" className="filter-icon" />
                            Filter
                        </button> */}

                        <div className="dropdown">
                            <button className="order-button" onClick={toggleDropdown}>
                                Order By {sortBy && `(${sortBy})`}
                            </button>
                            {isDropdownVisible && (
                                <div className="dropdown-content">
                                    <div className="dropdown-item" onClick={() => handleSortChange('Name')}>
                                        Name
                                    </div>
                                    <div className="dropdown-item" onClick={() => handleSortChange('Date')}>
                                        Date
                                    </div>
                                    <div className="dropdown-item" onClick={() => handleSortChange('Slots')}>
                                        Slots
                                    </div>
                                    <div className="dropdown-item" onClick={() => handleSortChange('EloRequirement')}>
                                        ELO Requirement
                                    </div>
                                    <div className="dropdown-item" onClick={() => handleSortChange('Prize')}>
                                        Prize
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tournament List */}
                <div className="tournament-list-container">
                    <table className="tournament-table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Name</th>
                                <th>Date</th>
                                <th>Location</th>
                                <th>Slots</th>
                                <th>ELO Requirement</th>
                                <th>Prize Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                        {tournamentsToDisplay.map((tournament, index) => {

                            return (
                                <tr key={tournament.tid} onClick={() => handleRowClick(tournament.tid)}>
                                    <td>{index + 1}</td>
                                    <td>{tournament.name}</td>
                                    <td>
                                        {new Date(tournament.startDatetime).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} —  
                                        {' '}
                                        {new Date(tournament.endDatetime).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </td>
                                    <td>{tournament.location}</td>
                                    <td>{tournament.capacity}</td>
                                    <td>{tournament.eloRequirement}</td>
                                    <td>${tournament.prize}</td>
                                    <td className={`status-${tournament.status.toLowerCase()}`}>
                                        {tournament.status}
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminTournaments;