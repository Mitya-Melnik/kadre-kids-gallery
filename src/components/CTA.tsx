import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section id="cta" className="py-20 bg-gradient-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern opacity-20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Закажите презентацию наших тематических пакетов
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Сразу получите PDF-презентацию с примерами декораций и ценами. 
            Посмотрите, как мы можем сделать фотосессию незабываемой для ваших детей.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button variant="accent" size="xl" className="shadow-accent">
              Хочу подробности
            </Button>
            <Button variant="outline" size="xl" className="text-white border-white hover:bg-white hover:text-primary">
              Связаться с нами
            </Button>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-white mb-6">
              Почему стоит заказать презентацию?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-white/90">Примеры всех тематических декораций</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-white/90">Подробные цены на все услуги</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-white/90">Процесс организации съемки</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-white/90">Примеры готовых фотографий</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-white/80 mb-2">Готовы обсудить детали?</p>
            <p className="text-white text-xl font-semibold">
              Дмитрий: +7 995 600 2111
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;