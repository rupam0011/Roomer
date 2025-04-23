'use client';

import React, { useState } from 'react';
import { Room } from '@/interfaces/interface';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { IconButton, Menu, MenuItem } from '@mui/material';

interface RoomCardProps {
  room: Room;
  onEdit: (room: Room) => void;
  onDelete: (roomId: string) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onEdit, onDelete }) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent navigating to details
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handleEdit = () => {
    handleMenuClose();
    onEdit(room);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete(room.id);
  };

  return (
    <div
      style={{
        border: '2px solid #00e5ff',
        borderRadius: '20px',
        padding: '16px',
        marginBottom: '16px',
        backgroundColor: '#0a0a0a',
        color: '#00e5ff',
        cursor: 'pointer',
        width: '100%',
        maxWidth: '350px',
        position: 'relative',
      }}
      onClick={() => router.push(`/admin/rooms/${room.id}`)}
    >
      {/* Menu Icon */}
      <div style={{display:"flex", justifyContent:"end", padding:"0" }} onClick={(e) => e.stopPropagation()}>
        <IconButton size="small" onClick={handleMenuOpen}>
          <MoreHorizIcon style={{ color: '#00e5ff' }} />
        </IconButton>
        <Menu disableScrollLock={true} anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem onClick={handleEdit}>Edit</MenuItem>
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        </Menu>
      </div>

      {/* Image */}
      {room.image_url && (
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '200px',
            borderRadius: '12px',
            overflow: 'hidden',
            marginBottom: '12px',
          }}
        >
          <Image
            src={room.image_url}
            alt={room.name}
            fill
            quality={100}
            style={{ objectFit: 'cover' }}
          />
        </div>
      )}

      <h2 className='kanit'>{room.name}</h2>
      <p className='outfit'><strong>Capacity:</strong> {room.columns && room.rows ? room.columns * room.rows : 0}</p>
      <p className='outfit'>{room.description}</p>
    </div>
  );
};

export default RoomCard;
