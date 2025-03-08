export default {
    darkMode: "class",
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