import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

interface BackToTopProps {
  aboveMobileBar?: boolean;
}

const BackToTop = ({ aboveMobileBar = false }: BackToTopProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      aria-label="Наверх"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed right-20 z-50 p-3 rounded-full bg-primary text-primary-foreground shadow-glow hover:brightness-110 transition-all ${aboveMobileBar ? "bottom-24 md:bottom-6" : "bottom-6"}`}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};

export default BackToTop;
