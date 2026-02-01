import React from 'react';
import {
    Box,
    Typography,
    Container
} from '@mui/material';
import { Dashboard as DashboardIcon } from '@mui/icons-material';
import Dashboard from '../Dashboard';

const DashboardPage: React.FC = () => {
    return (
        <Box sx={{ py: 4 }}>
            <Container maxWidth="xl">
                {/* Page Header */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                        <DashboardIcon sx={{ fontSize: 48, color: 'darkgrey', mr: 2 }} />
                        <Typography
                            variant="h2"
                            sx={{
                                color: 'white',
                                fontWeight: 800,
                                background: 'white',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >
                            Admin Dashboard
                        </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ color: 'darkgrey', maxWidth: 800, mx: 'auto' }}>
                        Manage your music platform with powerful admin tools and insights
                    </Typography>
                </Box>

                {/* Dashboard Component */}
                <Dashboard />
            </Container>
        </Box>
    );
};

export default DashboardPage;
