import React from 'react'
import { ThemeProvider } from '@/components/layout/ThemeContext'
import Overview from '@/pages/popup/Overview'

const Popup = () => {
  return (
    <ThemeProvider>
      <Overview/>
    </ThemeProvider>
  )
}

export default Popup