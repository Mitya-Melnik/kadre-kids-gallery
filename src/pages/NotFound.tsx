import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ArrowLeft, Home } from "lucide-react";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Helmet>
        <title>Страница не найдена | Дети в кадре</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <TopBar />
      <main className="container mx-auto flex flex-1 items-center justify-center px-4 py-20">
        <div className="max-w-xl rounded-3xl border border-border bg-gradient-card p-8 text-center shadow-soft md:p-12">
          <div className="text-7xl font-bold text-primary">404</div>
          <h1 className="mt-5 text-3xl font-bold text-foreground">Такой страницы нет</h1>
          <p className="mt-4 text-lg text-muted-foreground">Возможно, ссылка устарела или в адресе есть опечатка.</p>
          <Button asChild size="lg" className="mt-8">
            <Link to="/"><Home className="mr-2 h-4 w-4" />Вернуться на главную<ArrowLeft className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </main>
      <Footer hideQuickLinks />
    </div>
  );
};

export default NotFound;
