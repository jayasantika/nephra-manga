const BASE_API_URL = "https://api.shngm.io/v1";
const ODIN_API_URL = "https://odin.shinigami.gg/v1";
const SLIDER_API_URL = "https://slider.shinigami.gg/v1";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface Manga {
  manga_id: string;
  title: string;
  cover_image_url: string;
  alternative_title?: string;
  description?: string;
  status?: number;
  release_year?: string;
  user_rate?: number;
  view_count?: number;
  bookmark_count?: number;
  rank?: number;
  latest_chapter_number?: number;
  taxonomy?: {
    Genre?: Array<{ name: string; slug: string }>;
    Format?: Array<{ name: string; slug: string }>;
    Type?: Array<{ name: string; slug: string }>;
    Author?: Array<{ name: string; slug: string }>;
    Artist?: Array<{ name: string; slug: string }>;
  };
}

export interface Chapter {
  chapter_id: string;
  chapter_number: number;
  title?: string;
  created_at: string;
}

export interface MangaDetail {
  metadata: Manga;
  chapters: Chapter[];
}

export interface MangaDetail {
  metadata: Manga;
  chapters: Chapter[];
}

class NephraScraper {
  private async fetchAPI<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      return { data: result.data };
    } catch (error) {
      console.error("API Error:", error);
      return { error: error instanceof Error ? error.message : "Unknown error" };
    }
  }

  async getTopDaily(page = 1, pageSize = 10) {
    return this.fetchAPI<Manga[]>(
      `${BASE_API_URL}/manga/top?filter=daily&page=${page}&page_size=${pageSize}`
    );
  }

  async getTopAllTime(page = 1, pageSize = 10) {
    return this.fetchAPI<Manga[]>(
      `${BASE_API_URL}/manga/top?filter=all_time&page=${page}&page_size=${pageSize}`
    );
  }

  async getLatestManga(type: "project" | "mirror" = "project", page = 1, pageSize = 24) {
    return this.fetchAPI<Manga[]>(
      `${BASE_API_URL}/manga/list?type=${type}&page=${page}&page_size=${pageSize}&is_update=true&sort=latest&sort_order=desc`
    );
  }

  async getRecommended(format: "manga" | "manhwa" | "manhua" = "manga", page = 1, pageSize = 10) {
    return this.fetchAPI<Manga[]>(
      `${BASE_API_URL}/manga/list?format=${format}&page=${page}&page_size=${pageSize}&is_recommended=true&sort=latest&sort_order=desc`
    );
  }

  async getExploreCategory(category: string, page = 1, pageSize = 9) {
    return this.fetchAPI<Manga[]>(
      `${BASE_API_URL}/manga/list?page=${page}&page_size=${pageSize}&category=${category}`
    );
  }

  async getExploreSlider() {
    return this.fetchAPI(`${SLIDER_API_URL}/slider/explore-1`);
  }

  async getExplorePage() {
    return this.fetchAPI(`${ODIN_API_URL}/pages/explore`);
  }

  async searchManga(query: string, page = 1, pageSize = 24) {
    return this.fetchAPI<Manga[]>(
      `${BASE_API_URL}/manga/list?page=${page}&page_size=${pageSize}&genre_include_mode=or&genre_exclude_mode=or&sort=latest&sort_order=desc&q=${encodeURIComponent(query)}`
    );
  }

  async getMangaDetail(id: string) {
    const [metadataRes, chaptersRes] = await Promise.all([
      this.fetchAPI<Manga>(`${BASE_API_URL}/manga/detail/${id}`),
      this.getChapterList(id),
    ]);

    return {
      metadata: metadataRes.data,
      chapters: chaptersRes.data || [],
    };
  }

  async getChapterList(mangaId: string, page = 1, pageSize = 1000) {
    return this.fetchAPI<Chapter[]>(
      `${BASE_API_URL}/chapter/${mangaId}/list?page=${page}&page_size=${pageSize}&sort_by=chapter_number&sort_order=desc`
    );
  }

  async getChapterImages(chapterId: string) {
    try {
      const response = await fetch(`${BASE_API_URL}/chapter/detail/${chapterId}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      
      if (result.data?.base_url && result.data?.chapter?.path && result.data?.chapter?.data) {
        const { base_url, chapter } = result.data;
        const images = chapter.data.map((filename: string) => `${base_url}${chapter.path}${filename}`);
        return { data: images, chapterInfo: result.data.chapter };
      }
      
      return { error: "Invalid chapter data" };
    } catch (error) {
      console.error("Chapter Images Error:", error);
      return { error: error instanceof Error ? error.message : "Unknown error" };
    }
  }
}

export const nephraScraper = new NephraScraper();
