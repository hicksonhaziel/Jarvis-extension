import React from 'react'

const Auth = () => {
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
              Authentication succesfull.
            </p>
          </div>
          <br />
          <button
            onClick={() => window.close()}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <span>Done</span>
          </button>
        </div>
      </div>
  )
}

export default Auth