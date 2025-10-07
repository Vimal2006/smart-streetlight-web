import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { ref, onValue } from "firebase/database";

interface Metrics {
  lightIntensity: number;
  rainIntensity: number;
  temperature: number;
  humidity: number;
}

export function useStreetlightData() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    const dataRef = ref(db, "/streetlightNode1"); // <-- updated path
    const unsubscribe = onValue(dataRef, (snapshot) => {
      const value = snapshot.val();
      if (value) {
        setMetrics({
          lightIntensity: value.pwmValue, // pwmValue corresponds to light intensity
          rainIntensity: value.rain,
          temperature: value.temperature,
          humidity: value.humidity,
        });
      }
    });
    return () => unsubscribe();
  }, []);

  return metrics;
}


