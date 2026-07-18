import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    // Get JWT Token
    const token = localStorage.getItem("token");

    // If not logged in
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    // If logged in
    return children;
}

export default ProtectedRoute;