import * as React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, FileText, Calendar, DollarSign, Users, ChevronRight, Settings } from 'lucide-react';
import CollapsibleTable from './LeadsPage';
import CommissionPeriodTable from './FinanceCommissionPeriod';
import CommissionRangeTable from './COmmisionStructure';
import MarketerCommissionTable from './MarketCommission';
import './dashboard.css';

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -10,
  }
};

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3
};

// These components need to be inside the Router context
function SidebarContent({ isOpen, toggleSidebar }) {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Leads & Payments', icon: <FileText size={20} /> },
    { path: '/commission-periods', label: 'Commission Periods', icon: <Calendar size={20} /> },
    { path: '/commission-ranges', label: 'Commission Ranges', icon: <DollarSign size={20} /> },
    { path: '/marketer-commissions', label: 'Marketer Commissions', icon: <Users size={20} /> },
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
          <h2>Finance Portal</h2>
          <button onClick={toggleSidebar} className="sidebar-close-btn">
            <X size={20} />
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
                <span>{item.label}</span>
                {location.pathname === item.path && <ChevronRight size={16} className="indicator" />}
              </Link>
            </li>
          ))}
        </ul>
        <div className="sidebar-footer">
          <Link to="/settings" className="settings-link">
            <Settings size={18} />
            <span>Settings</span>
          </Link>
        </div>
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

function TopBarContent({ toggleSidebar }) {
  const location = useLocation();
  
  // Get current page title based on path
  const getPageTitle = () => {
    switch(location.pathname) {
      case '/':
        return 'Leads & Payments';
      case '/commission-periods':
        return 'Commission Periods';
      case '/commission-ranges':
        return 'Commission Ranges';
      case '/marketer-commissions':
        return 'Marketer Commissions';
      default:
        return 'Dashboard';
    }
  };
  
  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <button onClick={toggleSidebar} className="top-bar-menu-btn">
          <Menu size={20} />
        </button>
        <h1 className="page-title">{getPageTitle()}</h1>
      </div>
      <div className="user-profile">
        <div className="user-info">
          <div className="avatar">JD</div>
          <span>John Doe</span>
        </div>
        <button className="logout-btn">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

function PageWrapper({ children, title }) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="page-wrapper"
    >
      <div className="page-header">
        <h2>{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}

function AppRoutes({ isOpen }) {
  return (
    <div className="content-area">
      <Routes>
        <Route path="/" element={
          <PageWrapper title="Leads & Payments">
            <CollapsibleTable />
          </PageWrapper>
        } />
        <Route path="/commission-periods" element={
          <PageWrapper title="Commission Periods">
            <CommissionPeriodTable />
          </PageWrapper>
        } />
        <Route path="/commission-ranges" element={
          <PageWrapper title="Commission Ranges">
            <CommissionRangeTable />
          </PageWrapper>
        } />
        <Route path="/marketer-commissions" element={
          <PageWrapper title="Marketer Commissions">
            <MarketerCommissionTable />
          </PageWrapper>
        } />
      </Routes>
    </div>
  );
}

// Main App Component
function MainApp() {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="dashboard-container">
      {/* Sidebar - inside Router context */}
      <SidebarContent isOpen={isOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="main-content" style={{ marginLeft: isOpen ? '250px' : '0' }}>
        {/* Top Bar - inside Router context */}
        <TopBarContent toggleSidebar={toggleSidebar} />
        
        {/* Content Area with Routes */}
        <AppRoutes isOpen={isOpen} />
      </div>
    </div>
  );
}

// Main export that wraps everything in Router
export default function Dashboard() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}