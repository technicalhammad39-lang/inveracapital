'use client'; // global-error must be a Client Component

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0f1115] text-white font-sans antialiased">
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center border border-rose-500/20 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-400">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Critical System Failure</h1>
          <p className="text-gray-400 max-w-md mx-auto mb-8">
            The application encountered an unrecoverable error at the root level.
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-[#00ff88] text-black font-bold rounded-xl hover:bg-[#00e67a] transition-colors"
          >
            Attempt Recovery
          </button>
        </div>
      </body>
    </html>
  );
}
