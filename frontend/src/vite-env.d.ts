    /// <reference types="vite/client" />
    
    interface ImportMetaEnv {
        readonly VITE_BACKEND_WEBSOCKET_URL: string;
        readonly VITE_API_BASE_URL: string;
        // You can add other VITE_ environment variables here as you create them
      }
      
      interface ImportMeta {
        readonly env: ImportMetaEnv;
      }
