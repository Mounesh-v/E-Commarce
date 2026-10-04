import React from "react";

export const SkeletonBlock = ({ className = "" }) => (
  <div className={`skeleton ${className}`} />
);

export const ProductCardSkeleton = () => (
  <div className="card overflow-hidden">
    <div className="aspect-square skeleton !rounded-none" />
    <div className="p-4 space-y-3">
      <SkeletonBlock className="h-4 w-1/3" />
      <SkeletonBlock className="h-5 w-2/3" />
      <SkeletonBlock className="h-3 w-full" />
      <SkeletonBlock className="h-6 w-1/2" />
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 4, className = "" }) => (
  <div
    className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
  >
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export const ProductDetailsSkeleton = () => (
  <div className="py-6 sm:py-8 lg:py-10">
    <SkeletonBlock className="h-4 w-24 mb-8" />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      <div className="space-y-4">
        <SkeletonBlock className="aspect-square w-full !rounded-3xl" />
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBlock key={i} className="aspect-square w-full" />
          ))}
        </div>
      </div>
      <div className="space-y-5">
        <SkeletonBlock className="h-4 w-28" />
        <SkeletonBlock className="h-9 w-3/4" />
        <SkeletonBlock className="h-7 w-32" />
        <div className="space-y-2">
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-2/3" />
        </div>
        <div className="flex gap-3 pt-2">
          <SkeletonBlock className="h-12 w-32" />
          <SkeletonBlock className="h-12 w-40" />
        </div>
        <div className="flex gap-4 pt-4 border-t border-sage-100">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <SkeletonBlock className="h-8 w-8 !rounded-xl" />
              <SkeletonBlock className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const OrderCardSkeleton = () => (
  <div className="card p-5 sm:p-6">
    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-sage-100">
      <div className="space-y-2">
        <SkeletonBlock className="h-3 w-24" />
        <SkeletonBlock className="h-4 w-32" />
      </div>
      <div className="flex items-center gap-4">
        <SkeletonBlock className="h-7 w-24 !rounded-lg" />
        <SkeletonBlock className="h-6 w-20" />
      </div>
    </div>
    <div className="divide-y divide-sage-50">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-3">
          <SkeletonBlock className="h-14 w-14 shrink-0 !rounded-xl" />
          <div className="flex-1 space-y-2">
            <SkeletonBlock className="h-4 w-2/3" />
            <SkeletonBlock className="h-3 w-16" />
          </div>
          <SkeletonBlock className="h-4 w-16" />
        </div>
      ))}
    </div>
  </div>
);

export const OrderListSkeleton = ({ count = 3 }) => (
  <div className="py-6 sm:py-8">
    <div className="mb-8 space-y-3">
      <SkeletonBlock className="h-9 w-44" />
      <SkeletonBlock className="h-4 w-72 max-w-full" />
    </div>
    <div className="space-y-5">
      {Array.from({ length: count }).map((_, i) => (
        <OrderCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="mx-auto max-w-6xl py-6 sm:py-8">
    <div className="mb-8 space-y-3">
      <SkeletonBlock className="h-3 w-24" />
      <SkeletonBlock className="h-9 w-56" />
      <SkeletonBlock className="h-4 w-80 max-w-full" />
    </div>
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <section className="card p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <SkeletonBlock className="h-24 w-24 shrink-0 !rounded-2xl" />
          <div className="min-w-0 space-y-3">
            <SkeletonBlock className="h-6 w-40" />
            <SkeletonBlock className="h-4 w-56 max-w-full" />
            <SkeletonBlock className="h-6 w-28 !rounded-lg" />
          </div>
        </div>
        <div className="mt-7 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <SkeletonBlock className="h-4 w-24" />
              <SkeletonBlock className="h-11 w-full" />
            </div>
          ))}
          <SkeletonBlock className="h-11 w-36" />
        </div>
      </section>
      <aside className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="card p-5 space-y-3">
              <SkeletonBlock className="h-10 w-10 !rounded-xl" />
              <SkeletonBlock className="h-7 w-16" />
              <SkeletonBlock className="h-4 w-20" />
            </div>
          ))}
        </div>
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <SkeletonBlock className="h-5 w-32" />
            <SkeletonBlock className="h-4 w-16" />
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <SkeletonBlock className="h-14 w-14 shrink-0 !rounded-xl" />
              <div className="flex-1 space-y-2">
                <SkeletonBlock className="h-4 w-2/3" />
                <SkeletonBlock className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  </div>
);

export const CartListSkeleton = ({ count = 3 }) => (
  <div className="py-6 sm:py-8">
    <SkeletonBlock className="h-9 w-56 mb-8" />
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1">
        <div className="card overflow-hidden divide-y divide-sage-100">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5">
              <SkeletonBlock className="w-28 h-28 shrink-0 !rounded-2xl" />
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <SkeletonBlock className="h-4 w-1/2" />
                  <SkeletonBlock className="h-3 w-2/3" />
                </div>
                <div className="flex items-center justify-between mt-3">
                  <SkeletonBlock className="h-6 w-20" />
                  <div className="flex gap-3">
                    <SkeletonBlock className="h-9 w-28 !rounded-lg" />
                    <SkeletonBlock className="h-9 w-9 !rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full lg:w-[380px]">
        <div className="card p-6 space-y-4">
          <SkeletonBlock className="h-5 w-36" />
          <div className="space-y-3">
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="h-4 w-full" />
          </div>
          <SkeletonBlock className="h-6 w-full" />
          <SkeletonBlock className="h-12 w-full" />
        </div>
      </div>
    </div>
  </div>
);

export const CollectionsSkeleton = ({ count = 2 }) => (
  <div className="py-6 sm:py-8">
    <div className="mb-8 space-y-3">
      <SkeletonBlock className="h-9 w-52" />
      <SkeletonBlock className="h-4 w-72 max-w-full" />
    </div>
    <div className="space-y-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <SkeletonBlock className="h-10 w-10 !rounded-xl" />
              <div className="space-y-2">
                <SkeletonBlock className="h-5 w-36" />
                <SkeletonBlock className="h-3 w-16" />
              </div>
            </div>
            <SkeletonBlock className="h-6 w-20" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="bg-cream-50 rounded-2xl p-3 space-y-2">
                <SkeletonBlock className="aspect-square w-full" />
                <SkeletonBlock className="h-3 w-3/4" />
                <SkeletonBlock className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const SearchDropdownSkeleton = ({ count = 3 }) => (
  <div className="absolute top-full mt-2 left-0 w-full bg-white shadow-elevated rounded-2xl z-[999] border border-sage-100 overflow-hidden">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="px-4 py-3 flex items-center gap-3">
        <SkeletonBlock className="w-10 h-10 shrink-0" />
        <div className="flex-1 space-y-2">
          <SkeletonBlock className="h-3.5 w-2/3" />
          <SkeletonBlock className="h-3 w-1/4" />
        </div>
      </div>
    ))}
  </div>
);
