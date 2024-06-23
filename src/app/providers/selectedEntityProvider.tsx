import React, { useState } from 'react';
import { Entity } from '../models/entity';
import selectedEntityContext from '../contexts/selectedEntityContext'; // Corrected import statement

const SelectedEntityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);

  const contextValue = {
    selectedEntity,
    setSelectedEntity: (newSelectedEntity: Entity | null) => setSelectedEntity(newSelectedEntity),
  };

  return (
    <selectedEntityContext.Provider value={contextValue}>
      {children}
    </selectedEntityContext.Provider>
  );
};

export default SelectedEntityProvider;