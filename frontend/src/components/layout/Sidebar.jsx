import SearchBar from '../filters/SearchBar';
import ProjectTree from '../projects/ProjectTree';
import TypeFilter from '../filters/TypeFilter';

export default function Sidebar(props) {
  return (
    <aside className="col-span-12 lg:col-span-3">
      <SearchBar value={props.searchQuery} onChange={props.onSearchChange} />
      <ProjectTree
        projects={props.projects}
        resources={props.resources}
        selectedProject={props.selectedProject}
        selectedFolder={props.selectedFolder}
        onAddProject={props.onAddProject}
        onSelectProject={props.onSelectProject}
        onSelectFolder={props.onSelectFolder}
        onAddFolder={props.onAddFolder}
        onDeleteFolder={props.onDeleteFolder}
        onDeleteProject={props.onDeleteProject}
      />
      <TypeFilter
        selectedType={props.selectedType}
        onSelectType={props.onSelectType}
        selectedProject={props.selectedProject}
        resources={props.resources}
      />
    </aside>
  );
}
