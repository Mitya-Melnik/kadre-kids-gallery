import { Button } from "@/components/ui/button";

const KindergartenBanner = () => {
  const handleConsultationClick = () => {
    window.location.href = '/?direction=album#cta';
  };

  return (
    <section className="py-8 bg-gradient-primary relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-pattern opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left side - CTA Button */}
          <div className="text-center md:text-left">
            <Button 
              size="xl"
              variant="secondary"
              onClick={handleConsultationClick}
              className="bg-white hover:bg-white/90 text-primary px-8 py-4 shadow-glow hover:scale-105 transition-all duration-200 ease-in-out active:scale-95 font-semibold text-lg"
            >
              Получить консультацию
            </Button>
          </div>

          {/* Right side - Promotion Banner */}
          <div className="flex-1 text-center md:text-right">
            <div className="bg-gradient-to-r from-primary-glow to-primary-dark text-white px-8 py-4 rounded-xl shadow-soft">
              <div className="flex items-center justify-center md:justify-end gap-3">
                <span className="text-2xl">🎉</span>
                <div>
                  <p className="text-xl font-bold">Скидка 10% до 5 октября</p>
                  <p className="text-sm opacity-90">на все виды альбомов</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KindergartenBanner;
