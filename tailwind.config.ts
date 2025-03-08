export default {
    darkMode: ["class", '[class~="dark-mode"]'], // 讓 Tailwind 識別 `.dark-mode`
    content: [
      "./app.vue",
      "./components/**/*.{vue,js,ts}",
      "./layouts/**/*.vue",
      "./pages/**/*.vue",
    ],
    plugins: [require("daisyui")],
    daisyui: {
      themes: ["light", "dark", "cupcake", "bumblebee", "emerald", "sepia"],
    },
  };