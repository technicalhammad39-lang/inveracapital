import React from 'react';
import { Megaphone } from 'lucide-react';

export default function NewsletterPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center border border-brand/20 mb-6 shadow-[0_0_30px_rgba(0,255,136,0.15)]">
        <Megaphone size={32} className="text-brand" />
      </div>
      <h1 className="text-3xl font-bold text-white mb-4">Newsletter Management</h1>
      <p className="text-text-secondary max-w-md mx-auto">
        This module is currently under active development. Mass email campaigns and subscriber management will be available here soon.
      </p>
    </div>
  );
}
