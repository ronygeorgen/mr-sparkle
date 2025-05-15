import { axiosInstance } from "../../services/api";

export const pipelineStagesAPI = {
  getAllPipelineStages: () => axiosInstance.get("/pipeline-stages/"),
  
  // Add a new function to get pipeline stages by pipeline IDs
  getPipelineStagesByPipelines: (pipelineIds) => {
    // If no pipeline IDs are selected, return all pipeline stages
    if (!pipelineIds || pipelineIds.length === 0) {
      return axiosInstance.get("/pipeline-stages/");
    }
    
    // Create URL with multiple pipeline parameters
    let url = "/pipeline-stages/?";
    pipelineIds.forEach((id, index) => {
      // Add & between parameters, but not for the first one
      if (index > 0) url += "&";
      url += `pipeline=${id}`;
    });
    
    return axiosInstance.get(url);
  },

  // New methods for filtering by other parameters
  getPipelineStagesByFilters: (filters) => {
    if (!filters || Object.values(filters).every(arr => !arr || arr.length === 0)) {
      return axiosInstance.get("/pipeline-stages/");
    }
    
    let url = "/pipeline-stages/?";
    let paramCount = 0;
    
    // Add pipeline filters
    if (filters.pipelines && filters.pipelines.length > 0) {
      filters.pipelines.forEach(id => {
        url += (paramCount > 0 ? "&" : "") + `pipeline=${id}`;
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
    
    // Add assigned_to filters
    if (filters.assignedUsers && filters.assignedUsers.length > 0) {
      filters.assignedUsers.forEach(id => {
        url += (paramCount > 0 ? "&" : "") + `assigned_to=${id}`;
        paramCount++;
      });
    }
    
    // Add opportunity source filters if needed
    // Note: If opportunity source isn't a valid parameter for this endpoint, skip this
    
    return axiosInstance.get(url);
  }
};

