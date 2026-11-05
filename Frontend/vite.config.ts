import { realpathSync } from 'node:fs'
import { defineConfig, searchForWorkspaceRoot } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // When the project is reached through a junction/symlink, files resolve
      // to the real path, which Vite would otherwise refuse (403) — e.g. the
      // @fontsource woff2 files, leaving the boards on a wider fallback font.
      allow: [
        searchForWorkspaceRoot(process.cwd()),
        searchForWorkspaceRoot(realpathSync(process.cwd())),
      ],
    },
  },
})
