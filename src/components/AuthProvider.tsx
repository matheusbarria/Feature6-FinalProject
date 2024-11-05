// components/AuthProvider.tsx
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AuthService } from "../authService";
import { setUser, clearUser, setLoading } from "../authSlice";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      dispatch(setLoading(true));
      const currentUser = AuthService.getCurrentUser();

      if (currentUser) {
        dispatch(setUser(currentUser));
      } else {
        dispatch(clearUser());
      }
      dispatch(setLoading(false));
    };

    initializeAuth();
  }, [dispatch]);

  return <>{children}</>;
};
