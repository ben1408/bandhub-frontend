import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { EditBandModalProps } from '../../types';

const EditBandModal = ({ open, band, onClose, onSave }: EditBandModalProps) => {
    const [form, setForm] = useState({ ...band });

    // Update form when band prop changes
    // (in case modal is opened for a different band)
    useEffect(() => {
        setForm({ ...band });
    }, [band]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(form);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ bgcolor: '#1E1E1E', color: '#F5F5F5', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                Edit Band
                <IconButton onClick={onClose} sx={{ color: '#F5F5F5' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent sx={{ bgcolor: '#1E1E1E', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Band Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
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
                        label="Logo URL"
                        name="logoUrl"
                        value={form.logoUrl}
                        onChange={handleChange}
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
                        label="Band Photo URL"
                        name="bandPhotoUrl"
                        value={form.bandPhotoUrl || ''}
                        onChange={handleChange}
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
                        label="Genre"
                        name="genre"
                        value={form.genre || ''}
                        onChange={handleChange}
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
                        label="Description"
                        name="description"
                        value={form.description || ''}
                        onChange={handleChange}
                        multiline
                        minRows={2}
                        fullWidth
                        sx={{
                            input: { color: '#F5F5F5' },
                            label: { color: '#F5F5F5' },
                            '& .MuiInputLabel-root': { color: '#F5F5F5' },
                            '& .MuiInputLabel-root.Mui-focused': { color: '#F5F5F5' },
                            '& .MuiInputBase-inputMultiline': { color: '#F5F5F5' },
                            '& .MuiOutlinedInput-root': {
                                '& textarea': {
                                    color: '#F5F5F5'
                                },
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
                </DialogContent>
                <DialogActions sx={{ bgcolor: '#1E1E1E', p: 2 }}>
                    <Button onClick={onClose} sx={{ color: '#F5F5F5', borderColor: '#F5F5F5', borderRadius: 2 }}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" sx={{ bgcolor: 'white', color: '#1E1E1E', borderRadius: 2, fontWeight: 600, '&:hover': { bgcolor: 'black', color: 'white' } }}>
                        Save Changes
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default EditBandModal;
