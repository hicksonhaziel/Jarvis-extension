import { createContext, useContext, useState, ReactNode } from 'react';

interface RouterContextType {
  currentRoute: string;
  navigate: (route: string) => void;
}

const RouterContext = createContext<RouterContextType>({
  currentRoute: 'dashboard',
  navigate: () => {}
});

export const useRouter = () => useContext(RouterContext);

interface RouterProviderProps {
  children: ReactNode;
}

export const RouterProvider: React.FC<RouterProviderProps> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState('dashboard');

  const navigate = (route: string) => {
    setCurrentRoute(route);
  };

  return (
    <RouterContext.Provider value={{ currentRoute, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};