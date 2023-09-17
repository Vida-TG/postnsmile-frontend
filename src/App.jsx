import { Route, Routes } from "react-router-dom";
import { Login, Signup, Mint } from "./pages";
import Home from "./pages/Home";
import Profile from "./pages/profile/Profiles";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/mint" element={<Mint />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;