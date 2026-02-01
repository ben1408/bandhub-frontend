import { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useBandPage } from '../../context/BandPageContext';
import PosterGenerator from '../PosterGenerator/PosterGenerator';

const HamburgerMenu = ({ onAccount, onDashboard }: { onAccount: () => void; onDashboard?: () => void }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [posterGeneratorOpen, setPosterGeneratorOpen] = useState(false);
    const { bandPageActions } = useBandPage();
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const userRole = localStorage.getItem('userRole') || 'fan';
    const isModerator = userRole === 'moderator' || userRole === 'admin';

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };



    return (
        <>
            <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMenuOpen}
                sx={{ color: 'white' }}
            >
                <MenuIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                sx={{
                    '& .MuiPaper-root': {
                        bgcolor: '#2a2a2aff',
                        border: '1px solid #ffffffff',
                        borderRadius: 2,
                    },
                }}
            >

                <MenuItem onClick={() => { onAccount(); handleMenuClose(); }} sx={{ color: 'white', fontWeight: 600, '&:hover': { bgcolor: '#353535ff' } }}>
                    Account Settings
                </MenuItem>

                {isModerator && (
                    <MenuItem onClick={() => { setPosterGeneratorOpen(true); handleMenuClose(); }} sx={{ color: 'white', fontWeight: 600, '&:hover': { bgcolor: '#353535ff' } }}>
                        AI Poster Generator
                    </MenuItem>
                )}

                {isAdmin && onDashboard && (
                    <MenuItem onClick={() => { onDashboard(); handleMenuClose(); }} sx={{ color: 'white', fontWeight: 600, '&:hover': { bgcolor: '#353535ff' } }}>
                        Dashboard
                    </MenuItem>
                )}
                {bandPageActions && (
                    <>
                        <MenuItem onClick={() => { bandPageActions.onAddAlbum(); handleMenuClose(); }} sx={{ color: 'white', fontWeight: 600, '&:hover': { bgcolor: '#2a2d36' } }}>
                            Add Album
                        </MenuItem>
                        <MenuItem onClick={() => { bandPageActions.onAddShow(); handleMenuClose(); }} sx={{ color: 'white', fontWeight: 600, '&:hover': { bgcolor: '#2a2d36' } }}>
                            Add Show
                        </MenuItem>
                        <MenuItem onClick={() => { bandPageActions.onEditBand(); handleMenuClose(); }} sx={{ color: 'white', fontWeight: 600, '&:hover': { bgcolor: '#2a2d36' } }}>
                            Edit Band
                        </MenuItem>
                        <MenuItem onClick={() => { bandPageActions.onDeleteBand(); handleMenuClose(); }} sx={{ color: 'white', fontWeight: 600, backgroundColor: '#FF3C3F', '&:hover': { bgcolor: '#FF3C3F' } }}>
                            Delete Band
                        </MenuItem>
                    </>
                )}
            </Menu>

            <PosterGenerator
                open={posterGeneratorOpen}
                onClose={() => setPosterGeneratorOpen(false)}
            />
        </>
    );
};

export default HamburgerMenu;
