import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './BandPage.css';
import AlbumsList from './AlbumsList';
import ShowsList from './ShowsList';
import AddAlbumModal from './AddAlbumModal';
import AddShowModal from './AddShowModal';
import EditBandModal from './EditBandModal';
import EditAlbumModal from './EditAlbumModal';
import EditShowModal from './EditShowModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import DeleteShowModal from './DeleteShowModal';
import { useAuth } from '../../context/AuthContext';
import { useBandPage } from '../../context/BandPageContext';
import { Container, Paper, Typography, Box, Avatar, Stack } from '@mui/material';
import axios from 'axios';
import type { Band, Album } from '../../types';

const BandPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [band, setBand] = useState<Band | null>(null);
    const [loading, setLoading] = useState(true);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [shows, setShows] = useState<any[]>([]);
    const [openAlbumIndex, setOpenAlbumIndex] = useState<number | null>(null);
    const [editAlbumIndex, setEditAlbumIndex] = useState<number | null>(null);
    const [editShowIndex, setEditShowIndex] = useState<number | null>(null);
    const [deleteShowIndex, setDeleteShowIndex] = useState<number | null>(null);
    const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true');
    const [showForm, setShowForm] = useState(false);
    const [showAddShow, setShowAddShow] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const { isLogged } = useAuth();
    const { setBandPageActions, setIsOnBandPage } = useBandPage();

    useEffect(() => {
        fetch(`https://bandhub-backend.onrender.com/api/bands/${id}`)
            .then(res => res.json())
            .then(data => {
                setBand(data);
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        const fetchAlbums = async () => {
            const res = await fetch(`https://bandhub-backend.onrender.com/api/bands/${id}/albums`);
            const data = await res.json();
            setAlbums(data);
        };
        fetchAlbums();
    }, [id]);

    useEffect(() => {
        const fetchShows = async () => {
            const res = await fetch(`https://bandhub-backend.onrender.com/api/shows/band/${id}`);
            const data = await res.json();
            setShows(data);
        };
        fetchShows();
    }, [id]);

    useEffect(() => {
        // Set band page actions for the navbar
        setIsOnBandPage(true);
        if (isLogged && isAdmin) {
            setBandPageActions({
                onEditBand: () => setShowEdit(true),
                onAddAlbum: () => setShowForm(true),
                onAddShow: () => setShowAddShow(true),
                onDeleteBand: () => setShowDeleteConfirm(true)
            });
        }

        // Clean up when component unmounts
        return () => {
            setBandPageActions(null);
            setIsOnBandPage(false);
        };
    }, [isLogged, isAdmin, setBandPageActions, setIsOnBandPage]);

    useEffect(() => {
        const handleStorage = () => {
            setIsAdmin(localStorage.getItem('isAdmin') === 'true');
        };
        window.addEventListener('storage', handleStorage);
        const interval = setInterval(() => {
            setIsAdmin(localStorage.getItem('isAdmin') === 'true');
        }, 500);
        return () => {
            window.removeEventListener('storage', handleStorage);
            clearInterval(interval);
        };
    }, []);

    const handleEditShow = (index: number) => {
        setEditShowIndex(index);
    };

    const handleDeleteShow = (index: number) => {
        setDeleteShowIndex(index);
    };

    const confirmDeleteShow = async () => {
        if (deleteShowIndex !== null && shows[deleteShowIndex]) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`https://bandhub-backend.onrender.com/api/shows/${shows[deleteShowIndex]._id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                // Refresh shows list
                const response = await fetch(`https://bandhub-backend.onrender.com/api/shows/band/${id}`);
                const data = await response.json();
                setShows(data);
                setDeleteShowIndex(null);
            } catch (error) {
                console.error('Error deleting show:', error);
                setDeleteShowIndex(null);
            }
        }
    };

    const confirmDeleteBand = async () => {
        const token = localStorage.getItem('token');
        await fetch(`https://bandhub-backend.onrender.com/api/bands/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        setShowDeleteConfirm(false);
        navigate('/');
    }


    if (loading) return <div style={{ color: '#F5F5F5', padding: '2rem' }}>Loading...</div>;
    if (!band) return <div style={{ color: '#F5F5F5', padding: '2rem' }}>Band not found.</div>;

    return (
        <Container sx={{ py: 4, width: '79%' }}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 4, bgcolor: '#2a2a2aff' }}>
                <Stack spacing={2} alignItems="center">
                    <Avatar src={band.logoUrl} alt={band.name + ' logo'} sx={{ width: 250, height: 70, borderRadius: 2, marginBottom: '20px !important' }} imgProps={{ style: { objectFit: 'contain' } }} />
                    {band.bandPhotoUrl && (
                        <Avatar className='band-page-photo' src={band.bandPhotoUrl} alt={band.name + ' photo'} sx={{ width: '90%', height: '350px', mb: 2, borderRadius: 1, }} imgProps={{ style: { objectFit: 'contain' } }} />
                    )}
                    <div style={{ width: '95%', textAlign: 'start', marginTop: '50px', backgroundColor: '#1E1E1E', padding: '20px', borderRadius: 18, marginBottom: '20px' }}>
                        <Typography variant="h3" fontWeight={700} sx={{ color: '#F5F5F5 !important', marginBottom: '30px !important', marginTop: '5px !important', textAlign: 'center' }} gutterBottom>This Is {band.name}: </Typography>
                        <Typography variant="subtitle1" sx={{ color: '#F5F5F5', marginBottom: '5px' }}><strong style={{ color: '#ffffffff' }}>Genre:</strong> {band.genre}</Typography>
                        <Typography variant="body1" sx={{ color: '#F5F5F5', marginBottom: '5px' }}><strong style={{ color: '#ffffffff' }}>Description:</strong> {band.description}</Typography>
                        <Typography variant="body1" sx={{ color: '#F5F5F5', marginBottom: '10px' }}><strong style={{ color: '#ffffffff' }}>Members:</strong> {band.members?.map(member => `${member.name} (${member.instrument})`).join(', ')}</Typography>
                    </div>
                    <Box width="100%">
                        <AlbumsList albums={albums} openAlbumIndex={openAlbumIndex} setOpenAlbumIndex={setOpenAlbumIndex} onEditAlbum={setEditAlbumIndex} isAdmin={isAdmin} isLogged={isLogged} />
                    </Box>

                    <Box width="100%" sx={{ mt: 4 }}>
                        <ShowsList
                            shows={shows}
                            onEditShow={handleEditShow}
                            onDeleteShow={handleDeleteShow}
                            isAdmin={isAdmin}
                            isLogged={isLogged}
                        />
                    </Box>
                    {isLogged && isAdmin && showForm && (
                        <AddAlbumModal bandId={id as string} onClose={() => setShowForm(false)} onAlbumAdded={() => {
                            fetch(`https://bandhub-backend.onrender.com/api/bands/${id}/albums`).then(res => res.json()).then(setAlbums);
                        }} />
                    )}
                    {isLogged && isAdmin && showAddShow && (
                        <AddShowModal bandId={id as string} onClose={() => setShowAddShow(false)} onShowAdded={() => {
                            fetch(`https://bandhub-backend.onrender.com/api/shows/band/${id}`).then(res => res.json()).then(setShows);
                        }} />
                    )}
                    {isLogged && isAdmin && showEdit && band && (
                        <EditBandModal
                            open={showEdit}
                            band={band}
                            onClose={() => setShowEdit(false)}
                            onSave={async (updated) => {
                                const token = localStorage.getItem('token');
                                await axios.put(`https://bandhub-backend.onrender.com/api/bands/${id}`, updated, {
                                    headers: { 'Authorization': `Bearer ${token}` }
                                });
                                setShowEdit(false);
                                // Refresh band info
                                const res = await fetch(`https://bandhub-backend.onrender.com/api/bands/${id}`);
                                const data = await res.json();
                                setBand(data);
                            }}
                        />
                    )}
                    {isLogged && isAdmin && editAlbumIndex !== null && albums[editAlbumIndex] && (
                        <EditAlbumModal
                            open={editAlbumIndex !== null}
                            album={{
                                ...albums[editAlbumIndex],
                                releaseDate: albums[editAlbumIndex].releaseDate instanceof Date ? albums[editAlbumIndex].releaseDate.toISOString() : albums[editAlbumIndex].releaseDate,
                                songs: albums[editAlbumIndex].songs || []
                            }}
                            bandId={id as string}
                            onClose={() => setEditAlbumIndex(null)}
                            onAlbumUpdated={() => {
                                fetch(`https://bandhub-backend.onrender.com/api/bands/${id}/albums`).then(res => res.json()).then(setAlbums);
                                setEditAlbumIndex(null);
                            }}
                        />
                    )}
                    {isLogged && isAdmin && editShowIndex !== null && shows[editShowIndex] && (
                        <EditShowModal
                            open={editShowIndex !== null}
                            show={shows[editShowIndex]}
                            bandId={id as string}
                            onClose={() => setEditShowIndex(null)}
                            onShowUpdated={() => {
                                fetch(`https://bandhub-backend.onrender.com/api/shows/band/${id}`).then(res => res.json()).then(setShows);
                                setEditShowIndex(null);
                            }}
                        />
                    )}
                </Stack>
            </Paper>

            <DeleteShowModal
                open={deleteShowIndex !== null}
                onClose={() => setDeleteShowIndex(null)}
                onConfirm={confirmDeleteShow}
                show={deleteShowIndex !== null && shows[deleteShowIndex] ? shows[deleteShowIndex] : { venue: { name: '', location: '' }, date: '', setlist: [], ticketsPrice: 0, ticketsSold: 0, _id: '' }}
            />

            <DeleteConfirmationModal
                open={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDeleteBand}
                bandName={band?.name || ''}
            />
        </Container>
    );
};

export default BandPage;
