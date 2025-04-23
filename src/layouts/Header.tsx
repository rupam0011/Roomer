'use client';

import React, { useEffect, useState } from 'react';
import {
    AppBar,
    Toolbar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    Container,
    Typography,
    Menu,
    MenuItem,
    IconButton,
    Divider,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';
import Link from 'next/link';

const Header = () => {
    const router = useRouter();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const openMenu = Boolean(anchorEl);

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsLoggedIn(!!session);

            supabase.auth.onAuthStateChange((_event, session) => {
                setIsLoggedIn(!!session);
            });
        };

        checkSession();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setOpenDialog(false);
        setAnchorEl(null);
        setIsLoggedIn(false);
        router.push('/signin');
    };

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <AppBar position="static" sx={{ background: '#000', position: 'fixed', zIndex: '1000' }}>
                <Container maxWidth="xl">
                    <Toolbar variant="dense">
                        <Link href="/">
                            <p className="special-gothic" style={{ fontSize: '18px', cursor: 'pointer' }}>
                                Roomer
                            </p>
                        </Link>

                        <Box sx={{ flexGrow: 1 }} />
                        {!isLoggedIn && (
                            <Link href="/rooms">
                                <Typography sx={{ fontFamily: 'outfit', margin: '0px 8px' }}>Rooms</Typography>
                            </Link>
                        )}

                        {/* 👤 Account Icon with Menu */}
                        {isLoggedIn ? (
                            <>
                                <IconButton onClick={handleMenuClick} color="inherit">
                                    <AccountCircleIcon sx={{fontSize:30}}/>
                                </IconButton>
                                <Menu
                                    disableScrollLock={true}
                                    anchorEl={anchorEl}
                                    open={openMenu}
                                    onClose={handleMenuClose}
                                    onClick={handleMenuClose}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                >
                                    <MenuItem sx={{fontFamily:"outfit"}} onClick={() => router.push('/rooms')}><MeetingRoomIcon sx={{marginRight:"5px",fontSize:22}}/> Rooms</MenuItem>
                                    <Divider/>
                                    <MenuItem sx={{fontFamily:"outfit"}} onClick={() => setOpenDialog(true)}><LogoutIcon sx={{marginRight:"5px",fontSize:22}}/> Sign Out</MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <Typography sx={{ fontFamily: 'outfit', marginLeft: '15px', cursor:"pointer" }} onClick={() => router.push('/signin')}>
                                Sign In
                            </Typography>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>

            {/* 🔔 Confirmation Dialog */}
            <Dialog disableScrollLock={true} open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Are you sure you want to sign out?</DialogTitle>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleSignOut} color="error">
                        Yes, Sign Out
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Header;
