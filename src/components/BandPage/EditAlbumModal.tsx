import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Box, Typography, Stack, Button, Snackbar, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import type { Song, EditAlbumModalProps } from '../../types';

const EditAlbumModal = ({ open, album, onClose, onAlbumUpdated, bandId }: EditAlbumModalProps) => {
    const [formData, setFormData] = useState({
        title: album.title,
        releaseDate: album.releaseDate ? (typeof album.releaseDate === 'string' ? album.releaseDate.slice(0, 10) : album.releaseDate.toISOString().slice(0, 10)) : '',
        coverUrl: album.coverUrl || ''
    });
    const [songForms, setSongForms] = useState<Song[]>(album.songs ? album.songs.map(s => ({ ...s })) : []);
    const [showError, setShowError] = useState(false);
    const [albumError, setAlbumError] = useState('');

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSongChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const updated = [...songForms];
        const { name, value } = e.target;
        if (name === 'duration' || name === 'listens') {
            (updated[index] as any)[name] = Number(value);
        } else {
            (updated[index] as any)[name] = value;
        }
        setSongForms(updated);
    };
    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (songForms.length < 2) {
            setAlbumError('An album must have at least 2 songs.');
            setShowError(true);
            return;
        }
        const token = localStorage.getItem('token');
        const updatedAlbum = {
            ...formData,
            releaseDate: new Date(formData.releaseDate),
            songs: songForms,
        };
        try {
            await axios.put(`https://bandhub-backend.onrender.com/api/bands/${bandId}/albums/${album._id}`, updatedAlbum, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            onAlbumUpdated();
            onClose();
        } catch (err: any) {
            setAlbumError(err?.response?.data?.message || 'Failed to update album.');
            setShowError(true);
        }
    };
    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ bgcolor: '#1E1E1E', color: '#F5F5F5', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between', }}>
                    Edit Album
                    <IconButton onClick={onClose} sx={{ color: '#F5F5F5' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <form onSubmit={handleFormSubmit}>
                    <DialogContent sx={{ bgcolor: '#1E1E1E', display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '60vh', overflowX: 'hidden', }}>
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
                        <Box sx={{ mt: 3, bgcolor: '#1E1E1E', borderRadius: 2, p: 2, border: '1px solid #2a2a2aff', width: '95%', margin: 'auto', padding: "20px", paddingBottom: "20px" }}>
                            <Typography variant="subtitle1" color="white" fontWeight={600} sx={{ mb: 3 }}>
                                Edit Songs
                            </Typography>
                            <Stack spacing={2}>
                                {songForms.map((song, i) => (
                                    <Stack key={i} direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                                        <TextField
                                            label="Title"
                                            name="title"
                                            value={song.title}
                                            onChange={e => handleSongChange(i, e as React.ChangeEvent<HTMLInputElement>)}
                                            required
                                            sx={{
                                                input: { color: '#F5F5F5' },
                                                label: { color: '#F5F5F5' },
                                                minWidth: 120,
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
                                            label="Duration (Sec)"
                                            name="duration"
                                            type="number"
                                            inputProps={{ min: 0, style: { MozAppearance: 'textfield' } }}
                                            value={song.duration}
                                            onChange={e => handleSongChange(i, e as React.ChangeEvent<HTMLInputElement>)}
                                            required
                                            sx={{
                                                input: { color: '#F5F5F5' },
                                                label: { color: '#F5F5F5' },
                                                minWidth: 120,
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
                                            label="Listens"
                                            name="listens"
                                            type="number"
                                            inputProps={{ min: 0, style: { MozAppearance: 'textfield' } }}
                                            value={song.listens}
                                            onChange={e => handleSongChange(i, e as React.ChangeEvent<HTMLInputElement>)}
                                            required
                                            sx={{
                                                input: { color: '#F5F5F5' },
                                                label: { color: '#F5F5F5' },
                                                minWidth: 120,
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
                                    </Stack>
                                ))}
                            </Stack>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ bgcolor: '#1E1E1E', p: 2 }}>
                        <Button onClick={onClose} sx={{ color: '#F5F5F5', borderColor: '#F5F5F5', borderRadius: 2 }}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" sx={{ bgcolor: 'grey', color: 'white', borderRadius: 2, fontWeight: 600, '&:hover': { bgcolor: 'black' } }}>
                            Save Changes
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

export default EditAlbumModal;
