import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    Card,
    CardContent,
    Grid,
    Divider
} from '@mui/material';
import { Add, Group, Album, Analytics, Event } from '@mui/icons-material';
import AddBandDialog from '../Navbar/AddBandDialog';
import AddAlbumDialog from './AddAlbumDialog';
import AddShowDialog from './AddShowDialog';
import AnalyticsDialog from './AnalyticsDialog';
import type { Member } from '../../types';

interface DashboardProps {
    setIsAddedBand?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setIsAddedBand }) => {
    const [showAddBandForm, setShowAddBandForm] = useState(false);
    const [showAddAlbumForm, setShowAddAlbumForm] = useState(false);
    const [showAddShowForm, setShowAddShowForm] = useState(false);
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        logoUrl: '',
        bandPhotoUrl: '',
        genre: '',
        description: '',
    });
    const [members, setMembers] = useState<Member[]>([]);
    const [memberForm, setMemberForm] = useState<Member>({ name: '', instrument: '' });
    const [bandError, setBandError] = useState('');
    const [showError, setShowError] = useState(false);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMemberChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setMemberForm(prev => ({ ...prev, [name]: value }));
    };

    const removeMember = (index: number) => {
        setMembers(prev => prev.filter((_, i) => i !== index));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setBandError('');
        setShowError(false);

        if (!formData.name.trim()) {
            setBandError('Band name is required');
            setShowError(true);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://bandhub-backend.onrender.com/api/bands', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    members
                }),
            });

            if (response.ok) {
                // Reset form
                setFormData({
                    name: '',
                    logoUrl: '',
                    bandPhotoUrl: '',
                    genre: '',
                    description: '',
                });
                setMembers([]);
                setMemberForm({ name: '', instrument: '' });
                setShowAddBandForm(false);

                // Notify parent component if callback provided
                if (setIsAddedBand) {
                    setIsAddedBand();
                }
            } else {
                const errorData = await response.json();
                setBandError(errorData.message || 'Failed to add band');
                setShowError(true);
            }
        } catch (error) {
            setBandError('Failed to add band. Please try again.');
            setShowError(true);
        }
    };

    const handleAddBandClick = () => {
        setShowAddBandForm(true);
    };

    const handleCloseAddBand = () => {
        setShowAddBandForm(false);
        setBandError('');
        setShowError(false);
    };

    const handleAddAlbumClick = () => {
        setShowAddAlbumForm(true);
    };

    const handleCloseAddAlbum = () => {
        setShowAddAlbumForm(false);
    };

    const handleAddShowClick = () => {
        setShowAddShowForm(true);
    };

    const handleCloseAddShow = () => {
        setShowAddShowForm(false);
    };

    const handleShowAdded = () => {
        // Callback for when a show is successfully added
        console.log('Show added successfully');
    };

    const handleAlbumAdded = () => {
        // Refresh data if needed
        console.log('Album added successfully');
    };

    const handleAnalyticsClick = () => {
        setShowAnalytics(true);
    };

    const handleCloseAnalytics = () => {
        setShowAnalytics(false);
    };

    const dashboardItems = [
        {
            title: 'Add New Band',
            description: 'Create a new band with members and details',
            icon: <Group sx={{ fontSize: 40, color: '#00BCD4' }} />,
            action: handleAddBandClick,
            color: '#00BCD4'
        },
        {
            title: 'Add Album',
            description: 'Add new albums to existing bands',
            icon: <Album sx={{ fontSize: 40, color: '#FF4081' }} />,
            action: handleAddAlbumClick,
            color: '#FF4081'
        },
        {
            title: 'Add Show',
            description: 'Schedule new shows for bands',
            icon: <Event sx={{ fontSize: 40, color: '#8BC34A' }} />,
            action: handleAddShowClick,
            color: '#8BC34A'
        },
        {
            title: 'Analytics',
            description: 'View site statistics and insights',
            icon: <Analytics sx={{ fontSize: 40, color: '#FFA726' }} />,
            action: handleAnalyticsClick,
            color: '#FFA726',
            disabled: false
        }
    ];

    return (
        <Box>
            <Paper
                elevation={4}
                sx={{
                    p: 4,
                    borderRadius: 4,
                    bgcolor: '#2a2a2a',
                    width: '75%',
                    margin: 'auto',
                    marginBottom: '-5vh'
                }}
            >                {/* Dashboard Items Grid */}
                <Grid container spacing={3}>
                    {dashboardItems.map((item, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                            <Card
                                sx={{
                                    height: '100%',
                                    bgcolor: '#1E1E1E',
                                    border: `1px solid white`,
                                    borderRadius: 3,
                                    transition: 'all 0.3s ease',
                                    cursor: item.disabled ? 'not-allowed' : 'pointer',
                                    opacity: item.disabled ? 0.6 : 1,
                                    '&:hover': item.disabled ? {} : {
                                        transform: 'translateY(-4px)',
                                        borderColor: 'white'
                                    }
                                }}
                                onClick={item.disabled ? undefined : item.action}
                            >
                                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                                    <Box sx={{ mb: 2 }}>
                                        {item.icon}
                                    </Box>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: '#F5F5F5',
                                            fontWeight: 600,
                                            mb: 1
                                        }}
                                    >
                                        {item.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: '#B0B0B0', lineHeight: 1.5 }}
                                    >
                                        {item.description}
                                    </Typography>
                                    {item.disabled && (
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: '#888',
                                                fontStyle: 'italic',
                                                display: 'block',
                                                mt: 1
                                            }}
                                        >
                                            Coming Soon
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Quick Stats Section */}
                <Box sx={{ mt: 4 }}>
                    <Divider sx={{ bgcolor: '#444', mb: 3 }} />
                    <Typography
                        variant="h6"
                        sx={{ color: '#F5F5F5', mb: 2, fontWeight: 600 }}
                    >
                        Quick Actions
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Button
                            variant="outlined"
                            startIcon={<Add />}
                            onClick={handleAddBandClick}
                            sx={{
                                color: 'white',
                                borderColor: 'white',
                                '&:hover': {
                                    borderColor: 'white',
                                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                                }
                            }}

                        >
                            Add Band
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<Album />}
                            onClick={handleAddAlbumClick}
                            sx={{
                                color: 'white',
                                borderColor: 'white',
                                '&:hover': {
                                    borderColor: 'white',
                                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                                }
                            }}
                        >
                            Add Album
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<Event />}
                            onClick={handleAddShowClick}
                            sx={{
                                color: 'white',
                                borderColor: 'white',
                                '&:hover': {
                                    borderColor: 'white',
                                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                                }
                            }}
                        >
                            Add Show
                        </Button>
                    </Box>
                </Box>
            </Paper>

            {/* Add Band Dialog */}
            <AddBandDialog
                open={showAddBandForm}
                onClose={handleCloseAddBand}
                formData={formData}
                setFormData={setFormData}
                members={members}
                setMembers={setMembers}
                memberForm={memberForm}
                setMemberForm={setMemberForm}
                handleFormChange={handleFormChange}
                handleMemberChange={handleMemberChange}
                handleFormSubmit={handleFormSubmit}
                bandError={bandError}
                showError={showError}
                setShowError={setShowError}
                removeMember={removeMember}
            />

            {/* Add Album Dialog */}
            <AddAlbumDialog
                open={showAddAlbumForm}
                onClose={handleCloseAddAlbum}
                onAlbumAdded={handleAlbumAdded}
            />

            {/* Add Show Dialog */}
            <AddShowDialog
                open={showAddShowForm}
                onClose={handleCloseAddShow}
                onShowAdded={handleShowAdded}
            />

            {/* Analytics Dialog */}
            <AnalyticsDialog
                open={showAnalytics}
                onClose={handleCloseAnalytics}
            />
        </Box>
    );
};

export default Dashboard;
