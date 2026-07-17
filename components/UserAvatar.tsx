'use client';

import React from 'react';
import Image from 'next/image';

interface UserAvatarProps {
  userId: string;
  name: string;
  avatarUrl?: string | null;
  size?: number;
  className?: string;
}

export function UserAvatar({ userId, name, avatarUrl, size = 40, className = '' }: UserAvatarProps) {
  // If we have an avatarUrl from Google or Upload, use it!
  if (avatarUrl) {
    return (
      <div 
        className={`relative rounded-xl overflow-hidden shadow-[0_0_15px_rgba(0,255,136,0.15)] flex-shrink-0 ${className}`} 
        style={{ width: size, height: size }}
      >
        <Image 
          src={avatarUrl} 
          alt={name || "User Avatar"} 
          fill 
          className="object-cover"
          sizes={`${size}px`}
        />
      </div>
    );
  }

  // Otherwise, fallback to persistent DiceBear based on user ID
  // We use the DiceBear API directly as requested to generate avatars dynamically
  const dicebearUrl = `https://api.dicebear.com/7.x/big-smile/svg?seed=${userId}&backgroundColor=050505&radius=15`;
  
  return (
    <div 
      className={`relative rounded-xl overflow-hidden shadow-[0_0_15px_rgba(0,255,136,0.15)] bg-bg-base border border-white/10 flex-shrink-0 ${className}`} 
      style={{ width: size, height: size }}
    >
      <Image 
        src={dicebearUrl} 
        alt={name || "User Avatar"} 
        fill 
        className="object-cover scale-[1.15]"
        sizes={`${size}px`}
        unoptimized
      />
    </div>
  );
}
