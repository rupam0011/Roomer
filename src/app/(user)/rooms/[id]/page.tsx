/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';
import {
    Box,
    Container,
    Skeleton,
    Tooltip,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import supabase from '@/lib/supabaseClient';
import { Room, Seat } from '@/interfaces/interface';
import { Grid } from 'react-virtualized';
import 'react-virtualized/styles.css';
import Image from 'next/image';
import styles from '@/styles/RoomDetail.module.css';

const UserRoomDetailsPage = () => {
    const { id } = useParams();
    const searchParams = useSearchParams();
    const highlightName = searchParams.get("search")?.toLowerCase();

    const [room, setRoom] = useState<Room | null>(null);
    const [seats, setSeats] = useState<Seat[]>([]);
    const [loading, setLoading] = useState(true);

    // 🔧 Responsive cell size based on screen width
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const cellSize = isSmallScreen ? 32 : 44;

    useEffect(() => {
        const fetchRoomAndSeats = async () => {
            const { data: roomData } = await supabase
                .from('rooms')
                .select('*')
                .eq('id', id)
                .single();

            const { data: seatsData } = await supabase
                .from('seats')
                .select('*')
                .eq('rooms_id', id)
                .order('seat_no', { ascending: true });

            setRoom(roomData);
            setSeats(seatsData ?? []);
            setLoading(false);
        };

        if (id) fetchRoomAndSeats();
    }, [id]);

    const getRowLabel = (index: number): string => {
        let label = '';
        while (index >= 0) {
            label = String.fromCharCode((index % 26) + 65) + label;
            index = Math.floor(index / 26) - 1;
        }
        return label;
    };

    const seatMap = useMemo(() => {
        const map: Record<string, Seat> = {};
        seats.forEach((seat) => {
            map[`${seat.row_label}-${seat.column_number}`] = seat;
        });
        return map;
    }, [seats]);

    const getSeat = (row: number, col: number) => {
        const rowLabel = getRowLabel(row);
        return seatMap[`${rowLabel}-${col + 1}`];
    };

    const renderSeat = ({ columnIndex, rowIndex, key, style }: any) => {
        const seat = getSeat(rowIndex, columnIndex);
        if (!seat) return null;

        const isHighlighted = seat.is_allocated && highlightName && seat.name?.toLowerCase() === highlightName;

        if (seat.is_blank) {
            return (
                <div key={key} style={{ ...style, padding: '3px' }}>
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: '#111',
                            borderRadius: '4px',
                        }}
                    />
                </div>
            );
        }

        let bgColor = '#2196f3';
        if (seat.is_allocated) bgColor = '#f44336';
        if (isHighlighted) bgColor = '#09b100';

        const tooltipText = seat.is_allocated
            ? `${seat.name}, Age: ${seat.age}`
            : 'Available';

        return (
            <div key={key} style={{ ...style, padding: '3px' }}>
                <Tooltip title={tooltipText} arrow>
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: bgColor,
                            color: 'white',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: '4px',
                            fontSize: '12px',
                            userSelect: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        {seat.seat_label}
                    </Box>
                </Tooltip>
            </div>
        );
    };

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
            <Container maxWidth="xl">
                <Box
                    sx={{
                        p: 4,
                        border: '1px solid rgba(218, 218, 218, 0.297)',
                        boxShadow: '0 0 20px rgba(255, 255, 255, 0.05)',
                    }}
                    className={styles.wrapper}
                >
                    <div className={styles.header}>
                        <div>
                            <h2 className={styles.roomName}>Room: {room?.name}</h2>
                            <p>Total Seats: {room?.rows && room?.columns ? room.rows * room.columns : 0}</p>
                            <p>Description: {room?.description}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '30px', marginBottom: '20px' }}>
                            <div className="outfit">
                                <span style={{ background: '#2196f3', padding: '0px 10px', borderRadius: '4px', marginRight: '6px' }}></span>
                                Available
                            </div>
                            <div className="outfit">
                                <span style={{ background: '#f44336', padding: '0px 10px', borderRadius: '4px', marginRight: '6px' }}></span>
                                Allocated
                            </div>
                            <div className="outfit">
                                <span style={{ background: '#09b100', padding: '0px 10px', borderRadius: '4px', marginRight: '6px' }}></span>
                                Matched Name
                            </div>
                        </div>
                    </div>

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mt: 4,
                            border: '1px solid rgba(218, 218, 218, 0.297)',
                            padding: '40px 0',
                            overflowX: 'auto',
                        }}
                    >
                        {loading ? (
                            <Skeleton
                                sx={{ bgcolor: 'grey.900' }}
                                variant="rectangular"
                                width={900}
                                height={400}
                            />
                        ) : (
                            room && (
                                <Grid
                                    columnCount={room.columns}
                                    columnWidth={cellSize}
                                    height={room.rows * cellSize}
                                    rowCount={room.rows}
                                    rowHeight={cellSize}
                                    width={Math.min(room.columns * cellSize, 900)}
                                    cellRenderer={renderSeat}
                                />
                            )
                        )}
                    </Box>
                </Box>
            </Container>
        </div>
    );
};

export default UserRoomDetailsPage;
