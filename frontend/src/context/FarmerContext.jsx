import React, { createContext, useContext, useState, useEffect } from 'react';

const FarmerContext = createContext(null);

const DEFAULT_STATE = {
  farmer: { name: 'Ram Singh', mobile: '9876543210' },
  cropScan: null,       // { predicted_class, confidence, crop_health_score }
  vouches: [],          // [{ name, fpoId, date }]
  trustScore: null,     // { score, risk_band, shap_features }
  loanRequest: null,    // { amount, purpose }
  disclosedFields: {
    yield_history: true,
    gps_location: false,
    crop_type: true,
    vouch_details: true,
    land_area: true,
    soil_health: false,
  },
  loanStatus: 'idle',   // 'idle' | 'pending' | 'approved' | 'restructuring'
  pendingVouchRequest: false,
  latestToast: null,    // { message, amount, reason, timestamp }
};

export function FarmerProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem('sanjeevani_farmer');
      return saved ? { ...DEFAULT_STATE, ...JSON.parse(saved) } : DEFAULT_STATE;
    } catch {
      return DEFAULT_STATE;
    }
  });

  useEffect(() => {
    localStorage.setItem('sanjeevani_farmer', JSON.stringify(state));
  }, [state]);

  const update = (patch) => setState(prev => ({ ...prev, ...patch }));

  const resetAll = () => {
    localStorage.removeItem('sanjeevani_farmer');
    setState(DEFAULT_STATE);
  };

  return (
    <FarmerContext.Provider value={{ state, update, resetAll }}>
      {children}
    </FarmerContext.Provider>
  );
}

export const useFarmer = () => useContext(FarmerContext);
