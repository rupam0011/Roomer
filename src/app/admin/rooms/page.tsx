/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React, { useEffect, useState } from 'react';
import Particles from '../../../../reactbits/Particles/Particles';
import { Room, Seat } from '@/interfaces/interface';
import supabase from '@/lib/supabaseClient';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import RoomCard from '@/components/Roomcard';
import AlertDialog from '@/components/AlertDialog';
import AuthGuard from '@/components/AuthGuard';
import { useForm } from 'react-hook-form';

type FormValues = {
  name: string;
  description: string;
  image_url: string;
  rows: number;
  columns: number;
};

const Rooms = () => {
  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      name: '',
      description: '',
      image_url: '',
      rows: 1,
      columns: 1,
    },
  });


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

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setAlertOpen(true);
  };

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    setEditingRoomId(null);
    reset();
  };

  const getRowLabel = (index: number): string => {
    let label = "";
    while (index >= 0) {
      label = String.fromCharCode((index % 26) + 65) + label;
      index = Math.floor(index / 26) - 1;
    }
    return label;
  };

  const handleEditRoom = (room: Room) => {
    setValue('name', room.name);
    setValue('description', room.description || '');
    setValue('image_url', room.image_url || '');
    setValue('rows', room.rows || 1);
    setValue('columns', room.columns || 1);
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

  const onSubmit = async (data: FormValues) => {
  const { name, description, image_url, rows, columns } = data;

  if (!name || !rows || !columns) {
    showAlert("Please fill all required fields");
    return;
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return showAlert("Not logged in");

  if (editingRoomId) {
    // ✅ Update room
    const { error: updateError } = await supabase.from("rooms")
      .update({ name, description, image_url, rows, columns })
      .eq("id", editingRoomId);

    if (updateError) return showAlert("Failed to update room");

    // ✅ Delete old seats for that room
    const { error: deleteError } = await supabase.from("seats")
      .delete()
      .eq("rooms_id", editingRoomId);

    if (deleteError) return showAlert("Room updated, but failed to delete old seats");

    // ✅ Generate new seats based on updated rows/columns
    const newSeats = [];
    for (let r = 0; r < rows; r++) {
      const rowLabel = getRowLabel(r);
      for (let c = 1; c <= columns; c++) {
        newSeats.push({
          seat_no: r * columns + c,
          row_label: rowLabel,
          column_number: c,
          seat_label: `${rowLabel}${c}`,
          is_allocated: false,
          is_blank: false,
          rooms_id: editingRoomId,
        });
      }
    }

    const { error: insertError } = await supabase.from("seats").insert(newSeats);
    if (insertError) return showAlert("Room updated, but failed to regenerate seats");

    showAlert("Room updated successfully");
    await fetchRooms();
    await fetchSeats(); // ✅ Also refresh seats
    handleClose();
    return;
  }

  // Room creation logic (unchanged)
  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .insert([{ name, description, image_url, rows, columns, user_id: user.id }])
    .select()
    .single();

  if (roomError) return showAlert("Failed to create room");

  const seats = [];
  for (let r = 0; r < rows; r++) {
    const rowLabel = getRowLabel(r);
    for (let c = 1; c <= columns; c++) {
      seats.push({
        seat_no: r * columns + c,
        row_label: rowLabel,
        column_number: c,
        seat_label: `${rowLabel}${c}`,
        is_allocated: false,
        is_blank: false,
        rooms_id: room.id,
      });
    }
  }

  const { error: seatError } = await supabase.from("seats").insert(seats);

  if (seatError) return showAlert("Room created but failed to add seats");

  showAlert("Room created successfully!");
  await fetchRooms();
  await fetchSeats(); // ✅ Refresh seat data here too
  handleClose();
};


  return (
    <AuthGuard>
      <div>
        <div style={{ width: '100%', height: '300px', position: 'relative', border: "2px solid #00e5ff", borderRadius: "20px", overflow: 'hidden', color: '#00e5ff', cursor: "pointer" }} onClick={handleClickOpen}>
          <Particles particleColors={['#00e5ff', '#00e5ff']} particleCount={800} particleSpread={20} speed={0.1} particleBaseSize={100} moveParticlesOnHover={true} alphaParticles={false} disableRotation={false} />
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', zIndex: 1, pointerEvents: "none" }}>
            <p className='kanit' style={{ fontSize: '35px', margin: 0 }}>Create new room</p>
          </div>
        </div>

        <Dialog disableScrollLock={true} open={open} onClose={handleClose}>
          <DialogTitle sx={{ color: "#000", fontFamily: "kanit", fontSize: "25px" }}>Create a New Room</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '450px' }}>
            <TextField
              label="Room Name"
              fullWidth
              error={!!errors.name}
              helperText={errors.name?.message}
              {...register('name', { required: 'Room name is required' })}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              error={!!errors.description}
              helperText={errors.description?.message}
              {...register('description', { required: 'Description is required' })}
            />
            <TextField
              label="Image URL"
              fullWidth
              error={!!errors.image_url}
              helperText={errors.image_url?.message}
              {...register('image_url', { required: 'Image URL is required' })}
            />
            <TextField
              label="Rows"
              type="number"
              fullWidth
              inputProps={{ min: 1, max: 100 }}
              error={!!errors.rows}
              helperText={errors.rows?.message}
              {...register('rows', { valueAsNumber: true, required: 'Rows are required' })}
            />
            <TextField
              label="Columns"
              type="number"
              fullWidth
              inputProps={{ min: 1 }}
              error={!!errors.columns}
              helperText={errors.columns?.message}
              {...register('columns', { valueAsNumber: true, required: 'Columns are required' })}
            />
          </DialogContent>

          <DialogActions sx={{ width: "430px" }}>
            <button style={{ width: "100px", border: "1px solid #000", background: "#000", color: "#fff", padding: "10px", cursor: "pointer", borderRadius: "5px" }} onClick={handleClose}>Cancel</button>
            <button style={{ width: "120px", border: "1px solid #000", background: "#000", color: "#fff", padding: "10px", cursor: "pointer", borderRadius: "5px" }} onClick={handleSubmit(onSubmit)}>{isEditing ? "Update Room" : "Create Room"}</button>
          </DialogActions>
        </Dialog>

        <div style={{ marginTop: '40px', display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: "70px" }}>
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} onEdit={handleEditRoom} onDelete={handleDeleteRoom} />
          ))}
        </div>
      </div>

      <AlertDialog open={alertOpen} onClose={() => setAlertOpen(false)} message={alertMessage} />
    </AuthGuard>
  );
};

export default Rooms;
