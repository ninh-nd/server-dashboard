import * as dotenv from "dotenv";
import { IVulnerability } from "models/interfaces";
dotenv.config();
export async function fetchCVE(id: string) {
  const username = process.env.OPENCVE_USERNAME;
  const password = process.env.OPENCVE_PASSWORD;
  if (!username || !password) return new Error("Invalid OpenCVE credentials");
  const headers = new Headers();
  headers.set(
    "Authorization",
    "Basic " + Buffer.from(username + ":" + password).toString("base64")
  );
  try {
    const response = await fetch(`https://www.opencve.io/api/cve/${id}`, {
      headers,
    });
    const data = await response.json();
    if (data.message) return new Error("CVE does not exist");
    const cveId = data.id;
    const desc = data.summary;
    const score = data.cvss.v3 ?? data.cvss.v2;
    const cwes = data.cwes; // Array of CWEs
    const vendor = Object.keys(data.vendors)[0];
    const product = data.vendors[`${vendor}`][0];
    const version = data.raw_nvd_data.configurations.nodes[0].cpe_match.map(
      ({ cpe23Uri }: { cpe23Uri: string; vulnerable: boolean }) =>
        cpe23Uri.split(":")[5]
    );
    return {
      cveId,
      description: desc,
      score,
      cwes,
      vendor,
      product,
      version,
    };
  } catch (error) {
    return new Error("Error fetching data from OpenCVE");
  }
}
