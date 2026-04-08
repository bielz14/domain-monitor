import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ user, loading, children }) {
    if (loading) {
        return <div style={{ padding: 20 }}>Завантаження...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
