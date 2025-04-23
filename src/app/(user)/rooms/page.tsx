"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import supabase from "@/lib/supabaseClient";
import styles from "@/styles/roomsPage.module.css";
import { Room } from "@/interfaces/interface";
import { Container, Skeleton } from "@mui/material";
import Link from "next/link";

const RoomsPage = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [seatNameMap, setSeatNameMap] = useState<Record<string, string[]>>({});
    const [allSeatNames, setAllSeatNames] = useState<string[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);

    useEffect(() => {
        const fetchRoomsAndSeats = async () => {
            const { data: roomsData, error: roomError } = await supabase.from("rooms").select("*");
            const { data: seatData, error: seatError } = await supabase
                .from("seats")
                .select("rooms_id, name")
                .eq("is_allocated", true);

            if (roomError || seatError) {
                console.error(roomError || seatError);
                setLoading(false);
                return;
            }

            const groupedSeats: Record<string, string[]> = {};
            const seatNamesSet = new Set<string>();

            seatData?.forEach((seat) => {
                if (!groupedSeats[seat.rooms_id]) {
                    groupedSeats[seat.rooms_id] = [];
                }
                if (seat.name) {
                    const nameLower = seat.name.toLowerCase();
                    groupedSeats[seat.rooms_id].push(nameLower);
                    seatNamesSet.add(nameLower);
                }
            });

            setRooms(roomsData || []);
            setSeatNameMap(groupedSeats);
            setAllSeatNames(Array.from(seatNamesSet));
            setLoading(false);
        };

        fetchRoomsAndSeats();
    }, []);

    useEffect(() => {
        const trimmed = searchTerm.trim().toLowerCase();
        if (trimmed === "") {
            setSuggestions([]);
            return;
        }

        const filtered = allSeatNames.filter((name) => name.includes(trimmed));
        setSuggestions(filtered.length > 0 ? filtered.slice(0, 5) : ["__no_match__"]);
    }, [searchTerm, allSeatNames]);

    const noMatch = useMemo(() => {
        return searchTerm.trim() !== "" && suggestions.includes("__no_match__");
    }, [searchTerm, suggestions]);

    const filteredRooms = useMemo(() => {
        const trimmed = searchTerm.trim().toLowerCase();
        if (loading) return [];

        if (!trimmed) return rooms;

        if (noMatch) return []; // Don't show all rooms on no match

        return rooms.filter((room) =>
            seatNameMap[room.id]?.some((name) => name.includes(trimmed))
        );
    }, [rooms, seatNameMap, searchTerm, noMatch, loading]);

    const handleSuggestionClick = (name: string) => {
        if (name === "__no_match__") return;
        setSearchTerm(name);
        setSuggestions([]);
    };

    return (
        <div className={styles.container}>
            {/* Banner */}
            <div className={styles.banner}>
                <Image
                    src="https://images.unsplash.com/photo-1604263920153-100bcdbcf4a0?q=80&w=2070&auto=format&fit=crop"
                    alt="header"
                    quality={100}
                    fill
                    className={styles.bannerImg}
                />
            </div>

            {/* Main Content */}
            <Container maxWidth={"xl"}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        marginBottom: "20px",
                        paddingRight: "40px",
                        position: "relative",
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                        <p style={{ fontSize: "30px", fontFamily: "outfit" }}>
                            All Rooms ({loading ? "..." : filteredRooms.length})
                        </p>
                        <div style={{ position: "relative" }}>
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: "200px",
                                    height: "30px",
                                    paddingLeft: "8px",
                                    border: "1px solid rgba(218, 218, 218, 0.297)",
                                    outline: "none",
                                    background: "#111",
                                    color: "#fff",
                                    borderRadius: "4px",
                                }}
                            />
                            {/* Suggestions Dropdown */}
                            {suggestions.length > 0 && (
                                <ul
                                    style={{
                                        position: "absolute",
                                        top: "35px",
                                        width: "100%",
                                        background: "#111",
                                        border: "1px solid rgba(218, 218, 218, 0.297)",
                                        borderRadius: "4px",
                                        listStyle: "none",
                                        padding: 0,
                                        margin: 0,
                                        zIndex: 1000,
                                        maxHeight: "150px",
                                        overflowY: "auto",
                                    }}
                                >
                                    {suggestions.map((name, index) => (
                                        <li
                                            key={index}
                                            onClick={() => handleSuggestionClick(name)}
                                            style={{
                                                padding: "8px",
                                                cursor: name !== "__no_match__" ? "pointer" : "default",
                                                borderBottom: "1px solid rgba(218, 218, 218, 0.297)",
                                                color: "#fff",
                                                fontStyle: name === "__no_match__" ? "italic" : "normal",
                                            }}
                                        >
                                            {name === "__no_match__" ? "No matching names found" : name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                {/* Room Cards */}
                <div className={styles.roomList}>
                    {loading ? (
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
                    ) : filteredRooms.length === 0 ? (
                        <p style={{ color: "#ccc", fontStyle: "italic", padding: "20px" }}>
                            No rooms found for the searched name.
                        </p>
                    ) : (
                        filteredRooms.map((room) => (
                            <Link
                                href={{
                                    pathname: `/rooms/${room.id}`,
                                    query: searchTerm.trim() ? { search: searchTerm.trim() } : {},
                                }}
                                key={room.id}
                                className={styles.card}
                            >
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
                                    <p>
                                        Capacity:{" "}
                                        {room.columns && room.rows ? room.columns * room.rows : 0}
                                    </p>
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
