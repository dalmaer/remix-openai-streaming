# Remix OpenAI Streaming Example

This is a minimial example of using Remix with OpenAI's streaming API
for completions. There are many ways to do this, but this example uses:

- [OpenAI npm module](https://github.com/openai/openai-node"): The official library. It uses Axios, and you could instead justhit the REST APIs directly.
- `eventStream` from [remix-utils](https://github.com/sergiodxa/remix-utils) is used to return a Response with the right headers for an SSE.
- [EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) is used to listen for messages from the server. Could also use `useEventSource` from `remix-utils` instead.
- The index page contains the form which simply sends the input query to a resource route at `/completion`. That resource route does the OpenAI call (using gpt-3.5-turbo but you can change to gpt-4 if you fancy, with `stream:true`)

You must set the `OPENAI_API_KEY` environment variable before you `npm run dev`.
