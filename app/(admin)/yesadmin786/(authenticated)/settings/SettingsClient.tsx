'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Settings2, Save } from 'lucide-react';
import { updateSystemSetting } from './actions';

export default function SettingsClient({ settings }: { settings: any[] }) {
  const [formData, setFormData] = useState({
    platformName: settings.find(s => s.key === 'platformName')?.value || 'Invera Capital',
    supportEmail: settings.find(s => s.key === 'supportEmail')?.value || 'support@inveracapital.com',
    maintenanceMode: settings.find(s => s.key === 'maintenanceMode')?.value || 'false',
    allowSignups: settings.find(s => s.key === 'allowSignups')?.value || 'true',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const updates = Object.entries(formData).map(([key, value]) => updateSystemSetting(key, value));
    
    try {
      await Promise.all(updates);
      alert('Platform settings saved successfully!');
    } catch (err) {
      alert('Failed to save settings.');
    }
    
    setIsSaving(false);
  };

  return (
    <div className="space-y-8 pb-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">
            Platform Settings
          </h1>
          <p className="text-text-secondary text-sm font-medium">Configure core platform behavior, maintenance mode, and branding.</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0a0a0b] rounded-2xl border border-white/10 p-6 md:p-8 shadow-2xl"
      >
        <form onSubmit={handleSave} className="space-y-8">
          
          <div>
            <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">General Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Platform Name</label>
                <input 
                  type="text" 
                  value={formData.platformName}
                  onChange={(e) => setFormData({...formData, platformName: e.target.value})}
                  className="w-full bg-[#131619] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Support Email</label>
                <input 
                  type="email" 
                  value={formData.supportEmail}
                  onChange={(e) => setFormData({...formData, supportEmail: e.target.value})}
                  className="w-full bg-[#131619] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">System Controls</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Maintenance Mode</label>
                <select 
                  value={formData.maintenanceMode}
                  onChange={(e) => setFormData({...formData, maintenanceMode: e.target.value})}
                  className="w-full bg-[#131619] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand"
                >
                  <option value="false">Off - Platform Live</option>
                  <option value="true">On - Platform Offline</option>
                </select>
                <p className="text-[10px] text-rose-400 mt-1">Warning: Turning this on will lock out all non-admin users.</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Allow New Signups</label>
                <select 
                  value={formData.allowSignups}
                  onChange={(e) => setFormData({...formData, allowSignups: e.target.value})}
                  className="w-full bg-[#131619] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand"
                >
                  <option value="true">Yes - Accept New Users</option>
                  <option value="false">No - Close Registration</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button 
              type="submit" 
              disabled={isSaving}
              className="flex items-center gap-2 px-8 py-3 bg-brand text-black font-extrabold text-sm rounded-xl hover:bg-brand-hover active:scale-95 transition-all shadow-[0_0_15px_rgba(0,255,136,0.2)] disabled:opacity-50"
            >
              <Save size={18} />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
