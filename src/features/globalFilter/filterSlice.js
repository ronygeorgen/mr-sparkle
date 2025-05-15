import { createSlice } from '@reduxjs/toolkit';

const filterSlice = createSlice({
  name: 'filters',
  initialState: {
    selectedGlobalFilterPipelines: [],
    pipelineStages: [],
    assignedUsers: [],
    opportunityOwners: [],
    opportunitySources: [],
    productSales: []
  },
  reducers: {
    setPipelineFilters: (state, action) => {
      state.selectedGlobalFilterPipelines = action.payload;
    },
    setPipelineStageFilters: (state, action) => {
      state.pipelineStages = action.payload;
    },
    setAssignedUserFilters: (state, action) => {
      state.assignedUsers = action.payload;
    },
    setOpportunityOwnerFilters: (state, action) => {
      state.opportunityOwners = action.payload;
    },
    setOpportunitySourceFilters: (state, action) => {
      state.opportunitySources = action.payload;
    },
    setProductSalesFilters: (state, action) => {
      state.productSales = action.payload;
    },
    clearAllFilters: (state) => {
      state.selectedGlobalFilterPipelines = [];
      state.pipelineStages = [];
      state.assignedUsers = [];
      state.opportunityOwners = [];
      state.opportunitySources = [];
      state.productSales = [];
    }
  }
});

export const {
  setPipelineFilters,
  setPipelineStageFilters,
  setAssignedUserFilters,
  setOpportunityOwnerFilters,
  setOpportunitySourceFilters,
  setProductSalesFilters,
  clearAllFilters
} = filterSlice.actions;

export default filterSlice.reducer;