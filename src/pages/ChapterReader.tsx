import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { nephraScraper } from "@/services/nephraScraper";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ChapterReader = () => {
  const { mangaId, chapterId } = useParams<{ mangaId: string; chapterId: string }>();
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [chapterInfo, setChapterInfo] = useState<any>(null);
  const [chapterList, setChapterList] = useState<{ chapter_id: string; chapter_number: number }[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (chapterId) {
      const fetchChapter = async () => {
        setLoading(true);
        const response = await nephraScraper.getChapterImages(chapterId);
        
        if (response.data) {
          setImages(response.data);
          setChapterInfo(response.chapterInfo);
        } else {
          toast({
            title: "Error loading chapter",
            description: response.error || "Failed to load images",
            variant: "destructive",
          });
        }
        setLoading(false);
      };

      fetchChapter();

      // Track chapter view
      if (mangaId && chapterId) {
        fetch("https://delta.shngm.io/v1/chapter/add-view", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ manga_id: mangaId, chapter_id: chapterId }),
        }).catch(console.error);
      }
    }
  }, [chapterId, mangaId, toast]);

  // Load chapter list for prev/next navigation
  useEffect(() => {
    const loadList = async () => {
      if (!mangaId) return;
      const res = await nephraScraper.getChapterList(mangaId);
      const list = (res.data || []).map((c) => ({ chapter_id: c.chapter_id, chapter_number: c.chapter_number }));
      setChapterList(list);
    };
    loadList();
  }, [mangaId]);

  const currentIndex = chapterList.findIndex((c) => c.chapter_id === chapterId);
  const prevChapter = currentIndex >= 0 ? chapterList[currentIndex + 1] : undefined; // list is desc
  const nextChapter = currentIndex >= 0 ? chapterList[currentIndex - 1] : undefined;

  if (!mangaId || !chapterId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Invalid chapter</p>
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

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(`/manga/${mangaId}`)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden md:inline">Back to Manga</span>
            </Button>

            {chapterInfo && (
              <div className="text-center">
                <h2 className="font-semibold">Chapter {chapterInfo.chapter_number}</h2>
                {chapterInfo.title && (
                  <p className="text-xs text-muted-foreground">{chapterInfo.title}</p>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                title="Previous Chapter"
                disabled={!prevChapter}
                onClick={() => prevChapter && navigate(`/manga/${mangaId}/chapter/${prevChapter.chapter_id}`)}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="Next Chapter"
                disabled={!nextChapter}
                onClick={() => nextChapter && navigate(`/manga/${mangaId}/chapter/${nextChapter.chapter_id}`)}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Reader Content */}
      <div className="container mx-auto px-0 md:px-4 py-8">
        {loading ? (
          <div className="space-y-4 max-w-4xl mx-auto">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="w-full aspect-[2/3] rounded-lg" />
            ))}
          </div>
        ) : images.length > 0 ? (
          <div className="space-y-2 max-w-4xl mx-auto">
            {images.map((image, index) => (
              <div key={index} className="relative animate-fade-in">
                <img
                  src={image}
                  alt={`Page ${index + 1}`}
                  className="w-full h-auto rounded-lg shadow-lg"
                  loading={index < 3 ? "eager" : "lazy"}
                />
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {index + 1} / {images.length}
                </div>
              </div>
            ))}

            {/* Navigation Footer */}
            <div className="flex justify-between items-center py-8 px-4">
              <Button
                variant="outline"
                className="gap-2"
                disabled={!prevChapter}
                onClick={() => prevChapter && navigate(`/manga/${mangaId}/chapter/${prevChapter.chapter_id}`)}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous Chapter
              </Button>
              <Button
                variant="default"
                onClick={() => navigate(`/manga/${mangaId}`)}
              >
                Back to Manga
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                disabled={!nextChapter}
                onClick={() => nextChapter && navigate(`/manga/${mangaId}/chapter/${nextChapter.chapter_id}`)}
              >
                Next Chapter
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">No images available for this chapter</p>
            <Button variant="outline" onClick={() => navigate(`/manga/${mangaId}`)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Manga
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterReader;
