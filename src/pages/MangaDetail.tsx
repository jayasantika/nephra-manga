import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { nephraScraper, Manga, Chapter } from "@/services/nephraScraper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bookmark, BookmarkCheck, Star, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const MangaDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [manga, setManga] = useState<Manga | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        setLoading(true);
        const response = await nephraScraper.getMangaDetail(id);
        if (response.metadata) setManga(response.metadata);
        if (response.chapters) setChapters(response.chapters);
        setLoading(false);

        const bookmarks = JSON.parse(localStorage.getItem("nephra_bookmarks") || "[]");
        setIsBookmarked(bookmarks.includes(id));
      };

      fetchData();
    }
  }, [id]);

  const toggleBookmark = () => {
    if (!id) return;
    
    const bookmarks = JSON.parse(localStorage.getItem("nephra_bookmarks") || "[]");
    let newBookmarks;
    
    if (isBookmarked) {
      newBookmarks = bookmarks.filter((b: string) => b !== id);
      toast({ title: "Removed from bookmarks" });
    } else {
      newBookmarks = [...bookmarks, id];
      toast({ title: "Added to bookmarks" });
    }
    
    localStorage.setItem("nephra_bookmarks", JSON.stringify(newBookmarks));
    setIsBookmarked(!isBookmarked);
  };

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Invalid manga ID</p>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="flex flex-col md:flex-row gap-8">
            <Skeleton className="w-full md:w-64 aspect-[2/3] rounded-lg" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <div className="flex gap-3">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!manga) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Manga not found</p>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const genres = manga.taxonomy?.Genre?.map(g => g.name) || [];
  const type = manga.taxonomy?.Type?.[0]?.name;
  const format = manga.taxonomy?.Format?.[0]?.name;
  const statusText = manga.status === 1 ? "Ongoing" : "Completed";

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>

      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background" />
        <div className="container relative mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-8 animate-fade-in">
            <div className="w-full md:w-64 shrink-0">
              <img
                src={manga.cover_image_url}
                alt={manga.title}
                className="w-full rounded-lg shadow-2xl shadow-primary/20"
              />
            </div>

            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{manga.title}</h1>
              
              {manga.alternative_title && (
                <p className="text-muted-foreground mb-4 italic">{manga.alternative_title}</p>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                {type && (
                  <Badge variant="secondary" className="bg-secondary/80">
                    {type}
                  </Badge>
                )}
                {format && (
                  <Badge variant="outline" className="border-primary text-primary">
                    {format}
                  </Badge>
                )}
                <Badge variant="outline" className="border-accent text-accent">
                  {statusText}
                </Badge>
                {manga.user_rate && manga.user_rate > 0 && (
                  <Badge variant="secondary" className="bg-primary/80 flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    {manga.user_rate.toFixed(1)}
                  </Badge>
                )}
                {manga.release_year && (
                  <Badge variant="outline">{manga.release_year}</Badge>
                )}
              </div>

              {genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {genres.map((genre, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="border-border/50 text-muted-foreground"
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              )}

              {manga.description && (
                <p className="text-muted-foreground mb-6 leading-relaxed whitespace-pre-line">
                  {manga.description}
                </p>
              )}

              <div className="flex gap-3 mb-6">
                <Button
                  onClick={toggleBookmark}
                  variant={isBookmarked ? "default" : "outline"}
                  className={isBookmarked ? "bg-primary" : "border-primary text-primary hover:bg-primary/10"}
                >
                  {isBookmarked ? (
                    <>
                      <BookmarkCheck className="h-4 w-4 mr-2" />
                      Bookmarked
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-4 w-4 mr-2" />
                      Bookmark
                    </>
                  )}
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                {manga.view_count && (
                  <div className="bg-card/50 p-3 rounded-lg border border-border/50">
                    <p className="text-2xl font-bold text-primary">{manga.view_count.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Views</p>
                  </div>
                )}
                {manga.bookmark_count && (
                  <div className="bg-card/50 p-3 rounded-lg border border-border/50">
                    <p className="text-2xl font-bold text-secondary">{manga.bookmark_count.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Bookmarks</p>
                  </div>
                )}
                {manga.latest_chapter_number && (
                  <div className="bg-card/50 p-3 rounded-lg border border-border/50">
                    <p className="text-2xl font-bold text-accent">{manga.latest_chapter_number}</p>
                    <p className="text-xs text-muted-foreground">Chapters</p>
                  </div>
                )}
                {manga.rank && (
                  <div className="bg-card/50 p-3 rounded-lg border border-border/50">
                    <p className="text-2xl font-bold text-primary">#{manga.rank}</p>
                    <p className="text-xs text-muted-foreground">Rank</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6">Chapters ({chapters.length})</h2>
        
        {chapters.length > 0 ? (
          <div className="grid gap-2 animate-slide-up">
            {chapters.map((chapter) => (
              <Link key={chapter.chapter_id} to={`/manga/${id}/chapter/${chapter.chapter_id}`}>
                <Card className="p-4 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold group-hover:text-primary transition-colors">
                        Chapter {chapter.chapter_number}
                        {chapter.title && `: ${chapter.title}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(chapter.created_at).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <Button size="sm" variant="ghost" className="group-hover:bg-primary group-hover:text-primary-foreground">
                      Read Now
                      <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">No chapters available</p>
        )}
      </section>
    </div>
  );
};

export default MangaDetail;
