import React from 'react';
import { Entity } from '../models/entity';


const EntitiesContext = React.createContext<{
  entities: Entity[] | null;
  setEntities: (entities: Entity[]) => void;
}>({
  entities: null,
  setEntities: () => { },
});

export default EntitiesContext;