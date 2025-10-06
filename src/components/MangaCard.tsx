import { Link } from "react-router-dom";
import { Star, BookOpen } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import type { Manga } from "@/services/nephraScraper";

interface MangaCardProps {
  manga: Manga;
}

export const MangaCard = ({ manga }: MangaCardProps) => {
  const genres = manga.taxonomy?.Genre?.map(g => g.name) || [];
  const type = manga.taxonomy?.Type?.[0]?.name;
  const format = manga.taxonomy?.Format?.[0]?.name;

  return (
    <Link to={`/manga/${manga.manga_id}`}>
      <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]">
        <div className="aspect-[2/3] overflow-hidden">
          <img
            src={manga.cover_image_url}
            alt={manga.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="absolute top-2 right-2 flex gap-1">
          {type && (
            <Badge variant="secondary" className="bg-secondary/80 backdrop-blur-sm text-xs">
              {type}
            </Badge>
          )}
          {format && (
            <Badge variant="secondary" className="bg-accent/80 backdrop-blur-sm text-xs">
              {format}
            </Badge>
          )}
          {manga.user_rate && manga.user_rate > 0 && (
            <Badge variant="secondary" className="bg-primary/80 backdrop-blur-sm text-xs flex items-center gap-1">
              <Star className="h-3 w-3 fill-current" />
              {manga.user_rate.toFixed(1)}
            </Badge>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 text-foreground drop-shadow-lg">
            {manga.title}
          </h3>
          {genres.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {genres.slice(0, 3).map((genre, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="text-[10px] border-primary/50 text-primary bg-background/80 backdrop-blur-sm"
                >
                  {genre}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-primary/90 backdrop-blur-sm rounded-full p-3">
            <BookOpen className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>
      </Card>
    </Link>
  );
};
