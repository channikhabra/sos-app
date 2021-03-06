import { useSelector } from 'react-redux';

import { RootState } from 'src/duck';
import { employeeSelector } from 'src/duck/employees';
import { orgSelector } from 'src/duck/organizations';
import { projectSelector } from 'src/duck/projects';
import { Employee } from 'src/entities/Employee';
import { Organization } from 'src/entities/Organizations';
import { Project } from 'src/entities/Project';
import { User } from '.';

export interface CurrentUser extends User {
  employee?: Employee;
  projects?: Project[];
  organization?: Organization;
}

/**
 * This function forcefully typecasts user to be non-nullable. It is developer's
 * responsibility to use this only in such situations, where it is guaranteed
 * that User exists e.g inside <WithUser>
 */
export const currentUser = (): CurrentUser => {
  const { user, employee, organization, projects } = useSelector((state: RootState) => {
    const { activeEmployeeId } = state.auth;
    const activeEmployee = activeEmployeeId
      ? employeeSelector.selectById(state, activeEmployeeId)
      : undefined;
    const currentOrg =
      activeEmployee && orgSelector.selectById(state, activeEmployee.organization_id);
    // TODO: These should be employee's projects
    const activeProjects =
      currentOrg &&
      projectSelector.selectAll(state).filter((p) => p.organization_id === currentOrg.id);

    return {
      employee: activeEmployee,
      organization: currentOrg,
      projects: activeProjects,
      user: state.auth.user,
    };
  });

  // const projects = allProjects.length
  //   ? allProjects.filter((p) => p.organization_id === organization?.id)
  //   : [];

  return { ...(user as User), employee, organization, projects };
};
