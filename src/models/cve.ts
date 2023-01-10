import { model, Model, Schema } from "mongoose";
import { ICVE } from "./interfaces";

const cveSchema = new Schema<ICVE>({
    cveId: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    severity: {
        type: String
    },
    cweId: [{
        type: String,
        required: true
    }]
})
cveSchema.pre('save', function (next) {
    // Calculate severity based on score
    if (this !== undefined) {
        if (this.score >= 0 && this.score <= 3.9) {
            this.severity = 'Low'
        } else if (this.score >= 4 && this.score <= 6.9) {
            this.severity = 'Medium'
        } else if (this.score >= 7 && this.score <= 10) {
            this.severity = 'High'
        } else {
            this.severity = 'Unknown'
        }
    }
    next()
})
const CVE: Model<ICVE> = model('CVE', cveSchema)

export {
    CVE,
    cveSchema
}