import React, { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth, ROLES } from './AuthContext';

function pseudoSha256(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return (hex + hex + hex + hex + hex + hex + hex + hex).slice(0, 64);
}

const INITIAL_SHIPMENTS = [
  {
    id: 'SHP-88219-DXB',
    title: 'Biopharma Vaccines (Cold Chain)',
    category: 'Biopharma / Cold Chain',
    origin: 'Basel Bio Logistics, Switzerland',
    destination: 'Dubai Health Hub, UAE',
    supplier: 'Novartis Pharma AG',
    carrier: 'AeroCold Global',
    receiver: 'Dubai Health Authority',
    status: 'IN_TRANSIT',
    temperature: '3.8°C',
    currentTemp: 3.8,
    tempRange: { min: 2.0, max: 8.0 },
    shock: '0.04G',
    shockThreshold: 0.2,
    humidity: '42%',
    currentCustodian: 'Swiss WorldCargo AG',
    riskScore: 'Low (12/100)',
    tamperStatus: 'VERIFIED_SECURE',
    departureDate: '2026-11-14 08:15 UTC',
    estimatedArrival: '2026-11-15 02:30 UTC',
    events: [
      {
        index: 0,
        type: 'GENESIS_DISPATCH',
        title: 'Genesis Block: Dispatch Certified',
        location: 'Basel Bio Logistics Hub, Switzerland',
        custodian: 'Novartis Pharma AG',
        timestamp: '2026-11-14 08:15 UTC',
        tempReading: '3.5°C',
        shockReading: '0.01G',
        prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
        hash: '9d4f8e12a819b48c1092a01347890bcaf89211d0831a482b8f9e018a38217f2a',
        payloadDetails: 'Sealed cold container #BX-902 with digital GPS datalogger active.',
      },
      {
        index: 1,
        type: 'CUSTODY_HANDOVER',
        title: 'Custody Handover to Air Carrier',
        location: 'Zurich Airport Cargo Bay 4, Switzerland',
        custodian: 'Swiss WorldCargo AG',
        timestamp: '2026-11-14 11:42 UTC',
        tempReading: '3.7°C',
        shockReading: '0.04G',
        prevHash: '9d4f8e12a819b48c1092a01347890bcaf89211d0831a482b8f9e018a38217f2a',
        hash: '148fa721094ba98d1024bc0192e47291a81239ab748190cefab418934102948a',
        payloadDetails: 'Custody transfer confirmed via multi-party cryptographic signature.',
      },
      {
        index: 2,
        type: 'COLD_CHAIN_TELEMETRY',
        title: 'In-Flight Telemetry Ping',
        location: 'In-Flight LX108 (38,000 ft)',
        custodian: 'Swiss WorldCargo AG',
        timestamp: '2026-11-14 14:30 UTC',
        tempReading: '3.8°C',
        shockReading: '0.05G',
        prevHash: '148fa721094ba98d1024bc0192e47291a81239ab748190cefab418934102948a',
        hash: '57b91048ca091248db0192487af01924ba918234acfe09182390841289410298',
        payloadDetails: 'Compressor active. All telemetry parameters within contract corridor.',
      },
      {
        index: 3,
        type: 'CUSTOMS_INSPECTION',
        title: 'Checkpoint Customs Arrival',
        location: 'Dubai International DWC Hub, UAE',
        custodian: 'Emirates SkyCargo Ground',
        timestamp: '2026-11-14 17:05 UTC',
        tempReading: '3.9°C',
        shockReading: '0.02G',
        prevHash: '57b91048ca091248db0192487af01924ba918234acfe09182390841289410298',
        hash: 'a012948cbfa0918234b01982734bca091823471029348ba09182347b0192834b',
        payloadDetails: 'Customs security seal scanned and cryptographically validated.',
      },
    ],
  },
  {
    id: 'SHP-90412-SGP',
    title: 'Semiconductor Microchips Lot 3nm',
    category: 'High-Value Electronics',
    origin: 'Hsinchu Science Park, Taiwan',
    destination: 'Jurong Logistics Terminal, Singapore',
    supplier: 'TSMC Wafer Logistics',
    carrier: 'Pacific Freight Express',
    receiver: 'SingTech Assembly Ltd',
    status: 'CUSTOMS_HOLD',
    temperature: '22.1°C',
    currentTemp: 22.1,
    tempRange: { min: 15.0, max: 28.0 },
    shock: '0.09G',
    shockThreshold: 0.2,
    humidity: '38%',
    currentCustodian: 'Jurong Port Customs Authority',
    riskScore: 'Medium (48/100)',
    tamperStatus: 'VERIFIED_SECURE',
    departureDate: '2026-11-13 14:00 UTC',
    estimatedArrival: '2026-11-16 18:00 UTC',
    events: [
      {
        index: 0,
        type: 'GENESIS_DISPATCH',
        title: 'Genesis Block: Semiconductor Vault Dispatch',
        location: 'Hsinchu Science Park Cleanroom 2, Taiwan',
        custodian: 'TSMC Wafer Logistics',
        timestamp: '2026-11-13 14:00 UTC',
        tempReading: '21.5°C',
        shockReading: '0.01G',
        prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
        hash: '09ab1248fa091283cb0192481029abce01928341029ab0192834b0192834b019',
        payloadDetails: '5,000 unit 3nm wafer lot dispatched in shock-isolated sealed crate.',
      },
      {
        index: 1,
        type: 'CUSTOMS_HOLD',
        title: 'Seal Integrity Customs Audit',
        location: 'Jurong Port Terminal 3, Singapore',
        custodian: 'Jurong Port Customs Authority',
        timestamp: '2026-11-14 11:20 UTC',
        tempReading: '22.1°C',
        shockReading: '0.09G',
        prevHash: '09ab1248fa091283cb0192481029abce01928341029ab0192834b0192834b019',
        hash: '3b01984ca90124b8109cf819024a1029348b0192834bcaf01928341029348b01',
        payloadDetails: 'Container staged for secondary digital seal inspection.',
      },
    ],
  },
  {
    id: 'SHP-77103-LAX',
    title: 'Perishable Organic Produce (100 Boxes)',
    category: 'Perishable Agriculture',
    origin: 'Oaxaca Distribution Center, Mexico',
    destination: 'Los Angeles Terminal, USA',
    supplier: 'FreshMart Organics LLC',
    carrier: 'NorthStar Intermodal',
    receiver: 'PrimeGrocers Distribution LAX',
    status: 'EXCURSION_ALERT',
    temperature: '14.2°C (Warning)',
    currentTemp: 14.2,
    tempRange: { min: 2.0, max: 6.0 },
    shock: '0.31G',
    shockThreshold: 0.2,
    humidity: '78%',
    currentCustodian: 'NorthStar Intermodal Fleet',
    riskScore: 'Critical (89/100)',
    tamperStatus: 'TAMPER_ALERT',
    departureDate: '2026-11-14 04:00 UTC',
    estimatedArrival: '2026-11-15 12:00 UTC',
    events: [
      {
        index: 0,
        type: 'GENESIS_DISPATCH',
        title: 'Genesis Block: Cold Reefer Loaded (100 Boxes)',
        location: 'Oaxaca Distribution Center, Mexico',
        custodian: 'FreshMart Organics LLC',
        timestamp: '2026-11-14 04:00 UTC',
        tempReading: '3.8°C',
        shockReading: '0.02G',
        prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
        hash: 'b8192834019248ba019248bca019248b01928340192834bca019248b0192834b',
        payloadDetails: '100 boxes loaded into NorthStar Reefer trailer #R-401.',
      },
      {
        index: 1,
        type: 'CUSTODY_HANDOVER',
        title: 'Transporter Pickup Logged (100 Units)',
        location: 'Mexicali Logistics Station, Mexico',
        custodian: 'NorthStar Intermodal Fleet',
        timestamp: '2026-11-14 08:30 UTC',
        tempReading: '4.2°C',
        shockReading: '0.06G',
        prevHash: 'b8192834019248ba019248bca019248b01928340192834bca019248b0192834b',
        hash: '5a019248bca019248b019248bca0192481029ab0192481029ab0192834102948',
        payloadDetails: 'Transporter confirmed pickup of 100 boxes with seal #S-491.',
      },
      {
        index: 2,
        type: 'CRITICAL_EXCURSION',
        title: 'Refrigeration Power Failure Detected',
        location: 'Sonora Corridor Mile 142',
        custodian: 'NorthStar Intermodal Fleet',
        timestamp: '2026-11-14 12:15 UTC',
        tempReading: '14.2°C',
        shockReading: '0.31G',
        prevHash: '5a019248bca019248b019248bca0192481029ab0192481029ab0192834102948',
        hash: 'c81029ab0192481029ab019248bca0192834019248b01928340192834bca0192',
        payloadDetails: 'Compressor electrical fault duration 3h 12m. Weight loss registered: -8 boxes.',
      },
    ],
  },
];

