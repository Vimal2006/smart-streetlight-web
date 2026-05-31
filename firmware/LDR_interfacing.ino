#include <Arduino.h>
#include <DHT.h>
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
#include <Wire.h>

#include <WiFi.h>
#include <FirebaseESP32.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

//wifi
#define WIFI_SSID "vivo T2x 5G"
#define WIFI_PASSWORD "Vimal2006"
#define API_KEY "AIzaSyBG9lLUSNtIPAmdkflYUdYIb8UyGmI8Zxw"
#define DATABASE_URL "https://smart-street-lighting-f0dbb-default-rtdb.asia-southeast1.firebasedatabase.app/"
#define USER_EMAIL "vtvimaladitya@gmail.com"
#define USER_PASSWORD "Vimal@2006"
#define SLAVE_ADDR 0x08

FirebaseData fbdo;
FirebaseJson json;
FirebaseAuth auth; 
FirebaseConfig config;
unsigned long sendDataPrevMillis = 0; 

#if CONFIG_FREERTOS_UNICORE
static const BaseType_t app_cpu=0;
#else
static const BaseType_t app_cpu=1;
#endif

//LDR configuration
static int anpin=32;
static int ldrval;
static float voltval;

//DHT11 configuration
#define tempin 4
#define DHTTYPE DHT11
DHT dht(tempin,DHTTYPE);

//water sensor configuration
#define waterpin 33
static float rainval;

//LED configuration
static const int pwmpin=5;
static const int pwmchannel=0;
static const int freq=1000;
static const int resolution=12;


//Taskhandles
static TaskHandle_t ledhandle=NULL;
static TaskHandle_t sensorhandle=NULL;

//Queuehandle
static QueueHandle_t queue_msg;
static QueueHandle_t firebase_queue; 
static const int queue_len=6;

//structure datatype
typedef struct{
  uint16_t ldr;
  float temp;
  float hum;
  float rain;
  float pwmValue;
}sensordata; 

typedef struct{
  uint16_t ldr;
  float temp;
  float hum;
  float rain;
  float pwmValue;
}firebasedata; 

void sensortask(void *parameters){
  while(1){
    sensordata data;
    ldrval=4095-analogRead(anpin);
    rainval=analogRead(waterpin);
    float humidity=dht.readHumidity();
    float temperature=dht.readTemperature();
    voltval=ldrval*(3.3/4095);
    data.ldr=ldrval;
    data.rain=rainval;
    data.temp=temperature;
    data.hum=humidity;

    float tempNorm = constrain(temperature / 50.0, 0, 1);
    float humNorm = constrain(humidity / 100.0, 0, 1);
    float ldrNorm = constrain(ldrval / 4095.0, 0, 1);
    float rainNorm = constrain(rainval / 4095.0, 0, 1);
    float pwmF = 0.8*(ldrNorm) + 0.1*(rainNorm) + 0.02*(1-tempNorm) + 0.08*humNorm;
    pwmF = constrain(pwmF, 0, 1);
    data.pwmValue = (pwmF * 4095.0);

    xQueueSend(queue_msg,(void*)&data,10);
    vTaskDelay(500 / portTICK_PERIOD_MS);
  }
}  

void ledtask(void *parameter){
  while(1){
    
    sensordata recdata;
    if(xQueueReceive(queue_msg,(void *)&recdata,portMAX_DELAY)==pdTRUE){
      
      ledcWrite(pwmpin,(int)recdata.pwmValue);
      uint8_t pwmtosend=(int)((recdata.pwmValue/4095)*255);
      Wire.beginTransmission(SLAVE_ADDR);
      Wire.write(pwmtosend);
      Wire.endTransmission();

      Serial.print("Light Intensity% :");
      Serial.print((recdata.pwmValue/4095.0)*100);
      Serial.print(" ||Rain Intersity% : ");
      Serial.print((recdata.rain/4095)*100);
      Serial.print(" ||Temperaute :");
      Serial.print(recdata.temp);
      Serial.print(" ||Humidity :");
      Serial.println(recdata.hum);
      
      firebasedata fbData;
      fbData.temp = recdata.temp;
      fbData.hum = recdata.hum;
      fbData.ldr = recdata.ldr;
      fbData.rain = (recdata.rain / 4095.0) * 100;
      fbData.pwmValue = (recdata.pwmValue / 4095.0) * 100;
      
      xQueueSend(firebase_queue, &fbData, 0);
      
      vTaskDelay(500 / portTICK_PERIOD_MS);
    }
  }
}

