import React, { useState } from 'react';
import { Typography, Box, Card, CardContent, Chip, Collapse, IconButton, Stack, Divider, Button } from '@mui/material';
import { ExpandMore, CalendarToday, LocationOn, AttachMoney, People } from '@mui/icons-material';

interface Show {
    _id: string;
    venue: {
        _id: string;
        name: string;
        location: string;
    };
    date: string;
    setlist: string[];
    ticketsPrice: number;
    ticketsSold: number;
}

interface ShowsListProps {
    shows: Show[];
    onEditShow?: (index: number) => void;
    onDeleteShow?: (index: number) => void;
    isAdmin?: boolean;
    isLogged?: boolean;
}

const ShowsList: React.FC<ShowsListProps> = ({ shows, onEditShow, onDeleteShow, isAdmin, isLogged }) => {
    const [expandedShow, setExpandedShow] = useState<number | null>(null);

    const handleExpandClick = (index: number) => {
        setExpandedShow(expandedShow === index ? null : index);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isUpcoming = (dateString: string) => {
        return new Date(dateString) > new Date();
    };

    if (shows.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="#F5F5F5" gutterBottom>
                    No Shows Scheduled
                </Typography>
                <Typography variant="body2" color="#B0B0B0">
                    This band hasn't scheduled any shows yet.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h5" fontWeight={700} color="#F5F5F5" gutterBottom sx={{ mb: 3 }}>
                Shows & Concerts
            </Typography>

            <Stack spacing={2}>
                {shows.map((show, index) => (
                    <div key={show._id} style={{ position: 'relative' }}>
                        <Card
                            sx={{
                                bgcolor: '#1E1E1E',
                                border: `1px solid ${isUpcoming(show.date) ? 'grey' : '#2a2a2aff'}`,
                                borderRadius: 3,
                                overflow: 'hidden',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer',
                                position: 'relative',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
                                }
                            }}
                            onClick={() => handleExpandClick(index)}
                        >
                            {(onEditShow || onDeleteShow) && isAdmin && isLogged && (
                                <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 2, display: 'flex', gap: '8px' }}>
                                    {onEditShow && (
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                color: 'white !important',
                                                borderColor: 'grey !important',
                                                fontWeight: 600,
                                                borderRadius: 2,
                                                px: 2,
                                                py: 0.5,
                                                background: 'rgba(35,38,47,0.95)',
                                                marginTop: 1.5,
                                                marginRight: 0.5,
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEditShow(index);
                                            }}
                                        >
                                            Edit
                                        </Button>
                                    )}
                                    {onDeleteShow && (
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                color: '#FF3C3F !important',
                                                borderColor: '#FF3C3F !important',
                                                fontWeight: 600,
                                                height: '40px',
                                                marginTop: 1.7,
                                                marginRight: 1.3,
                                                px: 2,
                                                py: 0.5,
                                                background: 'rgba(35,38,47,0.95)',
                                                '&:hover': {
                                                    borderColor: '#FF3C3F !important',
                                                    background: 'rgba(255, 60, 63, 0.1)',
                                                }
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDeleteShow(index);
                                            }}
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </div>
                            )}
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Box sx={{ flex: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <LocationOn sx={{ color: '#FF3C3F', fontSize: '1.2rem' }} />
                                            <Typography variant="h6" fontWeight={600} color="#F5F5F5">
                                                {show.venue.name}
                                            </Typography>
                                            {isUpcoming(show.date) && (
                                                <Chip
                                                    label="Upcoming"
                                                    size="small"
                                                    sx={{
                                                        bgcolor: '#3fff3cff',
                                                        color: '#1E1E1E',
                                                        fontWeight: 600,
                                                        fontSize: '0.75rem'
                                                    }}
                                                />
                                            )}
                                            <IconButton
                                                sx={{
                                                    color: '#ffffffff',
                                                    transform: expandedShow === index ? 'rotate(180deg)' : 'rotate(0deg)',
                                                    transition: 'transform 0.3s ease',
                                                    pointerEvents: 'none',
                                                    ml: 1,
                                                    p: 0.5
                                                }}
                                            >
                                                <ExpandMore />
                                            </IconButton>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <CalendarToday sx={{ color: '#FF3C3F', fontSize: '1rem' }} />
                                            <Typography variant="body2" color="#B0B0B0">
                                                {formatDate(show.date)}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <AttachMoney sx={{ color: '#3fff3cff', fontSize: '1rem', marginBottom: '2px' }} />
                                                <Typography variant="body2" color="#F5F5F5" fontWeight={500}>
                                                    ${show.ticketsPrice}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <People sx={{ color: '#FF4081', fontSize: '1rem' }} />
                                                <Typography variant="body2" color="#F5F5F5" fontWeight={500}>
                                                    {show.ticketsSold} sold
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>

                                <Collapse in={expandedShow === index} timeout="auto" unmountOnExit>
                                    <Divider sx={{ bgcolor: '#2a2a2aff', my: 2 }} />
                                    <Box>
                                        <Typography variant="h6" fontWeight={600} color="#F5F5F5" gutterBottom>
                                            Setlist ({show.setlist.length} songs)
                                        </Typography>

                                        {show.setlist.length > 0 ? (
                                            <Stack spacing={1}>
                                                {show.setlist.map((song, songIndex) => (
                                                    <Box
                                                        key={songIndex}
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 2,
                                                            p: 1.5,
                                                            bgcolor: '#2a2a2aff',
                                                            borderRadius: 2,
                                                            border: '1px solid #353535ff'
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                minWidth: '24px',
                                                                textAlign: 'center',
                                                                color: 'darkgrey',
                                                                fontWeight: 600
                                                            }}
                                                        >
                                                            {songIndex + 1}
                                                        </Typography>
                                                        <Typography variant="body1" color="#F5F5F5">
                                                            {song}
                                                        </Typography>
                                                    </Box>
                                                ))}
                                            </Stack>
                                        ) : (
                                            <Typography variant="body2" color="#B0B0B0" sx={{ fontStyle: 'italic' }}>
                                                Setlist not yet announced
                                            </Typography>
                                        )}

                                        <Box sx={{ mt: 2, p: 2, bgcolor: '#2a2a2aff', borderRadius: 2 }}>
                                            <Typography variant="body2" color="#B0B0B0">
                                                <strong>Venue Details:</strong> {show.venue.location}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Collapse>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </Stack>
        </Box>
    );
};

export default ShowsList;
