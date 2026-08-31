import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone } from "lucide-react";
import { contacts } from "@/config/contacts";

const FabContact = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-4 z-50 flex flex-col items-end">
      <div className={`flex flex-col items-end gap-2 mb-2 transition-all duration-300 ${open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
        {contacts.max.inviteUrl ? (
          <a href={contacts.max.inviteUrl} target="_blank" rel="noopener noreferrer" aria-label="Написать в MAX" className="px-3 py-2 rounded-lg bg-white shadow-soft border border-border text-foreground hover:shadow-glow hover:bg-accent/40 transition-all">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-primary" />
              <span className="text-sm">Написать в MAX</span>
            </div>
          </a>
        ) : (
          <div className="max-w-64 px-3 py-2 rounded-lg bg-white shadow-soft border border-border text-foreground">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-primary" />
              <span className="text-sm">MAX: найдите нас по номеру {contacts.max.display}</span>
            </div>
          </div>
        )}
        <a
          href={contacts.phone.href}
          aria-label="Позвонить"
          className="px-3 py-2 rounded-lg bg-white shadow-soft border border-border text-foreground hover:shadow-glow hover:bg-accent/40 transition-all"
        >
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-primary" />
            <span className="text-sm">Позвонить: {contacts.phone.display}</span>
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
