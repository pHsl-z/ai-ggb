# AI GGB 纯前端版本

这是一个完全独立的纯前端版本，**不需要 Node.js 或任何后端服务器**。

## 使用方法

### 1. 直接打开（最简单）

双击打开 `index.html` 即可使用！

或者，使用浏览器的「打开文件」功能，选择 `index.html`。

### 2. 使用本地 HTTP 服务器（可选，更好）

为了更好的浏览器兼容性，你可以使用任意 HTTP 服务器：

#### Python 3:
```bash
python -m http.server 8000
# 然后在浏览器中访问 http://localhost:8000
```

#### Node.js (如果你有):
```bash
npx serve .
# 然后在浏览器中访问 http://localhost:3000
```

## 功能特性

- ✅ **14 个 AI 模型提供商**（DeepSeek, OpenAI, Qwen 等）
- ✅ **流式响应**（打字机效果）
- ✅ **GeoGebra 集成**（数学绘图）
- ✅ **对话历史**（本地存储）
- ✅ **CORS 代理支持**（手机访问）
- ✅ **纯前端实现**（无后端依赖）

## 手机使用（CORS 问题解决）

### 免费代理部署（Cloudflare Workers）

1. 访问 https://workers.cloudflare.com
2. 注册账号（免费）
3. 创建一个 Worker
4. 使用以下代码：

```javascript
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname + url.search;
    
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization,X-API-Key",
    };
    
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    
    // 从路径中提取真实的 API 地址
    let targetUrl = path.startsWith('/https:') ? 'https' : path.startsWith('/http:') ? 'http' : null;
    
    if (!targetUrl) {
      return new Response('Usage: /https://api.example.com/path', { 
        status: 400, 
        headers: corsHeaders 
      });
    }
    
    const realPath = path.slice(targetUrl.length + 1);
    targetUrl = targetUrl + '://' + realPath;
    
    try {
      const newRequest = new Request(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
        redirect: 'follow',
      });
      
      const response = await fetch(newRequest);
      const newHeaders = new Headers(response.headers);
      
      Object.keys(corsHeaders).forEach(key => {
        newHeaders.set(key, corsHeaders[key]);
      });
      
      return new Response(response.body, {
        status: response.status,
        headers: newHeaders,
      });
    } catch (error) {
      return new Response(error.message, { 
        status: 500, 
        headers: corsHeaders 
      });
    }
  },
};
```

5. 保存部署
6. 复制你的 Worker 地址（类似 `https://xxx.workers.dev`）
7. 在应用配置中：
   - 勾选「启用 CORS 代理」
   - 填入你的代理地址

## 配置方法

1. 点击设置图标 ⚙️
2. 选择你的 AI 模型提供商
3. 填入你的 API Key
4. 保存
5. 开始聊天！

## 文件说明

- `index.html` - 主页面
- `styles.css` - 样式文件
- `app.js` - 应用逻辑
- `README.md` - 本文件

## 安全提示

所有数据（包括 API Key）只存储在浏览器本地，没有上传到任何第三方服务器。
