// vite.config.js
// vite.config.js
// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 5173,
//     proxy: {
//       "/auth": { target: "http://localhost:5000", changeOrigin: true, secure: false },
//       "/api":  { target: "http://localhost:5000", changeOrigin: true, secure: false },
//     }
//   }
// });


// frontend/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // your dev port
    proxy: {

      "/auth": { target: "http://localhost:5000", changeOrigin: true, secure: false },


      // forward API calls to backend
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
      // forward any uploads/static images to backend
      "/uploads": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
        // keep path as-is (so /uploads/xxx -> backend /uploads/xxx)
      },
       



      // optionally forward other image roots your backend uses:
      "/images": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
