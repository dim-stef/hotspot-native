import {configureStore} from '@reduxjs/toolkit';
import {userSlice} from './presentational/features/Authentication/userSlice';

export default configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});
