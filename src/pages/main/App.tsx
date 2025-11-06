import React from 'react'
import Router from './router/Router'
import ErrorBoundary from '../../components/common/ErrorBoundary'
import { ThemeProvider } from '@/components/layout/ThemeContext'

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router />
      </ThemeProvider> 
    </ErrorBoundary>
  )
}

export default App