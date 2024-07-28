import React from "react";
import ReactDOM from "react-dom/client";
import "./normalize.css";
import "./index.css";
import App from "./components/app";
import { ConfigProvider } from "antd";

const themeConfig = {
  components: {
    Pagination: {
      itemActiveBg: "#1890FF",
      itemBg: "#f0f0f0",
      itemColor: "#000",
    },
  },
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ConfigProvider theme={themeConfig}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
