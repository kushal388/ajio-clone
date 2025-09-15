import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,   // 👈 specify your port here
    
  },

})



// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 5175,
//     proxy: {
//       '/api': {
//         target: 'http://localhost:5000',  // your backend
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
// })
