import { Form } from "@remix-run/react";
import { useState } from "react";

export default function Index() {
  const [results, setResults] = useState("");

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const query = formData.get("query");

    const sse = new EventSource(`/completion?query=${query}`);

    sse.addEventListener("message", (event) => {
      // console.log("event: ", event);
      setResults((prevResults) => prevResults + event.data);
    });

    sse.addEventListener("error", (event) => {
      console.log("error: ", event);
      sse.close();
    });
  };

  return (
    <div>
      <Form onSubmit={handleFormSubmit}>
        <input type="text" name="query" placeholder="Enter your query" />
        <button type="submit">Ask</button>
      </Form>

      <div id="results">{results}</div>

      <div id="readme">
        <h1>Remix OpenAI Streaming Example</h1>
        This is a minimial example of using Remix with OpenAI's streaming API
        for completions. There are many ways to do this, but this example uses:
        <ul>
          <li>
            <a href="https://github.com/openai/openai-node">
              OpenAI npm module
            </a>
            : The official library. It uses Axios, and you could instead just
            hit the REST APIs directly.
          </li>
          <li>
            <code>eventStream</code> from{" "}
            <a href="https://github.com/sergiodxa/remix-utils">remix-utils</a>{" "}
            is used to return a Response with the right headers for an SSE.
          </li>
          <li>
            <a href="https://developer.mozilla.org/en-US/docs/Web/API/EventSource">
              EventSource
            </a>{" "}
            is used to listen for messages from the server. Could also use{" "}
            <code>useEventSource</code> from <code>remix-utils</code> instead.
          </li>
          <li>
            This page contains the form which simply sends the input query to a
            resource route at <code>/completion</code>. That resource route does
            the OpenAI call (using gpt-3.5-turbo but you can change to gpt-4 if
            you fancy, with <code>stream:true</code>)
          </li>
        </ul>
      </div>
    </div>
  );
}
