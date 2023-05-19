import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";

import { Route } from "wouter";
import { Editor } from "./components/Editor";
import GutachtenLanding from "./components/GutachtenLanding";

function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Route path="/" component={GutachtenLanding} />
        <Route path="/gutachten/:ga_id">
          {(params) => <Editor ga_id={params.ga_id} />}
        </Route>
      </QueryClientProvider>
    </>
  );
}

export default App;
