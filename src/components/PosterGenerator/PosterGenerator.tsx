import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    TextField,
    Button,
    Paper,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Card,
    CardContent,
    Divider,
    Alert,
    IconButton,
    Autocomplete
} from '@mui/material';
import { Close as CloseIcon, Palette as PaletteIcon, Delete as DeleteIcon, Warning as WarningIcon, Download as DownloadIcon } from '@mui/icons-material';
import './PosterGenerator.css';

interface PosterData {
    _id: string;
    bandName: string;
    showTitle: string;
    venue: string;
    date?: string;
    style: string;
    createdAt: string;
}

interface Band {
    _id: string;
    name: string;
    logoUrl: string;
}

interface Venue {
    _id: string;
    name: string;
    location: string;
}

interface PosterGeneratorProps {
    open: boolean;
    onClose: () => void;
}

const PosterGenerator: React.FC<PosterGeneratorProps> = ({ open, onClose }) => {
    const [formData, setFormData] = useState({
        showTitle: '',
        date: '',
        style: ''
    });

    const [selectedBand, setSelectedBand] = useState<Band | null>(null);
    const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
    const [bands, setBands] = useState<Band[]>([]);
    const [venues, setVenues] = useState<Venue[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentPoster, setCurrentPoster] = useState<string | null>(null);
    const [posterHistory, setPosterHistory] = useState<PosterData[]>([]);
    const [selectedHistoryPoster, setSelectedHistoryPoster] = useState<string | null>(null);
    const [selectedPosterData, setSelectedPosterData] = useState<PosterData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [posterToDelete, setPosterToDelete] = useState<PosterData | null>(null);
    const [posterThumbnails, setPosterThumbnails] = useState<{ [key: string]: string }>({});

    // Fetch data when dialog opens
    useEffect(() => {
        if (open) {
            fetchPosterHistory();
            fetchBands();
            fetchVenues();
        }
    }, [open]);

    const fetchPosterHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://bandhub-backend.onrender.com/api/posters', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });

            if (response.ok) {
                const posters = await response.json();
                setPosterHistory(posters);

                // Load thumbnails for each poster
                loadPosterThumbnails(posters);
            }
        } catch (error) {
            console.error('Failed to fetch poster history:', error);
        }
    };

    const loadPosterThumbnails = async (posters: PosterData[]) => {
        const thumbnails: { [key: string]: string } = {};
        const token = localStorage.getItem('token');

        for (const poster of posters) {
            try {
                const response = await fetch(`https://bandhub-backend.onrender.com/api/posters/${poster._id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    credentials: 'include'
                });

                if (response.ok) {
                    const posterData = await response.json();
                    thumbnails[poster._id] = posterData.imageData;
                }
            } catch (error) {
                console.error(`Failed to load thumbnail for poster ${poster._id}:`, error);
            }
        }

        setPosterThumbnails(thumbnails);
    };

    const fetchBands = async () => {
        try {
            const response = await fetch('https://bandhub-backend.onrender.com/api/bands');
            if (response.ok) {
                const bandsData = await response.json();
                setBands(bandsData);
            }
        } catch (error) {
            console.error('Error fetching bands:', error);
        }
    };

    const fetchVenues = async () => {
        try {
            const response = await fetch('https://bandhub-backend.onrender.com/api/venues');
            if (response.ok) {
                const venuesData = await response.json();
                setVenues(venuesData);
            }
        } catch (error) {
            console.error('Error fetching venues:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleGenerate = async () => {
        if (!selectedBand) {
            setError('Band selection is required');
            return;
        }

        setIsGenerating(true);
        setError(null);
        setCurrentPoster(null);

        try {
            const token = localStorage.getItem('token');

            // Prepare the data for the API
            const posterData = {
                bandName: selectedBand.name,
                showTitle: formData.showTitle,
                venue: selectedVenue?.name || '',
                date: formData.date,
                style: formData.style
            };

            const response = await fetch('https://bandhub-backend.onrender.com/api/posters/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify(posterData)
            });

            if (response.ok) {
                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);
                setCurrentPoster(imageUrl);

                // Refresh poster history
                fetchPosterHistory();

                // Clear form after successful generation
                setFormData({
                    showTitle: '',
                    date: '',
                    style: ''
                });
                setSelectedBand(null);
                setSelectedVenue(null);
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to generate poster');
            }
        } catch (error) {
            console.error('Error generating poster:', error);
            setError('Failed to generate poster. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleHistoryPosterClick = async (posterId: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://bandhub-backend.onrender.com/api/posters/${posterId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });

            if (response.ok) {
                const posterData = await response.json();
                setSelectedHistoryPoster(posterData.imageData);
                setSelectedPosterData(posterData);
                setCurrentPoster(null); // Clear current generated poster
            }
        } catch (error) {
            console.error('Failed to fetch poster:', error);
        }
    };

    const handleDeletePoster = (poster: PosterData) => {
        setPosterToDelete(poster);
        setShowDeleteConfirm(true);
    };

    const confirmDeletePoster = async () => {
        if (!posterToDelete) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://bandhub-backend.onrender.com/api/posters/${posterToDelete._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });

            if (response.ok) {
                // Remove poster from history
                setPosterHistory(prev => prev.filter(p => p._id !== posterToDelete._id));

                // Clear selected poster if it was the deleted one
                if (selectedPosterData?._id === posterToDelete._id) {
                    setSelectedHistoryPoster(null);
                    setSelectedPosterData(null);
                }
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to delete poster');
            }
        } catch (error) {
            console.error('Error deleting poster:', error);
            setError('Failed to delete poster. Please try again.');
        } finally {
            setShowDeleteConfirm(false);
            setPosterToDelete(null);
        }
    };

    const handleDownloadPoster = () => {
        const imageUrl = selectedHistoryPoster || currentPoster;
        if (!imageUrl) return;

        // Create filename based on poster data
        let filename = 'poster.png';
        if (selectedPosterData) {
            const { bandName, showTitle, venue, date } = selectedPosterData;
            const parts = [bandName];
            if (showTitle) parts.push(showTitle);
            if (venue) parts.push(venue);
            if (date) parts.push(new Date(date).toLocaleDateString().replace(/\//g, '-'));
            filename = `${parts.join('_').replace(/[^a-zA-Z0-9_-]/g, '_')}_poster.png`;
        }

        // Create download link
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: '#2a2a2a',
                    color: 'white',
                    minHeight: '80vh'
                }
            }}
        >
            <DialogTitle sx={{
                bgcolor: '#2a2a2a',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                borderBottom: '1px solid #444',
                marginBottom: 3
            }}>
                <PaletteIcon sx={{ mr: 1 }} />
                AI Poster Generator
                <Button
                    onClick={onClose}
                    sx={{ ml: 'auto', color: 'white' }}
                >
                    <CloseIcon />
                </Button>
            </DialogTitle>

            <DialogContent sx={{ bgcolor: '#2a2a2a', p: 3 }}>
                <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                    {/* Left Panel - Form and Current Poster */}
                    <Box sx={{ flex: { xs: 1, md: 2 } }}>
                        <Paper sx={{
                            p: 3,
                            bgcolor: '#1e1e1e',
                            border: '1px solid #444',
                            mb: 3
                        }}>
                            <Typography variant="h6" sx={{ mb: 2, color: '#f5f5f5' }}>
                                Create New Poster
                            </Typography>

                            {error && (
                                <Alert severity="error" sx={{ mb: 2, bgcolor: '#ffebee', color: '#c62828' }}>
                                    {error}
                                </Alert>
                            )}

                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                                {/* Band Selector */}
                                <Autocomplete
                                    options={bands}
                                    getOptionLabel={(option) => option.name}
                                    value={selectedBand}
                                    onChange={(_, newValue) => setSelectedBand(newValue)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Select Band"
                                            required
                                            sx={{
                                                input: { color: 'white' },
                                                label: { color: 'white' },
                                                '& .MuiInputLabel-root': { color: 'white' },
                                                '& .MuiInputLabel-root.Mui-focused': { color: 'white' },
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': { borderColor: '#666' },
                                                    '&:hover fieldset': { borderColor: '#888' },
                                                    '&.Mui-focused fieldset': { borderColor: '#fff' }
                                                },
                                                '& .MuiAutocomplete-popupIndicator': { color: 'white' },
                                                '& .MuiAutocomplete-clearIndicator': { color: 'white' }
                                            }}
                                        />
                                    )}
                                    sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}
                                />

                                <TextField
                                    fullWidth
                                    label="Show Title"
                                    name="showTitle"
                                    value={formData.showTitle}
                                    onChange={handleInputChange}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            color: 'white',
                                            '& fieldset': { borderColor: '#666' },
                                            '&:hover fieldset': { borderColor: '#888' },
                                            '&.Mui-focused fieldset': { borderColor: '#fff' }
                                        },
                                        '& .MuiInputLabel-root': { color: 'white' },
                                        '& .MuiInputLabel-root.Mui-focused': { color: 'white' }
                                    }}
                                />

                                {/* Venue Selector */}
                                <FormControl fullWidth>
                                    <InputLabel sx={{
                                        color: 'white',
                                        '&.Mui-focused': { color: 'white' }
                                    }}>Venue</InputLabel>
                                    <Select
                                        value={selectedVenue?._id || ''}
                                        onChange={(e) => {
                                            const venue = venues.find(v => v._id === e.target.value);
                                            setSelectedVenue(venue || null);
                                        }}
                                        label="Venue"
                                        sx={{
                                            color: 'white',
                                            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#666' },
                                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#888' },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#fff' }
                                        }}
                                    >
                                        {venues.map((venue) => (
                                            <MenuItem key={venue._id} value={venue._id}>
                                                {venue.name} - {venue.location}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <TextField
                                    fullWidth
                                    label="Date"
                                    name="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    InputLabelProps={{ shrink: true }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            color: 'white',
                                            '& fieldset': { borderColor: '#666' },
                                            '&:hover fieldset': { borderColor: '#888' },
                                            '&.Mui-focused fieldset': { borderColor: '#fff' }
                                        },
                                        '& .MuiInputLabel-root': { color: 'white' },
                                        '& .MuiInputLabel-root.Mui-focused': { color: 'white' }
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="Music Genre/Style"
                                    name="style"
                                    value={formData.style}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Rock, Jazz, Electronic..."
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            color: 'white',
                                            '& fieldset': { borderColor: '#666' },
                                            '&:hover fieldset': { borderColor: '#888' },
                                            '&.Mui-focused fieldset': { borderColor: '#fff' }
                                        },
                                        '& .MuiInputLabel-root': { color: 'white' },
                                        '& .MuiInputLabel-root.Mui-focused': { color: 'white' }
                                    }}
                                />

                                <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={handleGenerate}
                                        disabled={isGenerating}
                                        sx={{
                                            bgcolor: '#444',
                                            color: 'white',
                                            py: 1.5,
                                            '&:hover': { bgcolor: '#555' },
                                            '&:disabled': { bgcolor: '#333' }
                                        }}
                                    >
                                        {isGenerating ? (
                                            <>
                                                <CircularProgress size={20} sx={{ mr: 1 }} />
                                                Generating...
                                            </>
                                        ) : (
                                            'Generate Poster'
                                        )}
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>

                        {/* Current Generated Poster */}
                        {(currentPoster || selectedHistoryPoster) && (
                            <Paper sx={{
                                p: 2,
                                bgcolor: '#1e1e1e',
                                border: '1px solid #444',
                                textAlign: 'center'
                            }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6" sx={{ color: '#f5f5f5' }}>
                                        {selectedHistoryPoster ? 'Selected Poster' : 'Generated Poster'}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button
                                            variant="contained"
                                            startIcon={<DownloadIcon />}
                                            onClick={handleDownloadPoster}
                                            sx={{
                                                bgcolor: '#4CAF50',
                                                color: 'white',
                                                '&:hover': { bgcolor: '#45a049' }
                                            }}
                                        >
                                            Download
                                        </Button>
                                        {selectedPosterData && (
                                            <Button
                                                variant="contained"
                                                color="error"
                                                startIcon={<DeleteIcon />}
                                                onClick={() => handleDeletePoster(selectedPosterData)}
                                                sx={{
                                                    bgcolor: '#FF3C3F',
                                                    '&:hover': { bgcolor: '#FF1C1F' }
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        )}
                                    </Box>
                                </Box>
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    maxHeight: '500px',
                                    overflow: 'hidden'
                                }}>
                                    <img
                                        src={selectedHistoryPoster || currentPoster || ''}
                                        alt="Generated poster"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '500px',
                                            objectFit: 'contain',
                                            border: '2px solid #666',
                                            borderRadius: '8px'
                                        }}
                                    />
                                </Box>
                            </Paper>
                        )}
                    </Box>

                    {/* Right Panel - Poster History */}
                    <Box sx={{ flex: 1, minWidth: { md: '300px' } }}>
                        <Paper sx={{
                            p: 2,
                            bgcolor: '#1e1e1e',
                            border: '1px solid #444',
                            height: 'fit-content'
                        }}>
                            <Typography variant="h6" sx={{ mb: 2, color: '#f5f5f5' }}>
                                Your Poster History
                            </Typography>
                            <Divider sx={{ bgcolor: '#444', mb: 2 }} />

                            <Box sx={{ maxHeight: '600px', overflowY: 'auto' }}>
                                {posterHistory.length === 0 ? (
                                    <Typography sx={{ color: '#ccc', textAlign: 'center', py: 2 }}>
                                        No posters generated yet
                                    </Typography>
                                ) : (
                                    posterHistory.map((poster) => (
                                        <Card
                                            key={poster._id}
                                            sx={{
                                                mb: 2,
                                                bgcolor: '#333',
                                                border: '1px solid #555',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    bgcolor: '#444',
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
                                                }
                                            }}
                                            onClick={() => handleHistoryPosterClick(poster._id)}
                                        >
                                            <CardContent sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 'bold' }}>
                                                        {poster.bandName}
                                                    </Typography>
                                                    {poster.showTitle && (
                                                        <Typography variant="body2" sx={{ color: 'white' }}>
                                                            {poster.showTitle}
                                                        </Typography>
                                                    )}
                                                    {poster.venue && (
                                                        <Typography variant="body2" sx={{ color: '#aaa' }}>
                                                            @ {poster.venue}
                                                        </Typography>
                                                    )}
                                                    <Typography variant="caption" sx={{ color: '#888' }}>
                                                        {formatDate(poster.createdAt)} • {poster.style}
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        width: 60,
                                                        height: 60,
                                                        ml: 2,
                                                        borderRadius: 1,
                                                        overflow: 'hidden',
                                                        border: '1px solid #666',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        bgcolor: '#222'
                                                    }}
                                                >
                                                    {posterThumbnails[poster._id] ? (
                                                        <img
                                                            src={posterThumbnails[poster._id]}
                                                            alt={`${poster.bandName} poster thumbnail`}
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'cover'
                                                            }}
                                                        />
                                                    ) : (
                                                        <PaletteIcon sx={{ color: '#666', fontSize: 20 }} />
                                                    )}
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </Box>
                        </Paper>
                    </Box>
                </Box>
            </DialogContent>

            {/* Delete Confirmation Modal */}
            <Dialog
                open={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 4 } }}
            >
                <DialogTitle sx={{
                    bgcolor: '#1E1E1E',
                    color: '#F5F5F5',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <WarningIcon sx={{ color: '#FF3C3F' }} />
                        Confirm Deletion
                    </div>
                    <IconButton onClick={() => setShowDeleteConfirm(false)} sx={{ color: '#F5F5F5' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ bgcolor: '#1E1E1E', p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ color: '#F5F5F5', mb: 2 }}>
                        Are you sure you want to delete this poster?
                    </Typography>
                    {posterToDelete && (
                        <Typography variant="body1" sx={{ color: '#F5F5F5', mb: 2 }}>
                            <strong style={{ color: '#FF3C3F' }}>"{posterToDelete.bandName}"</strong>
                            {posterToDelete.showTitle && ` - ${posterToDelete.showTitle}`}
                        </Typography>
                    )}
                    <Typography variant="body2" sx={{ color: '#F5F5F5', opacity: 0.8 }}>
                        This action cannot be undone. The poster will be permanently deleted from your history.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ bgcolor: '#1E1E1E', p: 2, gap: 1 }}>
                    <Button
                        onClick={() => setShowDeleteConfirm(false)}
                        sx={{
                            color: '#F5F5F5',
                            borderColor: '#F5F5F5',
                            borderRadius: 2,
                            border: '1px solid',
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={confirmDeletePoster}
                        variant="contained"
                        sx={{
                            bgcolor: '#FF3C3F',
                            color: '#1E1E1E',
                            borderRadius: 2,
                            fontWeight: 600,
                            '&:hover': {
                                bgcolor: '#FF3C3F'
                            }
                        }}
                    >
                        Yes, Delete Poster
                    </Button>
                </DialogActions>
            </Dialog>
        </Dialog>
    );
};

export default PosterGenerator;
