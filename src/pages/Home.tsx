import { useEffect, useState } from "react";
import { nephraScraper, Manga } from "@/services/nephraScraper";
import { MangaCard } from "@/components/MangaCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Clock, Star } from "lucide-react";

export const Home = () => {
  const [topDaily, setTopDaily] = useState<Manga[]>([]);
  const [topAllTime, setTopAllTime] = useState<Manga[]>([]);
  const [recommendedManga, setRecommendedManga] = useState<Manga[]>([]);
  const [recommendedManhwa, setRecommendedManhwa] = useState<Manga[]>([]);
  const [recommendedManhua, setRecommendedManhua] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [daily, allTime, manga, manhwa, manhua] = await Promise.all([
        nephraScraper.getTopDaily(1, 10),
        nephraScraper.getTopAllTime(1, 10),
        nephraScraper.getRecommended("manga", 1, 12),
        nephraScraper.getRecommended("manhwa", 1, 12),
        nephraScraper.getRecommended("manhua", 1, 12),
      ]);

      if (daily.data) setTopDaily(daily.data);
      if (allTime.data) setTopAllTime(allTime.data);
      if (manga.data) setRecommendedManga(manga.data);
      if (manhwa.data) setRecommendedManhwa(manhwa.data);
      if (manhua.data) setRecommendedManhua(manhua.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.1),rgba(139,92,246,0))]" />
        
        <div className="container relative mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="mb-6 text-5xl md:text-7xl font-bold">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Welcome to Nephra
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Your futuristic portal to endless manga, manhwa, and manhua adventures
            </p>
          </div>
        </div>
      </section>

      {/* Top Charts */}
      <section className="container mx-auto px-4 py-12">
        <Tabs defaultValue="daily" className="w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              Top Charts
            </h2>
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="daily" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Clock className="h-4 w-4 mr-2" />
                Daily
              </TabsTrigger>
              <TabsTrigger value="all-time" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
                <Star className="h-4 w-4 mr-2" />
                All Time
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="daily" className="mt-0">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[...Array(10)].map((_, i) => (
                  <Skeleton key={i} className="aspect-[2/3] rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 animate-slide-up">
                {topDaily.map((manga) => (
                  <MangaCard key={manga.manga_id} manga={manga} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="all-time" className="mt-0">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[...Array(10)].map((_, i) => (
                  <Skeleton key={i} className="aspect-[2/3] rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 animate-slide-up">
                {topAllTime.map((manga) => (
                  <MangaCard key={manga.manga_id} manga={manga} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>

      {/* Recommendations */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <Star className="h-8 w-8 text-secondary" />
          Recommended for You
        </h2>

        <Tabs defaultValue="manga" className="w-full">
          <TabsList className="bg-card border border-border mb-6">
            <TabsTrigger value="manga" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Manga
            </TabsTrigger>
            <TabsTrigger value="manhwa" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground">
              Manhwa
            </TabsTrigger>
            <TabsTrigger value="manhua" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              Manhua
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manga" className="mt-0">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[...Array(12)].map((_, i) => (
                  <Skeleton key={i} className="aspect-[2/3] rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-slide-up">
                {recommendedManga.map((manga) => (
                  <MangaCard key={manga.manga_id} manga={manga} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="manhwa" className="mt-0">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[...Array(12)].map((_, i) => (
                  <Skeleton key={i} className="aspect-[2/3] rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-slide-up">
                {recommendedManhwa.map((manga) => (
                  <MangaCard key={manga.manga_id} manga={manga} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="manhua" className="mt-0">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[...Array(12)].map((_, i) => (
                  <Skeleton key={i} className="aspect-[2/3] rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-slide-up">
                {recommendedManhua.map((manga) => (
                  <MangaCard key={manga.manga_id} manga={manga} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default Home;
