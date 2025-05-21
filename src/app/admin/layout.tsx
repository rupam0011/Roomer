'use client';
import Sidebar from '@/components/Sidebar';
import { Box, Container } from '@mui/material';
import React from 'react';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Box sx={{ backgroundColor: "black", minHeight: '100vh' }}>
            <Container maxWidth="xl" style={{ background: "#000", color: "#fff", height: "auto" }}>
                <Box sx={{
                    paddingTop: '20px',
                    display: "flex",
                    width: "100%",
                    minHeight: "100vh",
                    flexDirection: { xs: "column", md: "row" }
                }}>
                    {/* Sidebar - Hidden on xs/sm (<=768px), shown on md and above */}
                    <Box
                        sx={{
                            width: { xs: 0, md: "25%" },
                            display: { xs: 'none', md: 'block' },
                            borderRight: "1px solid #525252",
                            paddingRight: { md: "15px" }
                        }}
                    >
                        <Sidebar />
                    </Box>

                    {/* Content area - full width on small screens */}
                    <Box
                        sx={{
                            width: { xs: "100%", md: "75%" },
                            paddingLeft: { md: "20px" }
                        }}
                    >
                        {children}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default AdminLayout;
