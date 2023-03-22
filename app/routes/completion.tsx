import { LoaderArgs } from "@remix-run/node";
import { eventStream } from "remix-utils";
import { Configuration, OpenAIApi } from "openai";

declare module "openai" {
  interface CreateChatCompletionResponse {
    on: (event: string, callback: (data: any) => void) => void;
  }
}

let openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

let processData = function (data: { toString: () => string }, send: Function) {
  const lines = data
    .toString()
    .split("\n")
    .filter((line: string) => line.trim() !== "");

  for (const line of lines) {
    const message = line.toString().replace(/^data: /, "");
    if (message === "[DONE]") {
      return; // Stream finished
    }
    try {
      // console.log("Message", message);
      const parsed = JSON.parse(message);
      let delta = parsed.choices[0].delta?.content;
      if (delta) send({ data: delta });
    } catch (error) {
      console.error("Could not JSON parse stream message", message, error);
    }
  }
};

export async function loader({ request }: LoaderArgs) {
  let query = new URL(request.url).searchParams.get("query");

  console.log(`GET: Completion Loader called with query: ${query}`);

  let messages: any[] = [];
  messages.push({
    role: "user",
    content: `Answer the question as best yoyu can.\n\nQuestion: ${query}\n\nAnswer:`,
  });

  let response = await openai.createChatCompletion(
    {
      model: "gpt-3.5-turbo", // can change to "gpt-4" if you fancy
      messages: messages,
      temperature: 0,
      max_tokens: 1024,
      stream: true,
    },
    { responseType: "stream" }
  );

  return eventStream(request.signal, function setup(send) {
    response.data.on("data", (data: any) => {
      processData(data, send);
    });

    return function clear() {};
  });
}
