import { model, Model, Schema } from "mongoose";
import { ICPE } from "./interfaces";

const cpeSchema = new Schema<ICPE>({
    cpeId: {
        type: String,
        required: true
    },
    product: {
        type: String,
        required: true
    },
    vendor: {
        type: String,
        required: true
    },
    version: {
        type: String,
        required: true
    }
})

const CPE: Model<ICPE> = model('CPE', cpeSchema)

export {
    CPE,
    cpeSchema
}
