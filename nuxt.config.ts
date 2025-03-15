// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/color-mode",
    "@nuxt/content",
    "@nuxt/icon",
    "@nuxt/image",
    "nuxt-locomotive-scroll",
    "@nuxt/eslint",
  ],

  colorMode: {
    preference: "system", // 預設的顏色模式，'system' 會根據使用者的作業系統主題設定
    fallback: "light", // 當系統無法偵測顏色模式時，使用的預設值
    hid: "nuxt-color-mode-script", // 設定 `<script>` 標籤的 ID，通常用於 SSR 初始化
    globalName: "__NUXT_COLOR_MODE__", // 在 `window` 物件上存取顏色模式的全域變數名稱
    componentName: "ColorScheme", // 自動註冊的 Vue 組件名稱，可用於 `<ColorScheme />`
    classPrefix: "", // CSS 顏色模式類別的前綴（預設為空）
    classSuffix: "-mode", // CSS 顏色模式類別的後綴，例如 `dark-mode`、`light-mode`
    storage: "localStorage", // 儲存使用者顏色模式偏好的方式，可選擇 'localStorage'、'sessionStorage' 或 'cookie'
    storageKey: "nuxt-color-mode", // 儲存顏色模式的 key 值，影響 `localStorage`、`sessionStorage` 或 `cookie` 的 key
  },
  vite: {
    plugins: [tailwindcss()],
  },
  css: ["~/assets/app.css"],
  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            // Default theme (same as single string)
            default: "github-light",
            // Theme used if `html.dark`
            dark: "github-dark",
            // Theme used if `html.sepia`
            sepia: "monokai",
          },
          langs: [
            "json",
            "js",
            "ts",
            "html",
            "css",
            "vue",
            "shell",
            "mdc",
            "md",
            "yaml",
          ],
        },
      },
    },
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },
});
