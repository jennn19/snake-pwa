# 🐍 貪吃蛇 Snake PWA

一個輕量級的 PWA 貪吃蛇遊戲，純 HTML/CSS/JavaScript 製作，無需任何框架。

## 功能特點

- ✅ 離線支援 - 可不安裝使用
- ✅ 可安裝至主畫面 (PWA)
- ✅ 支援鍵盤 (方向鍵/WASD) 和觸控操作
- ✅ 最高分數記錄 (localStorage)
- ✅ 精美視覺效果

## 使用方式

1. 使用本地伺服器運行：
   ```bash
   # Python
   python -m http.server 8000
   
   # 或 Node.js
   npx serve
   ```

2. 在瀏覽器中打開 `http://localhost:8000`

3. 可將網站安裝到主畫面離線遊玩

## 操作方式

- **鍵盤**: 方向鍵 或 WASD
- **觸控**: 螢幕上的虛擬按鈕
- **目標**: 吃掉紅色的食物來獲得分數，不要撞到牆壁或自己

## 技術說明

- Service Worker 快取所有資源實現離線支援
- Web App Manifest 讓網站可安裝
- Canvas API 繪製遊戲畫面
- localStorage 儲存最高分數