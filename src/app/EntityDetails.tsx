import React, { useContext } from 'react';
import SelectedEntityContext from './contexts/selectedEntityContext';
import EntitiesContext from './contexts/entitiesContext';

const EntityDetails = () => {
  const { selectedEntity, setSelectedEntity } = useContext(SelectedEntityContext);
  const { entities } = useContext(EntitiesContext);

  function clickedEntityInstanceId(relationId: string): void {
    const entityName = relationId.split('|')[0];
    const instanceId = relationId.split('|')[1];
    const foundEntity = entities?.find(entity => entity.name === entityName && entity.instanceid === instanceId);
    if (!foundEntity) {
      console.error(`Entity with name ${entityName} and instanceId ${instanceId} not found`);
      return;
    }
    setSelectedEntity(foundEntity);
  }

  return (
    <div className="border border-gray-300 rounded-lg p-6 my-6 shadow-lg bg-white">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{selectedEntity?.name}</h2>
      <ul>
        {selectedEntity?.attributes.map((val, index) => {
          if (!val) return null;
          return (
            <li key={val.name + index} className="mb-3 last:mb-0">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-gray-700">{val.name}</span>
                  {Array.isArray(val.value) ? (
                    <ul className="list-none flex flex-col items-end">
                      {val.value.map((val2, index2) => (
                        <li key={index2}
                          className={`bg-gray-200 text-gray-700 text-sm font-medium mb-2 py-1 px-3 rounded-full cursor-pointer hover:bg-gray-300 ${val2.includes('|') ? "hover:underline" : ""}`}
                          onClick={val2.includes('|') ? () => clickedEntityInstanceId(val2) : undefined}>
                          {val2}
                        </li>
                      ))}
                    </ul>
                  ) : <span className="text-gray-600 text-sm">{val.value || "UNKNOWN"}</span>}
                </div>
                <span className="text-xs text-gray-400 mt-1 block">{val.source}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default EntityDetails;