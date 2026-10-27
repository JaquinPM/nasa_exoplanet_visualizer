import { Canvas } from "@react-three/fiber";
import { SearchView } from "../SearchView/SearchView";
import { SceneSwitcher } from "../ScenceSwitcher/SceneSwitcher";
import { ExoplanetDetails } from "../ExoplanetDetails/ExoplanetDetails";
import { Stars } from "@react-three/drei";
import type { Exoplanet } from "../../model/Exoplanet";
import { useState } from "react";
import { CanvasContainer } from "../CanvasConstainer/CanvasContainer";
type ViewType = "global" | "detail";

/**
 * Main componet that handles all the logit to syncornize the canvas and the interface
 */
export function AppContent() {
  // Stores the current canva view, detailed or global
  const [currentView, setCurrentView] = useState<ViewType>("global");

  // Stores the current selected system id, it there is no system selected then is -1
  const [selectedSystemId, setSelectedSystemId] = useState<number>(-1);

  // Stores the curtrent selected exoplanet
  const [selectedExoplanet, setSelectedExoplanet] =
    useState<Exoplanet | null>(null);
  //Stores whether the transitioneing animations shoul be execurtted or not
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Function that change the states values required to render the detailed canva view and shoo the exoplanet card
  const navigateToDetail = (id: number, exoplanet: Exoplanet) => {
    setSelectedSystemId(id);
    setSelectedExoplanet(exoplanet);
    // When the view is the global then start transitioning animation
    if (currentView === "global") {
      setIsTransitioning(true);
      //Stop the function until the transitioning stops, below is anither function that will be called by the child DetailedViewCanva
      //wheen the animation is complete
      return;
    }
    // Change to detail view
    setCurrentView("detail");
  };

  // Function that wiull be called by DetailedViewCanva when the transiition is complete
  const handleTransitionComplete = () => {
    setIsTransitioning(false);
    setCurrentView("detail");
  };

  // Function to return to the global view
  const navigateToGlobal = () => {
    setSelectedSystemId(-1);
    setSelectedExoplanet(null);
    setCurrentView("global");
  };


  return (
    <>

      {/* Component that display the list of exoplanets */}
      <SearchView
        navigateToDetail={navigateToDetail}
        currentView={currentView}
        currentSystemId={selectedSystemId}
        setSelectedExoplanet={setSelectedExoplanet}
      />

      <CanvasContainer>
        <Canvas camera={{
          position: [0, 50, 100],
          near: 0.1,
          far: 50000
        }}>
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
      </CanvasContainer >


      {/* When there is an exoplanet selected, a datailed card about the selected exoplanet is shown */}
      {selectedExoplanet && !isTransitioning && (
        <ExoplanetDetails
          exoplanet={selectedExoplanet}
          onClose={() => setSelectedExoplanet(null)}
        />
      )
      }
    </>
  );
}
