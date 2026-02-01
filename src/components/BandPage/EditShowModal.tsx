import { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Box, Typography, Stack, Button, Snackbar, Alert, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { Venue, EditShowModalProps } from '../../types';

const EditShowModal = ({ open, show, onClose, onShowUpdated }: EditShowModalProps) => {
    const [formData, setFormData] = useState({
        venueId: show.venue._id,
        date: show.date ? new Date(show.date).toISOString().slice(0, 16) : '',
        ticketsPrice: show.ticketsPrice,
        ticketsSold: show.ticketsSold
    });
    const [songForm, setSongForm] = useState('');
    const [setlist, setSetlist] = useState<string[]>([...show.setlist]);
    const [venues, setVenues] = useState<Venue[]>([]);
    const [showError, setShowError] = useState(false);
    const [showError2, setShowError2] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (open) {
            fetchVenues();
            // Reset form data when modal opens
            setFormData({
                venueId: show.venue._id,
                date: show.date ? new Date(show.date).toISOString().slice(0, 16) : '',
                ticketsPrice: show.ticketsPrice,
                ticketsSold: show.ticketsSold
            });
            setSetlist([...show.setlist]);
        }
    }, [open, show]);

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

    const handleSongFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSongForm(e.target.value);
    };

    const addSongToSetlist = () => {
        if (songForm.trim() && !setlist.includes(songForm.trim())) {
            setSetlist([...setlist, songForm.trim()]);
            setSongForm('');
        }
    };

    const removeSongFromSetlist = (index: number) => {
        setSetlist(setlist.filter((_, i) => i !== index));
    };

    const isPastShow = () => {
        return new Date(formData.date) < new Date();
    };

    const getMinSongsRequired = () => {
        return isPastShow() ? 2 : 0;
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const minSongs = getMinSongsRequired();
        if (setlist.length < minSongs) {
            setErrorMessage(`${isPastShow() ? 'Past shows' : 'Shows'} must have at least ${minSongs} songs in the setlist.`);
            setShowError2(true);
            return;
        }

        if (!formData.venueId || !formData.date) {
            setErrorMessage('Please fill in all required fields.');
            setShowError2(true);
            return;
        }

        try {
            const showData = {
                venueId: formData.venueId,
                date: formData.date,
                setlist,
                ticketsPrice: formData.ticketsPrice,
                ticketsSold: formData.ticketsSold
            };

            const token = localStorage.getItem('token');
            await axios.put(`https://bandhub-backend.onrender.com/api/shows/${show._id}`, showData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            onShowUpdated();
            onClose();
        } catch (error: any) {
            console.error('Error updating show:', error);
            if (error.response?.data?.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('Failed to update show. Please try again.');
            }
            setShowError(true);
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 4, width: '45%' } }}>
                <DialogTitle sx={{ bgcolor: '#2a2a2aff', color: 'white', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    Edit Show
                    <IconButton onClick={onClose} sx={{ color: '#bfc9d1' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <form onSubmit={handleFormSubmit}>
                    <DialogContent sx={{ bgcolor: '#1E1E1E', color: 'white' }}>
                        <Stack spacing={3} sx={{ mt: 1 }}>
                            <FormControl fullWidth>
                                <InputLabel sx={{ color: '#F5F5F5', '&.Mui-focused': { color: 'white' } }}>
                                    Venue
                                </InputLabel>
                                <Select
                                    value={formData.venueId}
                                    onChange={(e) => handleVenueChange(e.target.value)}
                                    sx={{
                                        color: '#F5F5F5',
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#948f8fff' },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                                        '& .MuiSvgIcon-root': { color: '#F5F5F5' }
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
                                name="date"
                                label="Date & Time"
                                type="datetime-local"
                                value={formData.date}
                                onChange={handleFormChange}
                                fullWidth
                                required
                                InputLabelProps={{
                                    shrink: true,
                                    sx: { color: '#F5F5F5', '&.Mui-focused': { color: 'white' } }
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        color: '#F5F5F5',
                                        '& fieldset': { borderColor: '#948f8fff' },
                                        '&:hover fieldset': { borderColor: 'white' },
                                        '&.Mui-focused fieldset': { borderColor: 'white' }
                                    }
                                }}
                            />

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    name="ticketsPrice"
                                    label="Ticket Price ($)"
                                    type="number"
                                    value={formData.ticketsPrice}
                                    onChange={handleFormChange}
                                    fullWidth
                                    onInput={(e) => {
                                        const target = e.target as HTMLInputElement;
                                        target.value = target.value.replace(/[^0-9.]/g, '');
                                    }}
                                    InputLabelProps={{
                                        sx: { color: '#F5F5F5', '&.Mui-focused': { color: 'white' } }
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            color: '#F5F5F5',
                                            '& fieldset': { borderColor: '#948f8fff' },
                                            '&:hover fieldset': { borderColor: 'white' },
                                            '&.Mui-focused fieldset': { borderColor: 'white' },
                                            '& input[type=number]': {
                                                '-moz-appearance': 'textfield',
                                                '&::-webkit-outer-spin-button': { '-webkit-appearance': 'none', margin: 0 },
                                                '&::-webkit-inner-spin-button': { '-webkit-appearance': 'none', margin: 0 }
                                            }
                                        }
                                    }}
                                />

                                <TextField
                                    name="ticketsSold"
                                    label="Tickets Sold"
                                    type="number"
                                    value={formData.ticketsSold}
                                    onChange={handleFormChange}
                                    fullWidth
                                    onInput={(e) => {
                                        const target = e.target as HTMLInputElement;
                                        target.value = target.value.replace(/[^0-9]/g, '');
                                    }}
                                    InputLabelProps={{
                                        sx: { color: '#F5F5F5', '&.Mui-focused': { color: 'white' } }
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            color: '#F5F5F5',
                                            '& fieldset': { borderColor: '#948f8fff' },
                                            '&:hover fieldset': { borderColor: 'white' },
                                            '&.Mui-focused fieldset': { borderColor: 'white' },
                                            '& input[type=number]': {
                                                '-moz-appearance': 'textfield',
                                                '&::-webkit-outer-spin-button': { '-webkit-appearance': 'none', margin: 0 },
                                                '&::-webkit-inner-spin-button': { '-webkit-appearance': 'none', margin: 0 }
                                            }
                                        }
                                    }}
                                />
                            </Box>

                            <Box>
                                <Typography variant="h6" sx={{ color: '#F5F5F5', mb: 2 }}>
                                    Setlist {isPastShow() && '(Minimum 2 songs for past shows)'}
                                </Typography>

                                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                    <TextField
                                        value={songForm}
                                        onChange={handleSongFormChange}
                                        placeholder="Enter song name"
                                        fullWidth
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addSongToSetlist();
                                            }
                                        }}
                                        InputProps={{
                                            sx: { color: 'white' }
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': { borderColor: '#948f8fff' },
                                                '&:hover fieldset': { borderColor: 'white' },
                                                '&.Mui-focused fieldset': { borderColor: 'white' }
                                            }
                                        }}
                                    />
                                    <Button
                                        onClick={addSongToSetlist}
                                        variant="contained"
                                        sx={{
                                            bgcolor: 'grey',
                                            color: 'white',
                                            borderRadius: 2,
                                            fontWeight: 600,
                                            width: '120px',
                                            height: '50px',
                                            fontSize: '0.875rem !important',
                                            '&:hover': { bgcolor: 'darkgrey' }
                                        }}
                                        disabled={!songForm.trim() || setlist.includes(songForm.trim())}
                                    >
                                        Add Song
                                    </Button>
                                </Box>

                                <Stack spacing={1}>
                                    {setlist.map((song, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                bgcolor: '#2a2a2a',
                                                p: 1.5,
                                                borderRadius: 1,
                                                border: '1px solid #404040'
                                            }}
                                        >
                                            <Typography sx={{ color: '#F5F5F5' }}>
                                                {index + 1}. {song}
                                            </Typography>
                                            <Button
                                                onClick={() => removeSongFromSetlist(index)}
                                                sx={{
                                                    minWidth: 'auto',
                                                    p: 0.5,
                                                    color: '#FF3C3F',

                                                }}
                                            >
                                                Remove
                                            </Button>
                                        </Box>
                                    ))}
                                </Stack>

                                {setlist.length === 0 && (
                                    <Typography variant="body2" sx={{ color: '#B0B0B0', fontStyle: 'italic', mt: 1 }}>
                                        No songs added to setlist yet.
                                    </Typography>
                                )}
                            </Box>
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ bgcolor: '#1E1E1E', p: 2 }}>
                        <Button onClick={onClose} sx={{ color: '#F5F5F5', borderColor: '#F5F5F5', borderRadius: 2 }}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                bgcolor: 'grey',
                                color: 'white',
                                borderRadius: 2,
                                fontWeight: 600,
                                '&:hover': { bgcolor: 'darkgrey', }
                            }}
                        >
                            Update Show
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Snackbar open={showError} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} onClose={() => setShowError(false)} autoHideDuration={3000}>
                <Alert severity="error" variant="filled" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>

            <Snackbar open={showError2} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} onClose={() => setShowError2(false)} autoHideDuration={3000}>
                <Alert severity="warning" variant="filled" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default EditShowModal;
