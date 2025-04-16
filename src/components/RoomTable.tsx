'use client';

import { AgGridReact } from 'ag-grid-react';
import { themeBalham } from 'ag-grid-community';
import { useMemo, useRef } from 'react';
import { Room, Seat } from '@/interfaces/interface';
import {
  ClientSideRowModelModule,
  ColDef,
  ICellRendererParams,
  ModuleRegistry,
} from 'ag-grid-community';
import Image from 'next/image'; // ✅ Import next/image

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const RoomTable = ({ rooms, seats }: { rooms: Room[]; seats: Seat[] }) => {
  const gridRef = useRef(null);

 

  const myTheme = themeBalham.withParams({
    accentColor: 'rgba(169, 169, 169, 0.45)',
    backgroundColor: 'rgb(13, 13, 13)',
    foregroundColor: 'rgb(198, 198, 198)',
    headerBackgroundColor: 'rgb(7, 7, 7)',
    headerTextColor: 'rgb(255, 255, 255)',
    spacing: 8,
    fontSize: '15px',
    fontFamily: 'outfit',
  });

  const roomsWithAllocatedSeats = useMemo(() => {
    return rooms.map((room) => ({
      ...room,
      allocatedSeats: seats.filter(
        (seat) => seat.rooms_id === room.id && seat.is_allocated === true
      ).length,
    }));
  }, [rooms, seats]);

  const columnDefs: ColDef[] = useMemo(() => {
    const centerStyle = {
      display: 'flex',
      alignItems: 'center',
      height: '100%',
    };

    return [
      {
        headerName: '',
        field: 'image_url',
        width: 70,
        pinned: 'left',
        suppressSizeToFit: true,
        cellRenderer: (params: ICellRendererParams<Room>) => (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Image
              src={params.value}
              alt="Room"
              width={30}
              height={30}
              style={{
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
          </div>
        ),
        cellStyle: { textAlign: 'center' },
      },
      {
        headerName: 'Room name',
        field: 'name',
        flex: 1,
        sortable: true,
        filter: true,
        cellStyle: centerStyle,
      },
      {
        headerName: 'Description',
        field: 'description',
        flex: 1,
        resizable: true,
        cellStyle: centerStyle,
      },
      {
        headerName: 'Capacity',
        field: 'capacity',
        flex: 1,
        sortable: true,
        cellStyle: centerStyle,
      },
      {
        headerName: 'Allocated Seats',
        field: 'allocatedSeats',
        flex: 1,
        cellStyle: centerStyle,
      },
    ];
  }, []); // ✅ Now no dynamic deps needed

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <AgGridReact<Room>
        theme={myTheme}
        ref={gridRef}
        rowData={roomsWithAllocatedSeats}
        columnDefs={columnDefs}
        pagination={true}
        paginationPageSize={10}
        rowHeight={40}
        domLayout="autoHeight"
      />
    </div>
  );
};

export default RoomTable;
