import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// const API = "http://localhost:4000/";
const API="https://chat-ecru-six.vercel.app/";

const initialState = {
  token: "",
  loading: false,
  errorsignup: "",
  errorsignin: "",
  successsignin: false,
  successsignup: false,
  userInfoSuccess:false,
  userdetail:[]
};

export const signupUser = createAsyncThunk("signupuser", async (body) => {
  try {
    const result = await fetch(`${API}users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await result.json();

    return data;
  } catch (error) {
    return { error: error.message };
  }
});

export const signinUser = createAsyncThunk("signinuser", async (body) => {
  try {
    const result = await fetch(`${API}users/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await result.json();
    const { token } = data;

    localStorage.setItem("token", token);

    return data;
  } catch (error) {
    return { error: error.message }; // Handle network or other errors
  }
});

export const userInfo = createAsyncThunk("userInfo", async (body) => {
  try {
    const token = localStorage.getItem('token');
    const result = await fetch(`${API}users/userinfo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },

    });

    const data = await result.json();

    return data;
  } catch (error) {
    return { error: error.message }; // Handle network or other errors
  }
});

const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.error) {
          state.successsignup = action.payload.success;
          state.errorsignup = action.payload.error;
        } else {

          state.successsignup = action.payload.success;
        }
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.successsignup = false;
      })
      .addCase(signupUser.rejected, (state) => {
        state.loading = true;
        state.successsignup = false;
      })
      .addCase(signinUser.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.error) {
          state.successsignin = action.payload.success;
          state.errorsignin = action.payload.error;
        } else {
          state.errorsignin = action.payload.message;
          state.successsignin = action.payload.success;
        }
      })
      .addCase(signinUser.pending, (state) => {
        state.loading = true;
        state.successsignin = false;
      })
      .addCase(signinUser.rejected, (state) => {
        state.loading = true;
        state.successsignin = false;
      })
      .addCase(userInfo.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.error) {
          state.successsignin = action.payload.success;
          
        } else {
          state.userdetail = action.payload.data;
          state.userInfoSuccess = action.payload.success;
        }
      })
      .addCase(userInfo.pending, (state) => {
        state.loading = true;
        state.userInfoSuccess = false;
      })
      .addCase(userInfo.rejected, (state) => {
        state.loading = true;
        state.userInfoSuccess = false;
      })

      
  },
});

export default authSlice.reducer;
