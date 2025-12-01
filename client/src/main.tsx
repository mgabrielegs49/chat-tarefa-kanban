// ============================================================================
// ARQUIVO PRINCIPAL DE ENTRADA DO REACT
// ============================================================================
// Este arquivo é o ponto de entrada da aplicação React.
// É responsável por renderizar o componente raiz da aplicação no DOM.

// Importa StrictMode do React
// StrictMode é um componente que ajuda a identificar problemas potenciais
// durante o desenvolvimento, executando verificações extras
import { StrictMode } from 'react'

// Importa createRoot do react-dom/client
// createRoot é a API moderna do React 18+ para criar uma raiz de renderização
// Permite renderização concorrente e melhor performance
import { createRoot } from 'react-dom/client'

// Importa os estilos globais da aplicação
// Este arquivo contém configurações do Tailwind CSS e estilos customizados
import './index.css'

// Importa o componente principal da aplicação (App)
// Este componente contém toda a lógica e estrutura da interface
import App from './App.tsx'

// ============================================================================
// RENDERIZAÇÃO DA APLICAÇÃO
// ============================================================================

// Obtém o elemento HTML com id "root" do documento
// O operador ! (non-null assertion) garante ao TypeScript que o elemento existe
// Este elemento está definido no arquivo index.html
const rootElement = document.getElementById('root')!

// Cria uma raiz de renderização React no elemento root
// Esta é a forma moderna (React 18+) de inicializar uma aplicação React
const root = createRoot(rootElement)

// Renderiza o componente App dentro do StrictMode
// StrictMode envolve a aplicação para detectar problemas durante desenvolvimento
root.render(
  <StrictMode>
    {/* Componente principal da aplicação */}
    {/* Contém o chat e o TaskBoard */}
    <App />
  </StrictMode>,
)
