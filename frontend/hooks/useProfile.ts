"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await api.get("/api/auth/getme");
      return res.data;
    },
    retry: false,
  });
};
