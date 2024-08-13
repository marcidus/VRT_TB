'use client';

import React,{useMemo} from 'react';
import dynamic from 'next/dynamic';

export default function MapDisplay() {

    const Map = useMemo(() => dynamic(
        () => import('../components/Charts/common/MapComponent'),
        { 
          loading: () => <p>A map is loading</p>,
          ssr: false
        }
      ), [])

    return (
        <div>
             <Map/>
        </div>
    );
};
