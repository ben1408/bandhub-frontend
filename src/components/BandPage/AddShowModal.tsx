import { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Box, Typography, Stack, Button, Snackbar, Alert, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { Venue, AddShowModalProps } from '../../types';

const AddShowModal = ({ bandId, onClose, onShowAdded }: AddShowModalProps) => {
    const [formData, setFormData] = useState({
        venueId: '',
        date: '',
        ticketsPrice: 0,
        ticketsSold: 0
    });
    const [songForm, setSongForm] = useState('');
    const [setlist, setSetlist] = useState<string[]>([]);
    const [venues, setVenues] = useState<Venue[]>([]);
    const [showError, setShowError] = useState(false);
    const [showError2, setShowError2] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchVenues();
    }, []);

    const fetchVenues = async () => {
        try {
            const response = await axios.get('https://bandhub-backend.onrender.com/api/venues');
            setVenues(response.data);
        } catch (error) {
            console.error('Error fetching venues:', error);
            // Create some default venues if none exist
            setVenues([
                { _id: '1', name: 'Madison Square Garden', location: 'New York, NY' },
                { _id: '2', name: 'The Forum', location: 'Los Angeles, CA' },
                { _id: '3', name: 'Red Rocks Amphitheatre', location: 'Morrison, CO' },
                { _id: '4', name: 'The Fillmore', location: 'San Francisco, CA' }
            ]);
        }
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'ticketsPrice' || name === 'ticketsSold' ? Number(value) : value
        });
    };

    const handleVenueChange = (value: string) => {
        setFormData({ ...formData, venueId: value });
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if the show date is in the future or past
        const showDate = new Date(formData.date);
        const now = new Date();
        const isFutureShow = showDate > now;

        // For past shows, require at least 2 songs in setlist
        // For future shows, setlist is optional
        if (!isFutureShow && setlist.length < 2) {
            setErrorMessage('Past shows must have at least 2 songs in the setlist since the show already happened.');
            setShowError(true);
            return;
        }

        try {
            const token = localStorage.getItem('token');

            // Convert the datetime-local input to ISO string
            const showDate = new Date(formData.date);
            console.log('Original date input:', formData.date);
            console.log('Converted date:', showDate);
            console.log('Date ISO string:', showDate.toISOString());

            const showData = {
                band: bandId,
                venue: formData.venueId,
                date: showDate.toISOString(), // Send as ISO string
                setlist: setlist,
                ticketsPrice: formData.ticketsPrice,
                ticketsSold: formData.ticketsSold,
            };

            console.log('Sending show data:', showData);

            await axios.post(`https://bandhub-backend.onrender.com/api/shows`, showData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Reset form
            setFormData({ venueId: '', date: '', ticketsPrice: 0, ticketsSold: 0 });
            setSetlist([]);
            setSongForm('');
            onShowAdded();
            onClose();
        } catch (error: any) {
            console.error('Error creating show:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);

            let errorMsg = 'Failed to create show. Please try again.';
            if (error.response?.data?.message) {
                errorMsg = error.response.data.message;
            } else if (error.response?.status === 404) {
                errorMsg = 'API endpoint not found. Please check the server.';
            } else if (error.response?.status === 401) {
                errorMsg = 'Unauthorized. Please log in again.';
            } else if (error.response?.status === 403) {
                errorMsg = 'Forbidden. Admin access required.';
            }

            setErrorMessage(errorMsg);
            setShowError2(true);
        }
    };

    const addSongToSetlist = () => {
        if (songForm.trim()) {
            setSetlist([...setlist, songForm.trim()]);
            setSongForm('');
        }
    };

    const removeSongFromSetlist = (index: number) => {
        setSetlist(setlist.filter((_, i) => i !== index));
    };

    return (
        <>
            <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 }, }}>
                <DialogTitle sx={{ bgcolor: '#1E1E1E', color: '#F5F5F5', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between', }}>
                    Add New Show
                    <IconButton onClick={onClose} sx={{ color: '#F5F5F5' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <form onSubmit={handleFormSubmit}>
                    <DialogContent sx={{ bgcolor: '#1E1E1E', display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '50vh', overflowX: 'hidden', }}>

                        {/* Venue Selection */}
                        <FormControl fullWidth>
                            <InputLabel sx={{ color: '#F5F5F5', '&.Mui-focused': { color: '#F5F5F5' } }}>
                                Venue
                            </InputLabel>
                            <Select
                                value={formData.venueId}
                                onChange={(e) => handleVenueChange(e.target.value)}
                                required
                                sx={{
                                    color: '#F5F5F5',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#2a2a2aff',
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
                                                },
                                            },
                                        },
                                    },
                                }}
                            >
                                {venues.map((venue) => (
                                    <MenuItem key={venue._id} value={venue._id}>
                                        {venue.name} - {venue.location}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Date */}
                        <TextField
                            label="Show Date"
                            name="date"
                            type="datetime-local"
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
                                    '& fieldset': {
                                        borderColor: '#2a2a2aff',
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

                        {/* Ticket Price */}
                        <TextField
                            label="Ticket Price ($)"
                            name="ticketsPrice"
                            type="number"
                            inputProps={{
                                min: 0,
                                step: 0.01,
                                style: { MozAppearance: 'textfield' } // Remove arrows in Firefox
                            }}
                            value={formData.ticketsPrice || ''}
                            onChange={handleFormChange}
                            onInput={(e) => {
                                const input = e.target as HTMLInputElement;
                                // Allow only numbers and decimal point
                                input.value = input.value.replace(/[^0-9.]/g, '');
                                // Ensure only one decimal point
                                const parts = input.value.split('.');
                                if (parts.length > 2) {
                                    input.value = parts[0] + '.' + parts.slice(1).join('');
                                }
                            }}
                            required
                            fullWidth
                            sx={{
                                input: { color: '#F5F5F5' },
                                label: { color: '#F5F5F5' },
                                '& .MuiInputLabel-root': { color: '#F5F5F5' },
                                '& .MuiInputLabel-root.Mui-focused': { color: '#F5F5F5' },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#2a2a2aff',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#ffffffff',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#ffffffff',
                                    }
                                },
                                // Remove spinner arrows in WebKit browsers
                                '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                                    WebkitAppearance: 'none',
                                    margin: 0,
                                },
                            }}
                        />

                        {/* Tickets Sold */}
                        <TextField
                            label="Tickets Sold"
                            name="ticketsSold"
                            type="number"
                            inputProps={{
                                min: 0,
                                style: { MozAppearance: 'textfield' } // Remove arrows in Firefox
                            }}
                            value={formData.ticketsSold || ''}
                            onChange={handleFormChange}
                            onInput={(e) => {
                                const input = e.target as HTMLInputElement;
                                // Allow only numbers (no decimal for tickets sold)
                                input.value = input.value.replace(/[^0-9]/g, '');
                            }}
                            fullWidth
                            sx={{
                                input: { color: '#F5F5F5' },
                                label: { color: '#F5F5F5' },
                                '& .MuiInputLabel-root': { color: '#F5F5F5' },
                                '& .MuiInputLabel-root.Mui-focused': { color: '#F5F5F5' },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#2a2a2aff',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#ffffffff',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#ffffffff',
                                    }
                                },
                                // Remove spinner arrows in WebKit browsers
                                '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                                    WebkitAppearance: 'none',
                                    margin: 0,
                                },
                            }}
                        />

                        {/* Add Songs to Setlist Section */}
                        <Box sx={{ mt: 3, bgcolor: '#1E1E1E', borderRadius: 2, p: 2, border: '1px solid #2a2a2aff', width: '92%', margin: 'auto', padding: "20px", paddingBottom: "20px" }}>
                            <Typography variant="subtitle1" color="#00BCD4" fontWeight={600} sx={{ mb: 1 }}>
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
                                        input: { color: '#F5F5F5', height: '15px' },
                                        label: { color: '#F5F5F5' },
                                        '& .MuiInputLabel-root': { fontSize: '15px', color: '#F5F5F5' },
                                        '& .MuiInputLabel-root.Mui-focused': { color: '#F5F5F5' },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#2a2a2aff',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'white',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: 'white',
                                            }
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
                                        padding: '10px',
                                        width: '120px',
                                        height: '45px',
                                        fontSize: '12px !important',
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
                                        <Typography variant="body2" color="#F5F5F5" fontSize={'16px'}>
                                            {i + 1}. {song}
                                        </Typography>
                                        <Button
                                            size="small"
                                            onClick={() => removeSongFromSetlist(i)}
                                            sx={{
                                                color: '#FF3C3F',
                                                fontSize: '12px',
                                                minWidth: 'auto',
                                                '&:hover': { color: '#FF3C3F' }
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
                                            <Typography variant="caption" color="#FF3C3F" sx={{ mt: 1 }}>
                                                {setlist.length === 0 ?
                                                    'Add at least 2 songs to the setlist for past shows' :
                                                    'Add 1 more song to meet minimum requirement for past shows'
                                                }
                                            </Typography>
                                        );
                                    } else if (isFutureShow && setlist.length === 0) {
                                        return (
                                            <Typography variant="caption" color="#3fff3cff" sx={{ mt: 1 }}>
                                                Future shows don't require a setlist - keep it secret until showtime!
                                            </Typography>
                                        );
                                    }
                                    return null;
                                })()}
                            </Stack>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ bgcolor: '#1E1E1E', p: 2 }}>
                        <Button onClick={onClose} sx={{ color: '#F5F5F5', borderColor: '#F5F5F5', borderRadius: 2 }}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={(() => {
                                // If no date is selected, disable button
                                if (!formData.date) return true;

                                const isFutureShow = new Date(formData.date) > new Date();
                                // For past shows, require at least 2 songs
                                // For future shows, no setlist requirement
                                return !isFutureShow && setlist.length < 2;
                            })()}
                            sx={{
                                bgcolor: (() => {
                                    if (!formData.date) return '#555';
                                    const isFutureShow = new Date(formData.date) > new Date();
                                    const canSubmit = isFutureShow || setlist.length >= 2;
                                    return canSubmit ? 'white' : '#555';
                                })(),
                                color: (() => {
                                    if (!formData.date) return '#888';
                                    const isFutureShow = new Date(formData.date) > new Date();
                                    const canSubmit = isFutureShow || setlist.length >= 2;
                                    return canSubmit ? '#1E1E1E' : '#888';
                                })(),
                                borderRadius: 2,
                                fontWeight: 600,
                                '&:hover': {
                                    bgcolor: (() => {
                                        if (!formData.date) return '#555';
                                        const isFutureShow = new Date(formData.date) > new Date();
                                        const canSubmit = isFutureShow || setlist.length >= 2;
                                        return canSubmit ? 'black' : '#555';
                                    })(),
                                    color: (() => {
                                        if (!formData.date) return '#888';
                                        const isFutureShow = new Date(formData.date) > new Date();
                                        const canSubmit = isFutureShow || setlist.length >= 2;
                                        return canSubmit ? 'white' : '#888';
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

export default AddShowModal;
