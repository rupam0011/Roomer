"use client";
import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Box } from '@mui/material';

interface ChartData {
    name: string;
    total: number;
    allocated: number;
}

const AreaChartStats: React.FC<{ data: ChartData[] }> = ({ data }) => {
    return (
        <Box sx={{ width: '100%', height: 400, mt: 4 ,px: 0}}>
            <p className='kanit' style={{marginBottom:"20px",fontSize:"20px", fontWeight:"600",paddingLeft:"5px"}}>
                Room-wise Seat Allocation
           </p>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 20, left: 5, bottom: 0 }}
                    
                >
                    <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorAllocated" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8fd3f4" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8fd3f4" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="name"
                        minTickGap={0}
                        className='outfit'
                    />


                    <YAxis 
                    className='outfit'
                    />
                    <Tooltip
                        contentStyle={{
                            borderRadius: '10px',
                            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                        }}
                        formatter={(value, name) => {
                            console.log({ value, name }); // Debug!
                            if (name === 'total') return [`${value}`, 'Total Seats'];
                            if (name === 'allocated') return [`${value}`, 'Allocated Seats'];
                            return [`${value}`, name]; // fallback
                        }}

                    />
                    <Area
                        type="monotone"
                        dataKey="total"
                        stroke="#8884d8"
                        fillOpacity={1}
                        fill="url(#colorTotal)"
                        name="Total Seats"
                       
                    />

                    <Area
                        type="monotone"
                        dataKey="allocated"
                        stroke="#82ca9d"
                        fillOpacity={1}
                        fill="url(#colorAllocated)"
                        name="Allocated Seats"
                       
                    />
                </AreaChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default AreaChartStats;
