import { useEffect, useState } from "react";
import { nephraScraper, Manga } from "@/services/nephraScraper";
import { MangaCard } from "@/components/MangaCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Compass } from "lucide-react";

export const Explore = () => {
  const [latestProject, setLatestProject] = useState<Manga[]>([]);
  const [latestMirror, setLatestMirror] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [project, mirror] = await Promise.all([
        nephraScraper.getLatestManga("project", 1, 24),
        nephraScraper.getLatestManga("mirror", 1, 24),
      ]);

      if (project.data) setLatestProject(project.data);
      if (mirror.data) setLatestMirror(mirror.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Compass className="h-10 w-10 text-primary" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Explore Manga
            </span>
          </h1>
          <p className="text-muted-foreground">
            Discover the latest updates from projects and mirrors
          </p>
        </div>

        <Tabs defaultValue="project" className="w-full">
          <TabsList className="bg-card border border-border mb-6">
            <TabsTrigger
              value="project"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Project
            </TabsTrigger>
            <TabsTrigger
              value="mirror"
              className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
            >
              Mirror
            </TabsTrigger>
          </TabsList>

          <TabsContent value="project" className="mt-0">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[...Array(24)].map((_, i) => (
                  <Skeleton key={i} className="aspect-[2/3] rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-slide-up">
                {latestProject.map((manga) => (
                  <MangaCard key={manga.manga_id} manga={manga} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="mirror" className="mt-0">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[...Array(24)].map((_, i) => (
                  <Skeleton key={i} className="aspect-[2/3] rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-slide-up">
                {latestMirror.map((manga) => (
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

export default Explore;
