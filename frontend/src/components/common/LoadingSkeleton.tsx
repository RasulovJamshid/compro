export function CardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="h-48 bg-secondary-200 rounded-t-2xl"></div>
      <div className="p-5 space-y-4">
        <div className="flex justify-between">
          <div className="h-3 bg-secondary-200 rounded w-1/3"></div>
          <div className="h-3 bg-secondary-200 rounded w-8"></div>
        </div>
        <div className="h-6 bg-secondary-200 rounded w-3/4"></div>
        <div className="space-y-2 pt-2">
          <div className="h-4 bg-secondary-200 rounded w-1/2"></div>
          <div className="flex justify-between pt-2">
            <div className="h-4 bg-secondary-200 rounded w-1/4"></div>
            <div className="h-5 bg-secondary-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function PropertyDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-secondary-200 rounded-2xl h-96 w-full"></div>
      
      <div className="space-y-4">
        <div className="h-8 bg-secondary-200 rounded w-3/4"></div>
        <div className="h-4 bg-secondary-200 rounded w-1/2"></div>
        
        <div className="grid grid-cols-2 gap-4 pt-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-secondary-200 rounded-xl"></div>
          ))}
        </div>
      </div>

      <div className="h-40 bg-secondary-200 rounded-xl"></div>
    </div>
  )
}

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-secondary-100 p-6 space-y-3">
          <div className="flex justify-between">
            <div className="h-5 bg-secondary-200 rounded w-1/3"></div>
            <div className="h-5 bg-secondary-200 rounded w-1/6"></div>
          </div>
          <div className="h-4 bg-secondary-200 rounded w-1/2"></div>
          <div className="flex gap-4 pt-2">
            <div className="h-4 bg-secondary-200 rounded w-1/4"></div>
            <div className="h-4 bg-secondary-200 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div className="min-h-[90vh] bg-secondary-100 animate-pulse flex items-center">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="h-20 bg-secondary-200 rounded-2xl w-3/4"></div>
          <div className="h-16 bg-secondary-200 rounded-2xl w-full"></div>
          <div className="h-12 bg-secondary-200 rounded-2xl w-2/3"></div>
        </div>
      </div>
    </div>
  )
}
