import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BottomNav from './components/layout/BottomNav';
import Dashboard from './pages/Dashboard';
import NewOrder from './pages/NewOrder';
import OrderDetails from './pages/OrderDetails';
import OrdersList from './pages/OrdersList';
import ExpensesList from './pages/ExpensesList';
import AddExpense from './pages/AddExpense';
import Reports from './pages/Reports';
import MenuManagement from './pages/MenuManagement';
import Settings from './pages/Settings';
import { initializeMenu } from './services/menu/menuService';
import './index.css';

function App() {
  useEffect(() => {
    // Initialize database with default menu items
    initializeMenu();
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Dashboard */}
          <Route path="/" element={<Dashboard />} />
          
          {/* Orders */}
          <Route path="/orders" element={<OrdersList />} />
          <Route path="/order/new" element={<NewOrder />} />
          <Route path="/order/:orderId" element={<OrderDetails />} />
          
          {/* Expenses */}
          <Route path="/expenses" element={<ExpensesList />} />
          <Route path="/expense/add" element={<AddExpense />} />
          
          {/* Reports */}
          <Route path="/reports" element={<Reports />} />
          
          {/* Menu & Settings */}
          <Route path="/menu" element={<MenuManagement />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;