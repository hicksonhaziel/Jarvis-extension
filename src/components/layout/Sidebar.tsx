import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from './ThemeContext'
import { useRouter } from '@/hooks/RouterContext' // Import the router hook
import { 
  LayoutDashboardIcon, 
  ServerIcon, 
  SettingsIcon, 
  DollarSignIcon,
  MenuIcon,
  XIcon
} from 'lucide-react'

interface Route {
  path: string
  title: string
}

const routes: Route[] = [
  { path: 'dashboard', title: 'Dashboard' },
  { path: 'deployments', title: 'Deployments' },
  { path: 'payments', title: 'Payments' },
  { path: 'settings', title: 'Settings' }
]

const Sidebar: React.FC = () => {
  const { theme, loading } = useTheme()
  const { currentRoute, navigate } = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  if (loading) return null

  const getIcon = (title: string) => {
    const iconClass = theme === 'light' ? 'text-black' : 'text-white'
    switch(title) {
      case 'Dashboard':
        return <LayoutDashboardIcon size={18} className={iconClass} />
      case 'Deployments':
        return <ServerIcon size={18} className={iconClass} />
      case 'Payments':
        return <DollarSignIcon size={18} className={iconClass} />
      case 'Settings':
        return <SettingsIcon size={18} className={iconClass} />
      default:
        return null
    }
  }

  const handleNavigation = (path: string) => {
    navigate(path)
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className={`lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg ${
          theme === 'light' ? 'bg-gray-100 text-black' : 'bg-gray-900 text-white'
        } shadow-md`}
      >
        {isMobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
      </button>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block w-64 ${
          theme === 'light' ? 'bg-gray-100 border-gray-200' : 'bg-gray-900 border-gray-800'
        } shadow-sm border-r`}
      >
        <nav className="mt-8">
          <div className="px-4">
            {routes.map((route: Route) => (
              <motion.a
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                key={route.path}
                onClick={() => navigate(route.path)}
                className={`flex items-center gap-4 rounded-lg px-3 py-2 my-2 text-lg transition-colors hover:bg-opacity-80 cursor-pointer ${
                  currentRoute === route.path
                    ? 'bg-[#FF4444] font-semibold'
                    : 'font-medium'
                }`}
              >
                <div className={theme === 'light' ? 'text-black' : 'text-white'}>
                  <span>{getIcon(route.title)}</span>
                </div>
                <span className={theme === 'light' ? 'text-black' : 'text-white'}>
                  {route.title}
                </span>
              </motion.a>
            ))}
          </div>
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            />
            
            {/* Sidebar */}
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`lg:hidden fixed left-0 top-0 bottom-0 w-64 z-40 ${
                theme === 'light' ? 'bg-gray-100 border-gray-200' : 'bg-gray-900 border-gray-800'
              } shadow-lg border-r`}
            >
              <nav className="mt-20">
                <div className="px-4">
                  {routes.map((route: Route) => (
                    <motion.a
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      key={route.path}
                      onClick={() => handleNavigation(route.path)}
                      className={`flex items-center gap-4 rounded-lg px-3 py-2 my-2 text-lg transition-colors hover:bg-opacity-80 cursor-pointer ${
                        currentRoute === route.path
                          ? 'bg-[#FF4444] font-semibold'
                          : 'font-medium'
                      }`}
                    >
                      <div className={theme === 'light' ? 'text-black' : 'text-white'}>
                        <span>{getIcon(route.title)}</span>
                      </div>
                      <span className={theme === 'light' ? 'text-black' : 'text-white'}>
                        {route.title}
                      </span>
                    </motion.a>
                  ))}
                </div>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar