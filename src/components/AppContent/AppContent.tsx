import { Canvas } from "@react-three/fiber";
import { SearchView } from "../SearchView/SearchView";
import { SceneSwitcher } from "../ScenceSwitcher/SceneSwitcher";
import { ExoplanetDetails } from "../ExoplanetDetails/ExoplanetDetails";
import { Stars } from "@react-three/drei";
import type { Exoplanet } from "../../model/Exoplanet";
import { useState } from "react";
import { CanvasContainer } from "../CanvasConstainer/CanvasContainer";
type ViewType = "global" | "detail";

export function AppContent() {
  const [currentView, setCurrentView] = useState<ViewType>("global");

  const [selectedSystemId, setSelectedSystemId] = useState<number>(-1);

  const [selectedExoplanet, setSelectedExoplanet] =
    useState<Exoplanet | null>(null);

  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigateToDetail = (id: number, exoplanet: Exoplanet) => {
    setSelectedSystemId(id);
    setSelectedExoplanet(exoplanet);

    if (currentView === "global") {
      setIsTransitioning(true);
      return;
    }

    setCurrentView("detail");
  };

  const handleTransitionComplete = () => {
    setIsTransitioning(false);
    setCurrentView("detail");
  };

  const navigateToGlobal = () => {
    setSelectedSystemId(-1);
    setSelectedExoplanet(null);
    setCurrentView("global");
  };


  return (
    <>
      <SearchView
        navigateToDetail={navigateToDetail}
        currentView={currentView}
        currentSystemId={selectedSystemId}
        setSelectedExoplanet={setSelectedExoplanet}
      />
      <CanvasContainer>
        <Canvas camera={{ position: [30, 30, 30], fov: 60 }}>
          <color attach="background" args={["#000000"]} />
          <Stars
            radius={150}
            depth={50}
            count={1000}
            factor={2}
            saturation={0}
            fade
            speed={0}
          />
          <SceneSwitcher
            currentView={currentView}
            selectedSystemId={selectedSystemId}
            selectedExoplanet={selectedExoplanet}
            isTransitioning={isTransitioning}
            onTransitionComplete={handleTransitionComplete}
          />
        </Canvas>
      </CanvasContainer>
      {selectedExoplanet && !isTransitioning && (
        <ExoplanetDetails
          exoplanet={selectedExoplanet}
          onClose={() => setSelectedExoplanet(null)}
        />
      )}
    </>
  );
}
