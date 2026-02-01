import { useState, useEffect } from 'react';
import { Container, Paper, Typography, TextField, Button, Box, Alert, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Account = () => {
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [isAdmin] = useState(localStorage.getItem('isAdmin') === 'true');
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (isAdmin) {
            fetchUsers();
        }
    }, [isAdmin]);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('https://bandhub-backend.onrender.com/api/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error('Failed to fetch users');
        }
    };

    const handleUsernameChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('https://bandhub-backend.onrender.com/api/users/update-username', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ username })
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('username', username);
                setSuccess('Username updated successfully!');
            } else {
                setError(data.message || 'Failed to update username');
            }
        } catch (err) {
            setError('Failed to update username');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setError('New password must be at least 6 characters long');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('https://bandhub-backend.onrender.com/api/users/update-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            });

            const data = await res.json();
            if (res.ok) {
                setSuccess('Password updated successfully!');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setError(data.message || 'Failed to update password');
            }
        } catch (err) {
            setError('Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!selectedUserId || !selectedRole) {
            setError('Please select both a user and a role');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`https://bandhub-backend.onrender.com/api/users/update-role/${selectedUserId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ role: selectedRole })
            });

            const data = await res.json();
            if (res.ok) {
                setSuccess(`User role updated to ${selectedRole} successfully!`);
                setSelectedUserId('');
                setSelectedRole('');
                fetchUsers(); // Refresh the users list
            } else {
                setError(data.message || 'Failed to update user role');
            }
        } catch (err) {
            setError('Failed to update user role');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 4, bgcolor: '#2a2a2aff' }}>
                <Typography variant="h4" align="center" fontWeight={700} color="#F5F5F5" gutterBottom>
                    Account Settings
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2, bgcolor: '#ff4444', color: 'white' }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2, bgcolor: '#4caf50', color: 'white' }}>
                        {success}
                    </Alert>
                )}

                {/* Username Change Section */}
                <Box component="form" onSubmit={handleUsernameChange} sx={{ mb: 4 }}>
                    <Typography variant="h6" color="#F5F5F5" gutterBottom>
                        Change Username
                    </Typography>
                    <TextField
                        label="New Username"
                        variant="outlined"
                        fullWidth
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                        sx={{
                            mb: 2,
                            input: { color: '#F5F5F5' },
                            label: { color: '#F5F5F5' },
                            '& .MuiInputLabel-root': { color: '#F5F5F5' },
                            '& .MuiInputLabel-root.Mui-focused': { color: '#F5F5F5' },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#9a9a9a9e',
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
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{
                            bgcolor: 'grey',
                            color: 'white',
                            borderRadius: 2,
                            fontWeight: 600,
                            '&:hover': { bgcolor: 'darkgrey' },
                            '&:disabled': { bgcolor: '#666' }
                        }}
                    >
                        Update Username
                    </Button>
                </Box>
                <hr style={{ marginBottom: '25px' }} />
                {/* Password Change Section */}
                <Box component="form" onSubmit={handlePasswordChange}>
                    <Typography variant="h6" color="#F5F5F5" gutterBottom>
                        Change Password
                    </Typography>
                    <TextField
                        label="Current Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        required
                        sx={{
                            mb: 2,
                            input: { color: '#F5F5F5' },
                            label: { color: '#F5F5F5' },
                            '& .MuiInputLabel-root': { color: '#F5F5F5' },
                            '& .MuiInputLabel-root.Mui-focused': { color: '#F5F5F5' },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#9a9a9a9e',
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
                        label="New Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        required
                        sx={{
                            mb: 2,
                            input: { color: '#F5F5F5' },
                            label: { color: '#F5F5F5' },
                            '& .MuiInputLabel-root': { color: '#F5F5F5' },
                            '& .MuiInputLabel-root.Mui-focused': { color: '#F5F5F5' },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#9a9a9a9e',
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
                        label="Confirm New Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                        sx={{
                            mb: 2,
                            input: { color: '#F5F5F5' },
                            label: { color: '#F5F5F5' },
                            '& .MuiInputLabel-root': { color: '#F5F5F5' },
                            '& .MuiInputLabel-root.Mui-focused': { color: '#F5F5F5' },
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': {
                                    borderColor: '#9a9a9a9e',
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
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{
                            bgcolor: 'grey',
                            color: 'white',
                            borderRadius: 2,
                            fontWeight: 600,
                            mr: 2,
                            '&:hover': { bgcolor: 'darkgrey' },
                            '&:disabled': { bgcolor: '#666' }
                        }}
                    >
                        Update Password
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => navigate('/')}
                        sx={{
                            color: '#F5F5F5',
                            borderColor: '#F5F5F5',
                            borderRadius: 2,
                            '&:hover': { bgcolor: '#353535ff', borderColor: '#F5F5F5' }
                        }}
                    >
                        Back to Home
                    </Button>
                </Box>

                {/* Admin Section - Role Management */}
                {isAdmin && (
                    <Box component="form" onSubmit={handleRoleChange} sx={{ mt: 4, pt: 4, borderTop: '1px solid #F5F5F5' }}>
                        <Typography variant="h6" color="#F5F5F5" gutterBottom>
                            Admin: Manage User Roles
                        </Typography>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel sx={{ color: '#F5F5F5', '&.Mui-focused': { color: '#F5F5F5' } }}>
                                Select User
                            </InputLabel>
                            <Select
                                value={selectedUserId}
                                onChange={e => setSelectedUserId(e.target.value)}
                                required
                                sx={{
                                    color: '#F5F5F5',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#9a9a9a9e',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#ffffffff',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#ffffffff',
                                    },
                                    '& .MuiSvgIcon-root': {
                                        color: '#F5F5F5',
                                    }
                                }}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            bgcolor: '#2a2a2aff',
                                            '& .MuiMenuItem-root': {
                                                color: '#F5F5F5',
                                                '&:hover': {
                                                    bgcolor: '#353535ff',
                                                }
                                            }
                                        }
                                    }
                                }}
                            >
                                {users.map(user => (
                                    <MenuItem key={user._id} value={user._id}>
                                        {user.username} ({user.role})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel sx={{ color: '#F5F5F5', '&.Mui-focused': { color: '#F5F5F5' } }}>
                                New Role
                            </InputLabel>
                            <Select
                                value={selectedRole}
                                onChange={e => setSelectedRole(e.target.value)}
                                required
                                sx={{
                                    color: '#F5F5F5',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#9a9a9a9e',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#ffffffff',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#ffffffff',
                                    },
                                    '& .MuiSvgIcon-root': {
                                        color: '#F5F5F5',
                                    }
                                }}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            bgcolor: '#2a2a2aff',
                                            '& .MuiMenuItem-root': {
                                                color: '#F5F5F5',
                                                '&:hover': {
                                                    bgcolor: '#353535ff',
                                                }
                                            }
                                        }
                                    }
                                }}
                            >
                                <MenuItem value="fan">Fan</MenuItem>
                                <MenuItem value="moderator">Moderator</MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                            </Select>
                        </FormControl>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            sx={{
                                bgcolor: 'grey',
                                color: '#F5F5F5',
                                borderRadius: 2,
                                fontWeight: 600,
                                '&:hover': { bgcolor: 'darkgrey' },
                                '&:disabled': { bgcolor: '#666' }
                            }}
                        >
                            Update User Role
                        </Button>
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default Account;
