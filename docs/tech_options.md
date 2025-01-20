# TransAddr.com 技术方案选型

## 1. 技术选型要求

- 技术栈简单，代码量少
- 单页面静态网站
- 可直接部署在 Vercel
- 开发维护成本低
- 开发速度快
- 适合调用 AI 大模型 API

## 2. 可选方案

### 方案一：Vue + Vite
**技术组成：**
- Vue 3 (Composition API)
- Vite
- TailwindCSS
- Axios

**优点：**
- 轻量级框架，打包体积小
- Vite 开发体验极佳，热更新快
- 组件化开发，代码组织清晰
- Vue 3 响应式 API 处理异步调用方便
- 完整的 TypeScript 支持
- 可以轻松集成 AI API 调用

**缺点：**
- 相比纯静态页面多了一层框架
- 需要简单的构建步骤

### 方案二：Next.js (Static Export)
**技术组成：**
- Next.js
- React
- TailwindCSS

**优点：**
- Vercel 原生支持，部署体验好
- 现代化开发体验
- API 路由可以方便地封装 AI 调用
- 良好的代码组织

**缺点：**
- 对于单页应用来说过重
- 构建步骤较多
- 开发配置相对复杂

### 方案三：纯 HTML + CSS + JavaScript
**技术组成：**
- HTML5
- CSS3
- Vanilla JavaScript

**优点：**
- 最简单的技术栈
- 加载速度最快
- 维护成本最低

**缺点：**
- 处理异步 API 调用较繁琐
- 代码组织不够优雅
- 开发效率相对较低
- 调试不便

## 3. 推荐方案

考虑到新增的要求，推荐使用**方案一：Vue + Vite**，原因如下：

1. **快速开发**
   - Vite 提供极速的开发体验
   - Vue 组件化开发提高效率
   - 丰富的生态系统和工具支持

2. **适合 AI API 调用**
   - 响应式状态管理
   - 优雅处理异步请求
   - 更好的错误处理机制

3. **简单高效**
   - 相比 Next.js 更轻量
   - 学习曲线平缓
   - 代码量依然可以保持较少

4. **部署便捷**
   - Vercel 完全支持 Vite 构建
   - 自动化部署流程
   - 静态资源优化

## 4. 项目结构建议

```
/
├── index.html
├── src/
│   ├── App.vue              # 主应用组件
│   ├── components/          # 可复用组件
│   │   └── AddressForm.vue  # 地址转换表单
│   ├── services/           
│   │   └── api.js          # AI API 调用
│   └── main.js             # 应用入口
├── public/                  # 静态资源
└── vite.config.js          # Vite 配置
```

## 5. 开发流程

1. 快速搭建
```bash
npm create vite@latest transaddr -- --template vue
cd transaddr
npm install
```

2. 添加依赖
```bash
npm install axios tailwindcss
```

3. 开发启动
```bash
npm run dev
```

## 6. 部署流程

1. 将代码推送到 GitHub 仓库
2. 在 Vercel 中导入该仓库
3. 自动识别为 Vite 项目并部署

Vercel 会自动处理构建和部署过程，无需额外配置。 