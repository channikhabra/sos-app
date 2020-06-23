import classNames from 'classnames/bind';
import Link from 'next/link';
import { MdAdd, MdBusiness } from 'react-icons/md';
import { useSelector } from 'react-redux';

import NoItemsFound from 'src/components/NoItemsFound';
import OrganizationsList from 'src/components/Organization/List';
import DashboardLayout from 'src/containers/DashboardLayout';
import { fetchOrganizations, orgSelector } from 'src/duck/organizations';
import { useQuery } from 'src/lib/asyncHooks';

import style from './style.module.scss';

const c = classNames.bind(style);

const Header: React.FC = () => (
  <div className={c('header')}>
    Organizations
    <Link href="/organizations/add">
      <a className={c('add-button')} title="Add organization">
        <MdAdd className={c('icon')} />
      </a>
    </Link>
  </div>
);

const Index = () => {
  const organizations = useSelector(orgSelector.selectAll);
  const [isFetching] = useQuery(fetchOrganizations, {
    errorTitle: 'Failed to fetch some Organizations',
  });

  if (!organizations.length && !isFetching) {
    return (
      <div className={c('not-found-container')}>
        <NoItemsFound
          Icon={MdBusiness}
          message="No Organizations found"
          addItemText="Add an Organization"
          addItemUrl="/organizations/add"
        />
      </div>
    );
  }

  return <OrganizationsList organizations={organizations} isFetching={isFetching} />;
};

export default () => (
  <DashboardLayout title={'Snake Oil Software - Organizations'} Header={Header}>
    <Index />
  </DashboardLayout>
);
