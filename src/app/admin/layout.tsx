'use client';
import Sidebar from '@/components/Sidebar';
import { Box, Container } from '@mui/material';
import React from 'react';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Box sx={{ backgroundColor: "black", minHeight: '100vh' }}>
            <Container maxWidth="xl" style={{ background: "#000", color: "#fff", height: "auto" }}>
                <Box sx={{ paddingTop: '20px', display: "flex", width: "100%", minHeight: "100vh" }}>
                    <Box sx={{ width: "25%", borderRight: "1px solid #ffc", paddingRight: "15px" }}>
                        <Sidebar />
                    </Box>
                    <Box sx={{ width: "75%", paddingLeft: "20px" }}>
                        {children}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default AdminLayout;
