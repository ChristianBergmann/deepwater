import machine
import time
from machine import Pin
import ntptime
from lib.wifi import Wlan
from lib.umqtt.simple2 import MQTTClient
from lib.sensor import Sensor

#ntptime.host = 'ptbtime2.ptb.de'

POWERPIN = machine.Pin(19, Pin.OUT)
SFACTOR = 5
STIME = 60*SFACTOR*1000
START = 0
LAST = 0

distancesensor = Sensor()
wlan = Wlan()
mqtt = MQTTClient(
    client_id='distance_sensor',
    server='127.0.0.1',
    port=1883,
    keepalive=60,
    user='xx',
    password='xx'
)


def sleep():
    POWERPIN.value(0)
    mqtt.disconnect()
    diff = time.ticks_diff(time.ticks_ms(), START)
    stime = STIME - diff

    print('sleep', stime, now)
    time.sleep_ms(stime)


def measure(rcount=1):
    print('measure')
    POWERPIN.value(1)
    time.sleep(1)

    distancesensor.connect()
    distance = distancesensor.measure()
    if distance and (LAST / distance) * 100 >= 150:
        distance = distancesensor.measure()

    if distance:
        mqtt.connect()
        time.sleep(0.5)
        print('send', distance)
        mqtt.publish(topic='measure', msg=str(distance))
    elif rcount <= 5:
        time.sleep(2)
        print('retry')
        measure(rcount+1)

    return distance

try:
    wlan.connect()
    ntptime.settime()

    while True:
        if not wlan.wlan.isconnected():
            print('reconnect wlan')
            wlan.connect()

        now = time.localtime()
        minuten = now[4]
        sekunden = now[5]
        val = str(minuten / SFACTOR)

        if not START and val[-1] == '0' and sekunden > 10:
            continue

        if val[-1] == '0':
            START = time.ticks_ms()
            LAST = measure()
            sleep()
        else:
            time.sleep(1)
except Exception as e:
    print(e)
    machine.reset()

