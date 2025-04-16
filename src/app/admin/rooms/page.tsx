/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React, { useEffect, useState } from 'react'
import Particles from '../../../../reactbits/Particles/Particles'
import { Room, Seat } from '@/interfaces/interface';
import supabase from '@/lib/supabaseClient';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material';
import RoomCard from '@/components/Roomcard';
import AuthGuard from '@/components/AuthGuard';



const Rooms = () => {

  const [form, setForm] = useState({
    name: '',
    description: '',
    image_url: '',
    capacity: '',
    customCapacity: '',
  });

  const [open, setOpen] = useState(false);
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


  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setForm({ name: '', description: '', image_url: '', capacity: '', customCapacity: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateRoom = async () => {
    const finalCapacity =
      form.capacity === 'custom'
        ? Number(form.customCapacity)
        : Number(form.capacity);

    if (finalCapacity > 200) {
      alert('Maximum allowed capacity is 200');
      return;
    }

    //(this is all debug purpose)
    const sessionResult = await supabase.auth.getSession();
    console.log("🧠 Full Session:", sessionResult.data);
    // console.log("🧠 Access token:", sessionResult.data.session?.access_token);

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    console.log("👤 USER:", user);
    console.log("❌ USER ERROR:", userError);

    if (!user) {
      alert("User not found, possibly not logged in");
      return;
    }

    //(this is all debug purpose)


    // Step 1: Create room
    console.log("user_id", user.id)

    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .insert([
        {
          name: form.name,
          description: form.description,
          image_url: form.image_url,
          capacity: finalCapacity,
          user_id: user.id,
        },
      ])
      .select()
      .single();


    // if (!user) {
    //   alert("User not logged in. Please sign in.");
    //   return;
    // }

    if (roomError) {
      console.error('Room insert error:', roomError);
      alert('Failed to create room');
      return;
    }

    // Step 2: Generate seats
    const seats = Array.from({ length: finalCapacity }, (_, i) => ({
      seat_no: i + 1,
      is_allocated: false,
      rooms_id: room.id, // FK reference
    }));

    // Step 3: Insert seats into Supabase
    const { error: seatError } = await supabase
      .from('seats')
      .insert(seats);

    if (seatError) {
      console.error('Seat insert error:', seatError);
      alert('Room created but failed to add seats');
      return;
    }

    alert('Room and seats created successfully!');
    await fetchRooms();
    handleClose();
  };

  return (
    <AuthGuard>
    <div>
      <div style={{
        width: '100%',
        height: '300px',
        position: 'relative',
        border: "2px solid #00e5ff",
        borderRadius: "20px",
        overflow: 'hidden',
        color: '#00e5ff',
        cursor: "pointer",
      }}
        onClick={handleClickOpen}
      >

        {/* Particle Background */}
        <Particles
          particleColors={['#00e5ff', '#00e5ff']}
          particleCount={800}
          particleSpread={20}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />

        {/* Overlayed Content */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
          zIndex: 1,
          pointerEvents: "none",

        }}>

          <p className='kanit' style={{ fontSize: '35px', margin: 0, }}>Create new room</p>
        </div>

      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create a New Room</DialogTitle>
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            mt: 1,
            width: '450px',
          }}
        >
          <TextField
            label="Room Name"
            name="name"
            fullWidth
            value={form.name}
            onChange={handleChange}
          />
          <TextField
            label="Description"
            name="description"
            fullWidth
            multiline
            rows={3}
            value={form.description}
            onChange={handleChange}
          />
          <TextField
            label="Image URL"
            name="image_url"
            fullWidth
            value={form.image_url}
            onChange={handleChange}
          />
          <TextField
            label="Capacity"
            name="capacity"
            select
            fullWidth
            value={form.capacity}
            onChange={handleChange}
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  style: {
                    maxHeight: 300,
                    zIndex: 9999,
                  },
                },
              },
            }}
          >
            <MenuItem value="75">75</MenuItem>
            <MenuItem value="100">100</MenuItem>
            <MenuItem value="200">200</MenuItem>
            <MenuItem value="custom">Custom</MenuItem>
          </TextField>
          {form.capacity === 'custom' && (
            <TextField
              label="Custom Capacity"
              name="customCapacity"
              type="number"
              fullWidth
              value={form.customCapacity}
              onChange={handleChange}
              inputProps={{ max: 200, min: 1 }}
              error={Number(form.customCapacity) > 200}
              helperText={
                Number(form.customCapacity) > 200
                  ? 'Maximum allowed capacity is 200'
                  : ''
              }
            />
          )}
        </DialogContent>
        <DialogActions sx={{ width: "430px" }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateRoom}>
            Create Room
          </Button>
        </DialogActions>
      </Dialog>

      {/* Show existing rooms */}
      <div style={{ marginTop: '40px', display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom:"70px"}} >
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>


    </div>
    </AuthGuard>
  )
}

export default Rooms
