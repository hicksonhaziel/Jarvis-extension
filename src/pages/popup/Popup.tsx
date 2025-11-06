import React from 'react';
import Layout from '@/components/layout/Layout';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { ThemeProvider } from '@/components/layout/ThemeContext';
import { RouterProvider } from '@/hooks/RouterContext'
import Overview from '@/pages/popup/Overview'

const Popup: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <RouterProvider>
          <Layout>
            <Overview/>
          </Layout>
        </RouterProvider>
      </ThemeProvider>
    </ErrorBoundary> 
  )
}

export default Popup