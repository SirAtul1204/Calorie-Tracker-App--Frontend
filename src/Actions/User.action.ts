import { TRole } from "../Reducers/User.reducer";

export const updateUser = (userId: number, role: TRole, name: string) => {
  return {
    type: "UPDATE_USER",
    payload: {
      userId,
      role,
      name,
    },
  };
};
