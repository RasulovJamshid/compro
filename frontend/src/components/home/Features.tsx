import { CheckCircle, Camera, Video, MapPin } from 'lucide-react'

const features = [
  {
    icon: CheckCircle,
    title: 'Проверенные объекты',
    description: 'Все объекты проходят модерацию и проверку',
  },
  {
    icon: Camera,
    title: 'Профессиональная съёмка',
    description: 'Качественные фото от профессиональных фотографов',
  },
  {
    icon: Video,
    title: '360-туры и видео',
    description: 'Виртуальные туры и видеообзоры объектов',
  },
  {
    icon: MapPin,
    title: 'Точная локация',
    description: 'Интерактивная карта с точными адресами',
  },
]

export default function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-secondary-900">
            Почему выбирают нас
          </h2>
          <p className="text-lg text-secondary-500">
            Мы предоставляем лучшие инструменты для поиска и проверки коммерческой недвижимости
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="group p-8 rounded-2xl bg-secondary-50 hover:bg-white border border-transparent hover:border-secondary-100 hover:shadow-xl transition-all duration-300">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-xl shadow-sm mb-6 group-hover:scale-110 group-hover:bg-primary-50 transition-all duration-300">
                  <Icon className="h-7 w-7 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-secondary-900">{feature.title}</h3>
                <p className="text-secondary-500 leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
