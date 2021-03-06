import classNames from 'classnames/bind';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';

import ImageUploadField from 'src/components/Form/ImageUploadField';
import SaveButton from 'src/components/Form/SaveButton';
import TextField from 'src/components/Form/TextField';

import style from './style.module.scss';

const c = classNames.bind(style);

interface UpdateProfileProps {
  values?: UpdateProfileFormValues;
  isFetchingProfile?: boolean;
  /*   profile?: Profile; */
}

const CreateProfileForm: React.FC<FormikProps<UpdateProfileFormValues> & UpdateProfileProps> = (
  p,
) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const handleUploading = (status: boolean) => {
    setIsUploading(status);
  };

  return (
    <div className={c('profile-container')}>
      <div className={c({ skeleton: p.isFetchingProfile })}>
        <form className={c('profile-form')} onSubmit={p.handleSubmit}>
          <div className={c('title-container')}>
            <h2>{p.values ? p.values.fullname : 'Update Profile'} </h2>
            <span className={c('sub-title')}>Manage your SOS profile</span>
          </div>

          <div className={c('image-container-logo', 'field-container')}>
            <span className={c('field-title')}>Profile Picture</span>
            <ImageUploadField
              className={c('profile-pic')}
              type={'file'}
              name="profile_pic"
              uploadStatus={handleUploading}
            />
          </div>

          <div className={c('name-container', 'field-container')}>
            <span className={c('field-title')}>Full Name</span>
            <TextField placeholder="Enter full name" type="name" name="fullname" />
          </div>

          <SaveButton
            isSubmitting={p.isSubmitting}
            isUploading={isUploading}
            className={c('save-button')}
            buttonText={'Update'}
          />
        </form>
      </div>
    </div>
  );
};

// ---

export interface UpdateProfileFormValues {
  fullname: string;
  profile_pic: string;
}

const validationSchema = Yup.object().shape({
  fullname: Yup.string()
    .min(2, 'Must be 2 characters or more')
    .max(16, 'Must be 16 characters or less')
    .required('Required'),
  profile_pic: Yup.string(),
});

interface OuterFormProps extends UpdateProfileProps {
  onSubmit: (
    values: UpdateProfileFormValues,
    helpers: FormikHelpers<UpdateProfileFormValues>,
  ) => Promise<void>;
}

const initialValues = {
  fullname: '',
  profile_pic: '',
};

const OuterForm: React.FC<OuterFormProps> = (p) => {
  const InnerForm = (formikProps: FormikProps<UpdateProfileFormValues>) => (
    <CreateProfileForm {...formikProps} isFetchingProfile={p.isFetchingProfile} />
  );

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={p.values ? p.values : initialValues}
        validationSchema={validationSchema}
        onSubmit={p.onSubmit}
      >
        {InnerForm}
      </Formik>
    </>
  );
};

export default OuterForm;
