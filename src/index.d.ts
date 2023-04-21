import { IAccount } from "models/interfaces";

declare global {
  namespace Express {
    interface User extends IAccount {}
  }
}
export {};
