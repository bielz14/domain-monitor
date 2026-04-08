import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    Navigate,
} from "react-router-dom";

import api, { getCsrfCookie } from "./api.jsx";

import Dashboard from "./pages/Dashboard";
import DomainDetails from "./pages/DomainDetails";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute";

function GuestRoute({ user, loading, children }) {
    if (loading) {
        return <div style={{ padding: 20 }}>Завантаження...</div>;
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    return children;
}

function Layout({ user, onLogout, children }) {
    return (
        <div>
            <nav
                style={{
                    padding: 16,
                    borderBottom: "1px solid #ccc",
                    marginBottom: 20,
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <div style={{ display: "flex", gap: 12 }}>
                    <Link to="/">Панель</Link>
                </div>

                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    {user ? (
                        <>
                            <span>{user.name}</span>
                            <button onClick={onLogout}>Вийти</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Вхід</Link>
                            <Link to="/register">Реєстрація</Link>
                        </>
                    )}
                </div>
            </nav>

            {children}
        </div>
    );
}

function AppRouter() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        setLoading(true);

        try {
            const res = await axios.get("/auth-user", {
                withCredentials: true,
                headers: {
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
            });

            if (res.data?.user?.id) {
                setUser(res.data.user);
                return res.data.user;
            }

            setUser(null);
            return null;
        } catch (e) {
            setUser(null);
            return null;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            await getCsrfCookie();
            await api.post("/logout");
            setUser(null);
        } catch (e) {
            console.error("Помилка виходу", e);
        }
    };

    return (
        <Layout user={user} onLogout={handleLogout}>
            <Routes>
                <Route
                    path="/login"
                    element={
                        <GuestRoute user={user} loading={loading}>
                            <Login onLogin={fetchUser} />
                        </GuestRoute>
                    }
                />

                <Route
                    path="/register"
                    element={
                        <GuestRoute user={user} loading={loading}>
                            <Register />
                        </GuestRoute>
                    }
                />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute user={user} loading={loading}>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/domains/:id"
                    element={
                        <ProtectedRoute user={user} loading={loading}>
                            <DomainDetails />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Layout>
    );
}

ReactDOM.createRoot(document.getElementById("app")).render(
    <React.StrictMode>
        <BrowserRouter>
            <AppRouter />
        </BrowserRouter>
    </React.StrictMode>
);
