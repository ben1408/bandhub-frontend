import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar
} from '@mui/material';
import {
    TrendingUp,
    Group,
    Album,
    Event,
    AttachMoney,
    LocationOn,
    Star
} from '@mui/icons-material';
import axios from 'axios';

interface AnalyticsDialogProps {
    open: boolean;
    onClose: () => void;
}

interface AnalyticsData {
    totalBands: number;
    totalAlbums: number;
    totalShows: number;
    totalRevenue: number;
    totalTicketsSold: number;
    topBands: Array<{
        _id: string;
        name: string;
        logoUrl?: string;
        showCount: number;
        totalRevenue: number;
    }>;
    topVenues: Array<{
        _id: string;
        name: string;
        location: string;
        showCount: number;
    }>;
    recentShows: Array<{
        _id: string;
        band: { name: string; logoUrl?: string };
        venue: { name: string; location: string };
        date: string;
        ticketsSold: number;
        revenue: number;
    }>;
    genreBreakdown: Array<{
        genre: string;
        count: number;
    }>;
}

const AnalyticsDialog: React.FC<AnalyticsDialogProps> = ({ open, onClose }) => {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            fetchAnalytics();
        }
    }, [open]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://bandhub-backend.onrender.com/api/analytics', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setAnalytics(response.data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
                <DialogContent sx={{ bgcolor: '#1E1E1E', p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="#F5F5F5" sx={{ mb: 2 }}>
                        Loading Analytics...
                    </Typography>
                    <LinearProgress sx={{ bgcolor: '#2a2a2a', '& .MuiLinearProgress-bar': { bgcolor: '#00BCD4' } }} />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: '#1E1E1E',
                    color: '#F5F5F5',
                    border: '1px solid #2a2a2aff',
                    maxHeight: '90vh'
                }
            }}
        >
            <DialogTitle sx={{ bgcolor: '#1E1E1E', color: '#FFA726', fontWeight: 600, pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TrendingUp />
                    Platform Analytics
                </Box>
            </DialogTitle>

            <DialogContent sx={{ bgcolor: '#1E1E1E', pt: 2 }}>
                {analytics && (
                    <Box>
                        {/* KPI Cards */}
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #00BCD4' }}>
                                    <CardContent sx={{ textAlign: 'center', p: 2 }}>
                                        <Group sx={{ fontSize: 40, color: '#00BCD4', mb: 1 }} />
                                        <Typography variant="h4" color="#F5F5F5" fontWeight={600}>
                                            {analytics.totalBands}
                                        </Typography>
                                        <Typography variant="body2" color="#B0B0B0">
                                            Total Bands
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #FF4081' }}>
                                    <CardContent sx={{ textAlign: 'center', p: 2 }}>
                                        <Album sx={{ fontSize: 40, color: '#FF4081', mb: 1 }} />
                                        <Typography variant="h4" color="#F5F5F5" fontWeight={600}>
                                            {analytics.totalAlbums}
                                        </Typography>
                                        <Typography variant="body2" color="#B0B0B0">
                                            Total Albums
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #8BC34A' }}>
                                    <CardContent sx={{ textAlign: 'center', p: 2 }}>
                                        <Event sx={{ fontSize: 40, color: '#8BC34A', mb: 1 }} />
                                        <Typography variant="h4" color="#F5F5F5" fontWeight={600}>
                                            {analytics.totalShows}
                                        </Typography>
                                        <Typography variant="body2" color="#B0B0B0">
                                            Total Shows
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #FFA726' }}>
                                    <CardContent sx={{ textAlign: 'center', p: 2 }}>
                                        <AttachMoney sx={{ fontSize: 40, color: '#FFA726', mb: 1 }} />
                                        <Typography variant="h4" color="#F5F5F5" fontWeight={600}>
                                            {formatCurrency(analytics.totalRevenue)}
                                        </Typography>
                                        <Typography variant="body2" color="#B0B0B0">
                                            Total Revenue
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Top Performers */}
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #2a2a2aff', height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="h6" color="#00BCD4" fontWeight={600} sx={{ mb: 2 }}>
                                            <Star sx={{ mr: 1 }} />
                                            Top Performing Bands
                                        </Typography>
                                        <List>
                                            {analytics.topBands.slice(0, 5).map((band, index) => (
                                                <ListItem key={band._id} sx={{ px: 0 }}>
                                                    <ListItemAvatar>
                                                        <Avatar
                                                            src={band.logoUrl}
                                                            sx={{ bgcolor: '#00BCD4' }}
                                                        >
                                                            {band.name.charAt(0)}
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={
                                                            <Typography color="#F5F5F5" fontWeight={500}>
                                                                {index + 1}. {band.name}
                                                            </Typography>
                                                        }
                                                        secondary={
                                                            <Typography color="#B0B0B0" fontSize="0.875rem">
                                                                {band.showCount} shows • {formatCurrency(band.totalRevenue)}
                                                            </Typography>
                                                        }
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #2a2a2aff', height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="h6" color="#8BC34A" fontWeight={600} sx={{ mb: 2 }}>
                                            <LocationOn sx={{ mr: 1 }} />
                                            Popular Venues
                                        </Typography>
                                        <List>
                                            {analytics.topVenues.slice(0, 5).map((venue, index) => (
                                                <ListItem key={venue._id} sx={{ px: 0 }}>
                                                    <ListItemAvatar>
                                                        <Avatar sx={{ bgcolor: '#8BC34A' }}>
                                                            {venue.name.charAt(0)}
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={
                                                            <Typography color="#F5F5F5" fontWeight={500}>
                                                                {index + 1}. {venue.name}
                                                            </Typography>
                                                        }
                                                        secondary={
                                                            <Typography color="#B0B0B0" fontSize="0.875rem">
                                                                {venue.location} • {venue.showCount} shows
                                                            </Typography>
                                                        }
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Genre Distribution */}
                        <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #2a2a2aff', mb: 4 }}>
                            <CardContent>
                                <Typography variant="h6" color="#FF4081" fontWeight={600} sx={{ mb: 3 }}>
                                    Genre Distribution
                                </Typography>
                                <Grid container spacing={2}>
                                    {analytics.genreBreakdown.map((genre) => (
                                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={genre.genre}>
                                            <Box sx={{ mb: 2 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                    <Typography color="#F5F5F5" fontSize="0.875rem">
                                                        {genre.genre}
                                                    </Typography>
                                                    <Typography color="#B0B0B0" fontSize="0.875rem">
                                                        {genre.count}
                                                    </Typography>
                                                </Box>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={(genre.count / analytics.totalBands) * 100}
                                                    sx={{
                                                        bgcolor: '#1E1E1E',
                                                        '& .MuiLinearProgress-bar': { bgcolor: '#FF4081' }
                                                    }}
                                                />
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                        </Card>

                        {/* Recent Shows */}
                        <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #2a2a2aff' }}>
                            <CardContent>
                                <Typography variant="h6" color="#FFA726" fontWeight={600} sx={{ mb: 2 }}>
                                    Recent Shows
                                </Typography>
                                <List>
                                    {analytics.recentShows.slice(0, 5).map((show) => (
                                        <ListItem key={show._id} sx={{ px: 0 }}>
                                            <ListItemAvatar>
                                                <Avatar
                                                    src={show.band.logoUrl}
                                                    sx={{ bgcolor: '#FFA726' }}
                                                >
                                                    {show.band.name.charAt(0)}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Typography color="#F5F5F5" fontWeight={500}>
                                                        {show.band.name} at {show.venue.name}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Typography color="#B0B0B0" fontSize="0.875rem">
                                                        {formatDate(show.date)} • {show.ticketsSold} tickets • {formatCurrency(show.revenue)}
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ bgcolor: '#1E1E1E', p: 2 }}>
                <Button
                    onClick={onClose}
                    sx={{
                        color: '#F5F5F5',
                        borderColor: '#F5F5F5',
                        borderRadius: 2
                    }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AnalyticsDialog;
