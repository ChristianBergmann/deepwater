import network
import time

class Wlan:

    ON = 1010
    OFF = 8
    SSID = "xx"
    PW = "xx!"

    def __init__(self):
        self.wlan = None
        self.status = None

    def connect(self):
        self.wlan = network.WLAN(network.STA_IF)
        self.wlan.active(True)

        if not self.wlan.isconnected():
            self.wlan.connect(self.SSID, self.PW)

            while not self.wlan.isconnected():
                pass

        self.status = self.wlan.status()
        if self.wlan.isconnected():
            print('wlan connected')
        print('network config:', self.wlan.ifconfig())

    def disconnect(self):
        self.wlan.disconnect()
        self.status = self.wlan.status()

