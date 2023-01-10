import * as dotenv from 'dotenv'
dotenv.config()
export async function fetchCVE(id: string) {
    const username = process.env.OPENCVE_USERNAME
    const password = process.env.OPENCVE_PASSWORD
    if (username === undefined || password === undefined) return new Error('Invalid OpenCVE credentials')
    const headers = new Headers()
    headers.set('Authorization', 'Basic ' + Buffer.from(username + ":" + password).toString('base64'));
    try {
        const response = await fetch(`https://www.opencve.io/api/cve/${id}`, {
            headers
        })
        const data = await response.json()
        if (data.message) return new Error('CVE does not exist')
        return data
    } catch (error) {
        return new Error('Error fetching data from OpenCVE')
    }
}