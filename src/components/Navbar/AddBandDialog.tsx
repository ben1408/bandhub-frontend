import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Box, Typography, Stack, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import type { AddBandDialogProps } from '../../types';

const AddBandDialog: React.FC<AddBandDialogProps> = ({
    open,
    onClose,
    formData,
    members,
    setMembers,
    memberForm,
    setMemberForm,
    handleFormChange,
    handleMemberChange,
    handleFormSubmit,
    bandError,
    showError,
    setShowError,
    removeMember
}) => {
    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogTitle sx={{ bgcolor: '#2a2a2aff', color: 'white', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between', }}>
                    Add New Band
                    <IconButton onClick={onClose} sx={{ color: '#bfc9d1' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <form onSubmit={handleFormSubmit}>
                    <DialogContent sx={{ bgcolor: '#1E1E1E', display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '50vh', overflowX: 'hidden', }}>
                        {/* Band Fields */}
                        <TextField
                            label="Band Name"
                            name="name"
                            value={formData.name}
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
                            label="Logo URL"
                            name="logoUrl"
                            value={formData.logoUrl}
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
                        <TextField
                            label="Band Photo URL"
                            name="bandPhotoUrl"
                            value={formData.bandPhotoUrl}
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
                        <TextField
                            label="Genre"
                            name="genre"
                            value={formData.genre}
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
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleFormChange}
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
                        {/* Add Member Section */}
                        <Box sx={{ mt: 3, bgcolor: '#1E1E1E', borderRadius: 2, p: 2, border: '1px solid grey', width: '92%', margin: 'auto', padding: "20px", paddingBottom: "20px" }}>
                            <Typography variant="subtitle1" color="#00BCD4" fontWeight={600} sx={{ mb: 1 }}>
                                Add Band Members
                            </Typography>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                                <TextField
                                    label="Name"
                                    name="name"
                                    type="text"
                                    value={memberForm.name}
                                    onChange={handleMemberChange}
                                    required={members.length === 0 && memberForm.name.trim() === ''}
                                    sx={{
                                        input: { color: '#F5F5F5' },
                                        label: { color: '#F5F5F5' },
                                        '& .MuiInputLabel-root': { color: '#F5F5F5' },
                                        '& .MuiInputLabel-root.Mui-focused': { color: '#F5F5F5' },
                                        minWidth: 120,
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
                                    label="Instrument"
                                    name="instrument"
                                    type="text"
                                    value={memberForm.instrument}
                                    onChange={handleMemberChange}
                                    required={members.length === 0 && memberForm.instrument.trim() === ''}
                                    sx={{
                                        input: { color: '#F5F5F5' },
                                        label: { color: '#F5F5F5' },
                                        '& .MuiInputLabel-root': { color: '#F5F5F5' },
                                        '& .MuiInputLabel-root.Mui-focused': { color: '#F5F5F5' },
                                        minWidth: 120,
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
                                <Button type="button" variant="outlined" className='add-member-button' sx={{ color: '#ffffffff', borderColor: 'grey !important', fontWeight: 200, borderRadius: 2, padding: '1px', width: '150px', height: '60px', fontSize: '14px !important', '&:hover': { borderColor: 'grey', color: 'white' } }} onClick={() => {
                                    if (memberForm.name.trim() && memberForm.instrument.trim()) {
                                        setMembers([...members, { ...memberForm }]);
                                        setMemberForm({ name: '', instrument: '' });
                                    }
                                }}>
                                    Add Member
                                </Button>
                            </Stack>
                            <Stack spacing={1} sx={{ mt: 2 }}>
                                {members.map((m, i) => (
                                    <Box key={i} sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        bgcolor: '#2a2a2a',
                                        p: 1.5,
                                        borderRadius: 1,
                                        border: '1px solid #404040'
                                    }}>
                                        <Typography variant="body2" color="#F5F5F5" sx={{ fontSize: "15px !important" }}>
                                            {m.name} <span style={{ color: '#f5f5f59c' }}>({m.instrument})</span>
                                        </Typography>
                                        <Button
                                            onClick={() => removeMember(i)}
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
                        <Button type="submit" variant="contained" sx={{ bgcolor: 'white', color: '#1E1E1E', borderRadius: 2, fontWeight: 600, '&:hover': { bgcolor: '#000000ff', color: 'white' } }}>
                            Add Band
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
            <Snackbar open={showError} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} onClose={() => setShowError(false)} autoHideDuration={3000}>
                <Alert severity="error" variant="filled" sx={{ width: '100%' }}>
                    {bandError}
                </Alert>
            </Snackbar>
        </>
    );
}

export default AddBandDialog;
