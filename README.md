# Smart Streetlight Web App & Dynamic Firmware

An automated, data-driven smart street lighting system built using a Dual-Core ESP32 processor running FreeRTOS. The system calculates an optimized PWM dimming curve via environmental data fusion and streams live analytics to a responsive React/Supabase web dashboard.

🌐 **Live Dashboard Link:** [smart-streetlight-web.vercel.app](https://smart-streetlight-web.vercel.app)

## 🚀 Features

* **Multi-Sensor Edge Intelligence:** Fuses real-time data from an LDR (Light Dependent Resistor), DHT11 Temperature & Humidity sensor, and an analog Water/Rainfall tracking module.
* **Deterministic Dual-Core Processing (FreeRTOS):** Employs safe multi-task management using distinct thread execution routines decoupled through FreeRTOS Queues (`xQueue`).
* **Weighted Power Optimization Formula:** Computes adaptive dimming parameters utilizing multi-variable linear logic to optimize power grids:
  $$PWM_{Final} = 0.8 \cdot LDR_{Norm} + 0.1 \cdot Rain_{Norm} + 0.02 \cdot (1 - Temp_{Norm}) + 0.08 \cdot Hum_{Norm}$$
* **I2C Master-Slave Communication:** Distributes real-time system executions by translating calculated duty cycles into an 8-bit signal transmitted over a $50\text{ kHz}$ I2C interface to isolated peripheral LED controllers.
* **Live Firebase Integration:** Connects seamlessly with real-time cloud clusters to bridge physical deployments with remote control desks.

---

## 🛠️ Hardware Ecosystem

* **Core Processor:** ESP32 (Dual-Core, 12-bit ADC resolution, configured with 11dB attenuation)
* **Light Sensor:** Analog LDR module (Pin 32)
* **Climate Sensor:** DHT11 Digital Temperature & Humidity Sensor (Pin 4)
* **Precipitation Sensor:** Analog Water Level/Rain sensor (Pin 33)
* **Local Actuator:** High-frequency PWM Dimming Unit (Pin 5)
* **Peripheral Bus:** Dedicated I2C Bus (`SDA: Pin 21`, `SCL: Pin 22`) running at Slave Address `0x08`.

---

## 📂 Repository Architecture

```text
smart-streetlight-web/
├── firmware/            # Embedded C Firmware
│   ├── I2C_Slave.ino       # Target logic mapping local LED controllers
│   └── LDR_interfacing.ino # Edge computing firmware & telemetry loop
├── src/                 # React Web Application Client (Dashboard)
├── supabase/            # Database definitions & real-time configurations
├── .gitignore           # Keeps critical local credential logs safe (.env)
└── README.md            # System overview documentation
