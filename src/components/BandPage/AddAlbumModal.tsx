import { useState } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Box, Typography, Stack, Button, Snackbar, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { Song, AddAlbumModalProps } from '../../types';

const AddAlbumModal = ({ bandId, onClose, onAlbumAdded }: AddAlbumModalProps) => {
    const [formData, setFormData] = useState({
        title: '',
        releaseDate: '',
        coverUrl: ''
    });
    const [songForm, setSongForm] = useState<Song>({ title: '', duration: 0, listens: 0 });
    const [albumSongs, setAlbumSongs] = useState<Song[]>([]);
    const [showError, setShowError] = useState(false);
    const [albumError, setAlbumError] = useState('');

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSongChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSongForm({ ...songForm, [e.target.name]: e.target.name === 'duration' || e.target.name === 'listens' ? Number(e.target.value) : e.target.value });
    };
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (albumSongs.length < 2) {
            setAlbumError('An album must have at least 2 songs.');
            setShowError(true);
            return;
        }
        const token = localStorage.getItem('token');
        const albumData = {
            title: formData.title,
            releaseDate: new Date(formData.releaseDate),
            coverUrl: formData.coverUrl,
            songs: albumSongs,
        };
        await axios.post(`https://bandhub-backend.onrender.com/api/bands/${bandId}/albums`, albumData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        setFormData({ title: '', releaseDate: '', coverUrl: '' });
        setAlbumSongs([]);
        setSongForm({ title: '', duration: 0, listens: 0 });
        onAlbumAdded();
        onClose();
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
    return (
        <>
            <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 }, }}>
                <DialogTitle sx={{ bgcolor: '#1E1E1E', color: '#F5F5F5', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between', }}>
                    Add New Album
                    <IconButton onClick={onClose} sx={{ color: '#F5F5F5' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <form onSubmit={handleFormSubmit}>
                    <DialogContent sx={{ bgcolor: '#1E1E1E', display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '50vh', overflowX: 'hidden', }}>
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
                        {/* Add Song Section */}
                        <Box sx={{ mt: 3, bgcolor: '#1E1E1E', borderRadius: 2, p: 2, border: '1px solid #2a2a2aff', width: '92%', margin: 'auto', padding: "20px", paddingBottom: "20px" }}>
                            <Typography variant="subtitle1" color="#00BCD4" fontWeight={600} sx={{ mb: 1 }}>
                                Add Songs
                            </Typography>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                                <TextField
                                    label="Title"
                                    name="title"
                                    value={songForm.title}
                                    onChange={handleSongChange}
                                    required={albumSongs.length === 0 && songForm.title.trim() === ''}
                                    sx={{
                                        input: { color: '#F5F5F5', height: '15px', },
                                        label: { color: '#F5F5F5' },
                                        minWidth: 120,
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
                                <TextField
                                    label="Duration (Min)"
                                    name="duration"
                                    type="number"
                                    inputProps={{ min: 0, style: { MozAppearance: 'textfield' } }}
                                    value={songForm.duration ? songForm.duration / 60 : ''}
                                    onChange={e => {
                                        // Accept minutes in the input, store as seconds in state
                                        const minutes = Number(e.target.value);
                                        setSongForm({ ...songForm, duration: isNaN(minutes) ? 0 : Math.round(minutes * 60) });
                                    }}
                                    onInput={e => {
                                        const input = e.target as HTMLInputElement;
                                        input.value = input.value.replace(/[^0-9]/g, '');
                                    }}
                                    required={albumSongs.length === 0 && !songForm.duration}
                                    sx={{
                                        input: { color: '#F5F5F5', height: '15px', },
                                        label: { color: '#F5F5F5' },
                                        minWidth: 120,
                                        '& .MuiInputLabel-root': { fontSize: '14px', color: '#F5F5F5' },
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
                                        input: { color: '#F5F5F5', height: '15px', },
                                        label: { color: '#F5F5F5' },
                                        minWidth: 120,
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
                                        },
                                        '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                                            WebkitAppearance: 'none',
                                            margin: 0,
                                        },
                                    }}
                                />

                                <Button type="button" variant="outlined" sx={{ color: 'white', borderColor: 'white', fontWeight: 200, borderRadius: 2, padding: '10px', width: '150px', height: '45px', fontSize: '12px !important', '&:hover': { borderColor: 'white', color: 'white' } }} onClick={addSongToAlbum}>
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
                        <Button onClick={onClose} sx={{ color: '#F5F5F5', borderColor: '#F5F5F5', borderRadius: 2 }}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" sx={{ bgcolor: 'white', color: '#1E1E1E', borderRadius: 2, fontWeight: 600, '&:hover': { bgcolor: 'black', color: 'white' } }}>
                            Add Album
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
            <Snackbar open={showError} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} onClose={() => setShowError(false)} autoHideDuration={3000}>
                <Alert severity="error" variant="filled" sx={{ width: '100%' }}>
                    {albumError}
                </Alert>
            </Snackbar>
        </>
    );
};

export default AddAlbumModal;
