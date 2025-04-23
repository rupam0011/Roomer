'use client';

// import { useParams } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import supabase from '@/lib/supabaseClient';
// import { Room, Seat } from '@/interfaces/interface';

// import Image from 'next/image';
// import { Container, Tooltip } from '@mui/material';

// const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// const RoomDetailPage = () => {
//     const { id } = useParams();
//     const [room, setRoom] = useState<Room | null>(null);
//     const [seats, setSeats] = useState<Seat[]>([]);

//     useEffect(() => {
//         const fetchData = async () => {
//             const { data: roomData } = await supabase
//                 .from('rooms')
//                 .select('*')
//                 .eq('id', id)
//                 .single();

//             const { data: seatData } = await supabase
//                 .from('seats')
//                 .select('*')
//                 .eq('rooms_id', id)
//                 .order('seat_no', { ascending: true });

//             setRoom(roomData);
//             setSeats(seatData || []);
//         };

//         if (id) fetchData();
//     }, [id]);

//     const rows: Seat[][] = [];
//     for (let i = 0; i < seats.length; i += 14) {
//         rows.push(seats.slice(i, i + 14));
//     }

//     const renderSeats = (rows: Seat[][], side: 'left' | 'right') =>
//         rows.map((row, rowIndex) => (
//             <div className={styles.row} key={rowIndex}>
//                 {side === 'left' && <span className={styles.rowLabel}>{alphabet[rowIndex]}</span>}

//                 {row.map((seat, i) => {
//                     const isLeft = side === 'left' && i < 7;
//                     const isRight = side === 'right' && i >= 7;
//                     if (!isLeft && !isRight) return null;

//                     const seatLabel = `${alphabet[rowIndex]}${i + 1}`;

//                     return (
//                         <Tooltip
//                             key={seat.id}
//                             title={seat.is_allocated ? `${seat.name}, Age: ${seat.age}` : 'Available'}
//                             arrow
//                             placement="top"
//                         >
//                             <div
//                                 className={`${styles.seat} ${seat.is_allocated ? styles.allocated : styles.available}`}
//                             >
//                                 {seatLabel}
//                             </div>
//                         </Tooltip>
//                     );
//                 })}
//             </div>
//         ));

//     return (
//         <div className={styles.container}>
//             <div className={styles.banner}>
//                 <Image
//                     src="https://images.unsplash.com/photo-1604263920153-100bcdbcf4a0?q=80&w=2070&auto=format&fit=crop"
//                     alt="header"
//                     quality={100}
//                     fill
//                     className={styles.bannerImg}
//                 />
//             </div>
//             <Container maxWidth={'xl'}>
//                 <div className={styles.wrapper}>
//                     <h2 className={styles.roomName}>Room: {room?.name}</h2>
//                     <p>Total Seats: {room?.columns && room?.rows ? room.columns * room.rows : 0}</p>
//                     <p>{room?.description}</p>

//                     <div className={styles.layout}>
//                         <div className={styles.block}>{renderSeats(rows, 'left')}</div>
//                         <div className={styles.block}>{renderSeats(rows, 'right')}</div>
//                     </div>
//                 </div>
//             </Container>
//         </div>
//     );
// };

// export default RoomDetailPage;


/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import {
    Box,
    Container,
    Skeleton,
    Tooltip
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import supabase from '@/lib/supabaseClient';
import { Room, Seat } from '@/interfaces/interface';
import { Grid } from 'react-virtualized';
import 'react-virtualized/styles.css';
import Image from 'next/image';
import styles from '@/styles/RoomDetail.module.css';
import { useSearchParams } from "next/navigation";

const UserRoomDetailsPage = () => {
    const { id } = useParams();

    const searchParams = useSearchParams();
    const highlightName = searchParams.get("search")?.toLowerCase();

    const [room, setRoom] = useState<Room | null>(null);
    const [seats, setSeats] = useState<Seat[]>([]);
    const [loading, setLoading] = useState(true);


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

        let bgColor = '#2196f3'; // available
        if (seat.is_allocated) bgColor = '#f44336'; // allocated
        if (isHighlighted) bgColor = '#09b100'; // highlight matching seat (yellow)

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
                            cursor: "pointer"
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
            <Container maxWidth={'xl'}>
                <Box
                    sx={{
                        p: 4,
                        border: '1px solid rgba(218, 218, 218, 0.297)',
                        boxShadow: '0 0 20px rgba(255, 255, 255, 0.05)',
                    }}
                    className={styles.wrapper}
                >
                    <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                        <div>
                            <h2 className="kanit">Room: {room?.name}</h2>
                            <p style={{ margin: '5px 0' }} className="outfit">
                                Total Seats: {room?.rows && room?.columns ? room.rows * room.columns : 0}
                            </p>
                            <p style={{ margin: '5px 0' }} className="outfit">
                                Description: {room?.description}
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '30px', marginBottom: '20px',}}>
                            <div className='outfit'><span style={{ background: '#2196f3', padding: '0px 10px', borderRadius: '4px', marginRight:"6px" }}></span> Available</div>
                            <div className='outfit'><span style={{ background: '#f44336', padding: '0px 10px', borderRadius: '4px', marginRight:"6px" }}></span> Allocated</div>
                            <div className='outfit'><span style={{ background: '#09b100', padding: '0px 10px', borderRadius: '4px', marginRight:"6px" }}></span> Matched Name</div>
                        </div>
                    </div>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',

                            mt: 4,
                            border: '1px solid rgba(218, 218, 218, 0.297)',
                            padding: '40px 0',
                        }}
                    >
                        {loading ?
                            (
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
                                        columnWidth={44}
                                        height={400}
                                        rowCount={room.rows}
                                        rowHeight={44}
                                        width={Math.min(room.columns * 44, 900)}
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
