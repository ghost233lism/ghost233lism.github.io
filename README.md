# 金莫迪个人主页 | Jin Modi's Personal Homepage

一个简洁、学术化的个人主页，参考 [srameo.github.io](https://srameo.github.io/) 的设计风格，支持中英文切换和明暗模式。

## ✨ 功能特性

### 🎨 简洁学术设计
- 清晰简洁的学术风格，专注内容展示
- 响应式布局，完美适配各种设备
- 无冗余动画，快速加载
- 专业的学术配色方案

### 🌍 多语言支持
- 中文/英文无缝切换
- 保存用户语言偏好
- 所有内容完全本地化

### 🌙 明暗模式
- 一键切换明暗主题
- 自动保存主题偏好
- 护眼的暗色模式

### 📱 移动端优化
- 完全响应式设计
- 移动端专用菜单
- 触摸友好的交互

### ⚡ 性能优化
- 最小化CSS和JavaScript
- 无多余动画和特效
- 快速页面加载
- 轻量级设计

### 🎯 学术功能
- 个人简介和学术背景
- 最新动态（News）展示
- 论文和成就列表
- 研究经历和工作经验
- 教育背景
- 领导力与活动经历
- 联系方式

## 🚀 快速开始

1. 将所有文件上传到您的网站服务器
2. 确保所有文件路径正确
3. 访问 `index.html` 即可查看网站

## 📁 文件结构

```
├── index.html              # 主页面
├── css/
│   └── academic-simple.css # 简洁学术风格样式文件
├── js/
│   └── academic-simple.js  # 轻量级脚本文件
├── img/                    # 图片资源
│   ├── avatar.jpg         # 头像
│   ├── favicon.png        # 网站图标
│   ├── weixin.jpg         # 微信二维码
│   └── qq.jpg             # QQ二维码
└── attaches/
    └── CV.pdf             # 简历文件
```

## 🎮 快捷键

- `Ctrl/Cmd + D`: 切换明暗模式
- `Ctrl/Cmd + L`: 切换语言

## 🔧 自定义设置

### 修改个人信息
在 `index.html` 中找到相应的 `data-zh` 和 `data-en` 属性，修改中英文内容。

### 修改配色
在 `css/academic-simple.css` 的 `:root` 部分修改CSS变量：

```css
:root {
    --accent-color: #007bff;   /* 强调色 */
    --text-primary: #333333;   /* 主文字颜色 */
    --bg-primary: #ffffff;     /* 主背景色 */
    /* ... 其他颜色变量 */
}
```

### 添加新的部分
1. 在HTML中添加新的section
2. 在CSS中添加对应的样式

## 🌐 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge
- 移动端浏览器

## 📝 内容管理

### 更新最新动态
在 `news` 部分的 `news-list` 中添加新的动态：

```html
<li class="news-item">
    <span class="news-date">2024/12</span>
    <span class="news-content" data-en="English content" data-zh="中文内容">中文内容</span>
</li>
```

### 更新论文列表
在 `publications` 部分添加新的 `publication-item`：

```html
<div class="publication-item">
    <div class="publication-content">
        <h3 class="publication-title" data-en="English Title" data-zh="中文标题">中文标题</h3>
        <p class="publication-authors" data-en="Authors" data-zh="作者">作者</p>
        <p class="publication-venue" data-en="Conference/Journal" data-zh="会议/期刊">会议/期刊</p>
        <p class="publication-note" data-en="Additional notes" data-zh="备注信息">备注信息</p>
    </div>
</div>
```

### 更新经历部分
在 `experience` 或 `activities` 部分添加相应的条目。

## 🎯 SEO优化

- 语义化HTML结构
- 适当的meta标签
- 结构化数据
- 响应式图片
- 快速加载时间

## 🔒 隐私和安全

- 不收集用户数据
- 本地存储偏好设置
- 安全的外部链接
- 无第三方追踪

## 📞 技术支持

如果您在使用过程中遇到任何问题，请通过以下方式联系：

- 📧 Email: 2312578@mail.nankai.edu.cn
- 💬 微信: 扫描网站上的二维码

## 📄 许可证

本项目基于现代网络技术构建，遵循最佳实践。

---

**感谢使用金莫迪的简洁学术个人主页！** 🎓 