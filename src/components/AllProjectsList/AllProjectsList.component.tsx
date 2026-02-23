import { ProjectCard } from "src/components/ProjectCard/ProjectCard.component";
import type { ProjectType } from "src/contentful/getProjects";

interface AllProjectsListProps {
  projects: ProjectType[];
}

export const AllProjectsList = ({ projects }: AllProjectsListProps) => {
  return (
    <>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </>
  );
};
