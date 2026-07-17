'use client';

import React, { useState, useRef, useMemo } from 'react';
import { Camera, Trash2, Upload } from 'lucide-react';
import { createAvatar } from '@dicebear/core';
import { bigSmile } from '@dicebear/collection';
import { updateAvatar } from '@/app/(dashboard)/profile/actions';
import Image from 'next/image';

interface AvatarUploadProps {
  userId: string;
  nameSeed: string;
  currentAvatarUrl: string | null;
}

export function AvatarUpload({ userId, nameSeed, currentAvatarUrl }: AvatarUploadProps) {
  const [avatar, setAvatar] = useState<string | null>(currentAvatarUrl);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate DiceBear SVG if no custom avatar is present
  const generatedAvatar = useMemo(() => {
    return createAvatar(bigSmile, {
      seed: nameSeed || userId,
      backgroundColor: ['00ff88'], // Brand color
      backgroundType: ['gradientLinear'],
    }).toDataUri();
  }, [nameSeed, userId]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // For demonstration, we'll convert the image to Base64 and store it directly.
    // In a production app, you would upload this to an S3 bucket and save the URL.
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      setAvatar(base64String);
      
      await updateAvatar(userId, base64String);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = async () => {
    setIsUploading(true);
    setAvatar(null);
    await updateAvatar(userId, null);
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative group">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-brand/30 shadow-[0_0_15px_rgba(0,255,136,0.15)] relative">
          <Image 
            src={avatar || generatedAvatar} 
            alt="Profile Avatar" 
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        
        {/* Upload Overlay */}
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
        >
          <Camera className="w-6 h-6 text-white mb-1" />
          <span className="text-[10px] text-white font-bold uppercase tracking-wider">Change</span>
        </button>
      </div>

      <div className="space-y-3 text-center sm:text-left">
        <div>
          <h3 className="font-bold text-white text-md">Profile Picture</h3>
          <p className="text-xs text-text-secondary">JPG, GIF or PNG. Max size of 800K</p>
        </div>
        <div className="flex items-center justify-center sm:justify-start gap-3">
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-brand/10 hover:bg-brand/20 border border-brand/30 text-brand px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
          >
            {isUploading ? <span className="animate-pulse">Uploading...</span> : <><Upload size={14} /> Upload New</>}
          </button>
          
          {avatar && (
            <button 
              onClick={handleRemove}
              disabled={isUploading}
              className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <Trash2 size={14} /> Remove
            </button>
          )}
        </div>
      </div>
      
      <input 
        type="file" 
        accept="image/png, image/jpeg, image/gif" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </div>
  );
}
