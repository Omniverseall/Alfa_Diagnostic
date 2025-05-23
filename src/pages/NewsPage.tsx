import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { adminService, NewsItem } from "@/services/adminService";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";

const NewsPage = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Все категории");

  useEffect(() => {
    const unsubscribe = adminService.subscribeNews((updatedNews) => {
        setNews(updatedNews);
        setLoading(false); // Убираем задержки при обновлении
    });

    return () => {
        unsubscribe();
    };
  }, []);

  const filteredNews = news.filter(
    (item) => selectedCategory === "Все категории" || item.category === selectedCategory
  );

  const categories = ["Все категории", ...Array.from(new Set(news.map(item => item.category)))];

  // Функция для рендеринга скелетона при загрузке
  const renderSkeletons = () => (
    Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
            <Skeleton className="h-48 w-full" />
            <div className="p-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <Skeleton className="h-4 w-32" />
            </div>
        </div>
    ))
  );

  return (
    <div className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Новости</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
            Актуальная информация о новостях клиники и специальных предложениях
          </p>
          {!loading && news.length === 0 && (
            <Button 
              className="mt-4 bg-brand-blue hover:bg-blue-700"
            >
              Обновить новости
            </Button>
          )}
        </div>

        {news.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`transition-colors duration-200 ${
                  selectedCategory === category
                    ? "bg-brand-blue hover:bg-blue-700 text-white"
                    : "text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        )}

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            renderSkeletons()
          ) : filteredNews.length > 0 ? (
            filteredNews.map((newsItem) => (
              <div
                key={newsItem.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
              >
                {newsItem.image && (
                   <div className="h-48 w-full overflow-hidden">
                    <img
                      src={newsItem.image}
                      alt={newsItem.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <span className="ml-2 px-2 py-0.5 bg-blue-100 text-brand-blue rounded text-xs font-medium truncate">
                        {newsItem.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg mb-3 text-gray-800">{newsItem.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">{newsItem.content}</p>
                  <div className="mt-auto">
                     <Link
                        to={`/news/${newsItem.id}`}
                        className="inline-flex items-center text-brand-blue hover:text-brand-red transition-colors duration-200 font-medium group"
                      >
                       Читать далее
                       <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
             <div className="text-center py-10 text-gray-500 col-span-3">
                  Новости еще не добавлены в систему.
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
