import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   proxy: {
  //     // Proxying API requests to avoid CORS issues during development
  //     '/api': 'https://login-signup-react-t8ka.onrender.com'
  //   }
// }
})
