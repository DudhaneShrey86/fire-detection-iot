
#define BLYNK_PRINT Serial
#include <ESP8266WiFi.h>
#include <SPI.h>
#include <BlynkSimpleEsp8266.h>
#include <DHT.h>
#include <WiFiClient.h> 
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>


#define soilpin A0
#define DHTPIN 2
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);
BlynkTimer timer;


char auth[] = "YOwxZkC_0PQJNlchFjYIeWE0kSdaWHFk"; //Auth code sent via Email
char ssid[] = "FR"; //Wifi name
char pass[] = "8652698098";  //Wifi Password
const char *host = "http://fire-detection-iot.000webhostapp.com/";


int flag1=0;
int flag2 = 0;
String st = "";
void notifyOnFire()
{
  int isButtonPressed = digitalRead(D1);
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  float moisturepercentage = 100.00 - ((analogRead(soilpin)/1024.00) * 100.00);
  if (isnan(h) || isnan(t)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }
  if (isButtonPressed==1 && flag1==0) {
    Serial.println("Fire in the House");
    Blynk.notify("Fire in the House");
    flag1=1;
  }
  else if (isButtonPressed==0)
  {
    flag1=0;
  }
  if(h <= 40 && t >= 30 && flag2 == 0){
    flag2 = 1;
    st = "Potential risk of firest fire! \nTemperature: "+String(t)+" Humidity: "+String(h);
    Blynk.notify(st);
  }
  Blynk.virtualWrite(V5, h);
  Blynk.virtualWrite(V6, t);
  Blynk.virtualWrite(V4, moisturepercentage);
}

void senddatatodatabase(){
  HTTPClient http;
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  float moisturepercentage = 100.00 - ((analogRead(soilpin)/1024.00) * 100.00);
  String deviceid = "nodemcu_1";
  String postData = "deviceid=" + deviceid + "&temperature="+String(t)+"&humidity="+String(h)+"&moisture="+String(moisturepercentage);
  http.begin("http://fire-detection-iot.000webhostapp.com/insertrecord.php");              //Specify request destination
  http.addHeader("Content-Type", "application/x-www-form-urlencoded");    //Specify content-type header

  int httpCode = http.POST(postData);   //Send the request
  String payload = http.getString();    //Get the response payload

  Serial.println(httpCode);   //Print HTTP return code
  Serial.println(payload);    //Print request response payload
  http.end();
}

void resetflag(){
  flag2 = 0;
}


void setup()
{
  Serial.begin(9600);
  Blynk.begin(auth, ssid, pass);
  
  dht.begin();
  pinMode(D1,INPUT_PULLUP);
  pinMode(soilpin, INPUT);
  timer.setInterval(1000L,notifyOnFire);
  timer.setInterval(1800000L,senddatatodatabase);
  timer.setInterval(30000L,resetflag);
}
void loop()
{
  Blynk.run();
  timer.run();
}
