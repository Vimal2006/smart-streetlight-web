#include <Arduino.h>
#include <Wire.h>


#define I2C_ADDRESS 0x08
#define pwmpin 5


int pwmchannel=0;
int freq=1000;
int resolution=8;

void receiveevent(int bytes){
  while(Wire.available()){
    int val=Wire.read();
    val=constrain(val,0,255);
    ledcWrite(pwmpin,val);
    Serial.printf("Received PwmValue: %d\n",val);
  }
}
void setup() {
  Serial.begin(115200);
  Serial.println("Slave ESP32 Ready - Waiting for PWM values");
  Wire.begin(I2C_ADDRESS); 
  Wire.onReceive(receiveevent);
  ledcAttachChannel(pwmpin,freq,resolution,pwmchannel);
  

}

void loop() {
  delay(1000);
}
