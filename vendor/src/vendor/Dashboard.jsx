// src/vendor/Dashboard.jsx
// import React, { useState } from "react";
// import Orders from "./Orders";
// import Products from "./Products";

// const Dashboard = () => {
//   const [tab, setTab] = useState("orders");

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <div className="w-64 bg-gray-900 text-white p-5">
//         <h2 className="text-xl font-bold mb-6">Vendor Dashboard</h2>
//         <ul className="space-y-4">
//           <li
//             className={`cursor-pointer ${tab === "orders" ? "font-bold" : ""}`}
//             onClick={() => setTab("orders")}
//           >
//             Orders
//           </li>
//           <li
//             className={`cursor-pointer ${tab === "products" ? "font-bold" : ""}`}
//             onClick={() => setTab("products")}
//           >
//             Products
//           </li>
//         </ul>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 p-6 overflow-y-auto">
//         {tab === "orders" && <Orders />}
//         {tab === "products" && <Products />}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


// **************************************************************

// src/vendor/Dashboard.jsx
import React, { useState } from "react";
import Orders from "./Orders";
import Products from "./Products";

const Dashboard = () => {
  const [tab, setTab] = useState("orders");

  return (
    <div className="flex h-screen bg-gray-50 pt-16">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-xl font-bold mb-8">Vendor Dashboard</h2>
        <ul className="space-y-4">
        


          <li
            className={`cursor-pointer ${
              tab === "orders" ? "text-emerald-400 font-bold" : ""
            }`}
            onClick={() => setTab("orders")}
          >
            Orders
          </li>
          <li
            className={`cursor-pointer ${
              tab === "products" ? "text-emerald-400 font-bold" : ""
            }`}
            onClick={() => setTab("products")}
          >
            Products
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {tab === "orders" && <Orders />}
        {tab === "products" && <Products />}
      </div>
    </div>
  );
};

export default Dashboard;


