import "bootstrap/dist/css/bootstrap.min.css";

interface Props {
  onSearch: (value: string) => void;
}

export const SearchBar = ({ onSearch }: Props) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const value = formData.get("search");

    if (typeof value === "string") {
      onSearch(value.trim());
    }
  };

  return (
    <form role="search" onSubmit={handleSubmit}>
      <div className="input-group search-input-group">
        <input
          className="form-control search-input"
          type="search"
          placeholder="Search Exoplanet..."
          name="search"
          aria-label="Search Exoplanet"
        />

        <button
          type="submit"
          className="btn btn-primary search-button"
          aria-label="Buscar"
        >
          Search
        </button>
      </div>
    </form>
  );
};
