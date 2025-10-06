import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { nephraScraper, Manga } from "@/services/nephraScraper";
import { MangaCard } from "@/components/MangaCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Search as SearchIcon } from "lucide-react";

export const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim()) {
      const fetchResults = async () => {
        setLoading(true);
        const response = await nephraScraper.searchManga(query);
        if (response.data) {
          setResults(response.data);
        }
        setLoading(false);
      };

      fetchResults();
    }
  }, [query]);

  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <SearchIcon className="h-10 w-10 text-primary" />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Search Results
            </span>
          </h1>
          {query && (
            <p className="text-muted-foreground">
              Showing results for: <span className="text-foreground font-semibold">{query}</span>
            </p>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(24)].map((_, i) => (
              <Skeleton key={i} className="aspect-[2/3] rounded-lg" />
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-slide-up">
            {results.map((manga) => (
              <MangaCard key={manga.manga_id} manga={manga} />
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No results found for "{query}"</p>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">Enter a search query to find manga</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Search;
