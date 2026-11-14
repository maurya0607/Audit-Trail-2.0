import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  Eye,
  Download,
  AlertCircle,
  PlusCircle,
  X,
} from 'lucide-react';

export const EVIDENCE_CATEGORIES = [
  'Dispatch Invoice',
  'Packing List',
  'Pickup Confirmation',
  'Transit Record',
  'Delivery Proof',
  'Damage Photograph',
  'Receiver Confirmation',
];

export default function EvidenceManagement() {
  const { user } = useAuth();

  const [activeCategory, setActiveCategory] = useState('ALL');
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState(EVIDENCE_CATEGORIES[0]);
  const [newShipmentId, setNewShipmentId] = useState('SHP-77103-LAX');
  const [newNotes, setNewNotes] = useState('');

  const [evidenceList, setEvidenceList] = useState([
    {
      id: 'EVD-901',
      title: 'Dispatch Commercial Invoice & Certified Packing List',
      category: 'Dispatch Invoice',
      shipmentId: 'SHP-88219-DXB',
      disputeId: null,
      submittingParty: 'Novartis Pharma AG (Supplier)',
      timestamp: '2026-11-14 08:16 UTC',
      fileType: 'PDF Document (2.4 MB)',
      sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      status: 'ANCHORED_LEDGER',
      verified: true,
    },
    {
      id: 'EVD-902',
      title: 'Carrier Bill of Lading & Reefer Sensor Handover Form',
      category: 'Transit Record',
      shipmentId: 'SHP-88219-DXB',
      disputeId: null,
      submittingParty: 'Swiss WorldCargo AG (Carrier)',
      timestamp: '2026-11-14 11:45 UTC',
      fileType: 'Signed Scanned PDF (1.1 MB)',
      sha256: '5f4dcc3b5aa765d61d8327deb882cf992b9699aafbe1432d0c24233215234551',
      status: 'ANCHORED_LEDGER',
      verified: true,
    },
    {
      id: 'EVD-903',
      title: 'Arrival Inspection Report & Thermal Probe Photo',
      category: 'Damage Photograph',
      shipmentId: 'SHP-77103-LAX',
      disputeId: 'DSP-2026-081',
      submittingParty: 'PrimeGrocers Distribution (Receiver)',
      timestamp: '2026-11-14 16:32 UTC',
      fileType: 'JPEG Image (3.8 MB)',
      sha256: 'd41d8cd98f00b204e9800998ecf8427e1b590022d4838048f02030d9a6566023',
      status: 'DISPUTE_EVIDENCE',
      verified: true,
    },
    {
      id: 'EVD-904',
      title: 'Refrigeration Unit Fault Diagnostics Log (Compressor #2)',
      category: 'Transit Record',
      shipmentId: 'SHP-77103-LAX',
      disputeId: 'DSP-2026-081',
      submittingParty: 'NorthStar Intermodal (Carrier)',
      timestamp: '2026-11-14 17:05 UTC',
      fileType: 'CSV Sensor Export (450 KB)',
      sha256: '9e107d9d372bb6826bd81d3542a419d6a36f90d165684d008986873528b12204',
      status: 'DISPUTE_EVIDENCE',
      verified: true,
    },
  ]);

  const filtered = evidenceList.filter((e) => {
    if (activeCategory === 'ALL') return true;
    return e.category === activeCategory;
  });

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!newTitle) return;

    setIsUploading(true);
    setTimeout(() => {
      const now = new Date();
      const generatedHash = Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('');

      const newEntry = {
        id: `EVD-${Math.floor(905 + Math.random() * 50)}`,
        title: newTitle,
        category: newCategory,
        shipmentId: newShipmentId,
        disputeId: null,
        submittingParty: `${user?.name || 'Authorized Agent'} (${user?.organization || 'Partner'})`,
        timestamp: `${now.toISOString().replace('T', ' ').substring(0, 16)} UTC`,
        fileType: 'PDF Document (1.8 MB)',
        sha256: generatedHash,
        status: 'ANCHORED_LEDGER',
        verified: true,
      };

      setEvidenceList([newEntry, ...evidenceList]);
      setIsUploading(false);
      setShowUploadModal(false);
      setNewTitle('');
      setNewNotes('');
    }, 700);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Cryptographic Evidence Vault & Chain Verification
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Immutable document hashing, custody receipts, and tamper-proof claim evidence
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all shrink-0"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload & Anchor Evidence</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {['ALL', ...EVIDENCE_CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-slate-900 text-white dark:bg-emerald-500/20 dark:text-emerald-400 border border-transparent dark:border-emerald-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Evidence Table */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase">
            <tr>
              <th className="py-3 px-4">Doc ID & Title</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Associated Entity</th>
              <th className="py-3 px-4">Cryptographic Hash (SHA-256)</th>
              <th className="py-3 px-4 text-right">Integrity Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                    <span>{item.title}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                    {item.id} &bull; {item.fileType}
                  </div>
                </td>
                <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                  {item.category}
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-medium text-slate-800 dark:text-slate-200">{item.submittingParty}</div>
                  <div className="text-[10px] text-slate-400">{item.timestamp}</div>
                </td>
                <td className="py-3.5 px-4 font-mono text-[11px] text-cyan-600 dark:text-cyan-400">
                  {item.sha256.substring(0, 20)}...
                </td>
                <td className="py-3.5 px-4 text-right">
                  <span className="inline-flex items-center gap-1 font-bold text-[10px] px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Anchored</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Anchor Evidence Document</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Temperature Sensor CSV Log & Visual Inspection"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold"
                  >
                    {EVIDENCE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                    Shipment ID
                  </label>
                  <input
                    type="text"
                    value={newShipmentId}
                    onChange={(e) => setNewShipmentId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-semibold"
                  />
                </div>
              </div>

              <div className="p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-950/50 transition-colors">
                <UploadCloud className="w-8 h-8 text-emerald-500 mb-2" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Select File or Drag & Drop
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  PDF, PNG, JPG, or CSV (SHA-256 computed on client side)
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
                >
                  {isUploading ? 'Anchoring...' : 'Hash & Anchor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export { EvidenceManagement as EvidenceList, EvidenceManagement as EvidenceUpload };
