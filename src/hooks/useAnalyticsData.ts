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
    const dataRef = ref(db, "/streetlightNode1"); // your Firebase path
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const value = snapshot.val();
      if (value) {
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

        // Append latest reading as new data point
        setHistoricalData((prev) => [
          ...prev,
          {
            time: timeStr,
            light: value.pwmValue,
            rain: value.rain,
            temp: value.temperature,
            humidity: value.humidity,
          },
        ].slice(-24)); // keep last 24 entries
      }
    });

    return () => unsubscribe();
  }, []);

  return historicalData;
}

