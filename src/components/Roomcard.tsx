
'use client';

import React from 'react';
import { Room } from '@/interfaces/interface';
import  {useRouter}  from 'next/navigation';
import Image from 'next/image';

interface RoomCardProps {
  room: Room;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
    const router = useRouter();
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
      }}
      onClick={() => router.push(`/admin/rooms/${room.id}`)}
    >
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
      <p className='outfit'><strong>Capacity:</strong> {room.capacity}</p>
      <p className='outfit'>{room.description}</p>
    </div>
  );
};

export default RoomCard;
