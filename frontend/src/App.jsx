import Home from "./components/home";
import UserLogin from "./components/userLogin";
import UserSignup from "./components/userSignup";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/login" element={<UserLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
