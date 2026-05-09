import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Ads from "./pages/Ads";
import Writing from "./pages/Writing";
import Survey from "./pages/Survey";
import "./styles.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RequireAuth from "./auth/RequireAuth";
import Account from "./pages/Account";
import Wallet from "./pages/Wallet";
import History from "./pages/History";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/ads"
          element={
            <RequireAuth>
              <Ads />
            </RequireAuth>
          }
        />
        <Route
          path="/writing"
          element={
            <RequireAuth>
              <Writing />
            </RequireAuth>
          }
        />
        <Route
          path="/survey"
          element={
            <RequireAuth>
              <Survey />
            </RequireAuth>
          }
        />
        <Route
          path="/account"
          element={
            <RequireAuth>
              <Account />
            </RequireAuth>
          }
        />
        <Route
          path="/wallet"
          element={
            <RequireAuth>
              <Wallet />
            </RequireAuth>
          }
        />
        <Route
          path="/history"
          element={
            <RequireAuth>
              <History />
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;