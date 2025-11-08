import { useEffect, useState, useCallback, ReactNode } from 'react';
import { useApi } from '@/hooks/useApi';
import { WEB_API_BASE_URL } from '@/utils/constants';
import { MessageListener } from '@/utils/messageListener';
import { sendMessageWithRetry } from '@/utils/messenger';

interface CheckAuthProps {
  children: (logout: () => Promise<void>) => ReactNode;
}

export const CheckAuth = ({ children }: CheckAuthProps) => {
  const api = useApi();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [status, setStatus] = useState('Checking authentication...');
  const [isPopup, setIsPopup] = useState(false);

  useEffect(() => {
    const checkContext = async () => {
      try {
        const url = window.location.href;
        setIsPopup(url.includes('/popup/') || window.innerWidth < 600);
      } catch (error) {
        setIsPopup(false);
      }
    };
    
    checkContext();
  }, []);

  // logout
  const handleLogout = useCallback(async () => { 
    await api.logout();
    setIsAuthenticated(false);
    setWalletAddress(null);
    setStatus('Logged out successfully');
  }, [api]);

  const initiateAuth = useCallback(async () => {
    setStatus('Opening authentication window...');
    
    try {
      const existingTabs = await chrome.tabs.query({ url: `${WEB_API_BASE_URL}/*` });
      
      let targetTab;
      
      if (existingTabs.length > 0) {
        targetTab = existingTabs[0];
        await chrome.tabs.update(targetTab.id!, { active: true });
      } else {
        targetTab = await chrome.tabs.create({ 
          url: WEB_API_BASE_URL,
          active: false 
        });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      if (!targetTab?.id) {
        setStatus('Error: Could not create web app tab');
        return;
      } 

      sendMessageWithRetry(targetTab.id, { action: 'open_auth' }, 5, 500)
        .then((response) => {
          if (response?.status === 'auth_opened') {
            setStatus('Auth window opened, waiting for wallet connection...');
          }
        })
        .catch((err) => {
          setStatus('Could not open auth window. Make sure the web app is loaded and try again.');
        });
    } catch (error) {
      setStatus('Failed to open auth window');
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

  
    const checkSession = async () => {
      setIsChecking(true);
      setStatus('Loading...');

      try {
        const hasAuth = await api.isAuthenticated();
        
        if (!isMounted) return;

        if (!hasAuth) {
          setIsChecking(false);
          setStatus('Please connect your wallet');
          
          
          if (isPopup) {
            chrome.tabs.create({ 
              url: chrome.runtime.getURL('src/pages/main/index.html#auth') 
            });
            window.close();
          }
          return;
        }

        
        const validationResult = await api.validateSession();
        
        if (!isMounted) return;
        
        if (validationResult && validationResult.valid) {
          // Session is valid
          const address = await api.getWalletAddress();
          setWalletAddress(address);
          setIsAuthenticated(true);
          setStatus('Session validated successfully');
          setIsChecking(false);
        } else {
          setStatus('Session expired, refreshing...');
          const refreshResult = await api.refreshSession();
          
          if (!isMounted) return;
          
          if (refreshResult) {
            const address = await api.getWalletAddress();
            setWalletAddress(address);
            setIsAuthenticated(true);
            setStatus('Session refreshed successfully');
            setIsChecking(false);
          } else {
            
            setIsChecking(false);
            setStatus('Session expired, please reconnect wallet');
            
            
            if (isPopup) {
              chrome.tabs.create({ 
                url: chrome.runtime.getURL('src/pages/main/index.html#auth') 
              });
              window.close();
            }
          }
        }
      } catch (error) {
        console.error('Session validation error:', error);
        if (!isMounted) return;
        setIsChecking(false);
        setStatus('Please connect your wallet');
        
        // If in popup and error, open full page
        if (isPopup) {
          chrome.tabs.create({ 
            url: chrome.runtime.getURL('src/pages/main/index.html#auth') 
          });
          window.close();
        }
      }
    };

    checkSession();

    
    const listener = new MessageListener();
    
    listener.onMessage((type, data) => {
      console.log('Received message:', type, data);
      
      if (type === 'wallet_connected') {
        setStatus('Wallet connected! Creating session...');
        setWalletAddress(data.address || null);
        
        // Create session
        api.createSession({
          wallet_address: data.address,
          nonce: data.nonce,
          signature: data.signature,
        }).then((sessionResult) => {
          if (sessionResult) {
            setIsAuthenticated(true);
            setStatus('Authentication successful!');
          } else {
            setStatus('Session creation failed, please try again');
          }
        });
      }
      
      if (type === 'auth_failed') {
        setStatus('Wallet connection failed, please try again');
      }

      if (type === 'auth_cancelled') {
        setStatus('Authentication cancelled');
      }
    });

    // Cleanup
    return () => {
      isMounted = false;
      listener.cleanup?.();
    };
  }, [isPopup]);

  
  useEffect(() => {
    if (!isAuthenticated) return;

    const intervalId = setInterval(async () => {
      const hasAuth = await api.isAuthenticated();
      
      if (!hasAuth) {
        
        const refreshResult = await api.refreshSession();
        
        if (!refreshResult) {
          
          setIsAuthenticated(false);
          setStatus('Session expired, please reconnect wallet');
          
          
          if (isPopup) {
            chrome.tabs.create({ 
              url: chrome.runtime.getURL('src/pages/main/index.html#auth') 
            });
            window.close();
          }
        } else {
          console.log('Token refreshed successfully');
        }
      }
    }, 5 * 60 * 1000); // 5 minutes 

    return () => {
      console.log('Cleaning up token refresh interval');
      clearInterval(intervalId);
    };
  }, [isAuthenticated, api, isPopup]);

  // loading state
  if (isChecking) {
    return (
      <div className="w-[300px] min-h-[700px] flex items-center justify-center bg-gray-800">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-b-transparent border-cyan-600 mb-3"></div>
          <p className="text-gray-50 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  // connect wallet screen - only shown in full page mode
  if (!isAuthenticated && !isPopup) { 
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-800">
        <div className="rounded-2xl glassmorphism-card border border-gray-900 p-8 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <div className="rounded-full flex items-center justify-center my-16 mx-auto mb-4">
              <img src="public/icons/icon128.png" alt="Jarvis" className="w-16 h-16" />
            </div>
            <h1 className="text-3xl font-bold text-gray-50 mb-2">
              Welcome To Jarvis
            </h1>
            <p className="text-sm text-gray-50 mb-6">
              {status}
            </p>
          </div>
          <br />
          <button
            onClick={initiateAuth}
            disabled={api.loading}
            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {api.loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <span>Connect Wallet</span>
              </>
            )}
          </button>

          {api.error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{api.error}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  
  if (!isAuthenticated && isPopup) {
    return null;
  }

  // Authenticated app
  return (
    <>
      {children(handleLogout)}
    </>
  );
};