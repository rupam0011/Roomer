'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import supabase from '@/lib/supabaseClient';
import { Room, Seat } from '@/interfaces/interface';
import styles from '@/styles/RoomDetail.module.css';
import Image from 'next/image';
import { Container, Tooltip } from '@mui/material';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const RoomDetailPage = () => {
    const { id } = useParams();
    const [room, setRoom] = useState<Room | null>(null);
    const [seats, setSeats] = useState<Seat[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const { data: roomData } = await supabase
                .from('rooms')
                .select('*')
                .eq('id', id)
                .single();

            const { data: seatData } = await supabase
                .from('seats')
                .select('*')
                .eq('rooms_id', id)
                .order('seat_no', { ascending: true });

            setRoom(roomData);
            setSeats(seatData || []);
        };

        if (id) fetchData();
    }, [id]);

    const rows: Seat[][] = [];
    for (let i = 0; i < seats.length; i += 14) {
        rows.push(seats.slice(i, i + 14));
    }

    const renderSeats = (rows: Seat[][], side: 'left' | 'right') =>
        rows.map((row, rowIndex) => (
            <div className={styles.row} key={rowIndex}>
                {side === 'left' && <span className={styles.rowLabel}>{alphabet[rowIndex]}</span>}

                {row.map((seat, i) => {
                    const isLeft = side === 'left' && i < 7;
                    const isRight = side === 'right' && i >= 7;
                    if (!isLeft && !isRight) return null;

                    const seatLabel = `${alphabet[rowIndex]}${i + 1}`;

                    return (
                        <Tooltip
                            key={seat.id}
                            title={seat.is_allocated ? `${seat.name}, Age: ${seat.age}` : 'Available'}
                            arrow
                            placement="top"
                        >
                            <div
                                className={`${styles.seat} ${seat.is_allocated ? styles.allocated : styles.available}`}
                            >
                                {seatLabel}
                            </div>
                        </Tooltip>
                    );
                })}
            </div>
        ));

    return (
        <div className={styles.container}>
            <div className={styles.banner}>
                <Image
                    src="https://images.unsplash.com/photo-1604263920153-100bcdbcf4a0?q=80&w=2070&auto=format&fit=crop"
                    alt="header"
                    quality={100}
                    fill
                    className={styles.bannerImg}
                />
            </div>
            <Container maxWidth={'xl'}>
                <div className={styles.wrapper}>
                    <h2 className={styles.roomName}>Room: {room?.name}</h2>
                    <p>Total Seats: {room?.capacity}</p>
                    <p>{room?.description}</p>

                    <div className={styles.layout}>
                        <div className={styles.block}>{renderSeats(rows, 'left')}</div>
                        <div className={styles.block}>{renderSeats(rows, 'right')}</div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default RoomDetailPage;
