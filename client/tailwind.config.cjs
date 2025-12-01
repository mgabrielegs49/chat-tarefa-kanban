// ============================================================================
// CONFIGURAÇÃO DO TAILWIND CSS (tailwind.config.cjs)
// ============================================================================
// Este arquivo configura o Tailwind CSS, framework de utilitários CSS.
// Define quais arquivos devem ser escaneados para classes Tailwind
// e permite customização do tema.

// Exporta a configuração do Tailwind
// module.exports é usado porque este é um arquivo CommonJS (.cjs)
module.exports = {
  // Array de caminhos para arquivos que contêm classes Tailwind
  // O Tailwind escaneia estes arquivos para gerar apenas as classes usadas
  content: [
    './index.html', // Arquivo HTML principal
    './src/**/*.{js,ts,jsx,tsx}' // Todos os arquivos JS/TS/JSX/TSX na pasta src
    // **/* significa recursivo (todas as subpastas)
  ],
  
  // Configuração do tema do Tailwind
  theme: {
    // extend permite estender o tema padrão sem sobrescrever
    extend: {
      // Aqui você pode adicionar cores, fontes, espaçamentos customizados
      // Exemplo:
      // colors: {
      //   primary: '#your-color',
      // },
    },
  },
  
  // Array de plugins do Tailwind
  // Plugins adicionam funcionalidades extras ao Tailwind
  plugins: [
    // Exemplos de plugins comuns:
    // require('@tailwindcss/forms'), // Estilos para formulários
    // require('@tailwindcss/typography'), // Estilos para tipografia
  ],
}
