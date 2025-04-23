/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React, { useEffect, useState } from 'react'
import Particles from '../../../../reactbits/Particles/Particles'
import { Room, Seat } from '@/interfaces/interface';
import supabase from '@/lib/supabaseClient';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import RoomCard from '@/components/Roomcard';
import AlertDialog from '@/components/AlertDialog'; // adjust the path if needed

import AuthGuard from '@/components/AuthGuard';

const Rooms = () => {

  const [form, setForm] = useState({
    name: '',
    description: '',
    image_url: '',
    rows: '',
    columns: '',
  });

  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const [rooms, setRooms] = useState<Room[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);


  const [isEditing, setIsEditing] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);


  const fetchRooms = async () => {
    const { data: roomData, error: roomError } = await supabase.from('rooms').select('*');
    if (!roomError) setRooms(roomData);
  };

  const fetchSeats = async () => {
    const { data: seatData, error: seatError } = await supabase.from('seats').select('*');
    if (!seatError && seatData) setSeats(seatData);
  };
  console.log("Generated seats:", seats.length);

  useEffect(() => {
    fetchRooms();
    fetchSeats();
  }, []);

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setAlertOpen(true);
  };


  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setForm({ name: '', description: '', image_url: '', rows: '', columns: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Helper function for Excel-style row labels
  function getRowLabel(index: number): string {
    let label = "";
    while (index >= 0) {
      label = String.fromCharCode((index % 26) + 65) + label;
      index = Math.floor(index / 26) - 1;
    }
    return label;
  }

  const handleEditRoom = (room: Room) => {
    setForm({
      name: room.name,
      description: room.description || '',
      image_url: room.image_url || '',
      rows: room.rows?.toString() || '',
      columns: room.columns?.toString() || '',
    });
    setEditingRoomId(room.id);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDeleteRoom = async (roomId: string) => {
    const { error } = await supabase.from('rooms').delete().eq('id', roomId);
    if (error) {
      console.error("Error deleting room:", error);
      showAlert("Failed to delete the room");
    } else {
      showAlert("Room deleted successfully");
      await fetchRooms();
    }
  };

  const handleCreateRoom = async () => {
    const rowCount = Number(form.rows);
    const colCount = Number(form.columns);

    if (!form.name || !rowCount || !colCount) {
      showAlert("Please fill all required fields");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return showAlert("Not logged in");

    if (editingRoomId) {
      // --- UPDATE mode ---
      const { error } = await supabase.from("rooms")
        .update({
          name: form.name,
          description: form.description,
          image_url: form.image_url,
          rows: rowCount,
          columns: colCount,
        })
        .eq("id", editingRoomId);

      if (error) {
        showAlert("Failed to update room");
        return;
      }

      showAlert("Room updated");
      setEditingRoomId(null);
      setIsEditing(false);
      await fetchRooms();
      handleClose();
      return;
    }

    // const sessionResult = await supabase.auth.getSession();
    // const {
    //   data: { user },
    //   error: userError
    // } = await supabase.auth.getUser();

    // if (!user) {
    //   alert("User not found, possibly not logged in");
    //   return;
    // }

    // Step 1: Insert room with rows & columns
    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .insert([
        {
          name: form.name,
          description: form.description,
          image_url: form.image_url,
          rows: rowCount,
          columns: colCount,
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (roomError) {
      console.error("Room insert error:", roomError);
      showAlert("Failed to create room");
      return;
    }

    // Step 2: Generate seats with row/column/label
    const seats = [];

    for (let r = 0; r < rowCount; r++) {
      const rowLabel = getRowLabel(r); // A, B, ..., Z, AA, AB, ...
      for (let c = 1; c <= colCount; c++) {
        seats.push({
          seat_no: r * colCount + c,
          row_label: rowLabel,
          column_number: c,
          seat_label: `${rowLabel}${c}`,
          is_allocated: false,
          is_blank: false,
          rooms_id: room.id,
        });
      }
    }
    console.log(`Creating room with ${rowCount} rows and ${colCount} columns`);
    console.log(`This should generate ${rowCount * colCount} seats`);
    // After generating seats array:
    console.log(`Generated ${seats.length} seats in memory`);

    // Step 3: Insert all seats
    const { error: seatError } = await supabase
      .from("seats")
      .insert(seats);

    if (seatError) {
      console.error("Seat insert error:", seatError);
      showAlert("Room created but failed to add seats");
      return;
    }

    showAlert("Room created successfully!");
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
            <p className='kanit' style={{ fontSize: '35px', margin: 0 }}>Create new room</p>
          </div>
        </div>

        {/* Dialog for room creation */}
        <Dialog disableScrollLock={true} open={open} onClose={handleClose}>
          <DialogTitle sx={{ color: "#000", fontFamily: "kanit", fontSize: "25px" }}>Create a New Room</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '450px', }}>
            <TextField sx={{ marginTop: "10px" }} label="Room Name" name="name" fullWidth value={form.name} onChange={handleChange} />
            <TextField label="Description" name="description" fullWidth multiline rows={3} value={form.description} onChange={handleChange} />
            <TextField label="Image URL" name="image_url" fullWidth value={form.image_url} onChange={handleChange} />
            <TextField
              label="Rows"
              name="rows"
              type="number"
              fullWidth
              value={form.rows}
              onChange={handleChange}
              inputProps={{ min: 1, max: 100 }}
            />
            <TextField
              label="Columns"
              name="columns"
              type="number"
              fullWidth
              value={form.columns}
              onChange={handleChange}
              inputProps={{ min: 1 }}
            />
          </DialogContent>
          <DialogActions sx={{ width: "430px" }}>
            <button style={{ width: "100px", border: "1px solid #000", background: "#000", color: "#fff", padding: "10px", cursor: "pointer", borderRadius: "5px" }} onClick={handleClose}>Cancel</button>
            <button style={{ width: "120px", border: "1px solid #000", background: "#000", color: "#fff", padding: "10px", cursor: "pointer", borderRadius: "5px" }} onClick={handleCreateRoom}>Create Room</button>
          </DialogActions>
        </Dialog>

        {/* Render rooms */}
        <div style={{ marginTop: '40px', display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: "70px" }}>
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onEdit={handleEditRoom}
              onDelete={handleDeleteRoom}
            />
          ))}

        </div>
      </div>

      {/* alert dialog */}
      <AlertDialog
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        message={alertMessage}
      />

    </AuthGuard>
  );
}

export default Rooms;
