import { axiosInstance } from "../../services/api";

export const oppSourceAPI = {
  getAllOppSources: () => axiosInstance.get("/opportunity_dash"), 

  getOppSourcesByPipelines: (pipelineIds) => {
    // If no pipeline IDs are selected, return all pipeline stages
    if (!pipelineIds || pipelineIds.length === 0) {
      return axiosInstance.get("/opportunity_dash");
    }
    
    // Create URL with multiple pipeline parameters
    let url = "/opportunity_dash?";
    pipelineIds.forEach((id, index) => {
      // Add & between parameters, but not for the first one
      if (index > 0) url += "&";
      url += `pipeline=${id}`;
    });
    
    return axiosInstance.get(url);

  },

  // New method for filtering by multiple parameters
  getOppSourcesByFilters: (filters) => {
    if (!filters || Object.values(filters).every(arr => !arr || arr.length === 0)) {
      return axiosInstance.get("/opportunity_dash");
    }
    
    let url = "/opportunity_dash?";
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
    
    // Add contact filters
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
    // Add opportunity_source filters
    if (filters.opportunitySource && filters.opportunitySource.length > 0) {
      filters.opportunitySource.forEach(id => {
        url += (paramCount > 0 ? "&" : "") + `opportunity_source=${id}`;
        paramCount++;
      });
    }
    
    return axiosInstance.get(url);
  }
};