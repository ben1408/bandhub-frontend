import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Typography,
    Box,
    Stack,
    Snackbar,
    Alert,
    Autocomplete
} from '@mui/material';
import axios from 'axios';

interface Band {
    _id: string;
    name: string;
    logoUrl: string | null;
}

interface Venue {
    _id: string;
    name: string;
    location: string;
}

interface AddShowDialogProps {
    open: boolean;
    onClose: () => void;
    onShowAdded: () => void;
}

interface ShowFormData {
    date: string;
    venue_id: string;
    ticketPrice: string | number;
    ticketsSold: string | number;
}

const AddShowDialog: React.FC<AddShowDialogProps> = ({ open, onClose, onShowAdded }) => {
    const [selectedBand, setSelectedBand] = useState<Band | null>(null);
    const [bands, setBands] = useState<Band[]>([]);
    const [venues, setVenues] = useState<Venue[]>([]);
    const [formData, setFormData] = useState<ShowFormData>({
        date: '',
        venue_id: '',
        ticketPrice: '',
        ticketsSold: ''
    });
    const [setlist, setSetlist] = useState<string[]>([]);
    const [songForm, setSongForm] = useState('');
    const [showError, setShowError] = useState(false);
    const [showError2, setShowError2] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Load bands and venues on component mount
    useEffect(() => {
        if (open) {
            loadBands();
            loadVenues();
        }
    }, [open]);

    const loadBands = async () => {
        try {
            const response = await axios.get('https://bandhub-backend.onrender.com/api/bands');
            console.log('Bands loaded:', response.data);
            setBands(response.data);
        } catch (error) {
            console.error('Error loading bands:', error);
            setErrorMessage('Failed to load bands');
            setShowError(true);
        }
    };

    const loadVenues = async () => {
        try {
            const response = await axios.get('https://bandhub-backend.onrender.com/api/venues');
            console.log('Venues loaded:', response.data);
            console.log('First venue structure:', response.data[0]);
            setVenues(response.data);
        } catch (error) {
            console.error('Error loading venues:', error);
            // Create some default venues if none exist
            const defaultVenues = [
                { _id: '1', name: 'The Roundhouse', location: 'London' },
                { _id: '2', name: 'Madison Square Garden', location: 'New York' },
                { _id: '3', name: 'Wembley Stadium', location: 'London' }
            ];
            console.log('Using default venues:', defaultVenues);
            setVenues(defaultVenues);
        }
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addSongToSetlist = () => {
        if (songForm.trim()) {
            setSetlist(prev => [...prev, songForm.trim()]);
            setSongForm('');
        }
    };

    const removeSongFromSetlist = (index: number) => {
        setSetlist(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedBand) {
            setErrorMessage('Please select a band');
            setShowError(true);
            return;
        }

        // Validation for past shows requiring setlist
        const isFutureShow = formData.date && new Date(formData.date) > new Date();
        if (!isFutureShow && setlist.length < 2) {
            setErrorMessage('Past shows require at least 2 songs in the setlist');
            setShowError(true);
            return;
        }

        try {
            const token = localStorage.getItem('token');

            // Convert the date input to ISO string
            const showDate = new Date(formData.date);

            const showData = {
                band: selectedBand._id,
                venue: formData.venue_id,
                date: showDate.toISOString(),
                setlist: setlist,
                ticketsPrice: formData.ticketPrice,
                ticketsSold: formData.ticketsSold,
            };

            await axios.post(`https://bandhub-backend.onrender.com/api/shows`, showData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Reset form
            setSelectedBand(null);
            setFormData({
                date: '',
                venue_id: '',
                ticketPrice: '',
                ticketsSold: ''
            });
            setSetlist([]);
            setSongForm('');
            onShowAdded();
            onClose();
        } catch (error) {
            console.error('Error adding show:', error);
            setErrorMessage('An error occurred while adding the show');
            setShowError2(true);
        }
    };

    const handleClose = () => {
        // Reset form when closing
        setSelectedBand(null);
        setFormData({
            date: '',
            venue_id: '',
            ticketPrice: '',
            ticketsSold: ''
        });
        setSetlist([]);
        setSongForm('');
        onClose();
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: '#1E1E1E',
                        color: '#F5F5F5',
                        border: '1px solid #2a2a2aff'
                    }
                }}
            >
                <form onSubmit={handleSubmit}>
                    <DialogTitle sx={{ bgcolor: '#1E1E1E', color: 'white', fontWeight: 600 }}>
                        Add New Show
                    </DialogTitle>
                    <DialogContent sx={{ bgcolor: '#1E1E1E', pt: 2 }}>
                        <Stack spacing={3}>
                            {/* Band Selection */}
                            <Autocomplete
                                options={bands}
                                getOptionLabel={(option) => option.name}
                                value={selectedBand}
                                onChange={(_, newValue) => setSelectedBand(newValue)}
                                isOptionEqualToValue={(option, value) => option._id === value._id}
                                renderOption={(props, option) => (
                                    <Box component="li" {...props} key={option._id} sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        color: '#F5F5F5',
                                        '&:hover': {
                                            backgroundColor: '#2a2a2a'
                                        }
                                    }}>
                                        {option.logoUrl && (
                                            <img
                                                src={option.logoUrl}
                                                alt={option.name}
                                                style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                                            />
                                        )}
                                        <Typography color="#F5F5F5">{option.name}</Typography>
                                    </Box>
                                )}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select Band"
                                        placeholder="Search bands..."
                                        required
                                        sx={{
                                            '& .MuiInputBase-root': { color: '#F5F5F5' },
                                            '& .MuiInputLabel-root': { color: '#F5F5F5' },
                                            '& .MuiInputLabel-root.Mui-focused': { color: 'white' },
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': { borderColor: '#2a2a2aff' },
                                                '&:hover fieldset': { borderColor: 'white' },
                                                '&.Mui-focused fieldset': { borderColor: 'white' }
                                            }
                                        }}
                                    />
                                )}
                                sx={{
                                    '& .MuiAutocomplete-popupIndicator': { color: '#F5F5F5' },
                                    '& .MuiAutocomplete-clearIndicator': { color: '#F5F5F5' }
                                }}
                                ListboxProps={{
                                    sx: {
                                        bgcolor: '#1E1E1E',
                                        color: '#F5F5F5',
                                        border: '1px solid #2a2a2aff',
                                        '& .MuiAutocomplete-option': {
                                            color: '#F5F5F5',
                                            '&:hover': {
                                                backgroundColor: '#2a2a2a'
                                            },
                                            '&[aria-selected="true"]': {
                                                backgroundColor: 'white',
                                                color: '#1E1E1E'
                                            }
                                        }
                                    }
                                }}
                            />

                            {/* Date */}
                            <TextField
                                label="Show Date"
                                name="date"
                                type="date"
                                value={formData.date}
                                onChange={handleFormChange}
                                required
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                    input: { color: '#F5F5F5' },
                                    label: { color: '#F5F5F5' },
                                    '& .MuiInputLabel-root': { color: '#F5F5F5' },
                                    '& .MuiInputLabel-root.Mui-focused': { color: '#F5F5F5' },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: '#2a2a2aff' },
                                        '&:hover fieldset': { borderColor: '#ffffffff' },
                                        '&.Mui-focused fieldset': { borderColor: '#ffffffff' }
                                    }
                                }}
                            />

                            {/* Venue */}
                            <TextField
                                select
                                label="Venue"
                                name="venue_id"
                                value={formData.venue_id}
                                onChange={handleFormChange}
                                required
                                fullWidth
                                sx={{
                                    '& .MuiInputBase-root': { color: '#F5F5F5' },
                                    '& .MuiInputLabel-root': { color: '#F5F5F5' },
                                    '& .MuiInputLabel-root.Mui-focused': { color: '#F5F5F5' },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: '#2a2a2aff' },
                                        '&:hover fieldset': { borderColor: '#ffffffff' },
                                        '&.Mui-focused fieldset': { borderColor: '#ffffffff' }
                                    },
                                    '& .MuiSelect-icon': { color: '#F5F5F5' }
                                }}
                                SelectProps={{
                                    MenuProps: {
                                        PaperProps: {
                                            sx: {
                                                bgcolor: '#1E1E1E',
                                                color: '#F5F5F5',
                                                border: '1px solid #2a2a2aff',
                                                '& .MuiMenuItem-root': {
                                                    color: '#F5F5F5',
                                                    '&:hover': {
                                                        backgroundColor: '#2a2a2a'
                                                    },
                                                    '&.Mui-selected': {
                                                        backgroundColor: '#00BCD4',
                                                        color: '#1E1E1E',
                                                        '&:hover': {
                                                            backgroundColor: '#008B9A'
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }}
                            >
                                {venues.map((venue) => (
                                    <MenuItem
                                        key={venue._id}
                                        value={venue._id}
                                        sx={{
                                            color: '#F5F5F5',
                                            '&:hover': {
                                                backgroundColor: '#2a2a2a'
                                            },
                                            '&.Mui-selected': {
                                                backgroundColor: '#00BCD4',
                                                color: '#1E1E1E'
                                            }
                                        }}
                                    >
                                        {venue.name} - {venue.location}
                                    </MenuItem>
                                ))}
                            </TextField>

                            {/* Ticket Price */}
                            <TextField
                                label="Ticket Price ($)"
                                name="ticketPrice"
                                type="number"
                                inputProps={{
                                    min: 0,
                                    step: 0.01,
                                    style: { MozAppearance: 'textfield' }
                                }}
                                value={formData.ticketPrice || ''}
                                onChange={handleFormChange}
                                onInput={(e) => {
                                    const input = e.target as HTMLInputElement;
                                    input.value = input.value.replace(/[^0-9.]/g, '');
                                }}
                                fullWidth
                                sx={{
                                    input: { color: '#F5F5F5' },
                                    label: { color: '#F5F5F5' },
                                    '& .MuiInputLabel-root': { color: '#F5F5F5' },
                                    '& .MuiInputLabel-root.Mui-focused': { color: '#F5F5F5' },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: '#2a2a2aff' },
                                        '&:hover fieldset': { borderColor: '#ffffffff' },
                                        '&.Mui-focused fieldset': { borderColor: '#ffffffff' }
                                    },
                                    '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                                        WebkitAppearance: 'none',
                                        margin: 0,
                                    }
                                }}
                            />

                            {/* Tickets Sold */}
                            <TextField
                                label="Tickets Sold"
                                name="ticketsSold"
                                type="number"
                                inputProps={{
                                    min: 0,
                                    style: { MozAppearance: 'textfield' }
                                }}
                                value={formData.ticketsSold || ''}
                                onChange={handleFormChange}
                                onInput={(e) => {
                                    const input = e.target as HTMLInputElement;
                                    input.value = input.value.replace(/[^0-9]/g, '');
                                }}
                                fullWidth
                                sx={{
                                    input: { color: '#F5F5F5' },
                                    label: { color: '#F5F5F5' },
                                    '& .MuiInputLabel-root': { color: '#F5F5F5' },
                                    '& .MuiInputLabel-root.Mui-focused': { color: '#F5F5F5' },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: '#2a2a2aff' },
                                        '&:hover fieldset': { borderColor: '#ffffffff' },
                                        '&.Mui-focused fieldset': { borderColor: '#ffffffff' }
                                    },
                                    '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                                        WebkitAppearance: 'none',
                                        margin: 0,
                                    }
                                }}
                            />

                            {/* Add Songs to Setlist Section */}
                            <Box sx={{
                                bgcolor: '#1E1E1E',
                                borderRadius: 2,
                                p: 2,
                                border: '1px solid #2a2a2aff'
                            }}>
                                <Typography variant="subtitle1" color="#00BCD4" fontWeight={600} sx={{ mb: 2 }}>
                                    Add Songs to Setlist
                                    {formData.date && new Date(formData.date) <= new Date() ?
                                        ' (Minimum 2 required for past shows)' :
                                        ' (Optional for future shows)'
                                    }
                                </Typography>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <TextField
                                        label="Song Title"
                                        value={songForm}
                                        onChange={(e) => setSongForm(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addSongToSetlist();
                                            }
                                        }}
                                        sx={{
                                            flex: 1,
                                            input: { color: '#F5F5F5' },
                                            label: { color: '#F5F5F5' },
                                            '& .MuiInputLabel-root': { color: '#F5F5F5' },
                                            '& .MuiInputLabel-root.Mui-focused': { color: '#F5F5F5' },
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': { borderColor: '#2a2a2aff' },
                                                '&:hover fieldset': { borderColor: 'white' },
                                                '&.Mui-focused fieldset': { borderColor: 'white' }
                                            }
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        variant="outlined"
                                        onClick={addSongToSetlist}
                                        sx={{
                                            color: 'white',
                                            borderColor: 'white',
                                            fontWeight: 200,
                                            borderRadius: 2,
                                            '&:hover': { borderColor: 'white', color: 'white' }
                                        }}
                                    >
                                        Add Song
                                    </Button>
                                </Stack>

                                {/* Setlist Display */}
                                <Stack spacing={1} sx={{ mt: 2 }}>
                                    {setlist.map((song, i) => (
                                        <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2" color="#F5F5F5">
                                                {i + 1}. {song}
                                            </Typography>
                                            <Button
                                                size="small"
                                                onClick={() => removeSongFromSetlist(i)}
                                                sx={{
                                                    color: '#FF4081',
                                                    fontSize: '12px',
                                                    minWidth: 'auto',
                                                    '&:hover': { color: '#FF4081' }
                                                }}
                                            >
                                                Remove
                                            </Button>
                                        </Box>
                                    ))}
                                    {(() => {
                                        const isFutureShow = formData.date && new Date(formData.date) > new Date();
                                        const needsSetlist = !isFutureShow && setlist.length < 2;

                                        if (needsSetlist) {
                                            return (
                                                <Typography variant="caption" color="#FF4081" sx={{ mt: 1 }}>
                                                    {setlist.length === 0 ?
                                                        'Add at least 2 songs to the setlist for past shows' :
                                                        'Add 1 more song to meet minimum requirement for past shows'
                                                    }
                                                </Typography>
                                            );
                                        } else if (isFutureShow && setlist.length === 0) {
                                            return (
                                                <Typography variant="caption" color="#8BC34A" sx={{ mt: 1 }}>
                                                    Future shows don't require a setlist - keep it secret until showtime!
                                                </Typography>
                                            );
                                        }
                                        return null;
                                    })()}
                                </Stack>
                            </Box>
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ bgcolor: '#1E1E1E', p: 2 }}>
                        <Button
                            onClick={handleClose}
                            sx={{
                                color: '#F5F5F5',
                                borderColor: '#F5F5F5',
                                borderRadius: 2
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={(() => {
                                if (!selectedBand || !formData.date) return true;
                                const isFutureShow = new Date(formData.date) > new Date();
                                return !isFutureShow && setlist.length < 2;
                            })()}
                            sx={{
                                bgcolor: (() => {
                                    if (!selectedBand || !formData.date) return '#555';
                                    const isFutureShow = new Date(formData.date) > new Date();
                                    const canSubmit = isFutureShow || setlist.length >= 2;
                                    return canSubmit ? 'white' : '#555';
                                })(),
                                color: '#1E1E1E',
                                borderRadius: 2,
                                fontWeight: 600,
                                '&:hover': {
                                    bgcolor: (() => {
                                        if (!selectedBand || !formData.date) return '#555';
                                        const isFutureShow = new Date(formData.date) > new Date();
                                        const canSubmit = isFutureShow || setlist.length >= 2;
                                        return canSubmit ? 'white' : '#555';
                                    })()
                                }
                            }}
                        >
                            Add Show
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Error Snackbars */}
            <Snackbar open={showError} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} onClose={() => setShowError(false)} autoHideDuration={3000}>
                <Alert severity="error" variant="filled" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>

            <Snackbar open={showError2} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} onClose={() => setShowError2(false)} autoHideDuration={3000}>
                <Alert severity="error" variant="filled" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default AddShowDialog;
