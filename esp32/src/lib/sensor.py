from machine import UART
import time


class Sensor:

    STA_OK = 0x00
    STA_ERR_CHECKSUM = 0x01
    STA_ERR_SERIAL = 0x02
    STA_ERR_CHECK_OUT_LIMIT = 0x03
    STA_ERR_CHECK_LOW_LIMIT = 0x04

    ''' last operate status, users can use this variable to determine the result of a function call. '''
    last_operate_status = STA_OK

    def __init__(self):
        self.uart1 = None

    def connect(self):
        self.uart1 = UART(2, baudrate=9600)
    
    def measure(self):
        time.sleep(0.2)
        data = self.uart1.read(4)

        if not data:
            return

        try:
            header, data_h, data_l, sum = data
            distance = data_h * 256 + data_l
            # in cm
            return distance / 10
        except:
            return
