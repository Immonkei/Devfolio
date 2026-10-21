"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { ProjectImage } from "@/lib/project-images";

interface ProjectImageGalleryProps {
  images: ProjectImage[];
  projectTitle: string;
}

export function ProjectImageGallery({ images, projectTitle }: ProjectImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  const safeImages = images && images.length > 0
    ? images
    : [{ url: "/projects/default-project.svg", alt: `${projectTitle} Blueprint`, isCover: true }];

  const currentImage = safeImages[activeIndex] || safeImages[0];
  const hasMultiple = safeImages.length > 1;

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  }, [safeImages.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  }, [safeImages.length]);

  const openLightboxAtIndex = (idx: number) => {
    setActiveIndex(idx);
    setIsZoomed(false);
    setIsLightboxOpen(true);
  };

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
    setIsZoomed(false);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLightboxOpen) {
        if (e.key === "Escape") {
          closeLightbox();
        } else if (e.key === "ArrowLeft") {
          handlePrev();
        } else if (e.key === "ArrowRight") {
          handleNext();
        }
      } else if (hasMultiple) {
        if (e.key === "ArrowLeft") {
          handlePrev();
        } else if (e.key === "ArrowRight") {
          handleNext();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, hasMultiple, handlePrev, handleNext, closeLightbox]);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (thumbnailsRef.current) {
      const activeBtn = thumbnailsRef.current.children[activeIndex] as HTMLElement | undefined;
      if (activeBtn && typeof activeBtn.scrollIntoView === "function") {
        activeBtn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  }, [activeIndex]);

  return (
    <div className="space-y-3">
      {/* Main Visual Showcase Frame (Single Slide Viewer) */}
      <div className="group relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border/80 bg-secondary/20 shadow-2xl shadow-primary/5 transition-all">
        {/* Active Image */}
        <Image
          key={currentImage.url}
          src={currentImage.url}
          alt={currentImage.alt}
          fill
          priority={activeIndex === 0}
          sizes="(max-width: 1024px) 100vw, 896px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.01] cursor-zoom-in"
          onClick={() => openLightboxAtIndex(activeIndex)}
        />

        {/* Subtle Gradient Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 opacity-70" />

        {/* Top Badges on Slide */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-auto">
          <div className="flex items-center gap-2">
            {currentImage.isCover && (
              <span className="rounded-md bg-emerald-500/90 backdrop-blur-xs px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
                Cover
              </span>
            )}
            {hasMultiple && (
              <span className="rounded-md bg-black/60 backdrop-blur-xs px-2.5 py-1 font-mono text-[11px] font-medium text-white/90 border border-white/10 shadow-xs">
                {activeIndex + 1} / {safeImages.length}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => openLightboxAtIndex(activeIndex)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-black/60 backdrop-blur-xs px-3 py-1.5 font-mono text-xs text-white hover:bg-black/80 hover:text-primary transition-all border border-white/10 shadow-lg cursor-pointer"
              title="Expand to Fullscreen Lightbox"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Enlarge</span>
            </button>
          </div>
        </div>

        {/* Bottom Caption Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <div className="truncate rounded-md bg-black/65 backdrop-blur-xs px-3 py-1 font-mono text-xs text-white/95 border border-white/10 max-w-[85%]">
            <span className="truncate">{currentImage.alt}</span>
          </div>
        </div>

        {/* Navigation Arrows for Multiple Slides */}
        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 backdrop-blur-xs p-2 text-white hover:bg-black/90 hover:scale-110 hover:text-primary transition-all border border-white/10 shadow-xl cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 backdrop-blur-xs p-2 text-white hover:bg-black/90 hover:scale-110 hover:text-primary transition-all border border-white/10 shadow-xl cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
      </div>

      {/* Filmstrip / Thumbnails Bar */}
      {hasMultiple && (
        <div
          ref={thumbnailsRef}
          className="flex items-center gap-2.5 overflow-x-auto py-1 px-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
        >
          {safeImages.map((img, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`group relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border transition-all cursor-pointer ${
                  isActive
                    ? "border-primary ring-2 ring-primary/60 ring-offset-2 ring-offset-background scale-[1.03] shadow-md"
                    : "border-border/70 opacity-60 hover:opacity-100 hover:border-primary/50"
                }`}
                title={img.alt}
              >
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  sizes="96px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {img.isCover && (
                  <span className="absolute top-1 left-1 rounded bg-emerald-500/90 px-1 py-0.2 font-mono text-[9px] font-bold text-white shadow-xs">
                    Cover
                  </span>
                )}
                <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 py-0.2 font-mono text-[9px] text-white">
                  {idx + 1}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex flex-col justify-between bg-black/92 backdrop-blur-md animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          {/* Lightbox Top Header */}
          <div
            className="flex items-center justify-between border-b border-white/10 bg-black/40 px-4 py-3 font-mono text-xs text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 truncate">
              <span className="font-bold text-primary">{projectTitle}</span>
              <span className="text-white/40">•</span>
              <span className="text-white/80 truncate">{currentImage.alt}</span>
              {hasMultiple && (
                <span className="rounded bg-white/10 px-2 py-0.5 text-[11px] text-white/90">
                  {activeIndex + 1} / {safeImages.length}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsZoomed((prev) => !prev)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/10 px-2.5 py-1.5 text-xs text-white hover:bg-white/20 transition-colors cursor-pointer"
                title={isZoomed ? "Reset Zoom" : "Zoom to 100%"}
              >
                {isZoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
                <span className="hidden sm:inline">{isZoomed ? "Fit" : "100%"}</span>
              </button>
              <button
                type="button"
                onClick={closeLightbox}
                className="rounded-lg border border-white/10 bg-white/10 p-1.5 text-white hover:bg-red-500/80 transition-colors cursor-pointer"
                title="Close Lightbox (Esc)"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Lightbox Active Image Body */}
          <div
            className="relative flex-1 overflow-auto p-4 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev Arrow */}
            {hasMultiple && (
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/10 backdrop-blur-sm p-3 text-white hover:bg-white/25 hover:scale-110 transition-all border border-white/10 cursor-pointer shadow-2xl"
                aria-label="Previous screenshot"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {/* Next Arrow */}
            {hasMultiple && (
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/10 backdrop-blur-sm p-3 text-white hover:bg-white/25 hover:scale-110 transition-all border border-white/10 cursor-pointer shadow-2xl"
                aria-label="Next screenshot"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}

            {/* Main Lightbox Image */}
            <div
              className={`relative transition-all duration-300 flex items-center justify-center ${
                isZoomed
                  ? "min-w-[140vw] min-h-[140vh] cursor-zoom-out p-8"
                  : "max-h-[82vh] max-w-[92vw] aspect-auto cursor-zoom-in"
              }`}
              onClick={() => setIsZoomed((prev) => !prev)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentImage.url}
                alt={currentImage.alt}
                className="max-h-[82vh] max-w-[92vw] object-contain rounded-xl shadow-2xl ring-1 ring-white/10 select-none"
              />
            </div>
          </div>

          {/* Lightbox Bottom Filmstrip */}
          {hasMultiple && (
            <div
              className="border-t border-white/10 bg-black/60 px-4 py-2.5 flex items-center justify-center gap-2 overflow-x-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {safeImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setActiveIndex(idx);
                    setIsZoomed(false);
                  }}
                  className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-md border transition-all cursor-pointer ${
                    idx === activeIndex
                      ? "border-primary ring-2 ring-primary/80 scale-105"
                      : "border-white/20 opacity-50 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
