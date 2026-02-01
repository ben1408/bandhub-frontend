import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Chip,
    Avatar,
    Divider
} from '@mui/material';
import { AccessTime, Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

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

interface ArticleCardProps {
    article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
    const navigate = useNavigate();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getExcerpt = (content: string, maxLength: number = 150) => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength).trim() + '...';
    };

    return (
        <Card
            onClick={() => navigate(`/article/${article._id}`)}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#1E1E1E',
                borderRadius: 3,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                border: '1px solid #2a2a2a',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
                    borderColor: 'grey !important'
                }
            }}
        >
            <CardMedia
                component="img"
                height="200"
                image={article.imageUrl}
                alt={article.title}
                sx={{
                    objectFit: 'cover',
                    background: 'linear-gradient(45deg, #1E1E1E, #2a2a2a)'
                }}
            />
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Avatar
                        src={article.band.logoUrl}
                        alt={article.band.name}
                        sx={{ width: 24, height: 24, marginTop: '14px ' }}
                    />
                    <Typography variant="body2" sx={{ color: '#FF4081', fontWeight: 600 }}>
                        {article.band.name}
                    </Typography>
                </Box>

                <Typography
                    variant="h6"
                    sx={{
                        color: '#F5F5F5',
                        fontWeight: 700,
                        mb: 1,
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}
                >
                    {article.title}
                </Typography>

                <Typography
                    variant="body2"
                    sx={{
                        color: '#B0B0B0',
                        mb: 2,
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}
                >
                    {getExcerpt(article.content)}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    {article.tags.slice(0, 3).map((tag) => (
                        <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            sx={{
                                bgcolor: 'black',
                                color: 'darkgrey',
                                fontSize: '0.7rem',
                                height: 24,
                                '&:hover': { bgcolor: 'black ' }
                            }}
                        />
                    ))}
                </Box>

                <Divider sx={{ bgcolor: '#2a2a2a', my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Person sx={{ color: '#B0B0B0', fontSize: '1rem' }} />
                        <Typography variant="body2" sx={{ color: '#B0B0B0', fontSize: '0.8rem' }}>
                            {article.author}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTime sx={{ color: '#B0B0B0', fontSize: '1rem' }} />
                        <Typography variant="body2" sx={{ color: '#B0B0B0', fontSize: '0.8rem' }}>
                            {article.readTime} min read
                        </Typography>
                    </Box>
                </Box>

                <Typography variant="body2" sx={{ color: '#888', fontSize: '0.75rem', mt: 1 }}>
                    {formatDate(article.publishDate)}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default ArticleCard;
