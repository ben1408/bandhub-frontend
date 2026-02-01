// Core domain types
export interface Song {
    title: string;
    duration: number;
    listens: number;
}

export interface Album {
    _id: string;
    title: string;
    releaseDate: Date | string;
    coverUrl?: string;
    songs?: Song[];
}

export interface Member {
    name: string;
    instrument: string;
}

export interface Band {
    id?: number;
    _id: string;
    name: string;
    logoUrl: string;
    bandPhotoUrl: string;
    genre?: string;
    description?: string;
    members?: Member[];
    albums?: Album[];
    createdAt?: Date;
    averageListeners?: number;
}

export interface Venue {
    _id: string;
    name: string;
    location: string;
}

export interface Show {
    _id: string;
    venue: Venue;
    date: string;
    setlist: string[];
    ticketsPrice: number;
    ticketsSold: number;
}

// Component Props Types
export interface BandCardProps {
    name: string;
    logo: string;
    img: string;
    _id: string;
    ranking?: number;
    averageListeners?: number;
}

export interface AllBandCardProps {
    name: string;
    logo: string;
    img: string;
    _id: string;
}

export interface AlbumsListProps {
    albums: Album[];
    openAlbumIndex: number | null;
    setOpenAlbumIndex: (idx: number | null) => void;
    onEditAlbum?: (idx: number) => void;
    isAdmin?: boolean;
    isLogged?: boolean;
}

export interface AlbumCardProps {
    album: Album;
    isOpen: boolean;
    onToggle: () => void;
}

export interface SongsListProps {
    songs: Song[];
}

export interface SongItemProps {
    song: Song;
}

export interface AddBandDialogProps {
    open: boolean;
    onClose: () => void;
    formData: any;
    setFormData: (data: any) => void;
    members: Member[];
    setMembers: (members: Member[]) => void;
    memberForm: Member;
    setMemberForm: (member: Member) => void;
    handleFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleMemberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleFormSubmit: (e: React.FormEvent) => void;
    bandError: string;
    showError: boolean;
    setShowError: (show: boolean) => void;
    removeMember: (index: number) => void;
}

export interface AddAlbumModalProps {
    bandId: string;
    onClose: () => void;
    onAlbumAdded: () => void;
}

export interface AddShowModalProps {
    bandId: string;
    onClose: () => void;
    onShowAdded: () => void;
}

export interface EditBandModalProps {
    open: boolean;
    band: {
        name: string;
        logoUrl: string;
        bandPhotoUrl?: string;
        genre?: string;
        description?: string;
    };
    onClose: () => void;
    onSave: (updated: any) => void;
}

export interface EditAlbumModalProps {
    open: boolean;
    album: Album;
    onClose: () => void;
    onAlbumUpdated: () => void;
    bandId: string;
}

export interface EditShowModalProps {
    open: boolean;
    show: Show;
    onClose: () => void;
    onShowUpdated: () => void;
    bandId: string;
}

// Context Types
export interface AuthContextType {
    isLogged: boolean;
    setIsLogged: (val: boolean) => void;
}

export interface BandPageActions {
    onEditBand: () => void;
    onAddAlbum: () => void;
    onAddShow: () => void;
    onDeleteBand: () => void;
}

export interface BandPageContextType {
    bandPageActions: BandPageActions | null;
    setBandPageActions: (actions: BandPageActions | null) => void;
    isOnBandPage: boolean;
    setIsOnBandPage: (isOnBandPage: boolean) => void;
}

// Component Specific Props
export interface HomeProps {
    isAddedBand: boolean;
}

export interface HamburgerMenuProps {
    onAddBand: () => void;
    onAccount: () => void;
}

export interface NavbarProps {
    setIsAddedBand: (value: boolean) => void;
}

export interface DeleteConfirmationModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    bandName: string;
}

export interface DeleteShowModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    show: Show;
}
