import { Card, CardMedia, CardContent, Typography } from '@mui/material';
import React from 'react';
import './BandCard.css';
import { useNavigate } from 'react-router-dom';
import type { BandCardProps } from '../../types';

export const BandCard: React.FC<BandCardProps> = ({ name, img, logo, _id, ranking, averageListeners }) => {
    const navigate = useNavigate();
    return (
        <Card className="band-card" onClick={() => navigate(`/band/${_id}`)} sx={{ border: 'none', bgcolor: '#2a2a2aff', height: 400, paddingTop: 3, cursor: 'pointer', borderRadius: 4, boxShadow: 6, transition: 'box-shadow 0.2s, transform 0.2s', '&:hover': { boxShadow: 12, transform: 'scale(1.03)' }, position: 'relative', }}>
            {ranking && (
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    background: '#2a2a2aff',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    zIndex: 6
                }}>
                    #{ranking}
                </div>
            )}
            {averageListeners !== undefined && (
                <div style={{
                    position: 'absolute',
                    margin: 'auto',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bottom: '15px',
                    right: '15px',
                    background: '#2a2a2aff',
                    color: '#F5F5F5',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.85rem ',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 8px rgba(100, 100, 100, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 1
                }}>
                    🎵 {averageListeners >= 1000000
                        ? `${(averageListeners / 1000000).toFixed(1)}m Avg`
                        : averageListeners >= 1000
                            ? `${Math.round(averageListeners / 1000)}k Avg`
                            : `${Math.round(averageListeners)} Avg`}
                </div>
            )}
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
                <CardMedia
                    component="img"
                    className="band-logo"
                    src={logo}
                    alt={name + ' logo'}
                    sx={{ width: 150, height: 50, objectFit: 'contain', mb: 2, borderRadius: 2, }}
                />
                <CardMedia
                    component="img"
                    className="band-photo"
                    src={img}
                    alt={name + ' photo'}
                    sx={{ width: 300, height: 210, objectFit: 'cover', borderRadius: 3, mb: 2, boxShadow: 2 }}
                />
                <Typography variant="h5" fontWeight={700} sx={{ mt: 1, color: '#F5F5F5 !important' }}>{name}</Typography>
            </CardContent>
        </Card>
    );
};