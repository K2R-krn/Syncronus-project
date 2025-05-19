
export const createAuthSlice  = (set, get) => ({
    userInfo : undefined,
    setUserInfo: (userInfo) => set({userInfo}),
});