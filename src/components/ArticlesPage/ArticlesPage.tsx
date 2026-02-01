import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Pagination,
    TextField,
    InputAdornment,
    Container,
    Skeleton
} from '@mui/material';
import { Search, LocalOffer } from '@mui/icons-material';
import axios from 'axios';
import ArticleCard from '../ArticleCard';

interface Article {
    _id: string;
    title: string;
    content: string;
    imageUrl: string;
    author: string;
    publishDate: string;
    tags: string[];
    readTime: number;
    band: {
        _id: string;
        name: string;
        logoUrl: string;
    };
}

interface ArticlesResponse {
    articles: Article[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalArticles: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

const ArticlesPage: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalArticles: 0,
        hasNext: false,
        hasPrev: false
    });

    useEffect(() => {
        fetchArticles();
    }, [currentPage, searchQuery]);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            const url = searchQuery.length >= 3
                ? `https://bandhub-backend.onrender.com/api/articles/search?q=${encodeURIComponent(searchQuery)}&page=${currentPage}&limit=9`
                : `https://bandhub-backend.onrender.com/api/articles?page=${currentPage}&limit=9`;

            const response = await axios.get<ArticlesResponse>(url);
            setArticles(response.data.articles);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const ArticleSkeleton = () => (
        <Card sx={{ height: '100%', bgcolor: '#1E1E1E', borderRadius: 3 }}>
            <Skeleton variant="rectangular" height={200} sx={{ bgcolor: '#2a2a2a' }} />
            <CardContent sx={{ p: 3 }}>
                <Skeleton variant="text" width="60%" sx={{ bgcolor: '#2a2a2a', mb: 1 }} />
                <Skeleton variant="text" width="100%" sx={{ bgcolor: '#2a2a2a', mb: 1 }} />
                <Skeleton variant="text" width="80%" sx={{ bgcolor: '#2a2a2a', mb: 2 }} />
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Skeleton variant="rounded" width={60} height={24} sx={{ bgcolor: '#2a2a2a' }} />
                    <Skeleton variant="rounded" width={50} height={24} sx={{ bgcolor: '#2a2a2a' }} />
                </Box>
                <Skeleton variant="text" width="40%" sx={{ bgcolor: '#2a2a2a' }} />
            </CardContent>
        </Card>
    );

    return (
        <Box sx={{ bgcolor: '#121212', minHeight: '100vh', py: 4 }}>
            <Container>
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography
                        variant="h2"
                        sx={{
                            color: '#F5F5F5 !important',
                            fontWeight: 800,
                            mb: 2,
                            background: 'linear-gradient(45deg, #F5F5F5, #F5F5F5)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}
                    >
                        Music Articles
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#B0B0B0', maxWidth: 600, mx: 'auto' }}>
                        Discover the latest news, reviews, and insights from the world of rock and metal
                    </Typography>
                </Box>

                {/* Search Bar */}
                <Box sx={{ maxWidth: 600, mx: 'auto', mb: 6 }}>
                    <TextField
                        fullWidth
                        placeholder="Search articles by title, content, or band name..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search sx={{ color: '#B0B0B0' }} />
                                </InputAdornment>
                            ),
                            sx: {
                                color: '#F5F5F5',
                                bgcolor: '#1E1E1E',
                                borderRadius: 3,
                                '& fieldset': { borderColor: '#2a2a2a' },
                                '&:hover fieldset': { borderColor: 'grey !important' },
                                '&.Mui-focused fieldset': { borderColor: 'grey !important' }
                            }
                        }}
                        sx={{
                            '& .MuiInputBase-input::placeholder': {
                                color: '#B0B0B0',
                                opacity: 1
                            }
                        }}
                    />
                    {searchQuery.length >= 3 && (
                        <Typography
                            variant="body2"
                            sx={{ color: '#B0B0B0', mt: 1, textAlign: 'center' }}
                        >
                            Found {pagination.totalArticles} article{pagination.totalArticles !== 1 ? 's' : ''} matching "{searchQuery}"
                        </Typography>
                    )}
                </Box>

                {/* Articles Grid */}
                <Grid container spacing={4} sx={{ mb: 6 }}>
                    {loading ? (
                        Array.from({ length: 9 }).map((_, index) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                                <ArticleSkeleton />
                            </Grid>
                        ))
                    ) : articles.length > 0 ? (
                        articles.map((article) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={article._id}>
                                <ArticleCard article={article} />
                            </Grid>
                        ))
                    ) : (
                        <Grid size={12}>
                            <Box sx={{ textAlign: 'center', py: 8 }}>
                                <LocalOffer sx={{ fontSize: 64, color: '#2a2a2a', mb: 2 }} />
                                <Typography variant="h5" sx={{ color: '#B0B0B0', mb: 1 }}>
                                    {searchQuery.length >= 3 ? 'No articles found' : 'No articles available'}
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#888' }}>
                                    {searchQuery.length >= 3
                                        ? `Try adjusting your search for "${searchQuery}"`
                                        : 'Check back later for new content'
                                    }
                                </Typography>
                            </Box>
                        </Grid>
                    )}
                </Grid>

                {/* Pagination */}
                {!loading && articles.length > 0 && pagination.totalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Pagination
                            count={pagination.totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                            size="large"
                            sx={{
                                '& .MuiPaginationItem-root': {
                                    color: '#F5F5F5',
                                    borderColor: '#2a2a2a',
                                    '&:hover': {
                                        bgcolor: 'darkgrey',
                                        borderColor: 'grey !important'
                                    },
                                    '&.Mui-selected': {
                                        bgcolor: 'grey',
                                        color: '#1E1E1E',
                                        '&:hover': { bgcolor: 'grey ' }
                                    }
                                }
                            }}
                        />
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default ArticlesPage;
