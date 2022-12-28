import { model, Model, Schema } from "mongoose";
import { ICWE } from "./interfaces";

const cweSchema = new Schema<ICWE>({
    cweId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    modesOfIntroduction: {
        type: [String],
        required: true
    },
    likelihood: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Unknown']
    },
    mitigation: {
        type: [String],
        required: true
    },
    consequences: {
        type: [String],
        required: true
    },
    detectionMethods: {
        type: [String],
        required: true
    }
})
const CWE: Model<ICWE> = model('CWE', cweSchema)

export {
    CWE,
    cweSchema
}