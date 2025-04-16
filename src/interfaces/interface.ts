export interface Room {
    id: string;
    name: string;
    description: string;
    image_url: string;
    capacity: number;
    created_at?: string;
  }
  
  export interface Seat {
    rooms_id: string;
    id?: string;
    seat_no: number;
    is_allocated: boolean;
    room_id: string;
    created_at?: string;
    assigned_to?: string;
    name?: string | null;
    age?: number | null;
  }
  