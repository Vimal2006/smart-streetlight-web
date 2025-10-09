import Navigation from "@/components/Navigation";
import { useAnalyticsData, Metric } from "@/hooks/useAnalyticsData";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useState, useEffect } from "react";

const Analytics = () => {
  const liveData = useAnalyticsData();
  const [chartData, setChartData] = useState<Metric[]>([]);

  useEffect(() => {
    if (liveData) {
      setChartData(prev => [...prev.slice(-19), liveData]); // Keep last 20 points
    }
  }, [liveData]);

  if (!liveData) return <p className="p-6">Waiting for live data...</p>;

  // Calculate averages over the current chart data
  const sum = chartData.reduce((acc, cur) => ({
    light: acc.light + cur.light,
    rain: acc.rain + cur.rain,
    temp: acc.temp + cur.temp,
    humidity: acc.humidity + cur.humidity,
  }), { light: 0, rain: 0, temp: 0, humidity: 0 });

  const count = chartData.length;
  const avg = {
    light: +(sum.light / count).toFixed(1),
    rain: +(sum.rain / count).toFixed(1),
    temp: +(sum.temp / count).toFixed(1),
    humidity: +(sum.humidity / count).toFixed(1),
  };

  const customTooltipStyle = {
    backgroundColor: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "0.5rem",
    padding: "0.75rem",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Live Analytics
          </h2>
          <p className="text-muted-foreground">Real-time sensor readings</p>
        </div>

        {/* Charts */}
        <div className="space-y-8">
          {/* Light & Rain */}
          <div className="p-6 bg-card border border-border rounded-lg">
            <h3 className="text-xl font-semibold mb-6 text-primary">Light & Rain Intensity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
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
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '0.875rem' }} />
                <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: '0.875rem' }} />
                <Tooltip contentStyle={customTooltipStyle} labelStyle={{ color: "hsl(var(--foreground))" }} />
                <Legend wrapperStyle={{ color: "hsl(var(--foreground))" }} />
                <Area type="monotone" dataKey="light" stroke="hsl(var(--primary))" fill="url(#colorLight)" strokeWidth={2} name="Light %" />
                <Area type="monotone" dataKey="rain" stroke="hsl(var(--secondary))" fill="url(#colorRain)" strokeWidth={2} name="Rain %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Temp & Humidity */}
          <div className="p-6 bg-card border border-border rounded-lg">
            <h3 className="text-xl font-semibold mb-6 text-accent">Temperature & Humidity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '0.875rem' }} />
                <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: '0.875rem' }} />
                <Tooltip contentStyle={customTooltipStyle} labelStyle={{ color: "hsl(var(--foreground))" }} />
                <Legend wrapperStyle={{ color: "hsl(var(--foreground))" }} />
                <Line type="monotone" dataKey="temp" stroke="hsl(var(--accent))" strokeWidth={3} dot={{ r: 4 }} name="Temperature °C" />
                <Line type="monotone" dataKey="humidity" stroke="hsl(var(--secondary))" strokeWidth={3} dot={{ r: 4 }} name="Humidity %" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Average Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 bg-card border border-primary/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Avg Light Intensity</p>
              <p className="text-3xl font-bold text-primary">{avg.light}%</p>
            </div>
            <div className="p-6 bg-card border border-secondary/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Avg Rain Intensity</p>
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
        </div>
      </main>
    </div>
  );
};

export default Analytics;
