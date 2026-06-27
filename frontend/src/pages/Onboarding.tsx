import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { operatorsAPI } from '../api/client';
import { Operator } from '../types/game';

interface OnboardingProps {
  onOperatorCreated: (operator: Operator) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onOperatorCreated }) => {
  const navigate = useNavigate();
  const [callsign, setCallsign] = useState('');
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!callsign.trim()) {
      setError('Callsign is required');
      return;
    }

    if (callsign.length > 50) {
      setError('Callsign must be 50 characters or less');
      return;
    }

    if (passcode.length < 8) {
      setError('Passcode must be at least 8 characters');
      return;
    }

    if (passcode !== confirmPasscode) {
      setError('Passcodes do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await operatorsAPI.create(callsign, passcode);
      const operator = response.data.data;
      localStorage.setItem('operatorId', operator.id);
      localStorage.setItem('callsign', operator.callsign);
      onOperatorCreated(operator);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create operator');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <div className="border-hard border-2 bg-white hard-shadow-lg p-12">
          {/* Header */}
          <div className="border-b-2 border-hard pb-6 mb-8">
            <h1 className="text-4xl font-bold font-sans">INITIALIZATION PROTOCOL</h1>
            <p className="text-sm font-mono text-gray-600 mt-2">SYS_ID: HK_ONB_01</p>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold mb-2 italic">OPERATOR IDENTITY</h2>
          <p className="text-sm text-gray-700 mb-8 border-l-2 border-hard pl-4">
            Establish local identifiers to track tactical progress and global rankings. No centralized
            authentication required. Data remains persistent locally.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Callsign */}
            <div>
              <label className="block text-xs font-mono font-bold mb-3">
                🔐 ALIAS / CALLSIGN
              </label>
              <input
                type="text"
                value={callsign}
                onChange={(e) => setCallsign(e.target.value.toUpperCase())}
                placeholder="ENTER_CALLSIGN"
                className="w-full px-4 py-3 border-hard font-mono"
                disabled={loading}
              />
            </div>

            {/* Passcode */}
            <div>
              <label className="block text-xs font-mono font-bold mb-3">
                🔒 OPERATOR PASSCODE
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="****_****"
                className="w-full px-4 py-3 border-hard font-mono"
                disabled={loading}
              />
              <p className="text-xs text-gray-600 font-mono mt-1">A/N SECURE HASH - 8 CHARACTERS MIN</p>
            </div>

            {/* Confirm Passcode */}
            <div>
              <label className="block text-xs font-mono font-bold mb-3">
                🔒 CONFIRM PASSCODE
              </label>
              <input
                type="password"
                value={confirmPasscode}
                onChange={(e) => setConfirmPasscode(e.target.value)}
                placeholder="****_****"
                className="w-full px-4 py-3 border-hard font-mono"
                disabled={loading}
              />
            </div>

            {/* Log output */}
            <div className="bg-white border-hard border-2 p-4 font-mono text-xs">
              <div className="text-gray-600">SYS_LOG:</div>
              <div className="text-gray-600">{'> SYSTEM READY'}</div>
              <div className="text-gray-600">{'> AWAITING OPERATOR INPUT '}</div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-400 p-4 font-mono text-xs text-red-700">
                {'> ERROR: ' + error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 button-outline"
                disabled={loading}
              >
                ← ABORT
              </button>
              <button
                type="submit"
                className="flex-1 button-base"
                disabled={loading}
              >
                {loading ? 'INITIALIZING...' : 'INITIALIZE OPERATOR ⚡'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
