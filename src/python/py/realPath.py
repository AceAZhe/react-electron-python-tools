import sys
import json
import win32com.client

value = sys.argv[1]  # 接收node传递过来json字符串的参数
params = json.loads(value)
exePath = params[0]

shell = win32com.client.Dispatch('WScript.Shell')
shortcut = shell.CreateShortCut(exePath)

print(json.dumps({  # 把json字符串数据传递给node
    "msg": 'success',
    "code": 0,
    "data": shortcut.Targetpath
}))
