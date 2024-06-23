import React from 'react';
import { Entity } from '../models/entity';

const SelectedEntityContext = React.createContext<{
  selectedEntity: Entity | null;
  setSelectedEntity: (entity: Entity | null) => void;
}>({
  selectedEntity: null,
  setSelectedEntity: () => { },
});

export default SelectedEntityContext;