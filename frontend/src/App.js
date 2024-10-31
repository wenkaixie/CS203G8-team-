// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Home from './screens/Home/Home';
// import Login from './screens/Login/Login';
// import UpdateProfile from './screens/UpdateProfile/UpdateProfile';
// import Signup from './screens/Signup/Signup';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/home" element={<Home />} />
//         <Route path="/create_profile" element={<UpdateProfile />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/routeProtection/ProtectedRoute';

// All Screens
import Login from './screens/Login/Login';
import Signup from './screens/Signup/Signup';

// User Screens
import UserHome from './screens/UserHome/UserHome';
import UserUpdateProfile from './screens/UserUpdateProfile/UserUpdateProfile';
import UserTournaments from './screens/UserTournaments/UserTournaments';
import UserTournamentParticipants from './screens/UserTournamentDetails/UserTournamentParticipants';
import UserTournamentOverview from './screens/UserTournamentDetails/UserTournamentOverview';
import UserTournamentMatch from './screens/UserTournamentDetails/UserTournamentMatch';
import UserCalendar from './screens/UserCalendar/UserCalendar';
import AdminTournamentOverview from './screens/AdminTournamentDetails/AdminTournamentOverview';
import AdminTournamentParticipants from './screens/AdminTournamentDetails/AdminTournamentParticipants';

// Admin Screens
import AdminHome from './screens/AdminHome/AdminHome';
import AdminUpdateProfile from './screens/AdminUpdateProfile/AdminUpdateProfile';


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="tournament/:tournamentId/participants" element={<UserTournamentParticipants />} />
        <Route path="tournament/:tournamentId/overview" element={<UserTournamentOverview />} />
        <Route path="tournaments" element={<UserTournaments />} />
    
        {/* <Route path="/admin/home" element={<AdminHome />} /> */}

        {/* User Protected Routes */}
        <Route
          path="/user/*"
          element={
            <ProtectedRoute allowedRoles={['Users']}>
              <Routes>
                <Route path="home" element={<UserHome />} />
                <Route path="profile" element={<UserUpdateProfile />} />
                <Route path="tournaments" element={<UserTournaments />} />
                <Route path="calendar" element={<UserCalendar />} />

                {/* Tournament Details Routes for Users */}
                <Route path="tournament/:tournamentId/overview" element={<UserTournamentOverview />} />
                <Route path="tournament/:tournamentId/participants" element={<UserTournamentParticipants />} />
                <Route path="tournament/:tournamentId/games" element={<UserTournamentMatch />} />
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['Admins']}>
              <Routes>
                {/* <Route path="/home" element={<AdminHome />} /> */}
                <Route path="tournament/:tournamentId/overview" element={<AdminTournamentOverview />} />
                <Route path="tournament/:tournamentId/participants" element={<AdminTournamentParticipants />} />
                <Route path="home" element={<AdminHome />} />
                <Route path="profile" element={<AdminUpdateProfile />} />
              </Routes>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