void firebase(void *parameter){
  while(1){
    firebasedata firedata;
    if(xQueueReceive(queue_msg,(void *)&firedata,portMAX_DELAY)==pdTRUE){
      if (Firebase.ready()&& (millis() - sendDataPrevMillis > 2000 || sendDataPrevMillis == 0)){   
        sendDataPrevMillis = millis();
        FirebaseJson json;
        json.set("temperature", firedata.temp);
        json.set("humidity", firedata.hum);
        json.set("ldr", firedata.ldr);
        json.set("rain", (firedata.rain / 4095.0) * 100);
        json.set("pwmValue", (firedata.pwmValue / 4095.0) * 100);

        if (Firebase.set(fbdo, "/streetlightNode1", &json)) {
          Serial.println("Data uploaded to Firebase!");
        } else {
          Serial.println("Firebase upload failed: " + fbdo.errorReason());
        }
      }
      else{
        Serial.println("Firebase not yet ready");
      }

    }

  }
}

void setup() {
  Serial.begin(115200);
  Wire.begin(21, 22);
  Wire.setClock(50000); // 50kHz - try lower if unstable
  Serial.println("I2C Master initialized");

  // Give slave time to boot (important if slave boots slower)
  delay(2000);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());

  
  config.api_key = API_KEY;
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;
  config.database_url = DATABASE_URL;
  
  
  config.token_status_callback = tokenStatusCallback;
  
  Firebase.begin(&config, &auth);
  Firebase.setDoubleDigits(5);
  
  Serial.println("Initializing Firebase...");
  unsigned long startMillis = millis();
  
  while (!Firebase.ready() && millis() - startMillis < 15000) { 
    delay(500);
  }
  
  if (Firebase.ready()) {
    Serial.println("\nFirebase is ready to send data!");
    
    // Test Firebase connection
    if (Firebase.setInt(fbdo, "/testConnection", 123)) {
      Serial.println("Firebase connection test: SUCCESS");
    } else {
      Serial.println("Firebase connection test failed: " + fbdo.errorReason());
    }
  } else {
    Serial.println("\nFirebase initialization failed!");
    Serial.println("Error: " + fbdo.errorReason());
  }
  

  vTaskDelay(1000 / portTICK_PERIOD_MS);
  Serial.println("--------LDR Interfacing--------");
  queue_msg=xQueueCreate(queue_len,sizeof(sensordata));
  firebase_queue = xQueueCreate(queue_len, sizeof(firebasedata));
  dht.begin();
  ledcAttachChannel(pwmpin,freq,resolution,pwmchannel);
  analogSetAttenuation(ADC_11db); 
  analogReadResolution(12);
  xTaskCreatePinnedToCore(
    ledtask,
    "LED Task",
    6144 ,
    NULL,
    1,
    &ledhandle,
    app_cpu
  );

NEW SKETCH

  xTaskCreatePinnedToCore(
    sensortask,
    "LDR Task",
    4096,
    NULL,
    1,
    &sensorhandle,
    app_cpu
  );

  xTaskCreatePinnedToCore(
    firebase,
    "firebase Task",
    12288,
    NULL,
    1,
    &sensorhandle,
    app_cpu
  );
}

void loop() {
  delay(1000);
}
