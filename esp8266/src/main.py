import machine
import time
from machine import Pin
import ntptime
from lib.wifi import Wlan
from lib.umqtt.simple2 import MQTTClient


class Rain:
    vfactor = 4.8
    ffactor = 10000 / 95.03
    wlan = Wlan()
    mqtt = MQTTClient(
        client_id='rain_sensor',
        server='127.0.0.1',
        port=1883,
        keepalive=60,
        user='xx',
        password='xx'
    )

    def __init__(self):
        self.last = 0
        self.counter = 0
        self.wlan.connect()
        ntptime.settime()

    def measure(self, pin=None):
        self.counter += 1
        print('counter:', self.counter)

        self.last = time.ticks_ms()
        now = time.localtime()
        minuten = now[4]

        if minuten in (0, 30):
            if not self.wlan.wlan.isconnected():
                self.wlan.connect()

            volume = (self.counter * self.vfactor) * self.ffactor
            self.mqtt.connect()
            time.sleep(0.5)
            print('send', volume)
            self.mqtt.publish(topic='rain', msg=str(volume))
            self.counter = 0
            self.mqtt.disconnect()


rain = Rain()
REED = machine.Pin(2, Pin.IN)
REED.irq(handler=rain.measure, trigger=Pin.IRQ_RISING)


while True:
    if not rain.counter:
        time.sleep(10)
        continue

    print('wait')
    diff = time.ticks_diff(time.ticks_ms(), rain.last) / 1000
    now = time.localtime()
    minuten = now[4]
    sekunde = now[5]
    if minuten in (0, 30) and rain.counter > 0 and diff > 30:
        rain.measure()

    time.sleep(1)

