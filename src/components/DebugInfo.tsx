import React from 'react';

const DebugInfo: React.FC = () => {
  const envVars = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? '[PRESENT]' : '[MISSING]',
    VITE_GOAFFPRO_ACCESS_TOKEN: import.meta.env.VITE_GOAFFPRO_ACCESS_TOKEN ? '[PRESENT]' : '[MISSING]',
    VITE_GOAFFPRO_PUBLIC_TOKEN: import.meta.env.VITE_GOAFFPRO_PUBLIC_TOKEN ? '[PRESENT]' : '[MISSING]',
    NODE_ENV: import.meta.env.NODE_ENV,
    MODE: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD
  };

  return (
    <div className="fixed top-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs max-w-md z-50">
      <h3 className="font-bold mb-2">Debug Info</h3>
      <div className="space-y-1">
        {Object.entries(envVars).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="text-gray-300">{key}:</span>
            <span className={value === '[MISSING]' ? 'text-red-400' : 'text-green-400'}>
              {String(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DebugInfo; 