import { Octokit } from "octokit";
import { Result } from "./vulnType";
import axios from "axios";
import { ArtifactModel } from "../models/models";
function resolveData(data: Result) {
  if (data.totalResults === 0) return [];
  return data.vulnerabilities.map((v) => {
    const cveId = v.cve.id;
    const description = v.cve.descriptions[0].value;
    const score = v.cve.metrics.cvssMetricV2[0].cvssData.baseScore;
    const severity = v.cve.metrics.cvssMetricV2[0].baseSeverity;
    const cwes = v.cve.weaknesses.map((w) => w.description[0].value);

    return {
      cveId,
      description,
      score,
      severity,
      cwes,
    };
  });
}
export async function fetchVulnsFromNVD(cpe: string) {
  const url = `https://services.nvd.nist.gov/rest/json/cves/2.0?cpeName=${cpe}`;
  try {
    const { data } = await axios.get<Result>(url);
    return resolveData(data);
  } catch (error) {
    return [];
  }
}
export async function importGithubScanResult(
  accessToken: string | undefined,
  url: string
) {
  const [owner, repo] = url.split("/").slice(-2);
  const octokit = new Octokit({
    auth: accessToken,
  });
  try {
    const { data } = await octokit.rest.codeScanning.listAlertsForRepo({
      owner,
      repo,
    });
    const vulns = data.map((v) => {
      const {
        // @ts-ignore
        rule: { id, description, tags, security_severity_level: severity },
        most_recent_instance: { location },
      } = v;
      // Go through each tags and extract list of CWEs
      const cweList = tags
        ?.map((x) => {
          const regex = /external\/cwe\/cwe-\d+/;
          if (regex.test(x)) return x.split("/")[2].toUpperCase();
          return null;
        })
        .filter((x) => x !== null);
      // Construct description from message and location
      const desc = `${description}. Found at ${location?.path} from line ${location?.start_line} to ${location?.end_line}`;
      return {
        cveId: id,
        description: desc,
        severity,
        cwes: cweList,
      };
    });
    await ArtifactModel.updateOne(
      { url },
      {
        $set: {
          vulnerabilityList: vulns,
        },
      }
    );
    return true;
  } catch (error) {
    return false;
  }
}
