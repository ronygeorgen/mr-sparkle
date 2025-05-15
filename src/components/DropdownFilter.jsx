import React, { useState, useRef, useEffect } from "react";
import { XCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, fetchUsersByPipelines, fetchUsersByFilters } from "../features/users/usersThunks";
import SingleDropdownFilter from "./SingleDropdownFilter";
import { fetchOpportunityOwners, fetchOpportunityOwnersByPipelines, fetchOpportunityOwnersByFilters } from "../features/contacts/contactsThunks";
import { fetchPipelines, fetchPipelinesByFilters } from "../features/Pipeline/pipelineThunks";
import { fetchPipelineStages, fetchPipelineStagesByPipelines, fetchPipelineStagesByFilters } from "../features/pipelineStages/pipelineStagesThunks";
import { fetchOppSources, fetchOppSourcesByPipelines, fetchOppSourcesByFilters } from "../features/opportunitySource/oppSourceThunks";
import { 
  setPipelineFilters, 
  setPipelineStageFilters,
  setAssignedUserFilters,
  setOpportunityOwnerFilters,
  setOpportunitySourceFilters,
  setProductSalesFilters,
  clearAllFilters 
} from '../features/globalFilter/filterSlice'

function DropdownFilters() {
  // const { assignedUserOptions, status, error } = useSelector((state) => state.users);
  const { opportunityOwnerOptions, filteredOpportunityOwnerOptions } = useSelector(state => state.contacts);
  const { items: pipelines } = useSelector(state => state.pipelines);
  const { stages: pipelineStages, filteredStages } = useSelector(state => state.pipelineStages);
  const { assignedUserOptions, filteredUserOptions } = useSelector(state => state.users);
  const { sources: oppSourcesList, filteredSources } = useSelector(state => state.oppSources);
  const [selectedFilters, setSelectedFilters] = useState({
    pipelines: [],
    stageNames: [],
    assignedUsers: [],
    contacts: [], // opportunity owners
    opportunitySources: []
  });
  
  const [showResetButton, setShowResetButton] = useState(false);

  // Add refs for SingleDropdownFilter components
  const pipelineFilterRef = useRef(null);
  const stageFilterRef = useRef(null);
  const assignedUserFilterRef = useRef(null);
  const opportunityOwnerFilterRef = useRef(null);
  const opportunitySourceFilterRef = useRef(null);
  const productSalesFilterRef = useRef(null);

  // const { GlobalPipelines } = useSelector(state => state.filters.selectedGlobalFilterPipelines);
  
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchPipelines());
    dispatch(fetchUsers());
    dispatch(fetchOpportunityOwners()); // initial fetch with no query
    dispatch(fetchPipelineStages());
    dispatch(fetchOppSources());
  }, [dispatch]);

  const pipelineOptions = pipelines.map(p => ({
    id: p.ghl_id,
    label: `${p.name}`
  }));

  // Create pipeline stage options based on the filtered stages or all stages if no filter is applied
  const stagesToUse = filteredStages && filteredStages.length > 0 ? filteredStages : pipelineStages;
  const assignedUserToUse = filteredUserOptions && filteredUserOptions.length > 0 ? filteredUserOptions : assignedUserOptions;
  const opportunityOwnerToUse = filteredOpportunityOwnerOptions && filteredOpportunityOwnerOptions.length > 0 ? filteredOpportunityOwnerOptions : opportunityOwnerOptions;
  const oppSourceToUse = filteredSources && filteredSources.length > 0 ? filteredSources : oppSourcesList;
  
  // Filter unique pipeline stages by normalized name (keeping the first occurrence)
  const uniquePipelineStagesMap = new Map();
  
  // Function to normalize stage names - removes extra spaces and standardizes spacing around special chars
  const normalizeStageNameForComparison = (name) => {
    if (!name) return '';
    
    // Trim the name first
    let normalized = name.trim();
    
    // Replace multiple spaces with a single space
    normalized = normalized.replace(/\s+/g, ' ');
    
    // Standardize spacing around special characters like '/' by removing spaces before/after them
    normalized = normalized.replace(/\s*\/\s*/g, '/');
    
    // Could add more replacements for other special characters if needed
    // normalized = normalized.replace(/\s*-\s*/g, '-');
    // normalized = normalized.replace(/\s*\.\s*/g, '.');
    
    return normalized;
  };
  
  // First ensure stages have valid name properties before processing
  stagesToUse
    .filter(stage => stage && stage.name) // Make sure stage and stage.name exist
    .forEach(stage => {
      // Get displayable name (trimmed but preserving original spacing)
      const displayName = stage.name
      
      // Get normalized name for comparison/deduplication
      const normalizedName = normalizeStageNameForComparison(stage.name);
      
      if (!uniquePipelineStagesMap.has(normalizedName)) {
        uniquePipelineStagesMap.set(normalizedName, {
          id: displayName,
          label: displayName // Use display name as the visible label
        });
      }
    });
  
  // Convert Map to array and sort alphabetically by stage name
  const pipelineStagesOptions = Array.from(uniquePipelineStagesMap.values())
    .sort((a, b) => a.label.localeCompare(b.label));

  // Make sure oppSourcesList is an array and each item is a string before trying to map over it
  const opportunitySourceOptions = Array.isArray(oppSourceToUse) 
    ? oppSourceToUse
        .filter(source => source && typeof source.source === 'string') // Filter out non-objects and objects without string source
        .map(source => ({
          id: source.source, // No need for toLowerCase, just replace spaces
          label: source.source
        }))
    : [];

  // const handleSearchOpportunityOwner = (query) => {
  //     dispatch(fetchOpportunityOwners(query));
  // };
  // const handleSearchOpportunityOwner = (query) => {
  //   if (!GlobalPipelines || GlobalPipelines.length === 0) {
  //     dispatch(fetchOpportunityOwners(query));
  //   } else {
  //     dispatch(fetchOpportunityOwnersByPipelines(query,GlobalPipelines));
  //   }
  // };

   // Handler for pipeline filter changes - now updates both pipeline stages and Redux filter store
  const handlePipelineFilterApply = (selectedPipelineIds) => {
    // Update pipeline filter state in Redux
    dispatch(setPipelineFilters(selectedPipelineIds));
    
    // Update local state
    const newFilters = {
      ...selectedFilters,
      pipelines: selectedPipelineIds
    };
    setSelectedFilters(newFilters);
    
    // If no filters selected, fetch all data
    if (!selectedPipelineIds || selectedPipelineIds.length === 0) {
      dispatch(fetchPipelineStages());
      dispatch(fetchUsers());
      dispatch(fetchOpportunityOwners());
      dispatch(fetchOppSources());
    } else {
      // Get filters without pipelines for the other API calls
      const filtersWithoutPipelines = {
        stageNames: newFilters.stageNames,
        assignedUsers: newFilters.assignedUsers,
        contacts: newFilters.contacts,
        opportunitySources: newFilters.opportunitySources
      };
      
      // Fetch filtered data for each entity type
      dispatch(fetchPipelineStagesByFilters({ ...filtersWithoutPipelines, pipelines: selectedPipelineIds }));
      dispatch(fetchUsersByFilters({ ...filtersWithoutPipelines, pipelines: selectedPipelineIds }));
      dispatch(fetchOpportunityOwnersByFilters({ ...filtersWithoutPipelines, pipelines: selectedPipelineIds }));
      dispatch(fetchOppSourcesByFilters({ ...filtersWithoutPipelines, pipelines: selectedPipelineIds }));
    }
  };

  // Handler for pipeline stage filter changes
  const handlePipelineStageFilterApply = (selectedStageIds) => {
    dispatch(setPipelineStageFilters(selectedStageIds));
    
    // Update local state
    const newFilters = {
      ...selectedFilters,
      stageNames: selectedStageIds
    };
    setSelectedFilters(newFilters);
    
    // If no filters selected, fetch all data
    if (!selectedStageIds || selectedStageIds.length === 0) {
      dispatch(fetchPipelines());
      dispatch(fetchUsers());
      dispatch(fetchOpportunityOwners());
      dispatch(fetchOppSources());
    } else {
      // Get filters without stageNames for the other API calls
      const filtersWithoutStages = {
        pipelines: newFilters.pipelines,
        assignedUsers: newFilters.assignedUsers,
        contacts: newFilters.contacts,
        opportunitySources: newFilters.opportunitySources
      };
      
      // Fetch filtered data for each entity type
      dispatch(fetchPipelinesByFilters({ ...filtersWithoutStages, stageNames: selectedStageIds }));
      dispatch(fetchUsersByFilters({ ...filtersWithoutStages, stageNames: selectedStageIds }));
      dispatch(fetchOpportunityOwnersByFilters({ ...filtersWithoutStages, stageNames: selectedStageIds }));
      dispatch(fetchOppSourcesByFilters({ ...filtersWithoutStages, stageNames: selectedStageIds }));
    }
  };

  // Handler for assigned user filter changes
  const handleAssignedUserFilterApply = (selectedUserIds) => {
    dispatch(setAssignedUserFilters(selectedUserIds));
    
    // Update local state
    const newFilters = {
      ...selectedFilters,
      assignedUsers: selectedUserIds
    };
    setSelectedFilters(newFilters);
    
    // If no filters selected, fetch all data
    if (!selectedUserIds || selectedUserIds.length === 0) {
      dispatch(fetchPipelines());
      dispatch(fetchPipelineStages());
      dispatch(fetchOpportunityOwners());
      dispatch(fetchOppSources());
    } else {
      // Get filters without assignedUsers for the other API calls
      const filtersWithoutUsers = {
        pipelines: newFilters.pipelines,
        stageNames: newFilters.stageNames,
        contacts: newFilters.contacts,
        opportunitySources: newFilters.opportunitySources
      };
      
      // Fetch filtered data for each entity type
      dispatch(fetchPipelinesByFilters({ ...filtersWithoutUsers, assignedUsers: selectedUserIds }));
      dispatch(fetchPipelineStagesByFilters({ ...filtersWithoutUsers, assignedUsers: selectedUserIds }));
      dispatch(fetchOpportunityOwnersByFilters({ ...filtersWithoutUsers, assignedUsers: selectedUserIds }));
      dispatch(fetchOppSourcesByFilters({ ...filtersWithoutUsers, assignedUsers: selectedUserIds }));
    }
  };

  // Handler for opportunity owner filter changes
  const handleOpportunityOwnerFilterApply = (selectedOwnerIds) => {
    dispatch(setOpportunityOwnerFilters(selectedOwnerIds));
    
    // Update local state
    const newFilters = {
      ...selectedFilters,
      contacts: selectedOwnerIds
    };
    setSelectedFilters(newFilters);
    
    // If no filters selected, fetch all data
    if (!selectedOwnerIds || selectedOwnerIds.length === 0) {
      dispatch(fetchPipelines());
      dispatch(fetchPipelineStages());
      dispatch(fetchUsers());
      dispatch(fetchOppSources());
    } else {
      // Get filters without contacts for the other API calls
      const filtersWithoutContacts = {
        pipelines: newFilters.pipelines,
        stageNames: newFilters.stageNames,
        assignedUsers: newFilters.assignedUsers,
        opportunitySources: newFilters.opportunitySources
      };
      
      // Fetch filtered data for each entity type
      dispatch(fetchPipelinesByFilters({ ...filtersWithoutContacts, contacts: selectedOwnerIds }));
      dispatch(fetchPipelineStagesByFilters({ ...filtersWithoutContacts, contacts: selectedOwnerIds }));
      dispatch(fetchUsersByFilters({ ...filtersWithoutContacts, contacts: selectedOwnerIds }));
      dispatch(fetchOppSourcesByFilters({ ...filtersWithoutContacts, contacts: selectedOwnerIds }));
    }
  };

  // Handler for opportunity source filter changes
  const handleOpportunitySourceFilterApply = (selectedSourceIds) => {
    dispatch(setOpportunitySourceFilters(selectedSourceIds));
    
    // Update local state
    const newFilters = {
      ...selectedFilters,
      opportunitySources: selectedSourceIds
    };
    setSelectedFilters(newFilters);
    
    // If no filters selected, fetch all data
    if (!selectedSourceIds || selectedSourceIds.length === 0) {
      dispatch(fetchPipelines());
      dispatch(fetchPipelineStages());
      dispatch(fetchUsers());
      dispatch(fetchOpportunityOwners());
    } else {
      // Get filters without opportunitySources for the other API calls
      const filtersWithoutSources = {
        pipelines: newFilters.pipelines,
        stageNames: newFilters.stageNames,
        assignedUsers: newFilters.assignedUsers,
        contacts: newFilters.contacts
      };
      
      // Fetch filtered data for each entity type
      dispatch(fetchPipelinesByFilters({ ...filtersWithoutSources, opportunitySources: selectedSourceIds }));
      dispatch(fetchPipelineStagesByFilters({ ...filtersWithoutSources, opportunitySources: selectedSourceIds }));
      dispatch(fetchUsersByFilters({ ...filtersWithoutSources, opportunitySources: selectedSourceIds }));
      dispatch(fetchOpportunityOwnersByFilters({ ...filtersWithoutSources, opportunitySources: selectedSourceIds }));
    }
  };


  const handleResetAllFilters = () => {
    // Reset Redux state using existing clearAllFilters action
    dispatch(clearAllFilters());
    
    // Reset local state
    setSelectedFilters({
      pipelines: [],
      stageNames: [],
      assignedUsers: [],
      contacts: [],
      opportunitySources: []
    });

     // Reset the checked state in each dropdown filter component
     if (pipelineFilterRef.current) pipelineFilterRef.current.resetSelections();
     if (stageFilterRef.current) stageFilterRef.current.resetSelections();
     if (assignedUserFilterRef.current) assignedUserFilterRef.current.resetSelections();
     if (opportunityOwnerFilterRef.current) opportunityOwnerFilterRef.current.resetSelections();
     if (opportunitySourceFilterRef.current) opportunitySourceFilterRef.current.resetSelections();
     if (productSalesFilterRef.current) productSalesFilterRef.current.resetSelections();
    
    // Fetch all original data
    dispatch(fetchPipelines());
    dispatch(fetchPipelineStages());
    dispatch(fetchUsers());
    dispatch(fetchOpportunityOwners());
    dispatch(fetchOppSources());
  };
  
  // Check if any filters are applied
  const hasActiveFilters = Object.values(selectedFilters).some(
    filterArray => filterArray && filterArray.length > 0
  );


  // Product Sales options
  const productSalesOptions = [
    { id: "fuel", label: "Fuel" },
    { id: "truck-insurance", label: "Cover Truck Insurance" },
    { id: "davis-derby", label: "Davis Derby" },
    { id: "plant-insurance", label: "Hire in Plant Insurance" },
    { id: "hpt-ppt", label: "HPT and PPT" },
    { id: "vaps", label: "VAPS" },
    { id: "racking", label: "Racking" },
    { id: "roller-doors", label: "Roller Shutter Doors" }
  ];

  return (

    <div className="relative mt-2">
    {/* Reset button placed above filters (aligned to the right end) */}
    {hasActiveFilters && (
      <div className="mb-4 flex justify-end w-full">
        <button
          onClick={handleResetAllFilters}
          className="flex items-center bg-green-500 hover:bg-green-400 font-semibold dark:bg-gray-500 dark:hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm cursor-pointer"
        >
          <XCircle className="w-4 h-4 mr-1" />
          Reset Filters
        </button>
      </div>
    )}
    <div className="flex flex-wrap items-center mt-5 space-x-2 ">
      <SingleDropdownFilter 
        ref={pipelineFilterRef}
        title="Pipeline" 
        filterOptions={pipelineOptions}
        onApplyFilters={handlePipelineFilterApply}
      />
      <SingleDropdownFilter
        ref={stageFilterRef} 
        title="Pipeline stages" 
        filterOptions={pipelineStagesOptions}
        onApplyFilters={handlePipelineStageFilterApply}
      />
      <SingleDropdownFilter
        ref={assignedUserFilterRef} 
        title="Owner - Assigned User" 
        filterOptions={assignedUserToUse}
        onApplyFilters={handleAssignedUserFilterApply}
      />
      <SingleDropdownFilter 
        ref={opportunityOwnerFilterRef}
        title="Opportunity Owner" 
        filterOptions={opportunityOwnerToUse} 
        // searchable
        // onSearch={handleSearchOpportunityOwner}
        onApplyFilters={handleOpportunityOwnerFilterApply}
        align="right"
      />
      <SingleDropdownFilter 
        ref={opportunitySourceFilterRef}
        title="Opportunity Source" 
        filterOptions={opportunitySourceOptions}
        onApplyFilters={handleOpportunitySourceFilterApply}
      />
      <SingleDropdownFilter 
        ref={productSalesFilterRef}
        title="Product Sales" 
        filterOptions={productSalesOptions}
        // onApplyFilters={handleProductSalesFilterApply}
        align="right"
      />
    </div>
    </div>
  );
}

export default DropdownFilters;