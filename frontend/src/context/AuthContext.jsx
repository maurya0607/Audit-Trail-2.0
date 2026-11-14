import React, { createContext, useContext, useState, useEffect } from 'react';

export const ROLES = {
  ADMIN: 'ADMIN',
  SUPPLIER: 'SUPPLIER',
  TRANSPORTER: 'TRANSPORTER',
  RECEIVER: 'RECEIVER',
  AUDITOR: 'AUDITOR',
  LOGISTICS_MANAGER: 'LOGISTICS_MANAGER',
};

export const ROLE_METADATA = {
  ADMIN: {
    label: 'Platform Admin',
    badgeColor: 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-500/10 dark:border-amber-500/30',
    description: 'Full infrastructure authority, cryptographic keys & user role permissions.',
    allowedTabs: ['dashboard', 'shipments', 'tracking', 'disputes', 'evidence', 'risks', 'ledger', 'replay', 'reports'],
  },
  SUPPLIER: {
    label: 'Cargo Supplier',
    badgeColor: 'text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-300 dark:bg-blue-500/10 dark:border-blue-500/30',
    description: 'Dispatch initialization, invoices, packing proofs & dispatch claim submissions.',
    allowedTabs: ['dashboard', 'shipments', 'tracking', 'disputes', 'evidence'],
  },
  TRANSPORTER: {
    label: 'Logistics Transporter',
    badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-500/10 dark:border-emerald-500/30',
    description: 'Fleet custody, pickup confirmations, transit sensor telemetry & delivery proofs.',
    allowedTabs: ['dashboard', 'shipments', 'tracking', 'risks', 'evidence'],
  },
  RECEIVER: {
    label: 'Consignee Receiver',
    badgeColor: 'text-purple-700 bg-purple-50 border-purple-200 dark:text-purple-300 dark:bg-purple-500/10 dark:border-purple-500/30',
    description: 'Cargo receipt verification, shortage reporting, damage evidence & dispute filing.',
    allowedTabs: ['dashboard', 'shipments', 'tracking', 'disputes', 'evidence'],
  },
  AUDITOR: {
    label: 'Compliance Auditor',
    badgeColor: 'text-cyan-700 bg-cyan-50 border-cyan-200 dark:text-cyan-300 dark:bg-cyan-500/10 dark:border-cyan-500/30',
    description: 'Cryptographic ledger audits, hash chain verification, event replay & compliance certification.',
    allowedTabs: ['dashboard', 'ledger', 'replay', 'reports', 'risks', 'disputes'],
  },
  LOGISTICS_MANAGER: {
    label: 'Logistics Manager',
    badgeColor: 'text-rose-700 bg-rose-50 border-rose-200 dark:text-rose-300 dark:bg-rose-500/10 dark:border-rose-500/30',
    description: 'Multi-party dispute arbitration, evidence cross-examination & final liability determination.',
    allowedTabs: ['dashboard', 'shipments', 'disputes', 'evidence', 'risks', 'reports', 'ledger'],
  },
};

export const DEMO_USERS = [
  {
    id: 'USR-MGR-01',
    name: 'Robert Hastings',
    email: 'robert.h@globalfreight.org',
    role: ROLES.LOGISTICS_MANAGER,
    organization: 'Global Supply Chain Operations',
  },
  {
    id: 'USR-AUD-02',
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@globalaudit.org',
    role: ROLES.AUDITOR,
    organization: 'Maritime Compliance Bureau',
  },
  {
    id: 'USR-SUP-03',
    name: 'Arthur Pendelton',
    email: 'arthur.p@novartis.com',
    role: ROLES.SUPPLIER,
    organization: 'Novartis Biopharma Dispatch',
  },
  {
    id: 'USR-TRN-04',
    name: 'Marcus Vance',
    email: 'marcus.v@aerocold.com',
    role: ROLES.TRANSPORTER,
    organization: 'AeroCold Global Logistics',
  },
  {
    id: 'USR-REC-05',
    name: 'Dr. Tariq Al-Mansoor',
    email: 'tariq.m@dubaihealth.ae',
    role: ROLES.RECEIVER,
    organization: 'Dubai Central Medical Reserve',
  },
  {
    id: 'USR-ADM-00',
    name: 'Vishal Maurya (Lead)',
    email: 'admin@audittrail.io',
    role: ROLES.ADMIN,
    organization: 'Audit-Trail 2.0 Core Platform',
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
    return DEMO_USERS[0]; // Default to Logistics Manager for complete feature review
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
    const newUser = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      name: email.split('@')[0],
      email,
      role: ROLES.LOGISTICS_MANAGER,
      organization: 'Enterprise Operations',
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
      role: role || ROLES.LOGISTICS_MANAGER,
      organization: organization || 'Enterprise Logistics',
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
