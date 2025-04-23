/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import {
  Box,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,

  TextField,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import supabase from '@/lib/supabaseClient';
import { Room, Seat } from '@/interfaces/interface';
import AuthGuard from '@/components/AuthGuard';
import { Grid } from 'react-virtualized';
import 'react-virtualized/styles.css';

const RoomDetailsPage = () => {
  const { id } = useParams();
  const [room, setRoom] = useState<Room | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [form, setForm] = useState({ name: '', age: '' });
  const [formOpen, setFormOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);

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

  const handleSeatClick = (seat: Seat) => {
    setSelectedSeat(seat);
    if (seat.is_allocated) {
      setForm({
        name: seat.name || '',
        age: seat.age?.toString() || '',
      });
      setFormOpen(true); // Directly open form if already allocated
    } else {
      setActionDialogOpen(true); // Show decision dialog otherwise
    }
  };


  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAllotSeat = () => {
    if (selectedSeat) {
      setForm({
        name: selectedSeat.name || '',
        age: selectedSeat.age?.toString() || '',
      });
    }
    setFormOpen(true);
    setActionDialogOpen(false);
  };

  const handleBlankSeatToggle = async () => {
    if (!selectedSeat) return;

    const isNowBlank = !selectedSeat.is_blank;

    const { error } = await supabase
      .from('seats')
      .update({
        is_blank: isNowBlank,
        is_allocated: false,
        name: null,
        age: null,
      })
      .eq('id', selectedSeat.id);

    if (!error) {
      setSeats((prev) =>
        prev.map((s) =>
          s.id === selectedSeat.id
            ? {
              ...s,
              is_blank: isNowBlank,
              is_allocated: false,
              name: null,
              age: null,
            }
            : s
        )
      );
      setActionDialogOpen(false);
    }
  };

  const handleSave = async () => {
    if (!selectedSeat) return;

    const { error } = await supabase
      .from('seats')
      .update({
        name: form.name,
        age: Number(form.age),
        is_allocated: true,
        is_blank: false,
      })
      .eq('id', selectedSeat.id);

    if (!error) {
      setSeats((prev) =>
        prev.map((s) =>
          s.id === selectedSeat.id
            ? {
              ...s,
              name: form.name,
              age: Number(form.age),
              is_allocated: true,
              is_blank: false,
            }
            : s
        )
      );
      setFormOpen(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSeat) return;

    const { error } = await supabase
      .from('seats')
      .update({
        is_allocated: false,
        is_blank: false,
        name: null,
        age: null,
      })
      .eq('id', selectedSeat.id);

    if (!error) {
      setSeats((prev) =>
        prev.map((s) =>
          s.id === selectedSeat.id
            ? { ...s, is_allocated: false, is_blank: false, name: null, age: null }
            : s
        )
      );
      setFormOpen(false);
    }
  };


  const renderSeat = ({ columnIndex, rowIndex, key, style }: any) => {
    const seat = getSeat(rowIndex, columnIndex);
    if (!seat) return null;

    let bgColor = '#2196f3'; // available
    if (seat.is_allocated) bgColor = '#f44336'; // allocated
    else if (seat.is_blank) bgColor = '#9e9e9e'; // blank

    return (
      <div key={key} style={{ ...style, padding: '3px' }}>
        <Tooltip
          title={
            seat.is_allocated
              ? `${seat.name}, Age: ${seat.age}`
              : seat.is_blank
                ? 'Blank Seat'
                : 'Available'
          }
          arrow
        >
          <Box
            onClick={() => handleSeatClick(seat)}
            sx={{
              width: '100%',
              height: '100%',
              backgroundColor: bgColor,
              color: 'white',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              userSelect: 'none',
            }}
          >
            {seat.seat_label}
          </Box>
        </Tooltip>
      </div>
    );
  };

  return (
    <AuthGuard>
      <Box
        sx={{
          p: 4,
          border: '1px solid rgba(218, 218, 218, 0.297)',
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.05)',
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 className="kanit">Room: {room?.name}</h2>
            <p style={{ margin: '5px 0' }} className="outfit">
              Total Seats: {room?.rows && room?.columns ? room.rows * room.columns : 0}
            </p>
            <p style={{ margin: '5px 0' }} className="outfit">
              Description: {room?.description}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '30px', marginBottom: '20px', }}>
            <div className='outfit'><span style={{ background: '#2196f3', padding: '0px 10px', borderRadius: '4px', marginRight: "6px" }}></span> Available</div>
            <div className='outfit'><span style={{ background: '#f44336', padding: '0px 10px', borderRadius: '4px', marginRight: "6px" }}></span> Allocated</div>
            <div className='outfit'><span style={{ background: '#9e9e9e', padding: '0px 10px', borderRadius: '4px', marginRight: "6px" }}></span> Blocked</div>
          </div>
        </div>
        {room && (
          <Box
            sx={{
              display: 'flex',
              gap: 8,
              mt: 4,
              border: '1px solid rgba(218, 218, 218, 0.297)',
              justifyContent: 'center',
              padding: '30px 0',
            }}
          >
            <Grid
              columnCount={room.columns}
              columnWidth={44}
              height={500}
              rowCount={room.rows}
              rowHeight={44}
              width={Math.min(room.columns * 44, 900)}
              cellRenderer={renderSeat}
            />
          </Box>
        )}

        {/* Action Dialog */}
        <Dialog disableScrollLock={true} open={actionDialogOpen} onClose={() => setActionDialogOpen(false)}>
          <DialogTitle sx={{ color: "#000", fontFamily: "kanit", fontSize: "25px", display: "flex", justifyContent: "center" }}>Select Action</DialogTitle>
          <DialogActions>
            <button style={{ width: "120px", padding: "10px", fontSize: "15px", fontFamily: "outfit", backgroundColor: "#9e9e9e", borderRadius: "5px", cursor: "pointer", border: "1px solid" }} onClick={handleBlankSeatToggle}>
              {selectedSeat?.is_blank ? 'Unblank Seat' : 'Blank Seat'}
            </button>
            <button style={{ width: "100px", padding: "10px", fontSize: "15px", fontFamily: "outfit", backgroundColor: "white", borderRadius: "5px", border: "1px solid rgb(33,150,243)", color: "rgb(33,150,243)", cursor: "pointer" }} onClick={handleAllotSeat}>Allot Seat</button>
            <button style={{ width: "100px", padding: "10px", fontSize: "15px", fontFamily: "outfit", backgroundColor: "white", borderRadius: "5px", border: "1px solid rgb(211,47,47)", color: "rgb(211,47,47)", cursor: "pointer" }} onClick={() => setActionDialogOpen(false)}>Cancel</button>
          </DialogActions>
        </Dialog>

        {/* Allot Seat Form */}
        <Dialog disableScrollLock={true} open={formOpen} onClose={() => setFormOpen(false)}>
          <DialogTitle sx={{ display: "flex", justifyContent: "center", fontFamily: "kanit", fontSize: "25px" }}>Allot Seat</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField sx={{ mt: 2 }} label="Name" name="name" value={form.name} onChange={handleFormChange} />
            <TextField label="Age" name="age" type="number" value={form.age} onChange={handleFormChange} />
          </DialogContent>
          <DialogActions sx={{ paddingRight: "20px" }}>
            {selectedSeat?.is_allocated && (
              <button style={{ width: "70px", padding: "10px", fontSize: "15px", fontFamily: "outfit", backgroundColor: "white", borderRadius: "5px", border: "1px solid rgb(211,47,47)", color: "rgb(211,47,47)", cursor: "pointer" }} onClick={handleDelete}>
                Delete
              </button>
            )}
            {/* <Button onClick={() => setFormOpen(false)}>Cancel</Button> */}
            <button style={{ width: "70px", padding: "10px", fontSize: "15px", fontFamily: "outfit", backgroundColor: "white", borderRadius: "5px", border: "1px solid rgb(33,150,243)", color: "rgb(33,150,243)", cursor: "pointer" }} onClick={handleSave}>Save</button>

          </DialogActions>
        </Dialog>
      </Box>
    </AuthGuard>
  );
};

export default RoomDetailsPage;







