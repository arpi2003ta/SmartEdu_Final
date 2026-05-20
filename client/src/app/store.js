import {configureStore} from "@reduxjs/toolkit" 
import rootRedcuer from "./rootRedcuer";
import { authApi } from "@/features/api/authApi";
import { courseApi } from "@/features/api/courseApi";
import { purchaseApi } from "@/features/api/purchaseApi";
import { courseProgressApi } from "@/features/api/courseProgressApi";
import { roadmapApi } from "@/features/api/roadmapApi";
import { searchApi } from "@/features/api/searchApi";
import { voiceAssistantApi } from "@/features/api/voiceAssistantApi";

export const appStore = configureStore({
    reducer: rootRedcuer,
    middleware:(defaultMiddleware) => defaultMiddleware().concat(
        authApi.middleware, 
        courseApi.middleware, 
        purchaseApi.middleware, 
        courseProgressApi.middleware,
        roadmapApi.middleware,
        searchApi.middleware,
        voiceAssistantApi.middleware
    ),
});

/*const initializeApp = async () => {
    await appStore.dispatch(authApi.endpoints.loadUser.initiate({},{forceRefetch:true}))
}
initializeApp();*/
