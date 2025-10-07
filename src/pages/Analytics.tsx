import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import Navigation from "@/components/Navigation";

const Analytics = () => {
  // Sample historical data
  const historicalData = [
    { time: "00:00", light: 45, rain: 12, temp: 18, humidity: 65 },
    { time: "04:00", light: 38, rain: 15, temp: 17, humidity: 68 },
    { time: "08:00", light: 65, rain: 8, temp: 22, humidity: 60 },
    { time: "12:00", light: 85, rain: 5, temp: 28, humidity: 55 },
    { time: "16:00", light: 78, rain: 20, temp: 26, humidity: 62 },
    { time: "20:00", light: 62, rain: 35, temp: 23, humidity: 70 },
  ];

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
            Historical Analytics
          </h2>
          <p className="text-muted-foreground">24-hour trends and patterns</p>
        </div>

        <div className="space-y-8">
          {/* Light & Rain Intensity Chart */}
          <div className="p-6 bg-card border border-border rounded-lg animate-fade-in">
            <h3 className="text-xl font-semibold mb-6 text-primary">Light & Rain Intensity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={historicalData}>
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
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '0.875rem' }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '0.875rem' }}
                />
                <Tooltip 
                  contentStyle={customTooltipStyle}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Legend 
                  wrapperStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="light" 
                  stroke="hsl(var(--primary))" 
                  fill="url(#colorLight)"
                  strokeWidth={2}
                  name="Light %"
                />
                <Area 
                  type="monotone" 
                  dataKey="rain" 
                  stroke="hsl(var(--secondary))" 
                  fill="url(#colorRain)"
                  strokeWidth={2}
                  name="Rain %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Temperature & Humidity Chart */}
          <div className="p-6 bg-card border border-border rounded-lg animate-fade-in">
            <h3 className="text-xl font-semibold mb-6 text-accent">Temperature & Humidity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '0.875rem' }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '0.875rem' }}
                />
                <Tooltip 
                  contentStyle={customTooltipStyle}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Legend 
                  wrapperStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="temp" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--accent))", r: 4 }}
                  name="Temperature °C"
                />
                <Line 
                  type="monotone" 
                  dataKey="humidity" 
                  stroke="hsl(var(--secondary))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--secondary))", r: 4 }}
                  name="Humidity %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-card border border-primary/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Avg Light Intensity</p>
              <p className="text-3xl font-bold text-primary">62.2%</p>
            </div>
            <div className="p-6 bg-card border border-secondary/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Avg Rain Intensity</p>
              <p className="text-3xl font-bold text-secondary">15.8%</p>
            </div>
            <div className="p-6 bg-card border border-accent/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Avg Temperature</p>
              <p className="text-3xl font-bold text-accent">22.3°C</p>
            </div>
            <div className="p-6 bg-card border border-secondary/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Avg Humidity</p>
              <p className="text-3xl font-bold text-secondary">63.3%</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
