import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import {
  HomePage,
  SignupPage,
  LoginPage,
  ProfilePage,
  SettingsPage,
} from "./pages";

function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/signup" element={<SignupPage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/profile" element={<ProfilePage />}></Route>
        <Route path="/settings" element={<SettingsPage />}></Route>
      </Routes>
    </div>
  );
}

export default App;
