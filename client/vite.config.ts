// ============================================================================
// CONFIGURAÇÃO DO VITE (vite.config.ts)
// ============================================================================
// Este arquivo configura o Vite, que é o build tool e dev server usado
// para desenvolvimento e build da aplicação React.
// Vite oferece hot module replacement (HMR) rápido e builds otimizados.

// Importa a função defineConfig do Vite
// defineConfig fornece autocomplete e type checking para a configuração
import { defineConfig } from 'vite'

// Importa o plugin do React para Vite
// Este plugin permite que o Vite processe arquivos .tsx e .jsx
import react from '@vitejs/plugin-react'

// ============================================================================
// CONFIGURAÇÃO DO VITE
// ============================================================================

// Exporta a configuração do Vite
// https://vite.dev/config/ - Documentação oficial do Vite
export default defineConfig({
  // Array de plugins usados pelo Vite
  plugins: [
    react(), // Plugin React - habilita suporte a JSX/TSX e HMR
  ],
  
  // Configurações do servidor de desenvolvimento
  server: {
    port: 5173, // Porta onde o servidor de desenvolvimento será executado
    // Outras opções disponíveis:
    // - host: 'localhost' (host padrão)
    // - open: true (abre navegador automaticamente)
    // - proxy: {} (configurar proxy para API)
  },
})
