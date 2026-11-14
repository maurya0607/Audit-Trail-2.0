import React, { createContext, useContext, useState, useEffect } from 'react';

export const ROLES = {
  ADMIN: 'ADMIN',
  LOGISTICS_MANAGER: 'LOGISTICS_MANAGER',
  SUPPLIER: 'SUPPLIER',
  TRANSPORTER: 'TRANSPORTER',
  RECEIVER: 'RECEIVER',
  AUDITOR: 'AUDITOR',
};

export const ROLE_METADATA = {
  ADMIN: {
    label: 'Platform Admin',
    badgeColor: 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-500/10 dark:border-amber-500/30',
    description: 'Complete platform administration, global infrastructure telemetry, cryptographic keys & master audit logs.',
    allowedTabs: ['dashboard', 'shipments', 'tracking', 'disputes', 'evidence', 'risks', 'ledger', 'replay', 'reports'],
    scopeSummary: 'Unrestricted Master View (All 1,428 Shipments, Global Disputes, System Audit Logs)',
  },
  LOGISTICS_MANAGER: {
    label: 'Logistics Manager',
    badgeColor: 'text-rose-700 bg-rose-50 border-rose-200 dark:text-rose-300 dark:bg-rose-500/10 dark:border-rose-500/30',
    description: 'Tripartite dispute arbitration, AI liability resolution, SLA compliance enforcement & settlement verdicts.',
    allowedTabs: ['dashboard', 'shipments', 'disputes', 'evidence', 'risks', 'reports', 'ledger'],
    scopeSummary: 'Fleet Arbitration Scope (Dispute Settlement, Carrier SLAs, AI Investigation Overrides)',
  },
  SUPPLIER: {
    label: 'Cargo Supplier',
    badgeColor: 'text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-300 dark:bg-blue-500/10 dark:border-blue-500/30',
    description: 'Outbound dispatch creation, invoice & packing list notarization, pre-cooling proofs & dispatch claims.',
    allowedTabs: ['dashboard', 'shipments', 'tracking', 'disputes', 'evidence'],
    scopeSummary: 'Supplier Outbound Scope (Novartis Pharma AG & FreshMart Organics dispatches only)',
  },
  TRANSPORTER: {
    label: 'Logistics Transporter',
    badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-500/10 dark:border-emerald-500/30',
    description: 'Fleet custody handover, in-transit IoT temperature telemetry, seal check-ins & transit proof logs.',
    allowedTabs: ['dashboard', 'shipments', 'tracking', 'risks', 'evidence'],
    scopeSummary: 'Carrier Transit Scope (Assigned vehicle freights, reefer telemetry & custody handovers)',
  },
  RECEIVER: {
    label: 'Consignee Receiver',
    badgeColor: 'text-purple-700 bg-purple-50 border-purple-200 dark:text-purple-300 dark:bg-purple-500/10 dark:border-purple-500/30',
    description: 'Inbound delivery verification, tare weight check, shortage/damage evidence filing & dispute claims.',
    allowedTabs: ['dashboard', 'shipments', 'tracking', 'disputes', 'evidence'],
    scopeSummary: 'Consignee Inbound Scope (Incoming hospital/store deliveries, receiving receipts & loss reports)',
  },
  AUDITOR: {
    label: 'Compliance Auditor',
    badgeColor: 'text-cyan-700 bg-cyan-50 border-cyan-200 dark:text-cyan-300 dark:bg-cyan-500/10 dark:border-cyan-500/30',
    description: 'Independent SHA-256 chain verification, tamper detection, historical replay & regulatory certificates.',
    allowedTabs: ['dashboard', 'ledger', 'replay', 'reports', 'risks', 'disputes'],
    scopeSummary: 'Regulatory Compliance Scope (Immutable Merkle roots, audit trails & official certificates)',
  },
};

export const DEMO_USERS = [
  {
    id: 'USR-ADM-00',
    name: 'Vishal Maurya',
    email: 'admin@audittrail.io',
    password: 'password123',
    role: ROLES.ADMIN,
    organization: 'Audit-Trail 2.0 Global Infrastructure',
    associatedEntity: 'Audit-Trail 2.0 Global Infrastructure',
  },
  {
    id: 'USR-MGR-01',
    name: 'Robert Hastings',
    email: 'robert.h@globalfreight.org',
    password: 'password123',
    role: ROLES.LOGISTICS_MANAGER,
    organization: 'Global Supply Chain Operations',
    associatedEntity: 'Global Supply Chain Operations',
  },
  {
    id: 'USR-SUP-03',
    name: 'Arthur Pendelton',
    email: 'arthur.p@novartis.com',
    password: 'password123',
    role: ROLES.SUPPLIER,
    organization: 'Novartis Biopharma AG Dispatch',
    associatedEntity: 'Novartis Pharma AG',
  },
  {
    id: 'USR-TRN-04',
    name: 'Marcus Vance',
    email: 'marcus.v@aerocold.com',
    password: 'password123',
    role: ROLES.TRANSPORTER,
    organization: 'AeroCold Global Logistics',
    associatedEntity: 'AeroCold Global',
  },
  {
    id: 'USR-REC-05',
    name: 'Dr. Tariq Al-Mansoor',
    email: 'tariq.m@dubaihealth.ae',
    password: 'password123',
    role: ROLES.RECEIVER,
    organization: 'Dubai Health Authority Central Reserve',
    associatedEntity: 'Dubai Health Authority',
  },
  {
    id: 'USR-AUD-02',
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@globalaudit.org',
    password: 'password123',
    role: ROLES.AUDITOR,
    organization: 'Maritime Compliance & Biopharma Audit Bureau',
    associatedEntity: 'Maritime Compliance Bureau',
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
    return DEMO_USERS[0]; // Default to Platform Admin for complete oversight
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('audit_trail_registered_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('audit_trail_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('audit_trail_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('audit_trail_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const login = (email, password, selectedRole) => {
    const allUsers = [...DEMO_USERS, ...registeredUsers];
    const match = allUsers.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        (!selectedRole || u.role === selectedRole)
    );

    if (match) {
      setUser(match);
      setIsAuthModalOpen(false);
      return { success: true, user: match };
    }

    // Role-specific auto session generation
    const fallbackRole = selectedRole || ROLES.LOGISTICS_MANAGER;
    const generatedUser = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      name: email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' '),
      email,
      role: fallbackRole,
      organization: ROLE_METADATA[fallbackRole]?.label + ' Partner',
      associatedEntity: ROLE_METADATA[fallbackRole]?.label,
    };
    setUser(generatedUser);
    setIsAuthModalOpen(false);
    return { success: true, user: generatedUser };
  };

  const register = ({ name, email, password, role, organization }) => {
    const targetRole = role || ROLES.LOGISTICS_MANAGER;
    const newUser = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      name,
      email,
      password: password || 'pass123',
      role: targetRole,
      organization: organization || `${ROLE_METADATA[targetRole]?.label} Organization`,
      associatedEntity: organization || ROLE_METADATA[targetRole]?.label,
    };

    setRegisteredUsers((prev) => [newUser, ...prev]);
    setUser(newUser);
    setIsAuthModalOpen(false);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (newRole) => {
    const matchingDemo = DEMO_USERS.find((u) => u.role === newRole);
    if (matchingDemo) {
      setUser(matchingDemo);
    } else if (user) {
      setUser({
        ...user,
        role: newRole,
        associatedEntity: ROLE_METADATA[newRole]?.label,
      });
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
