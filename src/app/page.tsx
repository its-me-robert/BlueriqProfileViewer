"use client";

import React from 'react';
import AppProviders from './providers/appProvider';
import ProfileViewer from './profileViewer';

export default function Home() {
  return (
    <AppProviders>
      <ProfileViewer />
    </AppProviders>
  );
}