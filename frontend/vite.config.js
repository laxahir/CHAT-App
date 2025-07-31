// import { defineConfig } from 'vite';
// import tailwindcss from '@tailwindcss/vite';

// export default defineConfig({
//   plugins: [
//     tailwindcss()
//   ],
//   server: {
//     proxy: {
//       "/api": {
//         target: "http://localhost:3000",
//         secure: false
//       }
//     }
//   }
// });
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/', // ensures correct routing on Netlify
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000", // your backend
        changeOrigin: true,
        secure: false
      }
    }
  }
});
