'use client'

import { Search, Sparkles, Building, Coins, Map, TrendingUp, Shield, CheckCircle, Star } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Hero() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/properties?q=${encodeURIComponent(searchQuery)}`)
  }

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        {/* Using a gradient background that simulates a modern office/building image */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800"></div>
        
        {/* Animated geometric shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60"></div>
      </div>

      {/* Floating Feature Cards */}
      <div className="absolute inset-0 z-0 hidden lg:block">
        {/* Top Right Card */}
        <div className="absolute top-24 right-12 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl animate-float">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <div className="text-white font-bold text-lg">2,500+</div>
              <div className="text-white/70 text-sm">Проверенных объектов</div>
            </div>
          </div>
        </div>

        {/* Left Middle Card */}
        <div className="absolute top-1/3 left-12 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl animate-float-delayed">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <div className="text-white font-bold text-lg">98%</div>
              <div className="text-white/70 text-sm">Успешных сделок</div>
            </div>
          </div>
        </div>

        {/* Bottom Right Card */}
        <div className="absolute bottom-32 right-24 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl animate-float">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            </div>
            <div>
              <div className="text-white font-bold text-lg">4.9/5</div>
              <div className="text-white/70 text-sm">Рейтинг платформы</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10 py-20">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
              <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
              <span className="text-white font-semibold text-sm">Маркетплейс №1 в Ташкенте</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-center mb-6 animate-slide-up">
            <div className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight">
              <span className="block text-white drop-shadow-2xl">
                Коммерческая
              </span>
              <span className="block bg-gradient-to-r from-primary-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                недвижимость
              </span>
              <span className="block text-white/90 text-4xl md:text-5xl lg:text-6xl mt-2">
                для вашего бизнеса
              </span>
            </div>
          </h1>
          
          {/* Subtitle */}
          <p className="text-center text-xl md:text-2xl lg:text-3xl mb-12 text-white/90 max-w-3xl mx-auto font-light leading-relaxed animate-fade-in-delayed drop-shadow-lg">
            Профессиональные объекты с проверенной информацией,<br className="hidden md:block" />
            фото и видео обзорами
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-8 animate-slide-up-delayed">
            <div className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 backdrop-blur-sm border border-white/20 transition-all hover:shadow-primary-500/30 hover:scale-[1.02] duration-300">
              <div className="flex-1 flex items-center px-4 py-1">
                <Search className="h-6 w-6 text-secondary-400 mr-3 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Поиск по району, названию или типу объекта..."
                  className="w-full py-3 text-secondary-900 text-lg outline-none placeholder-secondary-400 bg-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button 
                type="submit" 
                className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              >
                Найти
              </button>
            </div>
          </form>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-10 animate-fade-in-delayed">
            <div className="flex items-center gap-2 text-white/90">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-sm font-medium">100% Проверенные объекты</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <CheckCircle className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium">Бесплатный доступ</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium">15,000+ довольных клиентов</span>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap justify-center gap-3 animate-fade-in-delayed">
            <button
              onClick={() => router.push('/properties?dealType=rent')}
              className="group px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all font-medium backdrop-blur-md hover:-translate-y-1 hover:shadow-xl flex items-center gap-2 text-white"
            >
              <Building className="w-5 h-5 text-primary-300 group-hover:scale-110 transition-transform" />
              Аренда офиса
            </button>
            <button
              onClick={() => router.push('/properties?dealType=sale')}
              className="group px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all font-medium backdrop-blur-md hover:-translate-y-1 hover:shadow-xl flex items-center gap-2 text-white"
            >
              <Coins className="w-5 h-5 text-primary-300 group-hover:scale-110 transition-transform" />
              Продажа
            </button>
            <button
              onClick={() => router.push('/map')}
              className="group px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all font-medium backdrop-blur-md hover:-translate-y-1 hover:shadow-xl flex items-center gap-2 text-white"
            >
              <Map className="w-5 h-5 text-primary-300 group-hover:scale-110 transition-transform" />
              Показать на карте
            </button>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 6s ease-in-out infinite 2s;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
        .animate-fade-in-delayed {
          animation: fadeIn 1s ease-out 0.3s both;
        }
        .animate-slide-up {
          animation: slideUp 0.8s ease-out;
        }
        .animate-slide-up-delayed {
          animation: slideUp 1s ease-out 0.2s both;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  )
}
