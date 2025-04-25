
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import './App.css'





import SignInPage from './pages/SignInPage'
import HomePageUser from "./pages/HomePageUser";
import { auth } from "./utils/firebase";
import { useEffect, useState } from "react";
import NotFoundPage from "./pages/NotFoundPage";
import ProfileSetup from "./pages/ProfileSetupPage";
import MainHomePage from "./pages/MainHomePage";




function App() {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);




  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      setLoading(false);
    });
    return () => unsubscribe();
  }, []);


  if (loading) {
    return <div>Checking for signed in users...</div>
  }




  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={(user) ? <MainHomePage /> : <Navigate to="/signin" replace />}
          />

          <Route
            path="/signin"
            element={!user ? <SignInPage /> : <Navigate to="/" replace />}
          />

          <Route path="/profile-setup" element={<ProfileSetup />} />


          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>

    </>
  )
}

export default App
