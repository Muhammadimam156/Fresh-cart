import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  login as apiLogin,
  register as apiRegister,
  fetchMe,
  setAuthToken,
} from '../../api/client';

const tokenKey = 'freshcart-token';

// =========================
// LOGIN
// =========================
export const login = createAsyncThunk(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await apiLogin(payload);
      return res;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Login failed'
      );
    }
  }
);

// =========================
// REGISTER
// =========================
export const register = createAsyncThunk(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await apiRegister(payload);
      return res;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Registration failed'
      );
    }
  }
);

// =========================
// LOAD CURRENT USER
// =========================
export const loadMe = createAsyncThunk(
  'auth/loadMe',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchMe();
      return res;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Unable to load user'
      );
    }
  }
);

// =========================
// INITIAL STATE
// =========================
const initialState = {
  token:
    typeof window !== 'undefined'
      ? window.localStorage.getItem(tokenKey)
      : null,

  user: null,

  status: 'idle',

  error: null,
};

// =========================
// AUTH SLICE
// =========================
const authSlice = createSlice({
  name: 'auth',

  initialState,

  reducers: {
    // =========================
    // LOGOUT
    // =========================
    logout(state) {
      state.token = null;
      state.user = null;
      state.status = 'idle';
      state.error = null;

      window.localStorage.removeItem(tokenKey);

      setAuthToken(null);
    },

    // =========================
    // SET TOKEN
    // =========================
    setToken(state, action) {
      state.token = action.payload;
      state.error = null;

      if (action.payload) {
        window.localStorage.setItem(
          tokenKey,
          action.payload
        );

        setAuthToken(action.payload);
      } else {
        window.localStorage.removeItem(tokenKey);
        setAuthToken(null);
      }
    },

    // =========================
    // CLEAR ERROR
    // =========================
    clearAuthError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ==========================================
      // LOGIN - LOADING
      // ==========================================
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })

      // ==========================================
      // LOGIN - SUCCESS
      // ==========================================
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;

        state.token = action.payload.token;
        state.user = action.payload.user;

        window.localStorage.setItem(
          tokenKey,
          action.payload.token
        );

        setAuthToken(action.payload.token);
      })

      // ==========================================
      // LOGIN - ERROR
      // ==========================================
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';

        state.error =
          action.payload ||
          action.error.message ||
          'Login failed';
      })

      // ==========================================
      // REGISTER - LOADING
      // ==========================================
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })

      // ==========================================
      // REGISTER - SUCCESS
      // ==========================================
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;

        state.token = action.payload.token;
        state.user = action.payload.user;

        window.localStorage.setItem(
          tokenKey,
          action.payload.token
        );

        setAuthToken(action.payload.token);
      })

      // ==========================================
      // REGISTER - ERROR
      // ==========================================
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';

        state.error =
          action.payload ||
          action.error.message ||
          'Registration failed';
      })

      // ==========================================
      // LOAD ME - LOADING
      // ==========================================
      .addCase(loadMe.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })

      // ==========================================
      // LOAD ME - SUCCESS
      // ==========================================
      .addCase(loadMe.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;

        state.user = action.payload.user;
      })

      // ==========================================
      // LOAD ME - ERROR
      // ==========================================
      .addCase(loadMe.rejected, (state, action) => {
        state.status = 'failed';

        state.error =
          action.payload ||
          action.error.message ||
          'Unable to load user';
      });
  },
});

export const {
  logout,
  setToken,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;