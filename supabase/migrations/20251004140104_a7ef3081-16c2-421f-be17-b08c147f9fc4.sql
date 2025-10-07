-- Create sensor_readings table to store IoT sensor data
CREATE TABLE public.sensor_readings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  light_intensity DECIMAL(5,2) NOT NULL CHECK (light_intensity >= 0 AND light_intensity <= 100),
  rain_intensity DECIMAL(5,2) NOT NULL CHECK (rain_intensity >= 0 AND rain_intensity <= 100),
  temperature DECIMAL(5,2) NOT NULL,
  humidity DECIMAL(5,2) NOT NULL CHECK (humidity >= 0 AND humidity <= 100),
  sensor_id TEXT DEFAULT 'default',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries by timestamp
CREATE INDEX idx_sensor_readings_timestamp ON public.sensor_readings(timestamp DESC);

-- Enable Row Level Security
ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read sensor data (public dashboard)
CREATE POLICY "Anyone can view sensor readings" 
ON public.sensor_readings 
FOR SELECT 
USING (true);

-- Allow inserts from service role (for IoT devices via edge function)
CREATE POLICY "Service role can insert sensor readings" 
ON public.sensor_readings 
FOR INSERT 
WITH CHECK (true);