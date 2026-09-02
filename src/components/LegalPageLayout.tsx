import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";

interface LegalPageLayoutProps {
  title: string;
  updatedAt: string;
  children: React.ReactNode;
}

const LegalPageLayout = ({ title, updatedAt, children }: LegalPageLayoutProps) => (
  <div className="min-h-screen bg-background text-foreground">
    <header className="border-b border-border bg-background">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4">
        <Link to="/" aria-label="Дети в кадре — главная">
          <img
            src="/lovable-uploads/b6c9cc69-0a84-4a55-bb3d-bd6a40f3e305.png"
            alt="Дети в кадре"
            className="h-9 sm:h-10"
          />
        </Link>
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Вернуться на сайт
        </Link>
      </div>
    </header>

    <main className="container mx-auto px-4 py-10 md:py-16">
      <article className="mx-auto max-w-4xl">
        <p className="mb-3 text-sm font-semibold text-primary">Документы сайта</p>
        <h1 className="text-3xl font-bold leading-tight md:text-5xl">{title}</h1>
        <p className="mt-4 text-sm text-muted-foreground">Редакция от {updatedAt}</p>
        <div className="mt-10 space-y-8 text-base leading-7 text-muted-foreground [&_a]:text-primary [&_a]:underline [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-foreground [&_li]:ml-5 [&_li]:list-disc [&_p+p]:mt-3 [&_ul]:space-y-2">
          {children}
        </div>
      </article>
    </main>

    <Footer hideQuickLinks />
  </div>
);

export default LegalPageLayout;
