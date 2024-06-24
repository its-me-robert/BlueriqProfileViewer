import React, { useState, useContext, useEffect } from 'react';
import { parseXMLFile } from './utils/parseprofile';
import SearchInput from './SearchInput';
import EntityList from './EntityList';
import EntityDetails from './EntityDetails';
import FileUploader from './FileUploader';
import EntitiesContext from './contexts/entitiesContext';
import SelectedEntityContext from './contexts/selectedEntityContext';
import { Entity } from './models/entity';

export default function ProfileViewer() {
  const { entities, setEntities } = useContext(EntitiesContext);
  const { setSelectedEntity } = useContext(SelectedEntityContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEntities, setFilteredEntities] = useState<Entity[] | undefined>([]);
  useEffect(() => {
    const matchesSearchQuery = (text: string) => text.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase());

    const filtered = entities?.filter(entity =>
      matchesSearchQuery(entity.name) ||
      matchesSearchQuery(entity.instanceid) ||
      entity.attributes.some(attribute =>
        matchesSearchQuery(attribute.name) ||
        attribute.value.some(value => matchesSearchQuery(value))
      )
    );

    setFilteredEntities(filtered);
  }, [searchQuery, entities]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => {

    // Check if the event is a DragEvent
    if ('dataTransfer' in e) {
      const files = e.dataTransfer.files;
      processFiles(files);
    } else {
      // Otherwise, it's a ChangeEvent
      const files = e.target.files;
      if (files)
        processFiles(files);
    }
  };

  const processFiles = (files: FileList) => {
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && e.target.result) {
          let text = e.target.result.toString();

          //decode base64 encoded files
          if (isBase64Encoded(text)) {
            text = atob(text);
          }

          parseXMLFile(text)
            .then(parsedEntities => {
              setEntities(parsedEntities);
              const firstEntity: Entity = parsedEntities[0];
              setSelectedEntity(firstEntity);
              console.log("Selected entity:", firstEntity);
            })
            .catch(error => {
              console.error("Error parsing XML file:", error);
            });
        }
      };
      reader.readAsText(file);
    }
  };

  const isBase64Encoded = (text: string): boolean => {
    const regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;
    return regex.test(text);
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      {!filteredEntities?.length ? (
        <div className="w-full max-w-lg p-10 text-center">
          <div className="mt-5">
            <FileUploader onFileSelect={handleFileSelect} />
          </div>
          <div className="mb-5">
            <a href="https://github.com/its-me-robert/BlueriqProfileViewer" target="_blank" rel="noopener noreferrer" className="flex justify-center items-center gap-2 text-blue-600 hover:text-blue-800">
              <span role="img" aria-label="GitHub">🐙</span> View the repository on GitHub
            </a>
          </div>
          <div className="mb-5">
            <span className="flex justify-center items-center gap-2 text-pink-600">
              <span role="img" aria-label="Heart">❤️</span> Hosted on GitHub Pages
            </span>
          </div>
          <div className="text-sm text-gray-600">
            <p>Disclaimer: All operations are performed client-side. The only information recorded for security reasons is the client&apos;s IP address.</p>
          </div>
        </div>
      ) : (
        <div className="flex w-full p-24 min-h-screen">
          <div className="flex flex-col w-1/3 pr-4">
            <FileUploader onFileSelect={handleFileSelect} />
            <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <EntityList entities={filteredEntities} />
          </div>
          <div className="flex flex-col w-2/3">
            <EntityDetails />
          </div>
        </div>
      )}
    </main>
  );
}