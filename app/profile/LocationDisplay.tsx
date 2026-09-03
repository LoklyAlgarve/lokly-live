"use client";

import { useEffect, useState } from "react";

export default function LocationDisplay() {
  const [location, setLocation] = useState("Algarve");

  useEffect(() => {
    const savedLocation = localStorage.getItem("lokly_location");

    if (savedLocation) {
      setLocation(savedLocation);
    }
  }, []);

  return <>{location}</>;
}