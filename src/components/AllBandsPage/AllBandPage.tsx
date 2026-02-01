import { useState, useEffect } from 'react'
import './AllBandPage.css'
import { AllBandCard } from './AllBandCard';
import { useBandPage } from '../../context/BandPageContext';
import type { Band } from '../../types';
import axios from 'axios';
import { Typography, TextField, Box } from '@mui/material';

export const AllBandPage = () => {
    const [allBands, setAllBands] = useState<Band[]>([]);
    const [filteredBands, setFilteredBands] = useState<Band[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const { setIsOnBandPage } = useBandPage();

    useEffect(() => {
        setIsOnBandPage(false);
        fetchAllBands();
    }, [setIsOnBandPage]);

    useEffect(() => {
        // Filter bands based on search query
        if (searchQuery.length >= 2) {
            const filtered = allBands.filter(band =>
                band.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                band.genre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                band.description?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredBands(filtered);
        } else {
            setFilteredBands(allBands);
        }
    }, [searchQuery, allBands]);

    const fetchAllBands = async () => {
        try {
            const response = await axios.get('https://bandhub-backend.onrender.com/api/bands');
            if (response.data && Array.isArray(response.data)) {
                setAllBands(response.data);
                setFilteredBands(response.data); // Initialize filtered bands
            }
        } catch (error) {
            console.error('Error fetching bands:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    return (
        <div className="all-bands-container">
            <Typography variant="h3" className="all-bands-title" style={{ marginBottom: '30px', marginTop: '10px' }} sx={{ color: 'white !important' }}>
                All Bands
            </Typography>
            <Box sx={{ width: 450, margin: '0 auto 40px auto', px: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search bands (minimum 2 characters)"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            color: '#F5F5F5',
                            bgcolor: '#1E1E1E',
                            borderRadius: 3,
                            '& fieldset': {
                                borderColor: '#948f8fff',
                                borderWidth: 2
                            },
                            '&:hover fieldset': {
                                borderColor: 'white'
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'white',
                                borderWidth: 2
                            }
                        },
                        '& .MuiInputBase-input::placeholder': {
                            color: '#B0B0B0',
                            opacity: 1
                        }
                    }}
                />
                {searchQuery.length >= 3 && (
                    <Typography
                        variant="body2"
                        sx={{
                            color: '#B0B0B0',
                            mt: 1,
                            textAlign: 'center',
                            fontSize: '0.875rem'
                        }}
                    >
                        Found {filteredBands.length} band{filteredBands.length !== 1 ? 's' : ''} matching "{searchQuery}"
                    </Typography>
                )}
            </Box>


            {loading ? (
                <Typography className="loading-text">
                    Loading bands...
                </Typography>
            ) : (
                <div className="all-bands-grid" style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', margin: "auto", gap: '60px', flexWrap: 'wrap' }}>
                    {filteredBands.map((band) => (
                        <AllBandCard
                            key={band._id}
                            name={band.name}
                            img={band.bandPhotoUrl}
                            logo={band.logoUrl}
                            _id={band._id}
                        />
                    ))}
                    {filteredBands.length === 0 && searchQuery.length >= 3 && (
                        <Typography
                            variant="h6"
                            sx={{
                                color: '#B0B0B0',
                                textAlign: 'center',
                                fontStyle: 'italic',
                                width: '100%',
                                mt: 4
                            }}
                        >
                            No bands found matching "{searchQuery}"
                        </Typography>
                    )}
                </div>
            )}
        </div>
    )
}