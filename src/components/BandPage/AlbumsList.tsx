import AlbumCard from './AlbumCard';
import { Box, Button } from '@mui/material';
import type { AlbumsListProps } from '../../types';

const AlbumsList = ({ albums, openAlbumIndex, setOpenAlbumIndex, onEditAlbum, isAdmin, isLogged }: AlbumsListProps) => (
    <Box sx={{ mt: 3, mb: 2 }}>
        {albums.map((album, index) => (
            <div key={index} style={{ position: 'relative' }}>
                <AlbumCard
                    album={album}
                    isOpen={openAlbumIndex === index}
                    onToggle={() => setOpenAlbumIndex(openAlbumIndex === index ? null : index)}
                />
                {onEditAlbum && isAdmin && isLogged && (
                    <Button
                        variant="outlined"
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            zIndex: 2,
                            color: 'white !important',
                            borderColor: 'grey !important',
                            fontWeight: 600,
                            borderRadius: 2,
                            px: 2,
                            py: 0.5,
                            background: 'rgba(35,38,47,0.95)',
                            marginRight: 1.5,
                            marginTop: 1.5,
                        }}
                        onClick={() => onEditAlbum(index)}
                    >
                        Edit
                    </Button>
                )}
            </div>
        ))}
    </Box>
);

export default AlbumsList;
