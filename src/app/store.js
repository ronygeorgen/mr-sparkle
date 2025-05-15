import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { combineReducers } from 'redux';
import usersReducer from '../features/users/usersSlice';
import contactsReducer from '../features/contacts/contactsSlice'
import opportunitiesReducer from '../features/opportunity/opportunitySlice'
import pipelineReducer from '../features/Pipeline/pipelineSlice'
import pipelineStagesReducer from '../features/pipelineStages/pipelineStagesSlice'
import oppSourceReducer from '../features/opportunitySource/oppSourceSlice'
import filterReducer from '../features/globalFilter/filterSlice'

import storage from 'redux-persist/lib/storage';

// Redux Persist configuration
const usersPersistConfig = {
  key: 'users', 
  storage,
  whitelist: ['users'], 
};
const contactsPersistConfig = {
  key: 'contacts', 
  storage,
  whitelist: ['opportunityOwnerOptions'], 
};
const opportunitiesPersistConfig = {
  key: 'opportunities', 
  storage,
  whitelist: ['aggregations'], 
};
const pipelinePersistConfig = {
  key: 'pipelines', 
  storage,
  whitelist: ['items'], 
};

const pipelineStagesPersistConfig = {
  key: 'pipelineStages',
  storage,
  whitelist: ['stages']
}

const oppSourcePersistConfig = {
  key: 'oppSources',
  storage,
  whitelist: ['sources']
}

const usersPersistedReducer = persistReducer(usersPersistConfig, usersReducer);
const contactsPersistedReducer = persistReducer(contactsPersistConfig, contactsReducer);
const opportunitiesPersistedReducer = persistReducer(opportunitiesPersistConfig, opportunitiesReducer);
const pipelinePersistedReducer = persistReducer(pipelinePersistConfig, pipelineReducer);
const pipelineStagesPersistedReducer = persistReducer(pipelineStagesPersistConfig, pipelineStagesReducer);
const oppSourcePersistedReducer = persistReducer(oppSourcePersistConfig, oppSourceReducer);

// Combine all your reducers here
const rootReducers = combineReducers({
  users: usersPersistedReducer,
  contacts: contactsPersistedReducer,
  opportunities: opportunitiesPersistedReducer,
  pipelines: pipelinePersistedReducer,
  pipelineStages: pipelineStagesPersistedReducer,
  oppSources: oppSourcePersistedReducer,
  filters: filterReducer
  // add more reducers here 
});



// Create a persisted reducer

// Configure store with the persisted reducer
export  const store = configureStore({
  reducer: rootReducers,
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
          serializableCheck: {
              ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          },
      }),
});

// Create a persistor
export const persistor = persistStore(store);
