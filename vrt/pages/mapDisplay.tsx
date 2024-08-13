'use client';

import React,{useMemo} from 'react';
import dynamic from 'next/dynamic';

export default function MapDisplay() {

    const Map = useMemo(() => dynamic(
        () => import('../components/MapComponent'),
        { 
          loading: () => <p>A map is loading</p>,
          ssr: false
        }
      ), [])

    return (
        <div>
            <h1>Map</h1>
             <Map/>
        </div>
    );
};
