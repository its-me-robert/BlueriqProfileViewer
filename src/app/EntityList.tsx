import { useContext, useEffect, useState, useMemo } from 'react';
import { Entity } from './models/entity';
import SelectedEntityContext from './contexts/selectedEntityContext';
import React from 'react';

const EntityList = ({ entities }: { entities: Entity[] }) => {
  const { selectedEntity, setSelectedEntity } = useContext(SelectedEntityContext);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const groupedEntities = useMemo(() => {
    console.log("Grouping entities by name...");
    return entities.reduce((acc: { [key: string]: Entity[] }, entity: Entity) => {
      acc[entity.name] = acc[entity.name] || [];
      acc[entity.name].push(entity);
      return acc;
    }, {} as { [key: string]: Entity[] });
  }, [entities]);

  const groupedEntitiesArray = useMemo(() => {
    const array = Object.entries(groupedEntities).map(([name, entities]) => ({ name, entities }));

    // Sort the groups alphabetically by their names
    array.sort((a, b) => a.name.localeCompare(b.name));

    // sort entities within each group if needed
    array.forEach(group => {
      group.entities.sort((a, b) => a.instanceid.localeCompare(b.instanceid));
    });

    return array;
  }, [groupedEntities]);

  useEffect(() => {
    if (selectedEntity) {
      const selectedCategory = groupedEntitiesArray.find(group =>
        group.entities.some(entity => entity.instanceid === selectedEntity.instanceid)
      );

      if (selectedCategory) {
        setExpandedGroups(new Set([selectedCategory.name]));
      }
    }
  }, [selectedEntity, groupedEntitiesArray]);

  const handleSelectEntity = (entity: Entity) => {
    console.log("Selected entity:", entity);
    setSelectedEntity(entity);
  };

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => {
      const newExpandedGroups = new Set(prev);
      if (newExpandedGroups.has(groupName)) {
        newExpandedGroups.delete(groupName);
      } else {
        newExpandedGroups.add(groupName);
      }
      return newExpandedGroups;
    });
  };
  return (
    <div className="border border-gray-300 rounded-lg p-6 my-6 shadow-lg bg-white">
      {groupedEntitiesArray.map(group => (
        <div key={group.name}>
          <div className="text-xl font-semibold text-gray-800 mb-4 flex justify-between items-center cursor-pointer" onClick={() => toggleGroup(group.name)}>
            <span>{group.name}</span>
            <div className="flex items-center">
              <CounterBadge count={group.entities.length} />
              <span className="ml-2">{expandedGroups.has(group.name) ? '-' : '+'}</span>
            </div>
          </div>
          {expandedGroups.has(group.name) && (
            <ul className="list-none">
              {group.entities.map(entity => (
                <li key={entity.instanceid}
                  className={`mb-3 last:mb-0 p-3 rounded-lg cursor-pointer ${selectedEntity?.instanceid === entity.instanceid ? 'bg-gray-300' : 'bg-gray-50'} hover:bg-gray-200`}
                  onClick={() => handleSelectEntity(entity)}>
                  <span className="text-gray-700">{entity.instanceid}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default React.memo(EntityList);

const CounterBadge = ({ count }: { count: number }) => {
  return (
    <span className="inline-block bg-blue-500 text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded" aria-label={`Count: ${count}`}>
      {count}
    </span>
  );
};