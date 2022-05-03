export type TRole = "REGULAR" | "ADMIN" | "";

export interface IUserState {
  id: string;
  role: TRole;
  name: string;
}

const initialState: IUserState = {
  id: "",
  role: "",
  name: "",
};

export const UserReducer = (state = initialState, action: any) => {
  let newState = { ...state };
  switch (action.type) {
    case "UPDATE_USER":
      newState.id = action.payload.userId;
      newState.role = action.payload.role;
      newState.name = action.payload.name;
      break;
    default:
      break;
  }

  return newState;
};
