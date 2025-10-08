import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import Navigation from "@/components/Navigation";
import {
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from "recharts";

const Analytics = () => {
  const [data, setData] = useState<any[]>([]);
  const [avg, setAvg] = useState({
    light: 0,
    rain: 0,
    temp: 0,
    humidity: 0,
  });

  useEffect(() => {
    const dataRef = ref(db, "/streetlightHistory");

    onValue(dataRef, (snapshot) => {
      const raw = snapshot.val();
      if (raw) {
        const entries = Object.entries(raw).map(([time, v]: any) => ({
          time: time.split("T")[1]?.slice(0, 5) || time,
          light: v.ldr ? Math.min(100, (v.ldr / 4095) * 100) : 0,
          rain: v.rain || 0,
          temp: v.temperature || 0,
          humidity: v.humidity || 0,
        }));

        // Sort chronologically
        const sorted = entries.sort((a, b) =>
          a.time.localeCompare(b.time)
        );

        // Compute averages
        const sum = sorted.reduce(
          (acc, x) => ({
            light: acc.light + x.light,
            rain: acc.rain + x.rain,
            temp: acc.temp + x.temp,
            humidity: acc.humidity + x.humidity,
          }),
          { light: 0, rain: 0, temp: 0, humidity: 0 }
        );

        const count = sorted.length;
        setAvg({
  light: Number((sum.light / count).toFixed(1)),
  rain:  Number((sum.rain  / count).toFixed(1)),
  temp:   Number((sum.temp   / count).toFixed(1)),
  humidity:Number((sum.humidity / count).toFixed(1)),
});

        setData(sorted);
      }
    });
  }, []);

  const tooltipStyle = {
    backgroundColor: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "0.5rem",
    padding: "0.75rem",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Live Analytics
        </h2>

        {data.length === 0 ? (
          <p className="text-center text-muted-foreground mt-10">
            Waiting for historical data...
          </p>
        ) : (
          <>
            {/* Light & Rain Chart */}
            <div className="p-6 bg-card border border-border rounded-lg mb-8">
              <h3 className="text-xl font-semibold mb-4 text-primary">Light & Rain Intensity</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorLight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Area type="monotone" dataKey="light" stroke="hsl(var(--primary))" fill="url(#colorLight)" name="Light (%)"/>
                  <Area type="monotone" dataKey="rain" stroke="hsl(var(--secondary))" fill="url(#colorRain)" name="Rain (%)"/>
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Temperature & Humidity */}
            <div className="p-6 bg-card border border-border rounded-lg mb-8">
              <h3 className="text-xl font-semibold mb-4 text-accent">Temperature & Humidity</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Line type="monotone" dataKey="temp" stroke="hsl(var(--accent))" strokeWidth={3} dot={{ r: 3 }} name="Temperature (°C)" />
                  <Line type="monotone" dataKey="humidity" stroke="hsl(var(--secondary))" strokeWidth={3} dot={{ r: 3 }} name="Humidity (%)" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Average Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-card border border-primary/30 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Avg Light Intensity</p>
                <p className="text-3xl font-bold text-primary">{avg.light}%</p>
              </div>
              <div className="p-6 bg-card border border-secondary/30 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Avg Rain</p>
                <p className="text-3xl font-bold text-secondary">{avg.rain}%</p>
              </div>
              <div className="p-6 bg-card border border-accent/30 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Avg Temperature</p>
                <p className="text-3xl font-bold text-accent">{avg.temp}°C</p>
              </div>
              <div className="p-6 bg-card border border-secondary/30 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Avg Humidity</p>
                <p className="text-3xl font-bold text-secondary">{avg.humidity}%</p>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Analytics;
