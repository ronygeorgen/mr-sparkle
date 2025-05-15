import { createAsyncThunk } from "@reduxjs/toolkit";
import { contactsAPI } from "./contactsAPI";

export const fetchOpportunityOwners = createAsyncThunk(
    "contacts/fetchOpportunityOwners",
    async (searchQuery = "", { rejectWithValue }) => {
      try {
        const response = await contactsAPI.getContacts(searchQuery);
        
        return response.data.results.map(contact => ({
          id: contact.id,
          label: `${contact.first_name} ${contact.last_name}`,
        }));
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );
  
  // New thunk to fetch pipeline stages filtered by pipeline IDs
  export const fetchOpportunityOwnersByPipelines = createAsyncThunk(
    "contacts/fetchOpportunityOwnersByPipelines",
    async (pipelineIds) => {
      const response = await contactsAPI.getContactsByPipelines(pipelineIds);
      return response.data;
      
    }
  );

  export const fetchOpportunityOwnersByFilters = createAsyncThunk(
    "contacts/fetchOpportunityOwnersByFilters",
    async (filters) => {
      const response = await contactsAPI.getContactsByFilters(filters);
      return response.data;
    }
  );