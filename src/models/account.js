import mongoose from 'mongoose';
import { thirdPartySchema } from './thirdParty.js';

const accountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  thirdParty: [{
    type: thirdPartySchema,
    default: [],
  }],
});
const Account = mongoose.model('Account', accountSchema);

export {
  Account,
  accountSchema,
};
