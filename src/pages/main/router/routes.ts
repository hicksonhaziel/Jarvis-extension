import React from 'react'
import Auth from '../pages/Auth'


export interface Route {
  path: string
  component: React.ComponentType
  title: string 
}

export const routes: Route[] = [ 
  { path: 'auth', component: Auth, title: 'Authentication' },
]