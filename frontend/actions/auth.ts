import axios from "axios";

import {
  loginFailure,
  loginStart,
  loginSuccess,
  logout,
  setAuth,
} from "@/store/slices/authSlice";
import { AppDispatch } from "@/store/store";
import api from "@/lib/axios";

/* ================= LOGIN ================= */
export const loginUser =
  (email: string, password: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(loginStart());

      const res = await api.post("/api/auth/login", {
        email,
        password,
      });
      console.log("res", res);
      dispatch(
        loginSuccess({
          user: res.data.user,
          token: res.data.token,
        })
      );

      // Persist token (client-only)
      if (typeof window !== "undefined") {
        localStorage.setItem("token", res.data.token);
      }
    } catch (error: any) {
      dispatch(loginFailure(error?.response?.data?.message || "Login failed"));
    }
  };

/* ================= SIGNUP ================= */
export const signupUser = (data: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(loginStart());

    const res = await api.post("/api/auth/register", data);
    console.log("res", res);
    dispatch(
      loginSuccess({
        user: res.data.user,
        token: res.data.token,
      })
    );

    if (typeof window !== "undefined") {
      localStorage.setItem("token", res.data.token);
    }
  } catch (error: any) {
    dispatch(loginFailure(error?.response?.data?.message || "Signup failed"));
  }
};
export const getMe = () => async (dispatch: AppDispatch) => {
  try {
    const res = await api.get("/api/auth/getme");

    dispatch(
      setAuth({
        user: res.data,
      })
    );
  } catch (error) {
    // silently fail (user not logged in)
    dispatch(loginFailure(null));
  }
};

/* ================= LOGOUT ================= */
export const logoutUser = () => (dispatch: AppDispatch) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
  dispatch(logout());
};
