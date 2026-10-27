import { useState } from "react";
import { useFetch } from "../../hooks";
import { SearchBar } from "../SearchBar/SearchBar";
import { ExoplanetsList } from "../ExoplanetsList/ExoplanetsList";
import type { Exoplanet } from "../../model/Exoplanet";
import "bootstrap/dist/css/bootstrap.min.css";
import { PageBar } from "../PageBar/PageBar";
import "./SearchView.css";

interface Response {
  content: Exoplanet[];
  totalPages: number;
}

interface Props {
  navigateToDetail: (
    idExoplanet: number,
    selectedExoplanet: Exoplanet,
  ) => void;
  currentView: "global" | "detail";
  currentSystemId: number;
  setSelectedExoplanet: (exoplanet: Exoplanet | null) => void;
}

/**
 * Component that loads exoplanets info from API 
 * @returns 
 */
export const SearchView = ({
  navigateToDetail,
  currentView,
  currentSystemId,
  setSelectedExoplanet,
}: Props) => {
  //Url api
  const [url, setUrl] = useState(
    "http://localhost:8080/api/exoplanet?page=1&limit=10",
  );

  // Open or close the search
  const [isOpen, setIsOpen] = useState(true);

  // LIst of the current exoplanets loaded from api
  const exoplanets = useFetch<Response>(url, { content: [], totalPages: 0 });
  const [currentPage, setCurrentPage] = useState(1);


  const handleSearch = (value: string) => {
    setUrl(
      "http://localhost:8080/api/exoplanet/search?page=1&limit=10&name=" +
      value,
    );
    setCurrentPage(1);
  };


  const changePage = (newPage: number) => {
    if (newPage <= 0) {
      return;
    }
    const currentUrl = new URL(url);
    currentUrl.searchParams.set("page", newPage.toString());
    setCurrentPage(newPage);
    setUrl(currentUrl.toString());
  };


  const handleCardClick = (idExoplanet: number) => {
    const exoplanet = exoplanets.data.content.find(
      (item) => item.id === idExoplanet,
    );

    if (!exoplanet) return;

    const systemId = exoplanet.idExoplanetarySystem;

    // If this systemn is been already shown by the canvas, then only change the selected exoplanet
    if (currentView === "detail" && systemId === currentSystemId) {
      setSelectedExoplanet(exoplanet);
      return;
    }

    // navigateToDetail decidirá si se necesita animación.
    navigateToDetail(systemId, exoplanet);
  };

  return (
    <>
      {!isOpen && (
        <button
          className="btn btn-dark position-absolute top-0 start-0 m-3 shadow-sm border-secondary-subtle d-flex align-items-center gap-2"
          style={{ zIndex: 10 }}
          onClick={() => setIsOpen(true)}
        >
          <i className="bi bi-search" />
          Explore
        </button>
      )}

      <aside
        className={`search-panel position-absolute top-0 start-0 m-3
        d-flex flex-column gap-3 p-3 rounded-3 border
        ${!isOpen ? "d-none" : ""}`}
        style={{
          zIndex: 10,
          width: "340px",
          maxHeight: "calc(100vh - 32px)",
        }}
      >
        <header className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0 fw-semibold">EXOPLANET EXPLORER</h5>
          </div>

          <button
            type="button"
            className="btn btn-sm text-secondary border-0"
            aria-label="Close explorer"
            onClick={() => setIsOpen(false)}
            style={{ fontSize: "1.25rem", lineHeight: 1 }}
          >
            ×
          </button>
        </header>
        <hr className="my-0 border-secondary opacity-25" />

        <SearchBar onSearch={handleSearch} />

        <ExoplanetsList
          exoplanets={exoplanets.data.content}
          error={exoplanets.error}
          loading={exoplanets.loading}
          onCardClick={handleCardClick}
        />

        <PageBar
          onChange={changePage}
          currentPage={currentPage}
          totalPages={exoplanets.data.totalPages}
        />
      </aside>
    </>
  );
};
