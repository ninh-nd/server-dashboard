declare global {
  namespace Express {
    interface User {
      _id: Types.ObjectId;
      username: string;
      password: string;
      email: string;
      thirdParty: IThirdParty[];
      role: "admin" | "manager" | "member";
    }
  }
}
export {};
