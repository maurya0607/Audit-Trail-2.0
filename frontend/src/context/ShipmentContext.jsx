import React, { createContext, useContext, useState } from 'react';

// Lightweight SHA-256 simulation for client-side verifiable block hashing
function pseudoSha256(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  // Return standard 64-char hex string simulation
  return (hex + hex + hex + hex + hex + hex + hex + hex).slice(0, 64);
}

const INITIAL_SHIPMENTS = [
  {
    id: 'SHP-88219-DXB',
    title: 'Biopharma Vaccines (Cold Chain)',
    category: 'Biopharma / Cold Chain',
    origin: 'Basel Bio Logistics, Switzerland',
    destination: 'Dubai Health Hub, UAE',
    carrier: 'AeroCold Global',
    status: 'IN_TRANSIT',
    temperature: '3.8°C',
    tempRange: { min: 2.0, max: 8.0 },
    shock: '0.04G',
    shockThreshold: 0.2,
    humidity: '42%',
    currentCustodian: 'Swiss WorldCargo AG',
    riskScore: 'Low (12/100)',
    tamperStatus: 'VERIFIED',
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
    title: 'Semiconductor Microchips',
    category: 'High-Value Electronics',
    origin: 'Hsinchu Science Park, Taiwan',
    destination: 'Jurong Logistics Terminal, Singapore',
    carrier: 'Pacific Freight Express',
    status: 'CUSTOMS_HOLD',
    temperature: '22.1°C',
    tempRange: { min: 15.0, max: 28.0 },
    shock: '0.09G',
    shockThreshold: 0.2,
    humidity: '38%',
    currentCustodian: 'Jurong Port Customs Authority',
    riskScore: 'Medium (48/100)',
    tamperStatus: 'VERIFIED',
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
    title: 'Perishable Organic Produce',
    category: 'Perishable Agriculture',
    origin: 'Oaxaca Distribution Center, Mexico',
    destination: 'Los Angeles Terminal, USA',
    carrier: 'NorthStar Intermodal',
    status: 'EXCURSION_ALERT',
    temperature: '14.2°C (Warning)',
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
        title: 'Genesis Block: Cold Reefer Loaded',
        location: 'Oaxaca Distribution Center, Mexico',
        custodian: 'FreshMart Organics LLC',
        timestamp: '2026-11-14 04:00 UTC',
        tempReading: '3.8°C',
        shockReading: '0.02G',
        prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
        hash: '77a10294bca0918234b0192834bc01928341029abce0192834b0192834b01928',
        payloadDetails: '18 pallets organic berries pre-cooled to 3.8°C.',
      },
      {
        index: 1,
        type: 'COMPRESSOR_FAILURE',
        title: 'Telemetry Excursion Anomaly',
        location: 'Mexicali Transit Corridor, Mexico',
        custodian: 'NorthStar Intermodal Fleet',
        timestamp: '2026-11-14 13:45 UTC',
        tempReading: '14.2°C',
        shockReading: '0.31G',
        prevHash: '77a10294bca0918234b0192834bc01928341029abce0192834b0192834b01928',
        hash: '9a8f10bc39104fa2891cd01948ba1029348b0192834b0192834b0192834b0192',
        payloadDetails: 'Compressor power interruption detected for 3h 12m. Shock threshold exceeded.',
      },
    ],
  },
];

const ShipmentContext = createContext(null);

export function ShipmentProvider({ children }) {
  const [shipments, setShipments] = useState(INITIAL_SHIPMENTS);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // View shipment details modal
  const openDetails = (shipment) => {
    setSelectedShipment(shipment);
    setIsDetailsOpen(true);
  };

  const closeDetails = () => {
    setIsDetailsOpen(false);
  };

  // Create new shipment with Genesis Block #0
  const createShipment = (formData) => {
    const trackingId = `SHP-${Math.floor(10000 + Math.random() * 90000)}-${formData.destination.slice(0, 3).toUpperCase()}`;
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
    const genesisSeed = `0|${timestamp}|GENESIS_DISPATCH|${formData.origin}|${formData.custodian}|0000000000000000000000000000000000000000000000000000000000000000`;
    const genesisHash = pseudoSha256(genesisSeed);

    const genesisEvent = {
      index: 0,
      type: 'GENESIS_DISPATCH',
      title: 'Genesis Block: Dispatch Certified',
      location: formData.origin,
      custodian: formData.custodian || 'Origin Cargo Authority',
      timestamp: timestamp,
      tempReading: `${formData.tempMin || 2.0}°C`,
      shockReading: '0.01G',
      prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
      hash: genesisHash,
      payloadDetails: formData.description || 'Shipment initialized and cryptographically registered in ledger.',
    };

    const newShipment = {
      id: trackingId,
      title: formData.title,
      category: formData.category || 'General Freight',
      origin: formData.origin,
      destination: formData.destination,
      carrier: formData.carrier || 'AeroCold Global',
      status: 'IN_TRANSIT',
      temperature: `${((parseFloat(formData.tempMin) + parseFloat(formData.tempMax)) / 2).toFixed(1)}°C`,
      tempRange: { min: parseFloat(formData.tempMin) || 2.0, max: parseFloat(formData.tempMax) || 8.0 },
      shock: '0.02G',
      shockThreshold: parseFloat(formData.shockMax) || 0.2,
      humidity: '45%',
      currentCustodian: formData.custodian || formData.carrier,
      riskScore: 'Low (05/100)',
      tamperStatus: 'VERIFIED',
      departureDate: timestamp,
      estimatedArrival: 'Estimated 48h Transit',
      events: [genesisEvent],
    };

    setShipments([newShipment, ...shipments]);
    setSelectedShipment(newShipment);
    setIsCreateOpen(false);
    return newShipment;
  };

  // Append new checkpoint event to a shipment's cryptographic chain
  const addCheckpointEvent = (shipmentId, eventData) => {
    setShipments((prevShipments) =>
      prevShipments.map((shp) => {
        if (shp.id !== shipmentId) return shp;

        const lastEvent = shp.events[shp.events.length - 1];
        const newIndex = shp.events.length;
        const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
        const seed = `${newIndex}|${timestamp}|${eventData.type}|${eventData.location}|${eventData.custodian}|${lastEvent.hash}`;
        const eventHash = pseudoSha256(seed);

        const newEvent = {
          index: newIndex,
          type: eventData.type,
          title: eventData.title,
          location: eventData.location,
          custodian: eventData.custodian,
          timestamp: timestamp,
          tempReading: eventData.tempReading || shp.temperature,
          shockReading: eventData.shockReading || '0.03G',
          prevHash: lastEvent.hash,
          hash: eventHash,
          payloadDetails: eventData.payloadDetails || 'Operational checkpoint verified and hashed.',
        };

        const updatedShipment = {
          ...shp,
          temperature: eventData.tempReading || shp.temperature,
          currentCustodian: eventData.custodian || shp.currentCustodian,
          events: [...shp.events, newEvent],
        };

        if (selectedShipment && selectedShipment.id === shipmentId) {
          setSelectedShipment(updatedShipment);
        }

        return updatedShipment;
      })
    );
  };

  return (
    <ShipmentContext.Provider
      value={{
        shipments,
        selectedShipment,
        isDetailsOpen,
        isCreateOpen,
        openDetails,
        closeDetails,
        setIsCreateOpen,
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
