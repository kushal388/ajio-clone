// import axios from "axios";
// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import { CartProvider } from './context/CartContext.jsx'
// import { WishlistProvider } from "./context/WishlistContext";


// axios.defaults.withCredentials = true;
// axios.defaults.baseURL = import.meta.env.PROD ? import.meta.env.VITE_API_BASE || "" : "";

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <CartProvider>
//       <WishlistProvider>
//         <App />
//       </WishlistProvider>
//     </CartProvider>
//   </StrictMode>,
// )



// *********************************************************************************************************

// src/main.jsx
import axios from "axios";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { WishlistProvider } from "./context/WishlistContext";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.PROD ? import.meta.env.VITE_API_BASE || "" : "";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <WishlistProvider>
        <App />
      </WishlistProvider>
    </CartProvider>
  </StrictMode>
);
