export interface Room {
  id: string;
  name: string;
  description: string;
  image_url: string;
  rows: number; // 👈 New
  columns: number; // 👈 New
  created_at?: string;
  user_id: string;
}

export interface Seat {
  id?: string;
  seat_no: number;
  seat_label: string,
  rooms_id: string; // FK
  row_label: string; // 👈 New: A, B, C
  column_number: number; // 👈 New: 1, 2, 3
  is_allocated: boolean;
  is_blank: boolean;
  created_at?: string;
  name?: string | null;
  age?: number | null;
}
