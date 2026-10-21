import React from "react";

interface PageBarProps {
    currentPage: number;
    totalPages: number;
    onChange: (page: number) => void;
}

export const PageBar: React.FC<PageBarProps> = ({ currentPage, totalPages, onChange }) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const delta = 1; // Reducido a 1 para que la barra no sea tan ancha
        const range: number[] = [];
        const rangeWithDots: (number | string)[] = [];
        let l: number | undefined;

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - delta && i <= currentPage + delta)
            ) {
                range.push(i);
            }
        }

        range.forEach((i) => {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push("...");
                }
            }
            rangeWithDots.push(i);
            l = i;
        });

        return rangeWithDots;
    };

    return (
        <div className="d-flex align-items-center justify-content-center gap-1 py-2 px-3 bg-black bg-opacity-50 text-white border border-light border-opacity-10 rounded-pill shadow-sm overflow-auto">
            {/* Botón Anterior */}
            <button
                className="btn btn-link text-white text-decoration-none btn-sm p-1 px-2"
                onClick={() => onChange(currentPage - 1)}
                disabled={currentPage <= 1}
                style={{ opacity: currentPage <= 1 ? 0.3 : 1 }}
            >
                ‹
            </button>

            {/* Números de página */}
            <div className="d-flex align-items-center gap-1">
                {getPageNumbers().map((page, index) => {
                    if (page === "...") {
                        return (
                            <span key={`dots-${index}`} className="px-1 text-white text-opacity-50 small">
                                ...
                            </span>
                        );
                    }

                    const pageNum = page as number;
                    const isCurrent = pageNum === currentPage;

                    return (
                        <button
                            key={pageNum}
                            className={`btn btn-sm rounded-circle d-flex align-items-center justify-content-center ${
                                isCurrent 
                                    ? "btn-primary fw-bold shadow-sm" 
                                    : "btn-link text-white text-opacity-75 text-decoration-none"
                            }`}
                            style={{ width: "32px", height: "32px", fontSize: "0.85rem" }}
                            onClick={() => onChange(pageNum)}
                        >
                            {pageNum}
                        </button>
                    );
                })}
            </div>

            {/* Botón Siguiente */}
            <button
                className="btn btn-link text-white text-decoration-none btn-sm p-1 px-2"
                onClick={() => onChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                style={{ opacity: currentPage >= totalPages ? 0.3 : 1 }}
            >
                ›
            </button>
        </div>
    );
};