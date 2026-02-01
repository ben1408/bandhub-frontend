import { Card, CardMedia, CardContent, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { AllBandCardProps } from '../../types';

export const AllBandCard: React.FC<AllBandCardProps> = ({ name, img, logo, _id }) => {
    const navigate = useNavigate();
    return (
        <Card
            className="band-card"
            onClick={() => navigate(`/band/${_id}`)}
            sx={{
                border: 'none',
                bgcolor: '#2a2a2aff',
                height: 400,
                paddingTop: 3,
                cursor: 'pointer',
                borderRadius: 4,
                boxShadow: 12,
                transition: 'box-shadow 0.2s, transform 0.2s',
                '&:hover': {
                    boxShadow: 12,
                    transform: 'scale(1.03)',
                },
                position: 'relative'
            }}
        >
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
                <CardMedia
                    component="img"
                    className="band-logo"
                    src={logo}
                    alt={name + ' logo'}
                    sx={{ width: 150, height: 50, objectFit: 'contain', marginBottom: 3.2, borderRadius: 2, }}
                />
                <CardMedia
                    component="img"
                    className="band-photo"
                    src={img}
                    alt={name + ' photo'}
                    sx={{ width: 300, height: 210, objectFit: 'cover', borderRadius: 3, mb: 4, boxShadow: 2 }}
                />
                <Typography variant="h5" fontWeight={700} sx={{ color: '#F5F5F5 !important' }}>{name}</Typography>
            </CardContent>
        </Card>
    );
};
