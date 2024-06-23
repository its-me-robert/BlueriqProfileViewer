import React, { useState } from 'react';
import { Entity } from '../models/entity';
import EntitiesContext from '../contexts/entitiesContext'; // Corrected import statement

const EntitiesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entities, setEntities] = useState<Entity[] | null>(null);

  const contextValue = {
    entities,
    setEntities: (newEntities: Entity[]) => setEntities(newEntities),
  };

  return (
    <EntitiesContext.Provider value={contextValue}>
      {children}
    </EntitiesContext.Provider>
  );
};

export default EntitiesProvider;