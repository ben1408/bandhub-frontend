import SongsList from './SongsList';
import './BandPage.css';
import { Card, CardContent, Typography, Collapse, CardMedia, Paper } from '@mui/material';
import type { AlbumCardProps } from '../../types';

const AlbumCard = ({ album, isOpen, onToggle }: AlbumCardProps) => (
    <Paper elevation={4} sx={{ mb: 3, bgcolor: '#1E1E1E', borderRadius: 3, boxShadow: 6, p: 2 }}>
        <Card sx={{ bgcolor: '#1E1E1E', boxShadow: 'none' }}>
            <CardContent>
                <Typography variant="h5" fontWeight={700} color="white" onClick={onToggle} sx={{ cursor: 'pointer', mb: 1, marginBottom: '25px ' }}>
                    {album.title}
                </Typography>
                {album.coverUrl && (
                    <CardMedia
                        component="img"
                        image={album.coverUrl}
                        alt={album.title + ' cover'}
                        sx={{ width: 120, borderRadius: 2, mb: 1, cursor: 'pointer', boxShadow: 3, marginBottom: '25px' }}
                        onClick={onToggle}
                    />
                )}
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                    {album.songs && <SongsList songs={album.songs} />}
                </Collapse>
            </CardContent>
        </Card>
    </Paper>
);

export default AlbumCard;
