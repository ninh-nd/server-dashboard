import mongoose from 'mongoose';

const thirdPartySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});
const ThirdParty = mongoose.model('ThirdParty', thirdPartySchema);
export {
  ThirdParty,
  thirdPartySchema,
};
