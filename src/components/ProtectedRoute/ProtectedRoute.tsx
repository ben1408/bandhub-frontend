import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
    const { isLogged, setIsLogged } = useAuth();
    const [isValidating, setIsValidating] = useState(true);
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        const validateToken = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setIsLogged(false);
                setIsValid(false);
                setIsValidating(false);
                return;
            }

            try {
                // Make a simple API call to validate the token
                const response = await fetch('https://bandhub-backend.onrender.com/api/users/validate-token', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    setIsValid(true);
                } else {
                    // Token is invalid, clear localStorage
                    localStorage.removeItem('token');
                    localStorage.removeItem('username');
                    localStorage.removeItem('isAdmin');
                    localStorage.removeItem('userRole');
                    setIsLogged(false);
                    setIsValid(false);
                }
            } catch (error) {
                console.error('Token validation failed:', error);
                // For better UX, check if token looks valid (basic JWT structure)
                try {
                    const tokenParts = token.split('.');
                    if (tokenParts.length === 3) {
                        // Basic JWT structure check - assume valid if it looks like a JWT
                        setIsValid(true);
                    } else {
                        setIsValid(false);
                    }
                } catch (e) {
                    setIsValid(false);
                }
            } finally {
                setIsValidating(false);
            }
        };

        if (isLogged) {
            validateToken();
        } else {
            setIsValidating(false);
        }
    }, [isLogged, setIsLogged]);

    // Show loading spinner while validating
    if (isValidating) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '50vh'
            }}>
                <CircularProgress />
            </Box>
        );
    }

    // Check if user is logged in and token is valid
    if (!isLogged || !isValid) {
        return <Navigate to="/login" replace />;
    }

    // Check admin status if required
    if (requireAdmin) {
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        if (!isAdmin) {
            return <Navigate to="/" replace />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;
