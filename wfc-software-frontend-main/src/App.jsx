import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./utilis/Navbar.jsx";
import { Register } from "./compontes/Register.jsx";
import { UserDetails } from "./compontes/UserDetails.jsx";
import Update from "./compontes/Update.jsx";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<UserDetails />} />
        <Route path="/register" element={<Register />} />
        <Route path="/update/:id" element={<Update />} />
      </Routes>
    </Router>
  );
}

export default App;
