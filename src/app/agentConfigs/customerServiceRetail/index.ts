import authentication from "./authentication";
import returns from "./returns";
import sales from "./sales";
import simulatedHuman from "./simulatedHuman";
import summaryAnalysis from "../summaryAnalysis";
import { injectTransferTools } from "../utils";

authentication.downstreamAgents = [returns, sales, simulatedHuman, summaryAnalysis];
returns.downstreamAgents = [authentication, sales, simulatedHuman, summaryAnalysis];
sales.downstreamAgents = [authentication, returns, simulatedHuman, summaryAnalysis];
simulatedHuman.downstreamAgents = [authentication, returns, sales, summaryAnalysis];
summaryAnalysis.downstreamAgents = [authentication, returns, sales, simulatedHuman];

const agents = injectTransferTools([
  authentication,
  returns,
  sales,
  simulatedHuman,
  summaryAnalysis,
]);

export default agents;