import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { ref, onValue } from "firebase/database";

export interface Metric {
  time: string;
  light: number;
  rain: number;
  temp: number;
  humidity: number;
}

/**
 * Hook for fetching **live real-time data** from Firebase Realtime Database
 */
export function useAnalyticsData() {
  const [data, setData] = useState<Metric | null>(null);

  useEffect(() => {
    const liveRef = ref(db, "/streetlightNode1"); // live node only
    const unsubscribe = onValue(liveRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        const timestamp = val.timestamp ? new Date(val.timestamp) : new Date();
        const timeStr = `${timestamp.getHours().toString().padStart(2, "0")}:${timestamp
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;

        setData({
          time: timeStr,
          light: val.pwmValue ?? 0,
          rain: val.rain ?? 0,
          temp: val.temperature ?? 0,
          humidity: val.humidity ?? 0,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return data;
}



