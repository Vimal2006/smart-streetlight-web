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

export function useAnalyticsData() {
  const [historicalData, setHistoricalData] = useState<Metric[]>([]);

  useEffect(() => {
    const dataRef = ref(db, "/history"); // <-- now reading from /history
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const value = snapshot.val();
      if (value) {
        // Convert the Firebase object to an array
        const entries = Object.entries(value).map(([key, data]: any) => {
          const timestamp = data.timestamp
            ? new Date(data.timestamp)
            : new Date(); // fallback if missing
          const timeStr = `${timestamp
            .getHours()
            .toString()
            .padStart(2, "0")}:${timestamp
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;
          return {
            time: timeStr,
            light: data.pwmValue ?? 0,
            rain: data.rain ?? 0,
            temp: data.temperature ?? 0,
            humidity: data.humidity ?? 0,
          };
        });

        // Sort by time (optional but helps keep the graph ordered)
        const sorted = entries.sort((a, b) => (a.time > b.time ? 1 : -1));

        // Keep only the last 24 entries for display
        setHistoricalData(sorted.slice(-24));
      } else {
        setHistoricalData([]);
      }
    });

    return () => unsubscribe();
  }, []);

  return historicalData;
}

