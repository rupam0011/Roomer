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
import MenuIcon from '@mui/icons-material/Menu';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';
import Link from 'next/link';
import useMediaQuery from '@mui/material/useMediaQuery';

const Header = () => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);
    const isMobile = useMediaQuery('(max-width:600px)');

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

    return (
        <>
            <AppBar position="static" sx={{ background: '#000', position: 'fixed', zIndex: 1000 }}>
                <Container maxWidth="xl">
                    <Toolbar variant="dense">
                        <Link href="/">
                            <p className="special-gothic" style={{ fontSize: '18px', cursor: 'pointer' }}>
                                Roomer
                            </p>
                        </Link>

                        <Box sx={{ flexGrow: 1 }} />

                        {/* When not logged in */}
                        {!isLoggedIn ? (
                            isMobile ? (
                                // Mobile: Show menu icon with Rooms and Sign In
                                <>
                                    <IconButton
                                        onClick={(e) => setAnchorEl(e.currentTarget)}
                                        edge="end"
                                        color="inherit"
                                    >
                                        <MenuIcon />
                                    </IconButton>
                                    <Menu
                                        disableScrollLock
                                        anchorEl={anchorEl}
                                        open={openMenu}
                                        onClose={() => setAnchorEl(null)}
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    >
                                        <MenuItem onClick={() => { setAnchorEl(null); router.push('/rooms'); }}>
                                            <MeetingRoomIcon sx={{ marginRight: '8px' }} /> Rooms
                                        </MenuItem>
                                        <MenuItem onClick={() => { setAnchorEl(null); router.push('/signin'); }}>
                                            <ExitToAppIcon sx={{ marginRight: '8px' }} /> Sign In
                                        </MenuItem>
                                    </Menu>
                                </>
                            ) : (
                                // Desktop: Show Rooms and Sign In as links
                                <>
                                    <Link href="/rooms">
                                        <Typography sx={{ fontFamily: 'outfit', margin: '0px 8px', cursor: 'pointer' }}>Rooms</Typography>
                                    </Link>
                                    <Typography
                                        sx={{ fontFamily: 'outfit', marginLeft: '15px', cursor: 'pointer' }}
                                        onClick={() => router.push('/signin')}
                                    >
                                        Sign In
                                    </Typography>
                                </>
                            )
                        ) : (
                            // When logged in: Only show AccountCircleIcon on all screen sizes
                            <>
                                <IconButton
                                    onClick={(e) => setAnchorEl(e.currentTarget)}
                                    color="inherit"
                                >
                                    <AccountCircleIcon sx={{ fontSize: 30 }} />
                                </IconButton>
                                <Menu
                                    disableScrollLock
                                    anchorEl={anchorEl}
                                    open={openMenu}
                                    onClose={() => setAnchorEl(null)}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                >
                                    <MenuItem onClick={() => { setAnchorEl(null); router.push('/admin/dashboard'); }}>
                                        <DashboardIcon sx={{ marginRight: '5px', fontSize: 22 }} /> Dashboard
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem onClick={() => { setAnchorEl(null); router.push('/rooms'); }}>
                                        <MeetingRoomIcon sx={{ marginRight: '5px', fontSize: 22 }} /> Rooms
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem onClick={() => setOpenDialog(true)}>
                                        <LogoutIcon sx={{ marginRight: '5px', fontSize: 22 }} /> Sign Out
                                    </MenuItem>
                                </Menu>
                            </>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Confirm Sign Out Dialog */}
            <Dialog disableScrollLock open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Are you sure you want to sign out?</DialogTitle>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleSignOut} color="error">Yes, Sign Out</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Header;
