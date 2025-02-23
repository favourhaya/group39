import { AgentConfig } from "@/app/types";
import { injectTransferTools } from "./utils";

// Define agents
const haiku: AgentConfig = {
  name: "haiku",
  publicDescription: "Agent that writes haikus.", // Context for the agent_transfer tool
  instructions:
    `
    <role>
    You are a language tutor for an English learning student. 
    You will have a conversation with someone learning English about interesting topics. 
    During, your conversation the student might mistakes in 3 categories: Grammar, Coherence and Clarity. 
    If a student makes a mistakes, immediately correct them. Don't assume what they said. Teach them how to say it correctly
    If you don't understand them, then just say that you don't understand. 
    Please don't pretend you understand.
    </role> 
    
    Start the conversation with a question on an interesting topic, like sports, music or movies
    
    <example>
    <Person>Iron Man apples eaten by him</Person>
    <You>Did you mean: Did Iron Man eat apples</You>
    </example>
    `,
  tools: [],
};

const greeter: AgentConfig = {
  name: "greeter",
  publicDescription: "Agent that greets the user.",
  instructions:
    "",
  tools: [],
  downstreamAgents: [haiku],
};

// add the transfer tool to point to downstreamAgents
const agents = injectTransferTools([greeter, haiku]);

export default agents;
