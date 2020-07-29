import client from 'src/lib/client';
import resolveStorageFile from 'src/utils/resolveStorageFile';

export interface Employee {
  id: string;
  ecode: string;
  email: string;
  name: string;
  headshot: string;
  joining_date: string;
  designation_id: string;
  organization_id: string;
}

export interface EmployeeArgs {
  ecode: string;
  email?: string;
  name: string;
  headshot?: string;
  organization_id: string;
  designation_id: string;
}

export const create = async (payload: EmployeeArgs): Promise<Employee> => {
  const query = `
  mutation ($ecode: String!, $email: String, $name: String!, $headshot: String, $designation_id: designations_enum!, $organization_id: uuid!){
    insert_employees_one(
      object:{
         ecode: $ecode,
         email: $email,
         name: $name,
         headshot: $headshot,
         designation_id: $designation_id,
         organization_id: $organization_id
      })
       {
        ecode
      }
  }`;

  try {
    const data = await client.request(query, payload);

    return data.payload;
  } catch (err) {
    if (/uniqueness violation/i.test(err.message)) {
      throw new Error('Duplicate employee email');
    }

    throw new Error('Something went wrong :-(');
  }
};

export const update = async (payload: EmployeeArgs): Promise<Employee> => {
  const query = `
    mutation ($currentEcode: String!, $currentOrgId: uuid! $ecode: String, $email: String, $name: String, $headshot: String, $designation_id: designations_enum, $organization_id: uuid)
     {update_employees_by_pk ( pk_columns: {ecode: $currentEcode, organization_id: $currentOrgId}
      _set:{
        ecode: $ecode,
        email: $email,
        name: $name,
        headshot: $headshot,
        designation_id: $designation_id,
        organization_id: $organization_id
        }){
        ecode
      }
    }`;

  try {
    const data = await client.request(query, payload);

    return data.payload;
  } catch (err) {
    if (/uniqueness violation/i.test(err.message)) {
      throw new Error('Duplicate employee email');
    }

    throw new Error('Something went wrong :-(');
  }
};

export const fetchMany = async (): Promise<Employee[]> => {
  const query = `{
  employees {
    ecode
    name
    email
    headshot
    joining_date
    designation_id
    organization_id
    }
  }`;

  const data = await client.request(query);

  return data?.employees.length
    ? data.employees.map((e: any) => ({
        ...e,
        headshot: resolveStorageFile(e.headshot),
      }))
    : [];
};

export const fetchOne = async (payload: { orgId: string; ecode: string }): Promise<Employee> => {
  const query = `query ($orgId: uuid!, $ecode: String!){
    employees_by_pk(ecode: $ecode, organization_id: $orgId ) {
      ecode
      name
      email
      headshot
      joining_date
      designation_id
      organization_id
     }
   }`;

  const data = await client.request(query, payload);
  const employee = data.employees_by_pk;

  if (!employee) {
    throw new Error('Could not get employee at the moment');
  }
  return { ...employee, id: `${employee.ecode}-${employee.organization_id}` };
};
