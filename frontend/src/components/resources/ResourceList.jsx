import ResourceCard from './ResourceCard';

export default function ResourceList({ resources, projects, onToggleStar, onTagClick, onOpenFile }) {
  return (
    <div className="grid gap-4">
      {resources.map((item) => (
        <ResourceCard
          key={item.id}
          item={item}
          onToggleStar={onToggleStar}
          onTagClick={onTagClick}
          onOpenFile={onOpenFile}
          projectName={projects.find((p) => p.id === item.projectId)?.name || 'Unknown'}
        />
      ))}
    </div>
  );
}
