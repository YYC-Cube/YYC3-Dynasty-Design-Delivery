/**
 * @file main.tsx
 * @description 应用入口文件 - React DOM 渲染入口
 * @author YanYuCloudCube Team <admin@0379.email>
 * @version v1.0.0
 * @created 2026-07-12
 * @updated 2026-07-12
 * @status active
 * @tags [entry],[react],[app]
 *
 * @brief YYC3 Dynasty Design Delivery 应用主入口
 *
 * @details
 * - 引入全局样式
 * - 渲染 React 应用根组件
 *
 * @dependencies React, ReactDOM
 * @exports 无
 * @notes 在 index.html 中引入
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './styles/index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found. Ensure index.html contains <div id="root"></div>');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
