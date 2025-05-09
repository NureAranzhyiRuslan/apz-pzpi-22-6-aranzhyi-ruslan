import {create} from "zustand";
import {persist} from "zustand/middleware";

export const useAppStore = create(
    persist(
        (set) => ({
            authToken: null,
            userId: null,
            role: 0,
            setToken: (token) => set({authToken: token}),
            setUserId: (userId) => set({userId: userId}),
            setRole: (role) => set({role: role}),
            logOut: () => set({authToken: null, userId: null, role: 0}),
        }),
        {name: "apz-storage"},
    )
);