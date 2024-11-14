import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
// import Navbar from "./components/layout/Navbar";
import Login from "./components/auth/Login";
// import Register from "./components/auth/Register";
import CarList from "./components/cars/CarList";
import CarForm from "./components/cars/CarForm";
import CarDetail from "./components/cars/CarDetail";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/cars"
            element={
              <ProtectedRoute>
                <CarList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cars/new"
            element={
              <ProtectedRoute>
                <CarForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cars/:id"
            element={
              <ProtectedRoute>
                <CarDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cars/:id/edit"
            element={
              <ProtectedRoute>
                <CarForm />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/cars" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
