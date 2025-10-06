import { useEffect, useState } from "react";
import { nephraScraper, Manga } from "@/services/nephraScraper";
import { MangaCard } from "@/components/MangaCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Bookmark } from "lucide-react";

export const Bookmarks = () => {
  const [bookmarkedManga, setBookmarkedManga] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      setLoading(true);
      const bookmarkIds = JSON.parse(localStorage.getItem("nephra_bookmarks") || "[]");
      
      if (bookmarkIds.length === 0) {
        setLoading(false);
        return;
      }

      const mangaPromises = bookmarkIds.map((id: string) => nephraScraper.getMangaDetail(id));
      const results = await Promise.all(mangaPromises);
      
      const manga = results
        .filter((r) => r.metadata)
        .map((r) => r.metadata as Manga);
      
      setBookmarkedManga(manga);
      setLoading(false);
    };

    fetchBookmarks();
  }, []);

  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Bookmark className="h-10 w-10 text-primary" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              My Bookmarks
            </span>
          </h1>
          <p className="text-muted-foreground">
            Your saved manga collection
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="aspect-[2/3] rounded-lg" />
            ))}
          </div>
        ) : bookmarkedManga.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-slide-up">
            {bookmarkedManga.map((manga) => (
              <MangaCard key={manga.manga_id} manga={manga} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Bookmark className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground text-lg">No bookmarks yet</p>
            <p className="text-muted-foreground text-sm">Start exploring and bookmark your favorite manga!</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Bookmarks;
