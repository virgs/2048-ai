import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/2048-ai',
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    build: {
        target: 'esnext',
        rollupOptions: {
            output: {},
        },
        outDir: 'docs',
        assetsDir: '.',
    },
    css: {
        // Ensure CSS is processed consistently across environments
        devSourcemap: true,
    },
    // Optimize for better development experience
    optimizeDeps: {
        include: ['react', 'react-dom'],
    },
})
