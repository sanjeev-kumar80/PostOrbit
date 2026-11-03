
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

import Home from "./pages/Home";
import LoginSelection from "./pages/LoginSelection";
import UserLogin from "./pages/UserLogin";
import AdminLogin from "./pages/AdminLogin";
import UserSignup from "./pages/UserSignup";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginSelection />} />
      <Route path="/user-login" element={<UserLogin />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/signup" element={<UserSignup />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

