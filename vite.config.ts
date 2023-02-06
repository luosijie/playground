import { defineConfig } from 'vite'
import * as path from 'path'

export default defineConfig({
    server: {
        port: 3333
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    }
})