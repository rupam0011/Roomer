'use client';

import React, { useEffect, useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    Container,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';

const Header = () => {
    const router = useRouter();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    // 👀 Check user session on mount
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsLoggedIn(!!session);

            // Optional: Listen to auth changes in real-time
            supabase.auth.onAuthStateChange((_event, session) => {
                setIsLoggedIn(!!session);
            });
        };

        checkSession();
    }, []);

    // 🔐 Sign Out Handler
    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setOpenDialog(false);
        setIsLoggedIn(false);
        router.push('/signin');
    };

    return (
        <>
            <AppBar position="static" sx={{ background: '#000',position:"fixed",zIndex:"1000" }}>
                <Container maxWidth="xl">
                    <Toolbar variant="dense">
                        <p className='special-gothic' style={{fontSize:"18px"}}>
                            Roomer
                        </p>

                        <Box sx={{ flexGrow: 1 }} />

                        {/* 🔁 Dynamic Sign In/Sign Out Button */}
                        {isLoggedIn ? (
                            <Button color="inherit" onClick={() => setOpenDialog(true)}>
                                Sign Out
                            </Button>
                        ) : (
                            <Button color="inherit" onClick={() => router.push('/signin')}>
                                Sign In
                            </Button>
                        )}
                    </Toolbar>
                </Container>
            </AppBar>

            {/* 🔔 Confirmation Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
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
