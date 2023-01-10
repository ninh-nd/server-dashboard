import { Response, Request } from "express"
import { errorResponse, successResponse } from "utils/responseFormat"
import { fetchCVE } from "utils/vuln"
async function get(req: Request, res: Response) {
    const { id } = req.params
    const data = await fetchCVE(id)
    if (data instanceof Error) {
        return res.status(500).json(errorResponse(data.message))
    }
    const cveId = data.id
    const desc = data.summary
    const score = data.cvss.v3 === undefined ? data.cvss.v2 : data.cvss.v3
    const cwes = data.cwes // Array of CWEs
    const vendor = Object.keys(data.vendors)[0]
    const product = data.vendors[`${vendor}`][0]
    const version = data.raw_nvd_data.configurations.nodes[0].cpe_match.map(({ cpe23Uri }: { cpe23Uri: string, vulnerable: boolean }) => cpe23Uri.split(':')[5])
    const returnObject = { cveId, desc, score, cwes, vendor, product, version }
    return res.status(200).json(successResponse(returnObject, "CVE fetched successfully"))
}

export {
    get
}