"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function AdminGrowthChart({ data }: { data: any[] }) {
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#171717', border: '1px solid #333', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                    />
                    <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="listings" stroke="#a855f7" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
