import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';
import type { DeleteShowModalProps } from '../../types';

const DeleteShowModal = ({ open, onClose, onConfirm, show }: DeleteShowModalProps) => {
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

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
            <DialogTitle sx={{ bgcolor: '#1E1E1E', color: '#F5F5F5', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <WarningIcon sx={{ color: '#FF3C3F' }} />
                    Confirm Deletion
                </div>
                <IconButton onClick={onClose} sx={{ color: '#F5F5F5' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ bgcolor: '#1E1E1E', p: 3, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: '#F5F5F5', mb: 2 }}>
                    Are you sure you want to delete this show?
                </Typography>
                <Typography variant="body1" sx={{ color: '#F5F5F5', mb: 1 }}>
                    <strong style={{ color: '#FF3C3F' }}>"{show.venue.name}"</strong>
                </Typography>
                <Typography variant="body2" sx={{ color: '#F5F5F5', mb: 2, opacity: 0.9 }}>
                    {formatDate(show.date)}
                </Typography>
                <Typography variant="body2" sx={{ color: '#F5F5F5', opacity: 0.8 }}>
                    This action cannot be undone. The show and its setlist will be permanently deleted.
                </Typography>
            </DialogContent>
            <DialogActions sx={{ bgcolor: '#1E1E1E', p: 2, gap: 1 }}>
                <Button
                    onClick={onClose}
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
                    onClick={onConfirm}
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
                    Yes, Delete Show
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteShowModal;
