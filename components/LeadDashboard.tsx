
import React from 'react';
import { Lead } from '../types';

interface LeadDashboardProps {
  leads: Lead[];
  isSyncing?: boolean;
  connectionError?: boolean;
  onRefresh: () => void;
  onClear: () => void;
  onBack: () => void;
}

const LeadDashboard: React.FC<LeadDashboardProps> = ({ leads, isSyncing, connectionError, onRefresh, onClear, onBack }) => {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-luxury-dark">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-8 gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-4xl font-serif">Tailored Network Pipeline</h1>
              
              {isSyncing ? (
                <div className="flex items-center space-x-2 text-luxury-gold animate-pulse">
                  <div className="w-1.5 h-1.5 bg-luxury-gold rounded-full animate-bounce"></div>
                  <span className="text-[9px] uppercase tracking-widest">Cloud Syncing...</span>
                </div>
              ) : connectionError ? (
                <div className="flex items-center space-x-2 text-red-500">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  <span className="text-[9px] uppercase tracking-widest">Offline Mode (Local Only)</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-green-500/50">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span className="text-[9px] uppercase tracking-widest">Secured & Synced</span>
                </div>
              )}
            </div>
            <p className="text-white/50">Managing {leads.length} qualified prospects with detailed property data.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={onRefresh}
              className={`px-4 py-2 border text-xs uppercase tracking-widest transition-all flex items-center space-x-2 ${connectionError ? 'border-red-500/30 text-red-500 hover:border-red-500' : 'border-white/10 text-white/70 hover:border-luxury-gold hover:text-luxury-gold'}`}
            >
              <svg className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              <span>{connectionError ? 'Reconnect' : 'Refresh Cloud'}</span>
            </button>
            <button 
              onClick={onClear}
              className="px-4 py-2 border border-red-500/50 text-red-500 text-xs uppercase tracking-widest hover:bg-red-500/10 transition-colors"
            >
              Clear DB
            </button>
            <button 
              onClick={onBack}
              className="px-4 py-2 bg-white text-black text-xs uppercase tracking-widest hover:bg-luxury-gold hover:text-white transition-colors"
            >
              Close Admin
            </button>
          </div>
        </div>

        {connectionError && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 text-[10px] uppercase tracking-widest text-red-400 text-center animate-fadeIn">
            Warning: Could not connect to the Algarve Exclusif cloud. Leads shown are from your current device's local cache.
          </div>
        )}

        {leads.length === 0 ? (
          <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 animate-pulse">
            <p className="text-white/30 font-light text-xl italic">Waiting for high-intent capture...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leads.map(lead => (
              <div key={lead.id} className="lead-card bg-[#151515] border border-white/5 p-6 rounded-sm flex flex-col justify-between animate-fadeIn">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-[10px] uppercase tracking-[0.2em] px-2 py-1 rounded-sm ${lead.type === 'buyer' ? 'bg-blue-500/20 text-blue-400' : 'bg-luxury-gold/20 text-luxury-gold'}`}>
                      {lead.type}
                    </span>
                    <span className="text-[10px] text-white/30">
                      {new Date(lead.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-serif mb-1">{lead.firstName} {lead.lastName}</h3>
                  <div className="space-y-1 text-sm text-white/60 mb-6 font-light">
                    <p className="hover:text-luxury-gold transition-colors cursor-pointer">{lead.email}</p>
                    <p className="hover:text-luxury-gold transition-colors cursor-pointer">{lead.phone}</p>
                  </div>

                  <div className="pt-4 border-t border-white/5 space-y-4">
                    {lead.type === 'buyer' ? (
                      <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-[10px] uppercase tracking-wider">
                        <div>
                          <p className="text-white/30 mb-1">Budget</p>
                          <p className="text-white">{lead.budget || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-white/30 mb-1">Style</p>
                          <p className="text-white">{lead.propertyType || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-white/30 mb-1">Bedrooms</p>
                          <p className="text-white">{lead.bedrooms || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-white/30 mb-1">Purpose</p>
                          <p className="text-white">{lead.purpose || 'N/A'}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-white/30 mb-1">Essential Features</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {lead.features?.map(f => (
                              <span key={f} className="bg-white/5 px-2 py-0.5 border border-white/10 rounded-full text-[8px]">{f}</span>
                            )) || <span className="text-white/20 italic">No specific lifestyle features</span>}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 text-[10px] uppercase tracking-wider">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-white/30 mb-1">Price Expected</p>
                            <p className="text-white">{lead.expectedPrice || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-white/30 mb-1">Style</p>
                            <p className="text-white">{lead.propertyType || 'N/A'}</p>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-white/30 mb-1">Property Insight</p>
                          <p className="text-white/70 normal-case font-light leading-relaxed line-clamp-3">
                            {lead.propertyDescription || 'No description provided.'}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-white/30 mb-1">Caderneta Predial</p>
                            <div className="flex items-center space-x-2 text-luxury-gold">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                              <span className="truncate">{lead.cadernetaPredial || 'Missing'}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-white/30 mb-1">Assets</p>
                            <p className="text-white">{lead.images?.length || 0} Images</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <button className="mt-8 w-full border border-luxury-gold/30 text-luxury-gold py-3 text-xs uppercase tracking-widest hover:bg-luxury-gold hover:text-white transition-all shadow-lg">
                  {lead.type === 'buyer' ? 'Send Matching Portfolio' : 'Full Valuation Review'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadDashboard;
