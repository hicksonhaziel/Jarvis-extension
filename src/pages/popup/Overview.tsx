import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import Dashboard from '@/pages/popup/pages/Dashboard';
import Deployments from './pages/Deployments';
import Payments from './pages/Payments';
import Settings from './pages/Settings';
import { useRouter } from '@/hooks/RouterContext';

const Overview = () => {
  const api = useApi()
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { currentRoute } = useRouter()
  
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const hasAuth = await api.isAuthenticated()
        
        if (!hasAuth) {
          chrome.tabs.create({ 
            url: chrome.runtime.getURL('src/pages/main/index.html#auth') 
          })
          window.close()
          return
        }

        // Validate the session
        const validationResult = await api.validateSession()
        
        if (validationResult && validationResult.valid) {
          setIsAuthenticated(true)
          setIsChecking(false)
        } else {
          // Session invalid
          const refreshResult = await api.refreshSession()
          
          if (refreshResult) {
            setIsAuthenticated(true)
            setIsChecking(false)
          } else {
            chrome.tabs.create({ 
              url: chrome.runtime.getURL('src/pages/main/index.html#auth') 
            })
            window.close()
          }
        }
      } catch (error) {
        console.error('Auth check error:', error)
        // Error
        chrome.tabs.create({ 
          url: chrome.runtime.getURL('src/pages/main/index.html#auth') 
        })
        window.close()
      }
    }

    checkAuthStatus()
  }, [api])

  const renderContent = () => {
    switch(currentRoute) {
      case 'dashboard':
        return <Dashboard />
      case 'deployments':
        return <Deployments />
      case 'payments':
        return <Payments />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  // while checking
  if (isChecking) { 
    return (
      <div className="w-full h-[600px]"></div>
    )
  }

  // overview if authenticated
  if (isAuthenticated) {
    return renderContent()
  }

  return null
}

export default Overview