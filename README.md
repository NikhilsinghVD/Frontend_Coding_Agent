# Frontend Coding Agent

A practice project that uses LangGraph.js and a Groq chat model to inspect a
frontend project safely. The agent can only list and read files inside the
`workspace` directory.

## How the agent works

```text
START -> agent -> tools -> agent -> ... -> END
```

1. `src/index.ts` receives a request and invokes the compiled graph.
2. The `agent` node asks the model what to do next.
3. If the model requests a filesystem tool, LangGraph routes to `tools`.
4. Tool results are added to message state and control returns to `agent`.
5. When the model makes no tool call, LangGraph routes to `END`.

The recursion limit in `src/index.ts` prevents an accidental infinite loop.
`resolveSafePath` prevents tools from escaping the workspace with paths such as
`../secrets.txt`.

## Project layout

```text
src/
  config/       Environment validation
  graphs/       LangGraph state-machine definition
  models/       Chat model construction
  prompts/      System prompts
  services/     Filesystem operations and error handling
  tools/        Tools exposed to the model
  utils/        Path-safety and requirement helpers
workspace/      Frontend projects the agent is allowed to inspect
```

## Setup

1. Install dependencies with `npm install`.
2. Create a `.env` file in the project root:

   ```env
   GROQ_API_KEY=your_key_here
   # Optional: override the default model
   GROQ_MODEL=openai/gpt-oss-120b
   ```

3. Check the TypeScript code with `npm run typecheck`.
4. Run the default example with `npm run dev`.
5. Pass your own task after `--`:

   ```powershell
   npm run dev -- "Inspect demo-react-app/src/App.tsx"
   ```

## Extending it for practice

Add new tools to `src/tools`, then include them in the collection supplied to
both `bindTools` and `ToolNode`. Good next steps are a file-writing tool with
explicit approval, automated tests for path safety, and graph checkpointing for
multi-turn conversations.