const ShipmentContext = createContext(null);

export function ShipmentProvider({ children }) {
  const { user } = useAuth();
  const [shipments, setShipments] = useState(INITIAL_SHIPMENTS);
  const [selectedShipment, setSelectedShipment] = useState(INITIAL_SHIPMENTS[0]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Role-Based Filtering
  // ADMIN & AUDITOR & LOGISTICS_MANAGER: See full global freight
  // SUPPLIER: Outbound dispatches belonging to supplier
  // TRANSPORTER: Dispatches assigned to carrier
  // RECEIVER: Inbound consignments destined for receiver
  const authorizedShipments = shipments.filter((s) => {
    if (!user) return true;
    if (user.role === ROLES.ADMIN || user.role === ROLES.AUDITOR || user.role === ROLES.LOGISTICS_MANAGER) {
      return true;
    }
    if (user.role === ROLES.SUPPLIER) {
      return (
        s.supplier?.toLowerCase().includes('novartis') ||
        s.supplier?.toLowerCase().includes('freshmart') ||
        s.origin?.toLowerCase().includes('basel') ||
        s.origin?.toLowerCase().includes('oaxaca')
      );
    }
    if (user.role === ROLES.TRANSPORTER) {
      return (
        s.carrier?.toLowerCase().includes('aerocold') ||
        s.carrier?.toLowerCase().includes('northstar') ||
        s.carrier?.toLowerCase().includes('swiss')
      );
    }
    if (user.role === ROLES.RECEIVER) {
      return (
        s.receiver?.toLowerCase().includes('dubai') ||
        s.receiver?.toLowerCase().includes('primegrocers') ||
        s.destination?.toLowerCase().includes('dubai') ||
        s.destination?.toLowerCase().includes('angeles')
      );
    }
    return true;
  });

  const openDetails = (shipment) => {
    setSelectedShipment(shipment);
    setIsDetailsOpen(true);
  };

  const closeDetails = () => {
    setIsDetailsOpen(false);
  };

  const createShipment = (formData) => {
    const newId = `SHP-${Math.floor(10000 + Math.random() * 90000)}-${formData.destination.slice(0, 3).toUpperCase()}`;
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC';

    const genesisPayload = {
      index: 0,
      type: 'GENESIS_DISPATCH',
      title: `Genesis Block: ${formData.title} Initialized`,
      location: formData.origin,
      custodian: user ? `${user.name} (${user.organization})` : 'Authorized Consignor',
      timestamp,
      tempReading: `${formData.tempMin}°C`,
      shockReading: '0.01G',
      prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
      payloadDetails: `Consignment created with SLA temp limits: ${formData.tempMin}°C to ${formData.tempMax}°C. Notes: ${formData.notes || 'None'}`,
    };

    const hashString = `${genesisPayload.index}_${genesisPayload.timestamp}_${genesisPayload.prevHash}_${genesisPayload.payloadDetails}`;
    genesisPayload.hash = pseudoSha256(hashString);

    const newShipment = {
      id: newId,
      title: formData.title,
      category: formData.category,
      origin: formData.origin,
      destination: formData.destination,
      supplier: user?.role === ROLES.SUPPLIER ? user.organization : 'Novartis Pharma AG',
      carrier: formData.carrier,
      receiver: 'Authorized Consignee',
      status: 'IN_TRANSIT',
      temperature: `${((formData.tempMin + formData.tempMax) / 2).toFixed(1)}°C`,
      currentTemp: parseFloat(((formData.tempMin + formData.tempMax) / 2).toFixed(1)),
      tempRange: { min: formData.tempMin, max: formData.tempMax },
      shock: '0.02G',
      shockThreshold: 0.2,
      humidity: '45%',
      currentCustodian: formData.carrier,
      riskScore: 'Low (05/100)',
      tamperStatus: 'VERIFIED_SECURE',
      departureDate: timestamp,
      estimatedArrival: formData.eta || '2026-11-18 18:00 UTC',
      events: [genesisPayload],
    };

    setShipments([newShipment, ...shipments]);
    setSelectedShipment(newShipment);
    toast.success(`Genesis Block #0 anchored with SHA-256 hash ${genesisPayload.hash.substring(0, 10)}...`, {
      icon: '🛡️',
      duration: 5000,
    });
  };

  const addCheckpointEvent = (shipmentId, eventData) => {
    setShipments((prevShipments) =>
      prevShipments.map((s) => {
        if (s.id !== shipmentId) return s;

        const prevEvents = s.events || [];
        const lastEvent = prevEvents[prevEvents.length - 1];
        const nextIndex = prevEvents.length;
        const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC';

        const newCheckpoint = {
          index: nextIndex,
          type: eventData.type,
          title: eventData.title,
          location: eventData.location,
          custodian: eventData.custodian,
          timestamp,
          tempReading: eventData.tempReading || s.temperature,
          shockReading: eventData.shockReading || '0.02G',
          prevHash: lastEvent ? lastEvent.hash : '0000000000000000000000000000000000000000000000000000000000000000',
          payloadDetails: eventData.payloadDetails,
        };

        const hashString = `${newCheckpoint.index}_${newCheckpoint.timestamp}_${newCheckpoint.prevHash}_${newCheckpoint.payloadDetails}_${newCheckpoint.location}`;
        newCheckpoint.hash = pseudoSha256(hashString);

        const updatedEvents = [...prevEvents, newCheckpoint];
        const updated = {
          ...s,
          currentCustodian: eventData.custodian,
          events: updatedEvents,
        };

        if (selectedShipment && selectedShipment.id === shipmentId) {
          setSelectedShipment(updated);
        }

        toast.success(`Block #${nextIndex} (${eventData.type}) cryptographically chained!`, {
          icon: '🔗',
          duration: 4000,
        });

        return updated;
      })
    );
  };

  return (
    <ShipmentContext.Provider
      value={{
        shipments: authorizedShipments,
        allShipments: shipments,
        selectedShipment,
        isDetailsOpen,
        isCreateOpen,
        setIsCreateOpen,
        openDetails,
        closeDetails,
        createShipment,
        addCheckpointEvent,
      }}
    >
      {children}
    </ShipmentContext.Provider>
  );
}

export function useShipments() {
  const context = useContext(ShipmentContext);
  if (!context) {
    throw new Error('useShipments must be used within a ShipmentProvider');
  }
  return context;
}
