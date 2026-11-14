import React, { createContext, useContext, useState, useEffect } from 'react';

export const ROLES = {
  AUDITOR: 'AUDITOR',
  CARRIER: 'CARRIER',
  CONSIGNEE: 'CONSIGNEE',
  ADMIN: 'ADMIN',
};

export const ROLE_METADATA = {
  AUDITOR: {
    label: 'Compliance Auditor',
    badgeColor: 'text-cyan-700 bg-cyan-50 border-cyan-200 dark:text-cyan-300 dark:bg-cyan-500/10 dark:border-cyan-500/30',
    description: 'Cryptographic ledger verification, tamper log audits & dispute arbitration.',
    allowedTabs: ['dashboard', 'ledger', 'disputes', 'risks'],
  },
  CARRIER: {
    label: 'Logistics Carrier',
    badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-500/10 dark:border-emerald-500/30',
    description: 'Fleet dispatch, real-time IoT telemetry monitoring & sensor exception tracking.',
    allowedTabs: ['dashboard', 'shipments', 'risks'],
  },
  CONSIGNEE: {
    label: 'Cargo Consignee',
    badgeColor: 'text-purple-700 bg-purple-50 border-purple-200 dark:text-purple-300 dark:bg-purple-500/10 dark:border-purple-500/30',
    description: 'Cargo tracking, receipt verification & evidence-backed claim filing.',
    allowedTabs: ['dashboard', 'shipments', 'disputes'],
  },
  ADMIN: {
    label: 'System Admin',
    badgeColor: 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-500/10 dark:border-amber-500/30',
    description: 'Full infrastructure authority, cryptographic keys & user role permissions.',
    allowedTabs: ['dashboard', 'shipments', 'ledger', 'risks', 'disputes', 'admin'],
  },
};

export const DEMO_USERS = [
  {
    id: 'USR-AUD-01',
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@globalaudit.org',
    role: ROLES.AUDITOR,
    organization: 'Global Compliance Bureau',
  },
  {
    id: 'USR-CAR-02',
    name: 'Marcus Vance',
    email: 'marcus.v@aerocold.com',
    role: ROLES.CARRIER,
    organization: 'AeroCold Logistics Global',
  },
  {
    id: 'USR-CON-03',
    name: 'Elena Rostova',
    email: 'elena.r@novartis.com',
    role: ROLES.CONSIGNEE,
    organization: 'Novartis Biopharma Logistics',
  },
  {
    id: 'USR-ADM-00',
    name: 'Vishal Maurya (Lead)',
    email: 'admin@audittrail.io',
    role: ROLES.ADMIN,
    organization: 'Audit-Trail 2.0 Core Team',
  },
];

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('audit_trail_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEMO_USERS[0];
      }
    }
    return DEMO_USERS[0]; // Default to Auditor for Hackathon Showcase
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('audit_trail_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('audit_trail_user');
    }
  }, [user]);

  const login = (email, password) => {
    const found = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setUser(found);
      setIsAuthModalOpen(false);
      return { success: true, user: found };
    }
    // Allow custom login
    const newUser = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      name: email.split('@')[0],
      email,
      role: ROLES.AUDITOR,
      organization: 'Enterprise Auditor',
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
    return { success: true, user: newUser };
  };

  const register = ({ name, email, role, organization }) => {
    const newUser = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      name,
      email,
      role: role || ROLES.AUDITOR,
      organization: organization || 'Independent Auditor',
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (newRole) => {
    const matchingDemo = DEMO_USERS.find(u => u.role === newRole);
    if (matchingDemo) {
      setUser(matchingDemo);
    } else if (user) {
      setUser({ ...user, role: newRole });
    }
  };

  const canAccessTab = (tabId) => {
    if (!user) return tabId === 'dashboard';
    const permissions = ROLE_METADATA[user.role]?.allowedTabs || [];
    return permissions.includes(tabId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        switchRole,
        canAccessTab,
        isAuthModalOpen,
        setIsAuthModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
