import { useState} from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

 
interface LayoutProps {  
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {



  return ( 
    <div className="min-h-screen bg-gray-50 w-[360px] min-h-[700px]"> 
      <Header />
      <div className="flex">
        <Sidebar />
        <main className={` flex-1 p-6 bg-gray-900`}> 
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout