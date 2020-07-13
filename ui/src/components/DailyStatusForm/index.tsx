import classNames from 'classnames/bind';
import { Field, FieldArray, FieldArrayRenderProps, Form, Formik, FormikProps } from 'formik';
import { KeyboardEvent } from 'react';
import { GoGitPullRequest, GoIssueOpened } from 'react-icons/go';
import { MdClose, MdKeyboardReturn } from 'react-icons/md';

import FallbackIcon from 'src/containers/FallbackIcon';
import Header from './Header';
import style from './style.module.scss';

const c = classNames.bind(style);

/* interface DailyStatusFieldProps {
 *   name: string;
 *   className?: string;
 *   inputClassName?: string;
 *   placeholder?: string;
 * }
 *  */

interface NewStatusUpdate {
  issue?: string;
  pr?: string;
  status: string;
  employeeId: string;
}

interface DailyStatusFormValues {
  statusUpdates: NewStatusUpdate[];
}

const initialValues: DailyStatusFormValues = {
  statusUpdates: [
    {
      employeeId: '',
      issue: '',
      pr: '',
      status: '',
    },
  ],
};

const StatusField: React.FC<{
  status: NewStatusUpdate;
  name: string;
  onSave: () => void;
  onDelete?: () => void;
}> = (p) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      p.onSave();
    }
  };

  return (
    <div className={c('add-status-body')}>
      <div className={c('add-status-row')}>
        <Field
          className={c('add-status')}
          type={'text'}
          name={`${p.name}.status`}
          onKeyDown={handleKeyDown}
          placeholder="Status"
        />
        <span className={c('input-action-container')}>
          {!p.onDelete && <MdKeyboardReturn onClick={p.onSave} />}
          {p.onDelete && <MdClose onClick={p.onDelete} />}
        </span>
      </div>

      <div className={c('add-row-items')}>
        <div className={c('add-status-item')}>
          <GoIssueOpened className={c('add-item-icon')} />
          <input
            className={c('add-issue')}
            type={'text'}
            placeholder="Issue"
            name={`${name}.issue`}
          />
        </div>
        <div className={c('add-status-item')}>
          <GoGitPullRequest className={c('add-item-icon')} />
          <input className={c('add-issue')} type={'text'} placeholder="PR" name={`${name}.pr`} />
        </div>
        <div className={c('add-status-item', 'add-status-user')}>
          <span className={c('add-item-icon')}>
            <FallbackIcon logo={''} name={''} />
          </span>
          <span className={c('add-item-text')}>{''}</span>
        </div>
      </div>
    </div>
  );
};

const DailyStatusFields: React.FC<FieldArrayRenderProps & { value: NewStatusUpdate[] }> = ({
  remove,
  unshift,
  value: statusUpdates,
}) => {
  const handleSaveStatus = () => {
    unshift({ status: '', pr: '', issue: '', employeeId: '' });
  };

  const handleDelete = (index: number) => {
    remove(index);
  };

  const StatusFields = statusUpdates.map((s, index) => (
    <StatusField
      key={index}
      name={`statusUpdates.${index}`}
      onDelete={index ? () => handleDelete(index) : undefined}
      onSave={handleSaveStatus}
      status={s}
    />
  ));

  return <>{StatusFields}</>;
};

const InnerForm: React.FC<FormikProps<DailyStatusFormValues> & { onClose: () => void }> = (p) => (
  <Form>
    <Header onClose={p.onClose} onSubmit={p.submitForm} />

    <FieldArray
      name="statusUpdates"
      render={(props) => DailyStatusFields({ ...props, value: p.values.statusUpdates })}
    />
  </Form>
);

const FieldArr: React.FC<{ onClose: () => void }> = (p) => {
  const handleSubmit = (values: DailyStatusFormValues) => {
    console.warn('------values--------', values);
  };

  return (
    <>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {(formikProps) => InnerForm({ onClose: p.onClose, ...formikProps })}
      </Formik>
    </>
  );
};

export default FieldArr;
