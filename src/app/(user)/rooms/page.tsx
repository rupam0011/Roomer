"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import supabase from "@/lib/supabaseClient";
import styles from "@/styles/roomsPage.module.css";
import { Room } from "@/interfaces/interface";
import { Container, Skeleton } from "@mui/material";
import Link from "next/link";

const RoomsPage = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRooms = async () => {
            const { data, error } = await supabase.from("rooms").select("*");
            if (!error) setRooms(data);
            setLoading(false);
        };

        fetchRooms();
    }, []);

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

            <Container maxWidth={"xl"}>
                <div className={styles.roomList}>
                    {loading ? (
                        // Render 6 skeleton cards while loading
                        Array.from({ length: 8 }).map((_, index) => (
                            <div className={styles.card} key={index}>
                                <Skeleton variant="rectangular" width="100%" height={200} />
                                <div className={styles.content}>
                                    <Skeleton width="80%" />
                                    <Skeleton width="60%" />
                                    <Skeleton width="90%" />
                                </div>
                            </div>
                        ))
                    ) : (
                        // Render real room cards
                        rooms.map((room) => (
                            <Link href={`/rooms/${room.id}`} key={room.id} className={styles.card}>
                                <div className={styles.imageBox}>
                                    <Image
                                        src={room.image_url}
                                        alt={room.name}
                                        fill
                                        className={styles.cardImage}
                                    />
                                </div>
                                <div className={styles.content}>
                                    <h3>{room.name}</h3>
                                    <p>Capacity: {room.capacity}</p>
                                    <p className={styles.desc}>{room.description}</p>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </Container>
        </div>
    );
};

export default RoomsPage;
