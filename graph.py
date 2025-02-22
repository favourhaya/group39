from langchain_core.messages import AnyMessage
from typing_extensions import TypedDict
from dotenv import load_dotenv
load_dotenv()

class State(TypedDict):
    topic:str
    scenario:str
    user_speech:str
    bob_speech:str
    friend_speech:str
    context:str
    end:str

from langchain_core.messages import AIMessage


from langchain_openai import ChatOpenAI

gpt_client = ChatOpenAI(model="gpt-4o-mini")

#Nodes
def generate_scenario_context(state: State):
  """First LLM to generate a context for given scenario"""
  msg = gpt_client.invoke(f"Generate a conversation scenario from the given topic: {state['topic']}, two people will start their conversation and then the user will join. Keep it short as a setting of the conversation.")
  print("Scenario:")
  print(msg.content)
  return {"scenario":msg.content}

def bob_chat(state: State):
  bob_speech = gpt_client.invoke(f"You are the guy who talks to our user. Given the scenario {state['scenario']}, generate the most proper sentence for current situation.")
  print(f"\nBob's speech:")
  print(bob_speech.content)
  return {"bob_speech": bob_speech.content}

def friend_chat(state: State):
  friend_speech = gpt_client.invoke(f"You are our user's friend. Given the scenario {state['scenario']} and bob's speech {state['bob_speech']}, generate the most proper sentence for current situation.")
  print(f"\nFriend's speech:")
  print(friend_speech.content)
  return {"friend_speech": str(friend_speech.content)}

def get_user_speech(state: State):
  msg = "Oh I want to end the conversation."
  print(f"\nUser's speech:")
  print(msg)
  return {"user_speech": msg}

def check_chat_end(state: State):
  msg = "End"
  return {"end": msg}

from langgraph.graph import StateGraph, START, END

graph_builder = StateGraph(State)
graph_builder.add_node(generate_scenario_context)
graph_builder.add_node(bob_chat)
graph_builder.add_node(friend_chat)
graph_builder.add_node(get_user_speech)
graph_builder.add_node(check_chat_end)

graph_builder.set_entry_point("generate_scenario_context")

graph_builder.add_edge("generate_scenario_context", "bob_chat")
graph_builder.add_edge("bob_chat", "friend_chat")
graph_builder.add_conditional_edges("friend_chat", check_chat_end, {"Fail": END, "Pass": "get_user_speech"})

graph = graph_builder.compile()

from IPython.display import Image, display

display(Image(graph.get_graph().draw_mermaid_png()))

from langchain_core.messages import HumanMessage

result = graph.invoke({"topic": "I am going to be a shop assistant in a supermarket."})

print(result["scenario"])