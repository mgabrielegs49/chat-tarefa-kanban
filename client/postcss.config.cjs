// ============================================================================
// CONFIGURAÇÃO DO POSTCSS (postcss.config.cjs)
// ============================================================================
// Este arquivo configura o PostCSS, processador CSS que transforma
// CSS usando plugins. O Tailwind CSS e Autoprefixer são plugins do PostCSS.

// Exporta a configuração do PostCSS
// module.exports é usado porque este é um arquivo CommonJS (.cjs)
module.exports = {
  // Array de plugins do PostCSS
  plugins: {
    // Plugin Tailwind CSS
    // Processa as diretivas @tailwind e gera as classes utilitárias
    tailwindcss: {},
    
    // Plugin Autoprefixer
    // Adiciona automaticamente prefixos de vendor (-webkit-, -moz-, etc)
    // para garantir compatibilidade com navegadores antigos
    autoprefixer: {},
  },
}
