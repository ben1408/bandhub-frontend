import { useState, useEffect } from 'react'
import './Home.css'
import { BandCard } from '../BandCard/BandCard';
import { useBandPage } from '../../context/BandPageContext';
import type { Band } from '../../types';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const Home = ({ isAddedBand }: { isAddedBand: boolean }) => {
    const [topBands, setTopBands] = useState<Band[]>([]);
    const [loading, setLoading] = useState(true);
    const { setIsOnBandPage } = useBandPage();
    const navigate = useNavigate();

    useEffect(() => {
        // Set that we're on home page, not band page
        setIsOnBandPage(false);

        const fetchTopBands = async () => {
            try {
                setLoading(true);

                // NEW: Single API call to get top 5 bands with calculated averages
                const response = await fetch('https://bandhub-backend.onrender.com/api/bands/top');
                const topBandsData = await response.json();

                setTopBands(topBandsData);
            } catch (error) {
                console.error('Error fetching top bands:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchTopBands();
    }, [isAddedBand, setIsOnBandPage])

    return (
        <div className="home">
            <h1 id='home-title' style={{ color: '#F5F5F5 ' }}>These Are Our Top 5 Bands</h1>

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Button
                    variant="outlined"
                    onClick={() => navigate('/allbandpage')}
                    sx={{
                        color: '#F5F5F5 !important',
                        borderColor: 'grey !important',
                        fontWeight: 600,
                        fontSize: '1rem',
                        padding: '10px 24px',
                        borderRadius: 3,
                        textTransform: 'none',
                        background: 'rgba(30,30,30,0.7)',
                        backdropFilter: 'blur(4px)',
                        transition: 'all 0.3s ease',
                        marginRight: '1rem',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 20px grey'
                        }
                    }}
                >
                    View All Bands
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => navigate('/articles')}
                    sx={{
                        color: '#F5F5F5 !important',
                        borderColor: 'grey !important',
                        fontWeight: 600,
                        fontSize: '1rem',
                        padding: '10px 24px',
                        borderRadius: 3,
                        textTransform: 'none',
                        background: 'rgba(30,30,30,0.7)',
                        backdropFilter: 'blur(4px)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 20px grey'
                        }
                    }}
                >
                    Articles
                </Button>
            </div>

            {loading ? (
                <div style={{ color: '#F5F5F5', textAlign: 'center', padding: '2rem' }}>
                    Loading top bands...
                </div>
            ) : (
                <div className="bands-grid" style={{ justifyContent: "center", alignItems: "center", display: "flex", flexWrap: "wrap" }}>
                    {topBands.map((band, index) => (
                        <BandCard
                            key={band._id}
                            name={band.name}
                            img={band.bandPhotoUrl}
                            logo={band.logoUrl}
                            _id={band._id}
                            ranking={index + 1}
                            averageListeners={band.averageListeners}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}