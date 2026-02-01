import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Box,
    Typography,
    Stack,
    Button,
    Snackbar,
    Alert,
    Autocomplete
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import type { Song } from '../../types';

interface Band {
    _id: string;
    name: string;
    logoUrl: string;
}

interface AddAlbumDialogProps {
    open: boolean;
    onClose: () => void;
    onAlbumAdded?: () => void;
}

const AddAlbumDialog: React.FC<AddAlbumDialogProps> = ({ open, onClose, onAlbumAdded }) => {
    const [bands, setBands] = useState<Band[]>([]);
    const [selectedBand, setSelectedBand] = useState<Band | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        releaseDate: '',
        coverUrl: ''
    });
    const [songForm, setSongForm] = useState<Song>({ title: '', duration: 0, listens: 0 });
    const [albumSongs, setAlbumSongs] = useState<Song[]>([]);
    const [showError, setShowError] = useState(false);
    const [albumError, setAlbumError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            fetchBands();
        }
    }, [open]);

    const fetchBands = async () => {
        try {
            const response = await axios.get('https://bandhub-backend.onrender.com/api/bands');
            setBands(response.data);
        } catch (error) {
            console.error('Error fetching bands:', error);
            setAlbumError('Failed to load bands');
            setShowError(true);
        }
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSongChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSongForm({
            ...songForm,
            [e.target.name]: e.target.name === 'duration' || e.target.name === 'listens'
                ? Number(e.target.value)
                : e.target.value
        });
    };

    const addSongToAlbum = () => {
        if (songForm.title.trim() && songForm.duration > 0) {
            setAlbumSongs([...albumSongs, { ...songForm }]);
            setSongForm({ title: '', duration: 0, listens: 0 });
        }
    };

    const removeSongFromAlbum = (index: number) => {
        setAlbumSongs(albumSongs.filter((_, i) => i !== index));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedBand) {
            setAlbumError('Please select a band');
            setShowError(true);
            return;
        }

        if (albumSongs.length < 2) {
            setAlbumError('An album must have at least 2 songs.');
            setShowError(true);
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const albumData = {
                title: formData.title,
                releaseDate: new Date(formData.releaseDate),
                coverUrl: formData.coverUrl,
                songs: albumSongs,
            };

            await axios.post(`https://bandhub-backend.onrender.com/api/bands/${selectedBand._id}/albums`, albumData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Reset form
            setFormData({ title: '', releaseDate: '', coverUrl: '' });
            setAlbumSongs([]);
            setSongForm({ title: '', duration: 0, listens: 0 });
            setSelectedBand(null);

            if (onAlbumAdded) {
                onAlbumAdded();
            }
            onClose();
        } catch (error) {
            console.error('Error adding album:', error);
            setAlbumError('Failed to add album. Please try again.');
            setShowError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({ title: '', releaseDate: '', coverUrl: '' });
        setAlbumSongs([]);
        setSongForm({ title: '', duration: 0, listens: 0 });
        setSelectedBand(null);
        setAlbumError('');
        setShowError(false);
        onClose();
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
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
                    Add New Album
                    <IconButton onClick={handleClose} sx={{ color: '#F5F5F5' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <form onSubmit={handleFormSubmit}>
                    <DialogContent sx={{
                        bgcolor: '#1E1E1E',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        maxHeight: '60vh',
                        overflowX: 'hidden'
                    }}>
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
                                        input: { color: '#F5F5F5' },
                                        label: { color: '#F5F5F5' },
                                        '& .MuiInputLabel-root': { color: '#F5F5F5' },
                                        '& .MuiInputLabel-root.Mui-focused': { color: '#F5F5F5' },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { borderColor: '#2a2a2aff' },
                                            '&:hover fieldset': { borderColor: '#ffffffff' },
                                            '&.Mui-focused fieldset': { borderColor: '#ffffffff' }
                                        },
                                        '& .MuiSvgIcon-root': { color: '#F5F5F5' }
                                    }}
                                />
                            )}
                            renderOption={(props, option) => (
                                <Box
                                    component="li"
                                    {...props}
                                    sx={{
                                        bgcolor: '#2a2a2a !important',
                                        color: '#F5F5F5 !important',
                                        '&:hover': { bgcolor: '#353535 !important' }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {option.logoUrl && (
                                            <img
                                                src={option.logoUrl}
                                                alt={option.name}
                                                style={{ width: 24, height: 24, borderRadius: '50%' }}
                                            />
                                        )}
                                        {option.name}
                                    </Box>
                                </Box>
                            )}
                            PaperComponent={({ children }) => (
                                <Box sx={{ bgcolor: '#2a2a2a', border: '1px solid #444' }}>
                                    {children}
                                </Box>
                            )}
                        />

                        {/* Album Fields */}
                        <TextField
                            label="Album Title"
                            name="title"
                            value={formData.title}
                            onChange={handleFormChange}
                            required
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
                                }
                            }}
                        />

                        <TextField
                            label="Release Date"
                            name="releaseDate"
                            type="date"
                            value={formData.releaseDate}
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

                        <TextField
                            label="Cover URL"
                            name="coverUrl"
                            value={formData.coverUrl}
                            onChange={handleFormChange}
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
                                }
                            }}
                        />

                        {/* Add Song Section */}
                        <Box sx={{
                            mt: 3,
                            bgcolor: '#1E1E1E',
                            borderRadius: 2,
                            p: 2,
                            border: '1px solid #2a2a2aff',
                            width: '92%',
                            margin: 'auto',
                            padding: "20px"
                        }}>
                            <Typography variant="subtitle1" color="#00BCD4" fontWeight={600} sx={{ mb: 1 }}>
                                Add Songs
                            </Typography>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                                <TextField
                                    label="Title"
                                    name="title"
                                    value={songForm.title}
                                    onChange={handleSongChange}
                                    sx={{
                                        input: { color: '#F5F5F5', height: '15px' },
                                        label: { color: '#F5F5F5' },
                                        minWidth: 120,
                                        '& .MuiInputLabel-root': { fontSize: '15px', color: '#F5F5F5' },
                                        '& .MuiInputLabel-root.Mui-focused': { color: '#F5F5F5' },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { borderColor: '#2a2a2aff' },
                                            '&:hover fieldset': { borderColor: 'white' },
                                            '&.Mui-focused fieldset': { borderColor: 'white' }
                                        }
                                    }}
                                />
                                <TextField
                                    label="Duration (Min)"
                                    name="duration"
                                    type="number"
                                    inputProps={{ min: 0, style: { MozAppearance: 'textfield' } }}
                                    value={songForm.duration ? songForm.duration / 60 : ''}
                                    onChange={e => {
                                        const minutes = Number(e.target.value);
                                        setSongForm({ ...songForm, duration: isNaN(minutes) ? 0 : Math.round(minutes * 60) });
                                    }}
                                    onInput={e => {
                                        const input = e.target as HTMLInputElement;
                                        input.value = input.value.replace(/[^0-9]/g, '');
                                    }}
                                    sx={{
                                        input: { color: '#F5F5F5', height: '15px' },
                                        label: { color: '#F5F5F5' },
                                        minWidth: 120,
                                        '& .MuiInputLabel-root': { fontSize: '14px', color: '#F5F5F5' },
                                        '& .MuiInputLabel-root.Mui-focused': { color: '#F5F5F5' },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { borderColor: '#2a2a2aff' },
                                            '&:hover fieldset': { borderColor: 'white' },
                                            '&.Mui-focused fieldset': { borderColor: 'white' }
                                        },
                                        '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                                            WebkitAppearance: 'none',
                                            margin: 0,
                                        },
                                    }}
                                />
                                <TextField
                                    label="Listens"
                                    name="listens"
                                    type="number"
                                    inputProps={{ min: 0, style: { MozAppearance: 'textfield' } }}
                                    value={songForm.listens || ''}
                                    onChange={handleSongChange}
                                    onInput={e => {
                                        const input = e.target as HTMLInputElement;
                                        input.value = input.value.replace(/[^0-9]/g, '');
                                    }}
                                    sx={{
                                        input: { color: '#F5F5F5', height: '15px' },
                                        label: { color: '#F5F5F5' },
                                        minWidth: 120,
                                        '& .MuiInputLabel-root': { fontSize: '15px', color: '#F5F5F5' },
                                        '& .MuiInputLabel-root.Mui-focused': { color: '#F5F5F5' },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': { borderColor: '#2a2a2aff' },
                                            '&:hover fieldset': { borderColor: 'white' },
                                            '&.Mui-focused fieldset': { borderColor: 'white' }
                                        },
                                        '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                                            WebkitAppearance: 'none',
                                            margin: 0,
                                        },
                                    }}
                                />

                                <Button
                                    type="button"
                                    variant="outlined"
                                    sx={{
                                        color: 'white',
                                        borderColor: 'white',
                                        fontWeight: 200,
                                        borderRadius: 2,
                                        padding: '10px',
                                        width: '150px',
                                        height: '45px',
                                        fontSize: '12px !important',
                                        '&:hover': { borderColor: 'white', color: 'white' }
                                    }}
                                    onClick={addSongToAlbum}
                                >
                                    Add Song
                                </Button>
                            </Stack>

                            <Stack spacing={1} sx={{ mt: 2 }}>
                                {albumSongs.map((s, i) => (
                                    <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="body2" color="#F5F5F5" fontSize={'18px'}>
                                            {s.title} <span style={{ color: '#f5f5f5ed', fontSize: '14px' }}>({s.duration} sec, {s.listens} listens)</span>
                                        </Typography>
                                        <Button
                                            size="small"
                                            onClick={() => removeSongFromAlbum(i)}
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
                            </Stack>
                        </Box>
                    </DialogContent>

                    <DialogActions sx={{ bgcolor: '#1E1E1E', p: 2 }}>
                        <Button
                            onClick={handleClose}
                            sx={{ color: '#F5F5F5', borderColor: '#F5F5F5', borderRadius: 2 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            sx={{
                                bgcolor: 'white',
                                color: '#1E1E1E',
                                borderRadius: 2,
                                fontWeight: 600,
                                '&:hover': { bgcolor: 'black', color: 'white' },
                                '&:disabled': { bgcolor: '#666', color: '#999' }
                            }}
                        >
                            {loading ? 'Adding...' : 'Add Album'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Snackbar
                open={showError}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                onClose={() => setShowError(false)}
                autoHideDuration={3000}
            >
                <Alert severity="error" variant="filled" sx={{ width: '100%' }}>
                    {albumError}
                </Alert>
            </Snackbar>
        </>
    );
};

export default AddAlbumDialog;
