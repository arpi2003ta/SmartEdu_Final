import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import { authApi } from "@/features/api/authApi";
import { courseApi } from "@/features/api/courseApi";
import { purchaseApi } from "@/features/api/purchaseApi";
import { courseProgressApi } from "@/features/api/courseProgressApi";
import { roadmapApi } from "@/features/api/roadmapApi";
import { searchApi } from "@/features/api/searchApi";

import { voiceAssistantApi } from "@/features/api/voiceAssistantApi";

const rootReducer = combineReducers({
    [authApi.reducerPath]: authApi.reducer,
    [courseApi.reducerPath]: courseApi.reducer,
    [purchaseApi.reducerPath]: purchaseApi.reducer,
    [courseProgressApi.reducerPath]: courseProgressApi.reducer,
    [roadmapApi.reducerPath]: roadmapApi.reducer,
    [searchApi.reducerPath]: searchApi.reducer,
    
    [voiceAssistantApi.reducerPath]:voiceAssistantApi.reducer,
    auth: authReducer,
});

export default rootReducer;