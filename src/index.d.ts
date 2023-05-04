import { Account } from "../src/models/account";

declare global {
  namespace Express {
    interface User extends Account {}
  }
}
export {};
