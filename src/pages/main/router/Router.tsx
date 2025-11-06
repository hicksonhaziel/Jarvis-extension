import React from 'react'
import { useHashRouter } from '../../../hooks/useHashRouter'
import { routes } from './routes'

const Router: React.FC = () => {
  const { currentRoute } = useHashRouter()

  const currentRouteObj = routes.find(route => route.path === currentRoute)
  
  if (!currentRouteObj) {
    const HomeComponent = routes[0].component
    return <HomeComponent />
  } 

  const Component = currentRouteObj.component
  return <Component />
}

export default Router