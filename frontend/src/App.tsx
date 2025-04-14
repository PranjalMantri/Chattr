import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import {
  HomePage,
  SignupPage,
  LoginPage,
  ProfilePage,
  SettingsPage,
} from "./pages";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin"></Loader>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <LoginPage />}
        ></Route>
        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <HomePage />}
        ></Route>
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <HomePage />}
        ></Route>
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <LoginPage />}
        ></Route>
        <Route path="/settings" element={<SettingsPage />}></Route>
      </Routes>
    </div>
  );
}

export default App;
