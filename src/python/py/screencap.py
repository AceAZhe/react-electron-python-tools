from PIL import ImageGrab
import numpy as np
import cv2
import datetime
from pynput import keyboard  #pynput 1.6.8版本
import threading
import sys
import json

value = sys.argv[1]  #接收node传递过来json字符串的参数
params = json.loads(value)
videoUrl=params[0]  #视频存储位置


class Screencap:
    def __init__(self):
        self.flag=False
        self.init()

    def init(self):
        th = threading.Thread(target=self.video_record)
        th.start()
        with keyboard.Listener(on_press=self.on_press) as listener:  #按下ESC终止录屏
            listener.join()

    def video_record(self):
        name = videoUrl+'\\'+ datetime.datetime.now().strftime('%Y-%m-%d %H-%M-%S')  # 当前的时间
        p = ImageGrab.grab()  # 获得当前屏幕
        a, b = p.size  # 获得当前屏幕的大小
        fourcc = cv2.VideoWriter_fourcc(*'XVID')  # 编码格式
        # 输出文件命名为test.mp4,帧率为16，可以自己设置
        video = cv2.VideoWriter('%s.avi' % name, fourcc, 20, (a, b))
        while True:
            im = ImageGrab.grab()
            imm = cv2.cvtColor(np.array(im), cv2.COLOR_RGB2BGR)  # 转为opencv的BGR格式
            video.write(imm)
            if self.flag:
                print(json.dumps({   #把json字符串数据传递给node
                    "msg": 'success',
                    "code":0
                })) 
                break
        video.release()

    def on_press(self,key):
        if key == keyboard.Key.esc:
            self.flag = True
            return False  # 返回False，键盘监听结束！

Screencap()