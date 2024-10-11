// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Home from './screens/Home/Home';
// import Login from './screens/Login/Login';
// import CreateProfile from './screens/CreateProfile/CreateProfile';
// import Signup from './screens/Signup/Signup';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/home" element={<Home />} />
//         <Route path="/create_profile" element={<CreateProfile />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/routeProtection/ProtectedRoute';

// Import your pages/components
import UserHome from './screens/UserHome/UserHome';
import Login from './screens/Login/Login';
import CreateProfile from './screens/CreateProfile/CreateProfile';
import Signup from './screens/Signup/Signup';
import UserUpcomingTournament from './screens/UserUpcomingTournament/UserUpcomingTournament';
import UserTournamentParticipants from './screens/UserTournamentDetails/UserTournamentParticipants';
import UserTournamentOverview from './screens/UserTournamentDetails/UserTournamentOverview';
import UserTournamentMatch from './screens/UserTournamentDetails/UserTournamentMatch';
import UserTournamentMatchTree from './screens/UserTournamentDetails/UserTournamentMatchTree';
import UserCalendar from './screens/UserCalendar/UserCalendar';
import TournamentUpcoming from './screens/TournamentUpcoming/TournamentUpcoming';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/create_profile" element={<CreateProfile />} />

        <Route path="upcomingtournament" element={<UserUpcomingTournament />} />

        <Route path="tournament/:id/overview" element={<UserTournamentOverview />} />
        <Route path="tournament/:id/participants" element={<UserTournamentParticipants />} />
        <Route path="tournament/:id/games" element={<UserTournamentMatch />} />
        <Route path="tournament/:id/matchtree" element={<UserTournamentMatchTree />} />

        {/* User Protected Routes */}
        <Route
          path="/user/*"
          element={
            <ProtectedRoute allowedRoles={['User']}>
              <Routes>
                <Route path="home" element={<UserHome />} />
                <Route path="profile" element={<UserHome />} />
                <Route path="upcomingtournament" element={<UserUpcomingTournament />} />

                <Route path="upcomingtournament" element={<TournamentUpcoming />} />
                <Route path="calendar" element={<UserCalendar />} />

                {/* Tournament Details Routes for Users */}
                <Route path="tournament/:id/overview" element={<UserTournamentOverview />} />
                <Route path="tournament/:id/participants" element={<UserTournamentParticipants />} />
                <Route path="tournament/:id/games" element={<UserTournamentMatch />} />
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <Routes>
                {/* <Route path="/home" element={<AdminHome />} /> */}
              </Routes>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
