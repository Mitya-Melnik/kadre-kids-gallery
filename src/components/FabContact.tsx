import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, Send } from "lucide-react";

const FabContact = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-4 z-50">
      <div className={`flex flex-col items-end gap-2 mb-2 transition-all duration-300 ${open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
        <a
          href="https://wa.me/79956002111"
          aria-label="Написать в WhatsApp"
          className="px-3 py-2 rounded-lg bg-white shadow-soft border border-border text-foreground hover:shadow-glow hover:bg-accent/40 transition-all"
        >
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm">WhatsApp</span>
          </div>
        </a>
        <a
          href="https://t.me/your_telegram"
          aria-label="Написать в Telegram"
          className="px-3 py-2 rounded-lg bg-white shadow-soft border border-border text-foreground hover:shadow-glow hover:bg-accent/40 transition-all"
        >
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-blue-600" />
            <span className="text-sm">Telegram</span>
          </div>
        </a>
        <a
          href="tel:+79956002111"
          aria-label="Позвонить"
          className="px-3 py-2 rounded-lg bg-white shadow-soft border border-border text-foreground hover:shadow-glow hover:bg-accent/40 transition-all"
        >
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-primary" />
            <span className="text-sm">Позвонить</span>
          </div>
        </a>
      </div>

      <Button
        aria-label="Связаться"
        className="rounded-full w-14 h-14 shadow-glow"
        onClick={() => setOpen((v) => !v)}
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default FabContact;
