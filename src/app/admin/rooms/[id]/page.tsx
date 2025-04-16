'use client';
import {
  Box,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import supabase from '@/lib/supabaseClient';
import { Room, Seat } from '@/interfaces/interface';
import AuthGuard from '@/components/AuthGuard';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const RoomDetailsPage = () => {
  const { id } = useParams();
  const [room, setRoom] = useState<Room | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [form, setForm] = useState({ name: '', age: '' });
  const [open, setOpen] = useState(false);

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
    };

    if (id) fetchRoomAndSeats();
  }, [id]);

  const handleSeatClick = (seat: Seat) => {
    setSelectedSeat(seat);
    setForm({
      name: seat.name || '',
      age: seat.age?.toString() || '',
    });
    setOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!selectedSeat) return;

    const { error } = await supabase
      .from('seats')
      .update({
        is_allocated: true,
        name: form.name,
        age: Number(form.age),
      })
      .eq('id', selectedSeat.id);

    if (!error) {
      setSeats((prev) =>
        prev.map((s) =>
          s.id === selectedSeat.id
            ? { ...s, name: form.name, age: Number(form.age), is_allocated: true }
            : s
        )
      );
      setOpen(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSeat) return;

    const { error } = await supabase
      .from('seats')
      .update({ is_allocated: false, name: null, age: null })
      .eq('id', selectedSeat.id);

    if (!error) {
      setSeats((prev) =>
        prev.map((s) =>
          s.id === selectedSeat.id
            ? { ...s, name: null, age: null, is_allocated: false }
            : s
        )
      );
      setOpen(false);
    }
  };

  // Split into rows of 14
  const rows: Seat[][] = [];
  for (let i = 0; i < seats.length; i += 14) {
    rows.push(seats.slice(i, i + 14));
  }

  const renderBlock = (rows: Seat[][], side: 'left' | 'right') => {
    return rows.map((row, rowIndex) => {
      return (
        // eslint-disable-next-line react/jsx-key
        <AuthGuard>
        <Box key={rowIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {side === 'left' && (
            <Box sx={{ width: 20 }}>{alphabet[rowIndex]}</Box>
          )}
          {row.map((seat, index) => {
            const isInBlock = (side === 'left' && index < 7) || (side === 'right' && index >= 7);
            if (!isInBlock) return null;
  
            return (
              <Tooltip
                key={seat.id}
                title={
                  seat.is_allocated
                    ? `${seat.name}, Age: ${seat.age}`
                    : 'Available'
                }
                arrow
              >
                <Box
                  onClick={() => handleSeatClick(seat)}
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: seat.is_allocated ? '#f44336' : '#2196f3',
                    color: 'white',
                    mx: 0.5,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    userSelect: 'none',
                  }}
                >
                  {index + 1}
                </Box>
              </Tooltip>
            );
          })}
        </Box>
        </AuthGuard>
      );
    });
  };
  

  return (
    <AuthGuard>
    <Box sx={{ p: 4, border: "1px solid rgba(218, 218, 218, 0.297)", boxShadow:" 0 0 20px rgba(255, 255, 255, 0.05)" }}>
      <h2 className='kanit'>Room: {room?.name}</h2>
      <p className='outfit' style={{margin:"5px"}}>Total Seats: {room?.capacity}</p>
      <p className='outfit' style={{margin:"5px"}}>Description: {room?.description}</p>

      <Box sx={{ display: 'flex', gap: 8, mt: 4, border: "1px solid rgba(218, 218, 218, 0.297)", justifyContent:"center", padding:"30px 0"}}>
        <Box>{renderBlock(rows, 'left')}</Box>
        <Box>{renderBlock(rows, 'right')}</Box>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Seat Info</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleFormChange}
          />
          <TextField
            label="Age"
            name="age"
            type="number"
            value={form.age}
            onChange={handleFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </AuthGuard>
  );
};

export default RoomDetailsPage;
