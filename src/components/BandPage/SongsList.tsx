import { List, ListItem, Divider, Paper } from '@mui/material';
import SongItem from './SongItem';
import type { SongsListProps } from '../../types';

const SongsList = ({ songs }: SongsListProps) => (
    <Paper elevation={2} sx={{ bgcolor: '#2a2a2aff', borderRadius: 2, mt: 1, p: 1 }}>
        <List sx={{ bgcolor: 'transparent', borderRadius: 2, '& .MuiListItem-root': { marginBottom: '10px', marginTop: '10px' } }}>
            {songs.map((song, i) => (
                <>
                    <ListItem key={i}>
                        <SongItem song={song} />
                    </ListItem>
                    {i < songs.length - 1 && <Divider />}
                </>
            ))}
        </List>
    </Paper>
);

export default SongsList;
