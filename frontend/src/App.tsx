import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SpeakingGym from "./pages/SpeakingGym";
import ProgressPage from "./pages/Progress";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Navigation from "./components/Navigation";
import { useIsMobile } from "./hooks/use-mobile";

const App = () => {
  const isMobile = useIsMobile();

  return (
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <div className={`min-h-screen ${isMobile ? 'pb-20' : 'flex'}`}>
          {!isMobile && (
            <div className="w-64 bg-white border-r border-gray-200 fixed left-0 top-0 h-full">
              <div className="p-6">
                <h1 className="text-2xl font-bold text-indigo-900 mb-8">FluentNow</h1>
              </div>
              <Navigation />
            </div>
          )}
          <div className={`flex-1 ${!isMobile ? 'ml-64' : ''}`}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/speaking-gym" element={<SpeakingGym />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          {isMobile && <Navigation />}
        </div>
      </BrowserRouter>
    </TooltipProvider>
  );
};

export default App;