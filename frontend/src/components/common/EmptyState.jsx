import { Folder, Search } from 'lucide-react';

export default function EmptyState({ hasProject }) {
  return (
    <div className="bg-black/60 backdrop-blur-sm rounded-xl shadow-lg p-12 text-center border border-gray-800">
      <div className="w-16 h-16 bg-gray-900/80 rounded-full flex items-center justify-center mx-auto mb-4">
        {hasProject ? <Search className="w-8 h-8 text-gray-500" /> : <Folder className="w-8 h-8 text-gray-500" />}
      </div>
      <h3 className="text-lg font-semibold text-gray-200 mb-2">
        {hasProject ? 'No resources found' : 'Select a project to get started'}
      </h3>
      <p className="text-gray-400">
        {hasProject ? 'Try adjusting your filters or add a new resource' : 'Click on a project in the sidebar to view its contents'}
      </p>
    </div>
  );
}
