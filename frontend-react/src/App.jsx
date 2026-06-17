import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './services/auth';
import LoginPage from './pages/LoginPage/LoginPage';
import UsersPage from './pages/UsersPage/UsersPage';
import UserFormPage from './pages/UserFormPage/UserFormPage';
import StudentsPage from './pages/StudentsPage/StudentsPage';
import StudentFormPage from './pages/StudentFormPage/StudentFormPage';

function PrivateRoute({ children }) {
    return isAuthenticated() ? children : <Navigate to="/" replace />;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route
                    path="/users"
                    element={<PrivateRoute><UsersPage /></PrivateRoute>}
                />
                <Route
                    path="/users/new"
                    element={<PrivateRoute><UserFormPage /></PrivateRoute>}
                />
                <Route
                    path="/users/:id/edit"
                    element={<PrivateRoute><UserFormPage /></PrivateRoute>}
                />
                <Route
                    path="/students"
                    element={<PrivateRoute><StudentsPage /></PrivateRoute>}
                />
                <Route
                    path="/students/new"
                    element={<PrivateRoute><StudentFormPage /></PrivateRoute>}
                />
                <Route
                    path="/students/:id/edit"
                    element={<PrivateRoute><StudentFormPage /></PrivateRoute>}
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;