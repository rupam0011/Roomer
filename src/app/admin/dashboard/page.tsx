"use client"
import { Box,Typography,} from '@mui/material';
// import Image from 'next/image';
import React, { useEffect, useState } from 'react';
// import add from "../../../assets/add.png";
import supabase from '@/lib/supabaseClient'; // ✅ Adjust import path if needed
// import RoomCard from '@/components/RoomCard';
import { Room, Seat } from '@/interfaces/interface';
import ViewComfyIcon from '@mui/icons-material/ViewComfy';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AreaChartStats from '@/components/AreaChartStats';
import RoomTable from '@/components/RoomTable';
import AuthGuard from '@/components/AuthGuard';
// import Particles from '../../../../reactbits/Particles/Particles';



const Dashboard = () => {
 
  

  const [rooms, setRooms] = useState<Room[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);

  const fetchRooms = async () => {
    const { data: roomData, error: roomError } = await supabase.from('rooms').select('*');
    if (!roomError) setRooms(roomData);
  };
  const fetchSeats = async () => {
    const { data: seatData, error: seatError } = await supabase.from('seats').select('*');
    if (!seatError && seatData) setSeats(seatData);
  };


  useEffect(() => {
    fetchRooms();
    fetchSeats();
  }, []);

  



  const roomSeatStats = rooms.map((room) => {
    const roomSeats = seats.filter(seat => seat.rooms_id === room.id);
    const allocatedSeats = roomSeats.filter(seat => seat.is_allocated).length;

    console.log("🪑 Room:", room.name, "Seats:", roomSeats.length, "Allocated:", allocatedSeats);
    return {
      name: room.name,
      total: roomSeats.length,
      allocated: allocatedSeats,
    };
  });


  return (
    <AuthGuard>
    <Box>
      <p className='kanit' style={{ marginBottom: "20px", fontSize: "25px", fontWeight: "600", paddingLeft: "5px" }}>
        My Dashboard
      </p>

      <Box sx={{

        display: "flex",
        justifyContent: "space-between",
        paddingTop: "10px"
      }}>
        <Box sx={{

          width: "30%",
          padding: "10px",
          background: "linear-gradient(71deg, #080509, #1a171c, #080509)",
          borderRadius: "20px", // smoother corners
          border: "1px solid rgba(255, 255, 255, 0.1)", // light translucent border
          boxShadow: "0 0 20px rgba(255, 255, 255, 0.05)",
        }}>
          <ViewComfyIcon sx={{ fontSize: "40px", }} />
          <Typography sx={{ fontSize: "18px", fontWeight: "bold", margin: "5px" }}>{rooms.length}</Typography>
          <p className='outfit' style={{ margin: "5px" }}>Total rooms</p>
        </Box>
        <Box sx={{

          width: "30%",
          padding: "10px",
          background: "linear-gradient(71deg, #080509, #1a171c, #080509)",
          borderRadius: "20px", // smoother corners
          border: "1px solid rgba(255, 255, 255, 0.1)", // light translucent border
          boxShadow: "0 0 20px rgba(255, 255, 255, 0.05)",
        }}>
          <EventSeatIcon sx={{ fontSize: "40px", }} />
          <Typography sx={{ fontSize: "18px", fontWeight: "bold", margin: "5px" }}>{seats.length}</Typography>
          <p className='outfit' style={{ margin: "5px" }}>Total seats</p>
        </Box>
        <Box sx={{

          width: "30%",
          padding: "10px",
          background: "linear-gradient(71deg, #080509, #1a171c, #080509)",
          borderRadius: "20px", // smoother corners
          border: "1px solid rgba(255, 255, 255, 0.1)", // light translucent border
          boxShadow: "0 0 20px rgba(255, 255, 255, 0.05)",
        }} >
          <PeopleAltIcon sx={{ fontSize: "40px", }} />
          <Typography sx={{ fontSize: "18px", fontWeight: "bold", margin: "5px" }}>{seats.filter(seat => seat.name).length}</Typography>
          <p className='outfit' style={{ margin: "5px" }}>Total members</p>
        </Box>
      </Box>

      {/* -----------------------------charts----------------------------- */}
      <Box sx={{
        width: '100%',
        height: 500,
        mt: 4,
        mb: 10,
        padding: "0 10px",
        borderRadius: "20px", // smoother corners
        border: "1px solid rgba(255, 255, 255, 0.1)", // light translucent border
        boxShadow: "0 0 20px rgba(255, 255, 255, 0.05)",
      }}>
        {/* <Typography variant="h6" sx={{ mb: 2 }}>Room-wise Seat Allocation</Typography> */}
        <AreaChartStats data={roomSeatStats} />
      </Box>


      {/* Room table */}
      <Box sx={{
        borderRadius: "20px", // smoother corners
        border: "1px solid rgba(255, 255, 255, 0.1)", // light translucent border
        boxShadow: "0 0 20px rgba(255, 255, 255, 0.05)",
        padding: "20px"
      }}>
        <p className='kanit' style={{ marginBottom: "20px", fontSize: "20px", fontWeight: "600", paddingLeft: "5px" }}>My rooms</p>
        <Box sx={{}}>
          <RoomTable rooms={rooms} seats={seats} />
        </Box>
      </Box>

    </Box>
    </AuthGuard>
  );
};

export default Dashboard;
