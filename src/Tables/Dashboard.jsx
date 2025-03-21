import * as React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, FileText, Calendar, DollarSign, Users } from 'lucide-react';
import CollapsibleTable from './LeadsPage';
import CommissionPeriodTable from './FinanceCommissionPeriod';
import CommissionRangeTable from './COmmisionStructure';
import MarketerCommissionTable from './MarketCommission';
import './dashboard.css';

function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Leads & Payments', icon: <FileText size={20} />, component: CollapsibleTable },
    { path: '/commission-periods', label: 'Commission Periods', icon: <Calendar size={20} />, component: CommissionPeriodTable },
    { path: '/commission-ranges', label: 'Commission Ranges', icon: <DollarSign size={20} />, component: CommissionRangeTable },
    { path: '/marketer-commissions', label: 'Marketer Commissions', icon: <Users size={20} />, component: MarketerCommissionTable },
  ];

  return (
    <>
      {/* Sidebar */}
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: isOpen ? 0 : -250 }}
        transition={{ duration: 0.3 }}
        className={`sidebar ${isOpen ? 'open' : ''}`}
      >
        <div className="sidebar-header">
          <h2>Dashboard</h2>
          <button onClick={toggleSidebar} className="sidebar-close-btn">
            <X size={24} />
          </button>
        </div>
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                onClick={toggleSidebar}
                className={location.pathname === item.path ? 'active' : ''}
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Overlay for mobile when sidebar is open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overlay"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function TopBar({ toggleSidebar }) {
  return (
    <div className="top-bar">
      <button onClick={toggleSidebar} className="top-bar-menu-btn">
        <Menu size={24} />
      </button>
      <div className="user-profile">
        <div className="user-info">
          <User size={20} />
          <span>John Doe</span>
        </div>
        <button className="logout-btn">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <Router>
      <div className="dashboard-container">
        {/* Sidebar */}
        <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <div
          className="main-content"
          style={{ marginLeft: isOpen ? '250px' : '0' }}
        >
          {/* Top Bar */}
          <TopBar toggleSidebar={toggleSidebar} />

          {/* Content Area */}
          <div className="content-area">
            <Routes>
              <Route path="/" element={<CollapsibleTable />} />
              <Route path="/commission-periods" element={<CommissionPeriodTable />} />
              <Route path="/commission-ranges" element={<CommissionRangeTable />} />
              <Route path="/marketer-commissions" element={<MarketerCommissionTable />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}