import "./App.css";
import { QueryClient, QueryClientProvider } from "react-query";

import { Route } from "wouter";
import { Editor } from "./components/Editor";
import GutachtenLanding from "./components/GutachtenLanding";
import Landing from "./components/Landing";

function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <Route path="/" component={Landing} />
          <Route path="/gutachten" component={GutachtenLanding} />
          <Route path="/gutachten/:ga_id">
            {(params) => <Editor ga_id={params.ga_id} />}
          </Route>
        </div>
      </QueryClientProvider>
    </>
  );
}

export default App;
