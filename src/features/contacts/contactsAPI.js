import { axiosInstance } from "../../services/api";

// API methods for contacts feature
export const contactsAPI = {
    getContacts: (searchQuery = "") => axiosInstance.get(`/contacts/?search=${searchQuery}`),

    getContactsByPipelines: (pipelineIds) => {
      // If no pipeline IDs are selected, return all pipeline stages
      if (!pipelineIds || pipelineIds.length === 0) {
        return axiosInstance.get("/contacts/");
      }
      
      // Create URL with multiple pipeline parameters
      let url = "/contacts/?";
      pipelineIds.forEach((id, index) => {
        // Add & between parameters, but not for the first one
        if (index > 0) url += "&";
        url += `pipeline=${id}`;
      });
      
      return axiosInstance.get(url);

    },
    // New method for filtering by multiple parameters
    getContactsByFilters: (filters) => {
      if (!filters || Object.values(filters).every(arr => !arr || arr.length === 0)) {
        return axiosInstance.get("/contacts/");
      }
      
      let url = "/contacts/?";
      let paramCount = 0;
      
      // Add pipeline filters
      if (filters.pipelines && filters.pipelines.length > 0) {
        filters.pipelines.forEach(id => {
          url += (paramCount > 0 ? "&" : "") + `pipeline=${id}`;
          paramCount++;
        });
      }
      
      // Add stage_name filters
      if (filters.stageNames && filters.stageNames.length > 0) {
        filters.stageNames.forEach(name => {
          url += (paramCount > 0 ? "&" : "") + `stage_name=${encodeURIComponent(name)}`;
          paramCount++;
        });
      }
      
      // Add assigned_to filters
      if (filters.assignedUsers && filters.assignedUsers.length > 0) {
        filters.assignedUsers.forEach(id => {
          url += (paramCount > 0 ? "&" : "") + `assigned_to=${id}`;
          paramCount++;
        });
      }
      
      return axiosInstance.get(url);
    }

  };