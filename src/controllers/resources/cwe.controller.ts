import { Request, Response } from "express";
import { CWE } from "models/cwe";
import { errorResponse, successResponse } from "utils/responseFormat";

async function get(req: Request, res: Response) {
    const { id } = req.params
    try {
        const cwe = await CWE.findOne({ cweId: id })
        if (cwe === null) return res.status(404).json(errorResponse('CWE is not found in the database'))
        return res.status(200).json(successResponse(cwe, 'CWE found'))
    } catch (error) {
        return res.status(500).json(`Internal server error: ${error}`)
    }
}

export {
    get
}