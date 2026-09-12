# 枪火演出 · Gunfire 1.0

独立的 Owlbear Rodeo 视觉特效扩展，不修改专注插件、生命或行动点。

## GitHub 安装（已经构建，无需运行代码）

1. 在 kexinzhanga 账号下新建公开仓库，名称必须为 gunfire-mod。
2. 上传本 ZIP 解压后的全部内容到仓库根目录：index.html、background.html、manifest.json、icon.svg 和 assets 文件夹等。
3. Settings → Pages → Deploy from a branch → main → /(root) → Save。
4. 等显示 Your site is live 后，在 Owlbear Add Extension 中添加：
   https://kexinzhanga.github.io/gunfire-mod/manifest.json
5. 在房间扩展列表启用“枪火演出”，刷新房间。

不要覆盖 focus-mod，两个扩展可以一起使用。
如更换 GitHub 用户名或仓库名，修改 manifest.json 中所有网址。其他资源与图标从当前页面自动解析。

## 使用

1. 选中一个角色层 Token，打开左上角“枪火演出”准星图标。
2. 点击“设为射手”。射手锁定后可以切换选择目标。
3. 选择手枪、步枪或霰弹枪，选择命中／未命中／护盾。
4. 点“点击地图目标开火”，然后在地图上点击目标 Token 或地点。
5. 或者选中一个目标，点击“向当前选中目标开火”。
退出瞄准：面板“退出瞄准”、Esc，或者手动选择右侧其他地图工具。
角色层 Token 自动以中心为目标；点击其他图层视为指定地图位置。
隐藏射手和隐藏目标不播放公开特效，防止泄露隐藏单位。

## 功能

- 手枪单发、步枪默认三连发、霰弹枪每次七枚散弹。
- 枪口焰、弹迹、命中火星与烟尘；未命中偏离目标；护盾显示蓝色扩散环。
- 连发 1–6 次、颜色、粗细、弹速、散布、枪口前移量可调。
- 最多 30 个本机自定义预设；本机显示特效开关。
- 广播给启用同一扩展、能看到对应 Token 的房间客户端。不同网络延迟下不是逐帧同步。
- 演出自动清除，最多同时四段演出；防止快速重复点击。
- 本版无音效、无震屏，不自动判断命中或计算伤害。所有可见角色均可作为演出射手。
- 当前射手与预设保存在当前浏览器，不跨浏览器同步；浏览器需允许本地存储。

## 检查范围

通过 TypeScript、生产构建、坐标及参数测试；着色器通过 CanvasKit 编译和渲染检查。
尚未进入真实 Owlbear 房间进行交互及多客户端联调，需安装后验收。

## 开发源码

source-code.zip 内含源码、锁定依赖和测试。解压后安装 Node.js 22.12+，运行 npm ci、npm test、npm run build。
源码修改完成后，把 dist 里面的内容上传覆盖到同一仓库。

参考：https://docs.owlbear.rodeo/extensions/reference/effects/
