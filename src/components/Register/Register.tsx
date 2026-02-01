import { useState } from 'react';
import { Paper, Typography, TextField, Button, Box } from '@mui/material';
import './Register.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const res = await fetch('https://bandhub-backend.onrender.com/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (res.ok && data.token) {
                localStorage.setItem('token', data.token);
                navigate('/');
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Registration failed');
        }
    };

    return (
        <Box className="auth-container">
            <Paper elevation={6} className="auth-form" sx={{ borderRadius: 4, bgcolor: '#2a2a2aff', p: 4, minWidth: 340, marginTop: '-10vh' }}>
                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Typography variant="h4" align="center" fontWeight={700} color="white" gutterBottom>
                        Register
                    </Typography>
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                        sx={{
                            mb: 2,
                            input: { color: '#F5F5F5', height: '1.9rem' },
                            label: { color: '#F5F5F5' },
                            '& .MuiInputLabel-root': { color: '#F5F5F5', },
                            '& .MuiInputLabel-root.Mui-focused': { color: '#F5F5F5' },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'white !important',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#ffffffff',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#ffffffff',
                                }
                            }
                        }}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        sx={{
                            mb: 2,
                            input: { color: '#F5F5F5', height: '1.9rem' },
                            label: { color: '#F5F5F5' },
                            '& .MuiInputLabel-root': { color: '#F5F5F5' },
                            '& .MuiInputLabel-root.Mui-focused': { color: '#F5F5F5' },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: 'white !important',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#ffffffff',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#ffffffff',
                                }
                            }
                        }}
                    />
                    {error && <Typography className="auth-error" color="#ff6b6b" align="center">{error}</Typography>}
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, borderRadius: 2, fontWeight: 600, bgcolor: 'white !important', color: '#181a20', '&:hover': { bgcolor: 'black !important', color: 'white !important' } }}>
                        Register
                    </Button>
                    <Button type="button" className="switch-btn" onClick={() => navigate('/login')} fullWidth sx={{ mt: 1, borderRadius: 2, bgcolor: 'white !important', color: '#181a20', fontWeight: 500, '&:hover': { bgcolor: 'black !important', color: 'white !important' } }}>
                        Back to Login
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default Register;
