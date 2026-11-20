
// import { Routes, Route, Link } from 'react-router-dom';
// import Home from './pages/Home';
// import LoginSelection from './pages/LoginSelection';
// // import Navbar from "../components/Navbar";

// function LoginPlaceholder({ role }) {
//   return (
//     <div className="min-h-screen bg-[#F8F7FF] flex items-center justify-center p-6">
//       <div className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center">
//         <h1 className="text-3xl font-bold text-[#17152F]">
//           {role} Login
//         </h1>
//         <p className="text-gray-500 mt-4">
//           Login form will be implemented in our next development step.
//         </p>
//         <Link to="/login" className="inline-block mt-8 text-violet-600 font-bold">
//           Back to Login Selection
//         </Link>
//       </div>
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Home />} />
//       <Route path="/login" element={<LoginSelection />} />
//       <Route path="/user-login" element={<LoginPlaceholder role="User" />} />
//       <Route path="/admin-login" element={<LoginPlaceholder role="Admin" />} />
//       <Route path="*" element={<Home />} />
//     </Routes>
//   );
// }





import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./Pages/Home";
import LoginSelection from "./Pages/LoginSelection";
import UserLogin from "./Pages/UserLogin";
import AdminLogin from "./Pages/AdminLogin";
import UserSignup from "./Pages/UserSignup";
import UserDashboard from "./Pages/UserDashboard";
import RequireAdmin from "./Pages/RequireAdmin";
import AdminLayout from "./Pages/AdminLayout";
import AdminOverview from "./Pages/AdminOverview";
import AdminSettings from "./Pages/AdminSettings";
import AdminRegister from "./Pages/AdminRegister";
import AdminUsers from "./Pages/AdminUsers";
import AdminUserDetails from "./Pages/AdminUserDetails";
import AdminSocialAccounts from "./Pages/AdminSocialAccounts";
import AdminSocialAccountDetails from "./Pages/AdminSocialAccountDetails";
import AdminPosts, { ScheduledPosts } from "./Pages/AdminPosts";
import AdminAnalytics from "./Pages/AdminAnalytics";

import CreatePost from "./Pages/CreatePost";
import MyPosts from "./Pages/MyPosts";
import PostCalendar from "./Pages/PostCalendar";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginSelection />} />
      <Route path="/user-login" element={<UserLogin />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-register" element={<AdminRegister />} />
      <Route element={<RequireAdmin />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="users/:id" element={<AdminUserDetails />} />
          <Route path="social-accounts" element={<AdminSocialAccounts />} />
          <Route path="social-accounts/:id" element={<AdminSocialAccountDetails />} />
          <Route path="posts" element={<AdminPosts />} />
          <Route path="scheduled-posts" element={<ScheduledPosts />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>
      <Route path="/signup" element={<UserSignup />} />
      <Route path="/dashboard" element={<UserDashboard />} />
      <Route path="/create-post" element={<CreatePost />} />
      <Route path="/my-posts" element={<MyPosts />} />
      <Route path="/calendar" element={<PostCalendar />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
