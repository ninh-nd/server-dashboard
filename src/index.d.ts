import { Account } from "models/account";

declare global {
  namespace Express {
    interface User extends Account {}
  }
}
export {};
