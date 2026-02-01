import { AppBar, Toolbar, Typography, Button, Box, Stack } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';
import HamburgerMenu from './HamburgerMenu';
import type { NavbarProps } from '../../types';


const Navbar = ({ setIsAddedBand }: NavbarProps) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState(localStorage.getItem('username'));
    const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');
    const { isLogged, setIsLogged } = useAuth();


    useEffect(() => {
        // Listen for storage changes (e.g., login/logout in another tab)
        const handleStorage = () => {
            setUsername(localStorage.getItem('username'));
            setIsAdmin(localStorage.getItem('isAdmin') === 'true');
        };
        window.addEventListener('storage', handleStorage);
        // Listen for manual changes in this tab (e.g., after login)
        const interval = setInterval(() => {
            setUsername(localStorage.getItem('username'));
            setIsAdmin(localStorage.getItem('isAdmin') === 'true');
        }, 500);
        return () => {
            window.removeEventListener('storage', handleStorage);
            clearInterval(interval);
        };
    }, []);

    const handleAccount = () => {
        navigate('/account');
    };

    const handleLogin = () => {
        navigate('/login');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('isAdmin'); // Remove admin flag on logout
        localStorage.removeItem('userRole'); // Remove user role on logout
        setUsername(null);
        setIsAdmin(false);
        setIsLogged(false); // Update auth context so UI changes
        navigate('/login');
    };

    const handleDashboard = () => {
        navigate('/dashboard');
    };

    return (
        <>
            <AppBar position="sticky" sx={{ bgcolor: '#2a2a2aff', boxShadow: 3, borderBottom: '2px solid grey', paddingBottom: 1.5, paddingTop: 1.5 }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, position: 'relative' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 120 }}>
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <h1 style={{ margin: 0, fontFamily: 'Cinzel, serif', color: '#F5F5F5', pointerEvents: 'auto' }} >
                                IR
                            </h1>
                        </Link>
                    </Box>
                    {/* Center: Header absolutely centered */}
                    <Box sx={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', pointerEvents: 'none', zIndex: 1 }}>
                        <Link to="/" style={{ textDecoration: 'none', pointerEvents: 'auto' }} className="no-underline">
                            <Typography
                                variant="h3"
                                fontWeight={700}
                                sx={{
                                    fontFamily: 'Cinzel, serif',
                                    color: 'white !important',
                                    letterSpacing: 2,
                                    textAlign: 'center',
                                    lineHeight: 1.1,
                                }}
                            >
                                Imprint Records
                            </Typography>
                        </Link>
                    </Box>
                    {/* Right: User controls */}
                    <Stack direction="row" spacing={2} alignItems="center" className="nav-right" sx={{ minWidth: 120 }}>
                        {isLogged ? (
                            <>
                                <Typography className="nav-user" sx={{ color: '#F5F5F5', fontWeight: 500 }}>
                                    Hello, {username}
                                </Typography>
                                <Button
                                    className="nav-logout"
                                    variant="contained"
                                    size="small"
                                    sx={{
                                        bgcolor: 'grey',
                                        color: 'white',
                                        borderRadius: 2,
                                        fontWeight: 600,
                                        fontSize: '0.875rem !important',
                                        '&:hover': { bgcolor: '#FF3C3F' }
                                    }}
                                    onClick={handleLogout}
                                >
                                    Logout
                                </Button>
                                <HamburgerMenu onAccount={handleAccount} onDashboard={isAdmin ? handleDashboard : undefined} />
                            </>
                        ) : (
                            <Button className="nav-btn" variant="contained" sx={{ bgcolor: 'white', color: 'black', borderRadius: 2, fontWeight: 600, '&:hover': { bgcolor: 'black', color: 'white' } }} onClick={handleLogin}>
                                Login
                            </Button>
                        )}
                    </Stack>
                </Toolbar>
            </AppBar>
        </>
    );
};

export default Navbar;
