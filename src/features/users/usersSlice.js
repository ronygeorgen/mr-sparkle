import { createSlice } from '@reduxjs/toolkit';
import { fetchUsers, fetchUsersByPipelines, fetchUsersByFilters } from './usersThunks';

const initialState = {
    assignedUserOptions: [],
    filteredUserOptions: [],
    status: 'idle',
    error: null,
  };

  const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
      clearfilteredUserOptions: (state) => {
        state.filteredUserOptions = [];
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchUsers.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchUsers.fulfilled, (state, action) => {
            state.status = 'succeeded';
            // Transform the data to match the expected format
            state.assignedUserOptions = action.payload.map(user => ({
              id: user.id, // Changed from value to id to match your component
              label: `${user.first_name} ${user.last_name}`,
            }));
            state.filteredUserOptions = action.payload.map(user => ({
              id: user.id, // Changed from value to id to match your component
              label: `${user.first_name} ${user.last_name}`,
            }));
          })
        .addCase(fetchUsers.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        })
        .addCase(fetchUsersByPipelines.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchUsersByPipelines.fulfilled, (state, action) => {
          state.status = 'succeeded';
          // Transform the data to match the expected format
          state.filteredUserOptions = action.payload.map(user => ({
            id: user.id, // Changed from value to id to match your component
            label: `${user.first_name} ${user.last_name}`,
          }));
        })
        .addCase(fetchUsersByPipelines.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        })
        .addCase(fetchUsersByFilters.pending, (state) => {
          state.status = "loading";
        })
        .addCase(fetchUsersByFilters.fulfilled, (state, action) => {
          state.status = "succeeded";
          state.filteredUserOptions = action.payload.map(user => ({
            id: user.id, // Changed from value to id to match your component
            label: `${user.first_name} ${user.last_name}`,
          }));
        })
        .addCase(fetchUsersByFilters.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.error.message;
        });
    },
  });
  
  // Export actions
  export const { clearfilteredUserOptions } = usersSlice.actions;
  
  // Export reducer
  export default usersSlice.reducer;