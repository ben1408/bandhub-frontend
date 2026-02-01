import { ListItemText } from '@mui/material';
import type { SongItemProps } from '../../types';

const SongItem = ({ song }: SongItemProps) => {
    const formatListens = (listens: number) => {
        if (listens >= 1000000) {
            return `${(listens / 1000000).toFixed(1)}m`;
        } else if (listens >= 1000) {
            return `${Math.round(listens / 1000)}k`;
        } else {
            return `${listens}`;
        }
    };

    return (
        <ListItemText
            primary={<strong style={{ color: 'white', fontWeight: 700, }}> ○ {song.title}</strong>}
            secondary={<span style={{ color: '#bfc9d1' }}> {`${Math.floor(song.duration / 60)}m long / ${formatListens(song.listens)} listens`}</span>}
            primaryTypographyProps={{ sx: { fontWeight: 700, fontSize: '1.1rem' } }}
            secondaryTypographyProps={{ sx: { fontWeight: 500, fontSize: '0.95rem' } }}
        />
    );
};

export default SongItem;
