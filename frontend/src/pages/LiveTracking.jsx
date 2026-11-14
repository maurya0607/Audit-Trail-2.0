import React from 'react';
import GpsRouteViewer from '../components/tracking/GpsRouteViewer';

export default function LiveTracking() {
  return (
    <div className="space-y-8 animate-fadeIn">
      <GpsRouteViewer />
    </div>
  );
}
