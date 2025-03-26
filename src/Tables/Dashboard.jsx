
import * as React from 'react';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, FileText, Calendar, DollarSign, Users, ChevronRight, Settings } from 'lucide-react';
import CollapsibleTable from './LeadsPage';
import CommissionPeriodTable from './FinanceCommissionPeriod';
import CommissionRangeTable from './COmmisionStructure';
import MarketerCommissionTable from './MarketCommission';
import Refunds from './Refunds';
import './dashboard.css';

// Redux Slices
const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: {
    isOpen: false,
    isMobile: window.innerWidth <= 768
  },
  reducers: {
    toggleSidebar: (state) => {
      state.isOpen = !state.isOpen;
    },
    closeSidebar: (state) => {
      state.isOpen = false;
    },
    setMobileView: (state, action) => {
      state.isMobile = action.payload;
    }
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: {
      name: 'John Doe',
      initials: 'JD',
      isAuthenticated: true
    }
  },
  reducers: {
    logout: (state) => {
      state.user = {
        name: '',
        initials: '',
        isAuthenticated: false
      };
    }
  }
});

const navigationSlice = createSlice({
  name: 'navigation',
  initialState: {
    currentPage: '/'
  },
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    }
  }
});

// Create Redux Store
const store = configureStore({
  reducer: {
    sidebar: sidebarSlice.reducer,
    auth: authSlice.reducer,
    navigation: navigationSlice.reducer
  }
});

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, y: 10 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -10 }
};

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3
};

// Navigation configuration
const NAVIGATION_ITEMS = [
  { 
    path: '/', 
    label: 'Leads & Payments', 
    icon: <FileText size={20} />,
    component: CollapsibleTable 
  },
  { 
    path: '/commission-periods', 
    label: 'Commission Periods', 
    icon: <Calendar size={20} />,
    component: CommissionPeriodTable 
  },
  { 
    path: '/commission-ranges', 
    label: 'Commission Ranges', 
    icon: <DollarSign size={20} />,
    component: CommissionRangeTable 
  },
  { 
    path: '/marketer-commissions', 
    label: 'Marketer Commissions', 
    icon: <Users size={20} />,
    component: MarketerCommissionTable 
  },
  { 
    path: '/refunds', 
    label: 'Refunds', 
    icon: <DollarSign size={20} />,
    component: Refunds 
  }
];

function SidebarContent() {
  const location = useLocation();
  const { isOpen } = useSelector((state) => state.sidebar);
  const dispatch = useDispatch();

  const toggleSidebar = () => {
    dispatch(sidebarSlice.actions.toggleSidebar());
  };

  return (
    <>
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
          {NAVIGATION_ITEMS.map((item) => (
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

function TopBarContent() {
  const location = useLocation();
  const { isOpen } = useSelector((state) => state.sidebar);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const toggleSidebar = () => {
    dispatch(sidebarSlice.actions.toggleSidebar());
  };

  const logout = () => {
    dispatch(authSlice.actions.logout());
  };
  
  const getPageTitle = () => {
    const currentRoute = NAVIGATION_ITEMS.find(item => item.path === location.pathname);
    return currentRoute ? currentRoute.label : 'Dashboard';
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
          <div className="avatar">{user.initials}</div>
          <span>{user.name}</span>
        </div>
        <button onClick={logout} className="logout-btn">
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

function AppRoutes() {
  const { isOpen } = useSelector((state) => state.sidebar);

  return (
    <div 
      className="content-area" 
      style={{ 
        marginLeft: isOpen ? '250px' : '0',
        width: isOpen ? 'calc(100% - 250px)' : '100%' 
      }}
    >
      <Routes>
        {NAVIGATION_ITEMS.map((route) => (
          <Route 
            key={route.path} 
            path={route.path} 
            element={
              <PageWrapper title={route.label}>
                <route.component />
              </PageWrapper>
            } 
          />
        ))}
        {/* Redirect to homepage or 404 for undefined routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function MainApp() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Handle responsive sidebar
  React.useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      dispatch(sidebarSlice.actions.setMobileView(isMobile));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  // Protect routes based on authentication
  if (!user.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="dashboard-container">
      <SidebarContent />
      <div className="main-content">
        <TopBarContent />
        <AppRoutes />
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Provider store={store}>
      <Router>
        <MainApp />
      </Router>
    </Provider>
  );
}