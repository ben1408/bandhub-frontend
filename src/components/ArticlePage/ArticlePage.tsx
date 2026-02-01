import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Container,
    Chip,
    Avatar,
    Divider,
    Skeleton,
    Button
} from '@mui/material';
import { AccessTime, Person, ArrowBack, LocalOffer } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

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

const ArticlePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (id) {
            fetchArticle(id);
        }
    }, [id]);

    const fetchArticle = async (articleId: string) => {
        try {
            setLoading(true);
            setError(false);
            const response = await axios.get(`https://bandhub-backend.onrender.com/api/articles/${articleId}`);
            setArticle(response.data);
        } catch (error) {
            console.error('Error fetching article:', error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatContent = (content: string) => {
        return content.split('\n').map((paragraph, index) => (
            <Typography
                key={index}
                variant="body1"
                sx={{
                    color: '#E0E0E0',
                    lineHeight: 1.8,
                    fontSize: '1.1rem',
                    mb: paragraph.trim() ? 3 : 1,
                    textAlign: 'justify'
                }}
            >
                {paragraph}
            </Typography>
        ));
    };

    if (loading) {
        return (
            <Box sx={{ bgcolor: '#121212', minHeight: '100vh', py: 4 }}>
                <Container maxWidth="md">
                    <Skeleton variant="rectangular" height={400} sx={{ bgcolor: '#2a2a2a', borderRadius: 3, mb: 4 }} />
                    <Skeleton variant="text" width="80%" height={60} sx={{ bgcolor: '#2a2a2a', mb: 2 }} />
                    <Skeleton variant="text" width="60%" height={30} sx={{ bgcolor: '#2a2a2a', mb: 4 }} />
                    <Skeleton variant="text" width="100%" height={20} sx={{ bgcolor: '#2a2a2a', mb: 1 }} />
                    <Skeleton variant="text" width="100%" height={20} sx={{ bgcolor: '#2a2a2a', mb: 1 }} />
                    <Skeleton variant="text" width="90%" height={20} sx={{ bgcolor: '#2a2a2a' }} />
                </Container>
            </Box>
        );
    }

    if (error || !article) {
        return (
            <Box sx={{ bgcolor: '#121212', minHeight: '100vh', py: 4 }}>
                <Container maxWidth="md">
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <LocalOffer sx={{ fontSize: 64, color: '#2a2a2a', mb: 2 }} />
                        <Typography variant="h4" sx={{ color: '#B0B0B0', mb: 2 }}>
                            Article Not Found
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#888', mb: 4 }}>
                            The article you're looking for doesn't exist or has been removed.
                        </Typography>
                        <Button
                            variant="outlined"
                            onClick={() => navigate('/articles')}
                            startIcon={<ArrowBack />}
                            sx={{
                                color: '#F5F5F5',
                                borderColor: '#00BCD4',
                                '&:hover': {
                                    borderColor: '#00BCD4',
                                    bgcolor: 'rgba(0, 188, 212, 0.1)'
                                }
                            }}
                        >
                            Back to Articles
                        </Button>
                    </Box>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: '#121212', minHeight: '100vh', py: 4 }}>
            <Container maxWidth="md">
                {/* Back Button */}
                <Button
                    onClick={() => navigate('/articles')}
                    startIcon={<ArrowBack />}
                    sx={{
                        color: '#B0B0B0',
                        mb: 4,
                        textTransform: 'none',
                        '&:hover': {
                            color: '#ffffffff',
                            bgcolor: 'grey'
                        }
                    }}
                >
                    Back to Articles
                </Button>

                {/* Article Header */}
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <Avatar
                            src={article.band.logoUrl}
                            alt={article.band.name}
                            sx={{ width: 40, height: 40, }}
                        />
                        <Box>
                            <Typography variant="h6" sx={{ color: '#FF4081', fontWeight: 600, }}>
                                {article.band.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#888', marginBottom: '14px' }}>
                                {formatDate(article.publishDate)}
                            </Typography>
                        </Box>
                    </Box>

                    <Typography
                        variant="h2"
                        sx={{
                            color: '#F5F5F5',
                            fontWeight: 800,
                            mb: 3,
                            lineHeight: 1.2
                        }}
                    >
                        {article.title}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Person sx={{ color: '#B0B0B0', fontSize: '1.2rem' }} />
                            <Typography variant="body1" sx={{ color: '#B0B0B0' }}>
                                {article.author}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTime sx={{ color: '#B0B0B0', fontSize: '1.2rem' }} />
                            <Typography variant="body1" sx={{ color: '#B0B0B0' }}>
                                {article.readTime} min read
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                        {article.tags.map((tag) => (
                            <Chip
                                key={tag}
                                label={tag}
                                sx={{
                                    bgcolor: 'black',
                                    color: 'darkgrey',
                                    fontSize: '0.9rem',
                                    height: 32,
                                }}
                            />
                        ))}
                    </Box>
                </Box>

                {/* Featured Image */}
                <Box
                    sx={{
                        width: '100%',
                        height: 400,
                        borderRadius: 3,
                        overflow: 'hidden',
                        mb: 6,
                        backgroundImage: `url(${article.imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        border: '1px solid #2a2a2a'
                    }}
                />

                {/* Article Content */}
                <Box sx={{ mb: 6 }}>
                    {formatContent(article.content)}
                </Box>

                <Divider sx={{ bgcolor: '#2a2a2a', my: 6 }} />

                {/* Article Footer */}
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" sx={{ color: '#B0B0B0', mb: 2 }}>
                        Want to read more articles?
                    </Typography>
                    <Button
                        variant="outlined"
                        onClick={() => navigate('/articles')}
                        sx={{
                            color: '#F5F5F5',
                            borderColor: 'grey !important',
                            fontSize: '1rem',
                            padding: '10px 24px',
                            borderRadius: 3,
                            textTransform: 'none',
                        }}
                    >
                        Browse All Articles
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default ArticlePage;
