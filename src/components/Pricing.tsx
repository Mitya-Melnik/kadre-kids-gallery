const Pricing = () => {
  const prices = [
    {
      title: "Электронные фото",
      price: "399 ₽",
      note: "При заказе от 1890₽ — в подарок!",
      popular: true
    },
    {
      title: "Фото 10×15",
      price: "410 ₽",
      note: "Классический размер для альбома"
    },
    {
      title: "Фото 15×21", 
      price: "479 ₽",
      note: "Увеличенный формат"
    },
    {
      title: "Фото 21×30",
      price: "600 ₽", 
      note: "Для рамки на стол"
    },
    {
      title: "Фото 30×45",
      price: "900 ₽",
      note: "Большой формат для стены"
    },
    {
      title: "Магнит 7×10",
      price: "500 ₽",
      note: "На холодильник"
    },
    {
      title: "Магнит 10×15",
      price: "550 ₽", 
      note: "Увеличенный магнит"
    },
    {
      title: "Холст 20×30",
      price: "2900 ₽",
      note: "Художественная печать"
    },
    {
      title: "Холст 30×45",
      price: "4500 ₽",
      note: "Большой художественный холст"
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Стоимость фотографий
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Прозрачные цены без скрытых платежей. Платите только за понравившиеся фотографии
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {prices.map((item, index) => (
            <div
              key={index}
              className={`relative bg-gradient-card p-6 rounded-xl shadow-soft hover:shadow-glow transition-all duration-300 hover:-translate-y-1 ${
                item.popular ? 'ring-2 ring-primary' : ''
              }`}
            >
              {item.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-accent text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Популярное
                  </span>
                </div>
              )}
              
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <div className="text-3xl font-bold text-primary mb-2">
                  {item.price}
                </div>
                <p className="text-sm text-muted-foreground">
                  {item.note}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-accent-soft p-8 rounded-xl max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Специальное предложение
          </h3>
          <p className="text-lg text-muted-foreground mb-6">
            При заказе печатной продукции от 1890 рублей — электронные версии всех фотографий в подарок!
          </p>
          <div className="flex justify-center">
            <div className="bg-gradient-primary text-white px-6 py-3 rounded-lg font-semibold">
              Экономия до 399 ₽ на каждом фото
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;