import { axiosInstance } from "../../services/api";

export const opportunityAPI = {
  async getOpportunities(
    searchQuery = "", 
    page = 1, 
    pageSize = 10, 
    fiscalPeriod = null,
    created_at_min = null,
    created_at_max = null,
    state = null,
    pipeline = null,
    stage_name = null, 
    assigned_to = null,
    contact = null,
    opportunity_source = null,
  ) {
    // Build query parameters
    const params = new URLSearchParams();
    
    // Add search query if provided
    if (searchQuery) {
      params.append("search", searchQuery);
    }
    
    // Add pagination parameters
    params.append("page", page);
    params.append("page_size", pageSize);
    
    // Add state filter if provided (open, closed, etc.)
    if (state) {
      params.append("state", state);
    }
    
    // Add fiscal period if provided (takes precedence over date range)
    if (fiscalPeriod) {
      params.append("fiscal_period", fiscalPeriod);
    } 
    // Otherwise use date range if provided
    else {
      if (created_at_min) {
        params.append("created_at_min", created_at_min);
      }
      if (created_at_max) {
        params.append("created_at_max", created_at_max);
      }
    }
    
    // Add pipeline filters if provided
    if (pipeline) {
      // If pipeline is an array, add each pipeline ID separately
      if (Array.isArray(pipeline)) {
        pipeline.forEach(p => {
          params.append("pipeline", p);
        });
      } 
      // If it's a single value, add it directly
      else {
        params.append("pipeline", pipeline);
      }
    }
    
    if (stage_name) {
      // If pipeline is an array, add each pipeline ID separately
      if (Array.isArray(stage_name)) {
        stage_name.forEach(p => {
          params.append("stage_name", p);
        });
      } 
      // If it's a single value, add it directly
      else {
        params.append("stage_name", stage_name);
      }
    }
    
    if (assigned_to) {
      // If pipeline is an array, add each pipeline ID separately
      if (Array.isArray(assigned_to)) {
        assigned_to.forEach(p => {
          params.append("assigned_to", p);
        });
      } 
      // If it's a single value, add it directly
      else {
        params.append("assigned_to", assigned_to);
      }
    }
    
    if (contact) {
      // If pipeline is an array, add each pipeline ID separately
      if (Array.isArray(contact)) {
        contact.forEach(p => {
          params.append("contact", p);
        });
      } 
      // If it's a single value, add it directly
      else {
        params.append("contact", contact);
      }
    }
    
    if (opportunity_source) {
      // If pipeline is an array, add each pipeline ID separately
      if (Array.isArray(opportunity_source)) {
        opportunity_source.forEach(p => {
          params.append("opportunity_source", p);
        });
      } 
      // If it's a single value, add it directly
      else {
        params.append("opportunity_source", opportunity_source);
      }
    }
    
    // Make the API request
    const response = await axiosInstance.get(`/opportunities/?${params.toString()}`);
    return response.data;
  },
  
  // Keep other methods...
};