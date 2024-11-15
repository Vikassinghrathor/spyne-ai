import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Navbar from "./components/layout/Navbar";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import CarList from "./components/cars/CarList";
import CarForm from "./components/cars/CarForm";
import CarDetail from "./components/cars/CarDetail";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                {/* Car Routes */}
                <Route path="/cars" element={<CarList />} />
                <Route path="/cars/new" element={<CarForm />} />
                <Route path="/cars/:id" element={<CarDetail />} />
                <Route path="/cars/:id/edit" element={<CarForm />} />

                {/* Redirect to cars list from root */}
                <Route path="/" element={<Navigate to="/cars" replace />} />
              </Route>

              {/* Catch all other routes and redirect to cars */}
              <Route path="*" element={<Navigate to="/cars" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
