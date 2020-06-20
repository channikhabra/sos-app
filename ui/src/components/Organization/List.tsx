import classNames from 'classnames/bind';
import style from 'src/components/Organization/style.module.scss';
import FallbackIcon from 'src/containers/FallbackIcon';

import { Organization } from 'src/entities/Organizations';

const c = classNames.bind(style);

interface Props {
  organizations: Organization[];
}

const OrgItem: React.FC<Organization> = (o) => (
  <div className={c('container')} key={o.id}>
    <div className={c('fallback-icon')}>
      <FallbackIcon logo={o.square_logo} name={o.name} />
    </div>
    <div className={c('organization-container')}>
      <span className={c('name')}>{o.name}</span>
      <span className={c('count')}>{o.employees_count} Employees</span>
    </div>
  </div>
);

const List: React.FC<Props> = (p) => {
  return <div className={c('organization')}>{p.organizations.map(OrgItem)}</div>;
};

export default List;
