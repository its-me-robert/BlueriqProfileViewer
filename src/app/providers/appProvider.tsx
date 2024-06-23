import React from 'react';
import SelectedEntityProvider from './selectedEntityProvider';
import EntitiesProvider from './entitiesProvider';

type AppProvidersProps = {
  children?: React.ReactNode;
};

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <SelectedEntityProvider>
      <EntitiesProvider>
        {children}
      </EntitiesProvider>
    </SelectedEntityProvider>
  );
};

export default AppProviders;