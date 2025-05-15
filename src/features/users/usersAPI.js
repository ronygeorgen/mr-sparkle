import { axiosInstance } from "../../services/api";

// API methods for users feature
export const usersAPI = {
    getUsers: () => axiosInstance.get('/ghlusers/'),

    getUsersByPipelines: (pipelineIds) => {
      // If no pipeline IDs are selected, return all pipeline stages
      if (!pipelineIds || pipelineIds.length === 0) {
        return axiosInstance.get("/ghlusers/");
      }
      
      // Create URL with multiple pipeline parameters
      let url = "/ghlusers/?";
      pipelineIds.forEach((id, index) => {
        // Add & between parameters, but not for the first one
        if (index > 0) url += "&";
        url += `pipeline=${id}`;
      });
      
      return axiosInstance.get(url);

    },

    // New method for filtering by multiple parameters
  getUsersByFilters: (filters) => {
    if (!filters || Object.values(filters).every(arr => !arr || arr.length === 0)) {
      return axiosInstance.get("/ghlusers/");
    }
    
    let url = "/ghlusers/?";
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
    
    // Add contact (opportunity owner) filters
    if (filters.contacts && filters.contacts.length > 0) {
      filters.contacts.forEach(id => {
        url += (paramCount > 0 ? "&" : "") + `contact=${id}`;
        paramCount++;
      });
    }
    
    return axiosInstance.get(url);
  }
  };