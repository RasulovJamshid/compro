import Hero from '@/components/home/Hero'
import Features from '@/components/home/Features'
import Categories from '@/components/home/Categories'
import Stats from '@/components/home/Stats'
import HowItWorks from '@/components/home/HowItWorks'
import Testimonials from '@/components/home/Testimonials'
import CTA from '@/components/home/CTA'
import PropertyList from '@/components/properties/PropertyList'

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Categories />
      <Features />
      
      {/* Featured Properties */}
      <section className="py-24 bg-gradient-to-b from-white to-secondary-50">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary-100 border border-primary-200">
              <span className="text-sm font-medium text-primary-700">Рекомендуем</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-secondary-900">
              Новые объекты
            </h2>
            <p className="text-lg text-secondary-500 max-w-2xl mx-auto">
              Свежие предложения коммерческой недвижимости, добавленные за последние 7 дней
            </p>
          </div>
          <PropertyList />
        </div>
      </section>

      <HowItWorks />
      <Testimonials />
      <CTA />
    </>
  )
}
