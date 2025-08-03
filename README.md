# 🍽️ AI 点菜助手

一款基于 Next.js 和 shadcn/ui 构建的智能点菜助手，采用 Chat-first 的交互设计，让点菜变得简单有趣。

## ✨ 功能特性

- **🤖 智能推荐**: 根据用户偏好和预算推荐最合适的菜品
- **💬 自然对话**: 像和朋友聊天一样轻松完成点菜
- **📱 响应式设计**: 支持移动端和桌面端
- **🛒 购物车管理**: 实时管理已选菜品，支持数量调整
- **📋 菜品详情**: 详细展示菜品信息、评价和营养成分
- **❓ 智能问答**: 针对菜品进行自然语言提问

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 配置 OpenAI API

1. 创建 `.env.local` 文件：
```bash
cp .env.example .env.local
```

2. 在 `.env.local` 中添加您的 OpenAI API 密钥：
```
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
```

**注意**: 您需要有一个有效的 OpenAI API 密钥才能使用 AI 推荐功能。

### 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 即可查看应用。

## 🏗️ 技术栈

- **框架**: Next.js 15 (App Router)
- **样式**: Tailwind CSS
- **UI 组件**: shadcn/ui
- **图标**: Lucide React
- **字体**: Inter
- **语言**: TypeScript

## 📁 项目结构

```
orderly/
├── app/                    # Next.js App Router
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx          # 首页
├── components/            # React 组件
│   ├── chat/             # 聊天相关组件
│   ├── cart/             # 购物车组件
│   ├── side-panel/       # 侧边栏组件
│   └── ui/               # shadcn/ui 基础组件
├── types/                # TypeScript 类型定义
├── docs/                 # 产品文档
│   ├── prd.md           # 产品需求文档
│   ├── user_journey.md  # 用户流程
│   ├── wireframe.md     # 线框图说明
│   └── design_guideline.md # 设计规范
└── lib/                  # 工具函数
    └── utils.ts
```

## 🎨 设计理念

### 颜色方案
- **背景色**: 奶油白 (`#FFFBF5`)
- **主色调**: 食物橘 (`#FF6B2D`)
- **卡片背景**: 米色 (`#FFF5EB`)
- **文本色**: 深灰 (`#333333`)

### 交互设计
- Chat-first 的对话式交互
- 轻量级的动画效果
- 直觉化的操作流程

## 🔄 用户流程

1. **欢迎页面**: 展示产品特性，引导用户开始
2. **人数选择**: 选择用餐人数
3. **偏好收集**: 了解预算、口味偏好和忌口
4. **菜品推荐**: AI 推荐个性化菜单
5. **详情查看**: 查看菜品详情，支持问答
6. **购物车管理**: 添加/删除菜品，调整数量
7. **订单确认**: 最终确认菜单

## 🛠️ 开发命令

```bash
# 开发环境
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
```

## 📝 核心组件

### ChatInterface
主要的聊天界面组件，管理整个对话流程。

### DishCard
菜品卡片组件，展示菜品信息和操作按钮。

### ShoppingCartBar
固定在底部的购物车栏，实时显示已选菜品。

### DishDetailsPanel
侧边栏面板，展示菜品详细信息。

## 🔮 后续优化

- [ ] 集成真实的 AI 推荐 API
- [ ] 添加用户登录和历史记录
- [ ] 支持多人聚餐模式
- [ ] 接入支付系统
- [ ] 添加语音输入功能

## 📄 许可证

MIT License

---

> 💡 这是一个演示项目，展示了如何构建现代化的 Chat-first 用户界面。实际部署时需要集成真实的后端服务。