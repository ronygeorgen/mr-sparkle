import { axiosInstance } from "../../services/api";

export const pipelineAPI = {
  getAllPipelines: () => axiosInstance.get("/pipelines/"), // no pagination needed

  // New method for filtering by other parameters
  getPipelinesByFilters: (filters) => {
    if (!filters || Object.values(filters).every(arr => !arr || arr.length === 0)) {
      return axiosInstance.get("/pipelines/");
    }
    
    let url = "/pipelines/?";
    let paramCount = 0;
    
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
    
    return axiosInstance.get(url);
  }
};