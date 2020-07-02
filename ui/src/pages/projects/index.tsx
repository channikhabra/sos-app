import classNames from 'classnames/bind';
import Link from 'next/link';
import { MdAdd, MdFolder } from 'react-icons/md';
import { useSelector } from 'react-redux';

import Listing, { ListingItemProps } from 'src/components/Listing';
import NoItemsFound from 'src/components/NoItemsFound';
import DashboardLayout from 'src/containers/DashboardLayout';
import { fetchProjects, projectSelector } from 'src/duck/projects';
import { currentUser } from 'src/entities/User/selectors';
import { useQuery } from 'src/lib/asyncHooks';

import style from './style.module.scss';

const c = classNames.bind(style);

const Header: React.FC = () => (
  <div className={c('header')}>
    Projects
    <Link href="/projects/add">
      <a className={c('add-button')} title="Add project">
        <MdAdd className={c('icon')} />
      </a>
    </Link>
  </div>
);

const Index = () => {
  const user = currentUser();
  let projects = user.projects ? user.projects : [];
  let isFetching = false;

  if (user.role.id === 'APP_ADMIN') {
    projects = useSelector(projectSelector.selectAll);
    [isFetching] = useQuery(fetchProjects, {
      errorTitle: 'Failed to fetch some Projects :-(',
    });
  }

  if (!projects.length) {
    return (
      <div className={c('not-found-container')}>
        <NoItemsFound
          Icon={MdFolder}
          message="No Projects found"
          addItemText="Add a project"
          addItemUrl="/projects/add"
        />
      </div>
    );
  }

  const listItems: ListingItemProps[] = projects.map((p) => ({
    href: `/projects/${p.id}`,
    id: p.id,
    logo: p.logo_square,
    subtitle: `${p.teams_count} members`,
    title: p.name,
  }));

  return (
    <div className={c('list-container')}>
      <Listing items={listItems} isFetching={isFetching} />
    </div>
  );
};

export default () => (
  <DashboardLayout title={'Snake Oil Software - Projects'} Header={Header}>
    <Index />
  </DashboardLayout>
);
