1. 基于react+electron生成的electron应用的debug调试，截图，录屏.....工具的项目。
2. 初始化代码之前：先执行npm-config-set.bat配置环境依赖。
3. robotjs需要匹配对应的api：https://github.com/mapbox/node-pre-gyp/blob/master/lib/util/abi_crosswalk.json。

    手动编译robotjs：npm rebuild --runtime=electron --disturl=https://atom.io/download/atom-shell --target=<你的electron版本> --abi=<对应abi版本>
                    npm rebuild --runtime=electron --disturl=https://atom.io/download/atom-shell --target=12.0.14 --abi=83

