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

  // Handle logout
  const handleLogout = useCallback(async () => { 
    await api.logout();
    setIsAuthenticated(false);
    setWalletAddress(null);
    setStatus('Logged out successfully');
  }, [api]);

  // Open auth window and wait for wallet connection
  const initiateAuth = useCallback(async () => {
    setStatus('Opening authentication window...');
    
    try {
      const existingTabs = await chrome.tabs.query({ url: `${WEB_API_BASE_URL}/*` });
      
      let targetTab;
      
      if (existingTabs.length > 0) {
        targetTab = existingTabs[0];
        await chrome.tabs.update(targetTab.id!, { active: true });
      } else {
        // New tab with web app
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

      // Send message to content script to open auth
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

    // Validate existing session
    const checkSession = async () => {
      setIsChecking(true);
      setStatus('Loading...');

      try {
        // if user has token
        const hasAuth = await api.isAuthenticated();
        
        if (!isMounted) return;

        if (!hasAuth) {
          setIsChecking(false);
          setStatus('Please connect your wallet');
          return;
        }

        // Validate token 
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
          // Session invalid, try to refresh
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
            // Refresh failed, need new auth
            setIsChecking(false);
            setStatus('Session expired, please reconnect wallet');
          }
        }
      } catch (error) {
        console.error('Session validation error:', error);
        if (!isMounted) return;
        setIsChecking(false);
        setStatus('Please connect your wallet');
      }
    };

    
    checkSession();

    // listener for wallet connection events
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
  }, []);

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!isAuthenticated) return;

    // Check token expiry 
    const intervalId = setInterval(async () => {
      const hasAuth = await api.isAuthenticated();
      
      if (!hasAuth) {
        // Token expired
        const refreshResult = await api.refreshSession();
        
        if (!refreshResult) {
          // Refresh failed, logout
          setIsAuthenticated(false);
          setStatus('Session expired, please reconnect wallet');
        } else {
          console.log('Token refreshed successfully');
        }
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => {
      console.log('Cleaning up token refresh interval');
      clearInterval(intervalId);
    };
  }, [isAuthenticated, api]);

  // loading state
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-[600px] min-w-80 bg-gray-50">
        <div className="text-center p-8">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mb-4"></div>
          <p className="text-gray-700 font-medium">{status}</p>
        </div>
      </div>
    );
  }

  // connect wallet screen
  if (!isAuthenticated) { 
    return (
      <div className="flex items-center justify-center min-h-[600px] min-w-80 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="rounded-2xl glassmorphism-card border-1 border-red-500 p-8 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <div className="rounded-full flex items-center justify-center my-16 mx-auto mb-4">
              <img src="public/icons/icon128.png" alt="Jarvis" className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-sm xs:text-xs font-bold text-gray-900 mb-2">
              Welcome To Jarvis
            </h1>
            <p className="sm:text-sm xs:text-xs text-gray-600 mb-6">
              {status}
            </p>
          </div>
          <br />
          <button
            onClick={initiateAuth}
            disabled={api.loading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {api.loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <span className='sm:text-sm xs:text-xs'>Connect Wallet</span>
              </>
            )}
          </button>

          {api.error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm sm:text-sm xs:text-xs">{api.error}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Authenticated app
  return (
    <>
      {children(handleLogout)}
    </>
  );
};