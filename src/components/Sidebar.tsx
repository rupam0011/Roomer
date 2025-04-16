'use client';
import React from 'react';
import { Box, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import PeopleIcon from '@mui/icons-material/People';
import BookIcon from '@mui/icons-material/Book';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import { usePathname, useRouter } from 'next/navigation';

const menuItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
  { label: 'Manage Rooms', icon: <MeetingRoomIcon />, path: '/admin/rooms' },
  { label: 'Manage Users', icon: <PeopleIcon />, path: '/admin' },
  { label: 'Bookings', icon: <BookIcon />, path: '/admin' },
  { label: 'Reports', icon: <BarChartIcon />, path: '/admin' },
  { label: 'Settings', icon: <SettingsIcon />, path: '/admin' },
];

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Box sx={{ 
      width: '18%', background: 'transparent',position:"fixed" ,
       }}>
      <List>
        {menuItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <ListItemButton
              key={item.label}
              onClick={() => router.push(item.path)}
              sx={{
                backgroundColor: isActive ? '#e6e6e6' : 'transparent',
                // border:"2px solid red",
                borderRadius:"10px",
                marginBottom:"12px",
                outline:"none",
                padding:"10px 10px",
                color: isActive ? '#000' : '#ddd',
                transition:" all 0.2s ease-in-out",
                '&:hover': {
                  backgroundColor: '#424242',
                  color: '#fff',
                },
                '& .MuiListItemIcon-root': {
                  color: isActive ? '#000' : '#bbb',
                },
                '&:hover .MuiListItemIcon-root': {
                  color: '#fff',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: '40px' }}>{item.icon}</ListItemIcon>
              <p className='outfit' style={{fontSize:"16px"}}> {item.label} </p>
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
};

export default Sidebar;
