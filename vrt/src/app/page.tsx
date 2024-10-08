"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import "./page.css";

export default function Home() {

  return (
    <main className="main">
      <Image
        src="/car_background.avif"
        alt="Background Image"
        layout="fill"
        objectFit="cover"
        className="background-image"
      />
      <div className="logo-container">
        <Image
          src="/vrt_logo.webp"
          alt="VRT Logo"
          width={100}
          height={100}
          className="logo"
        />
      </div>
      <div className="content-container">
        <h1 className="fade-in">VRT</h1>
        <h2 className="fade-in">Valais Racing Team</h2>
        <h3 className="fade-in">Telemetry System</h3>
        <a href="/dashboard" className="link fade-in">
          Go to Dashboard
        </a>
      </div>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Welcome to My Dashboard App</h1>
        <a href="/mapDisplay" className="text-blue-500">Go to Map Display</a>
      </div>
    </main>
  );
}
