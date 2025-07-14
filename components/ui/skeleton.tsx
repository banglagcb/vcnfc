import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

// Profile specific skeleton components
export function ProfileHeaderSkeleton() {
  return (
    <div className="relative mb-8">
      {/* Cover Image Skeleton */}
      <Skeleton className="h-48 w-full rounded-lg" />

      {/* Profile Avatar Skeleton */}
      <div className="absolute -bottom-16 left-8">
        <Skeleton className="w-30 h-30 rounded-full border-4 border-white" />
      </div>

      {/* Profile Info Skeleton */}
      <div className="pt-20 px-8 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="flex items-center space-x-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <div className="space-y-3">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </div>
  );
}

export function ProfileTabsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Tabs Navigation Skeleton */}
      <div className="flex space-x-1 rounded-lg bg-muted p-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-md" />
        ))}
      </div>

      {/* Tab Content Skeleton */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ProfileCardSkeleton />
          <ProfileCardSkeleton />
        </div>
        <div className="space-y-6">
          <ProfileCardSkeleton />
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-8" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SocialLinkSkeleton() {
  return (
    <div className="flex items-center space-x-3 p-4 border rounded-lg">
      <Skeleton className="w-10 h-10 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="w-8 h-8 rounded" />
    </div>
  );
}

export function ContactFieldSkeleton() {
  return (
    <div className="flex items-center space-x-2">
      <Skeleton className="w-1/3 h-10" />
      <Skeleton className="flex-1 h-10" />
      <Skeleton className="w-8 h-8" />
    </div>
  );
}

export function SkillSkeleton() {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center space-x-3">
        <Skeleton className="w-8 h-8 rounded-full" />
        <div>
          <Skeleton className="h-4 w-24 mb-1" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="w-16 h-6 rounded-full" />
    </div>
  );
}

export function PortfolioItemSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <Skeleton className="w-full h-48" />
      <div className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-3" />
        <div className="flex flex-wrap gap-2 mb-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-16 rounded-full" />
          ))}
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>
    </div>
  );
}

export function TestimonialSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-start space-x-4 mb-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-5 w-32 mb-1" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex space-x-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="w-4 h-4" />
          ))}
        </div>
      </div>
      <Skeleton className="h-16 w-full" />
    </div>
  );
}

export function AnalyticsCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="w-8 h-8 rounded" />
      </div>
      <Skeleton className="h-8 w-16 mb-2" />
      <div className="flex items-center space-x-2">
        <Skeleton className="w-4 h-4" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

export { Skeleton };
