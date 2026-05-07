import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import Home from './pages/Home';
import Database from './pages/Database';
import Predictor from './pages/Predictor';
import Results from './pages/Results';
import ShareData from './pages/ShareData';
import About from './pages/About';
import MaterialsAdvisor from './pages/MaterialsAdvisor';
import PropertyEstimator from './pages/PropertyEstimator';

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/database" element={<Database />} />
          <Route path="/predictor" element={<Predictor />} />
          <Route path="/results" element={<Results />} />
          <Route path="/share" element={<ShareData />} />
          <Route path="/about" element={<About />} />
          <Route path="/advisor" element={<MaterialsAdvisor />} />
          <Route path="/property-estimator" element={<PropertyEstimator />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
