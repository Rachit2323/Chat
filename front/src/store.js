import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Reducers/auth'; 

import chatReducer from "./Reducers/Chat.js";

const store = configureStore({
  reducer: {
    user: authReducer,
    chat: chatReducer, 
  },
});

export default store;