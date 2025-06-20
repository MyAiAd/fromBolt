import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { X, Search } from 'lucide-react';

interface AffiliateUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

interface ReassignAffiliateModalProps {
  isOpen: boolean;
  onClose: () => void;
  affiliateToReassign: AffiliateUser | null;
  allAffiliates: AffiliateUser[];
  onReassign: (newReferrerId: string) => void;
}

const ReassignAffiliateModal: React.FC<ReassignAffiliateModalProps> = ({
  isOpen,
  onClose,
  affiliateToReassign,
  allAffiliates,
  onReassign,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReferrer, setSelectedReferrer] = useState<AffiliateUser | null>(null);
  const [filteredAffiliates, setFilteredAffiliates] = useState<AffiliateUser[]>([]);

  useEffect(() => {
    if (isOpen) {
      const filtered = allAffiliates.filter(aff =>
        aff.id !== affiliateToReassign?.id &&
        (aff.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         aff.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         aff.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredAffiliates(filtered);
    }
  }, [searchTerm, allAffiliates, affiliateToReassign, isOpen]);

  const handleReassign = () => {
    if (selectedReferrer) {
      onReassign(selectedReferrer.id);
    }
  };

  if (!isOpen || !affiliateToReassign) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-jennaz-purple p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Reassign Affiliate</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>
        <p className="text-gray-300 mb-4">
          Reassigning{' '}
          <span className="font-semibold text-jennaz-rose">
            {affiliateToReassign.first_name} {affiliateToReassign.last_name}
          </span>
        </p>
        <div className="mb-4">
          <label htmlFor="referrer-search" className="block text-sm font-medium text-gray-300 mb-2">
            Select New Referrer
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="referrer-search"
              type="text"
              placeholder="Search for an affiliate..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 w-full"
            />
          </div>
        </div>
        <div className="max-h-60 overflow-y-auto border border-jennaz-rose border-opacity-20 rounded-md">
          {filteredAffiliates.map(aff => (
            <div
              key={aff.id}
              onClick={() => setSelectedReferrer(aff)}
              className={`p-3 cursor-pointer hover:bg-jennaz-purple-light ${selectedReferrer?.id === aff.id ? 'bg-jennaz-purple-light' : ''}`}
            >
              <p className="font-semibold text-white">{aff.first_name} {aff.last_name}</p>
              <p className="text-sm text-gray-400">{aff.email}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button
            onClick={handleReassign}
            disabled={!selectedReferrer}
            className="btn-primary"
          >
            Reassign Affiliate
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReassignAffiliateModal; 