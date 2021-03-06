import { createAsyncThunk, createEntityAdapter, createSlice, EntityState } from '@reduxjs/toolkit';

import { ActivityEvent, fetchMany } from 'src/entities/Activity';
import { PaginationArgs } from 'src/lib/paginationArgs';
import { RootState } from '.';

const activityAdapter = createEntityAdapter<ActivityEvent>();

export const activitySelector = activityAdapter.getSelectors<RootState>(
  (state) => state.activities,
);

export const fetchTaskActivites = createAsyncThunk<
  ActivityEvent[],
  PaginationArgs,
  { rejectValue: Error; state: ActivityEvent }
>('activities/fetchMany', fetchMany);

export type ProjectState = EntityState<ActivityEvent>;

export default createSlice({
  extraReducers: (builder) => {
    builder.addCase(fetchTaskActivites.fulfilled, activityAdapter.upsertMany);
  },
  initialState: activityAdapter.getInitialState(),
  name: 'activities',
  reducers: {},
});
