"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { motion } from "framer-motion";

export default function PreviewNewCardsPage() {
  const [selectedStyle, setSelectedStyle] = useState<
    "modern" | "minimal" | "playful"
  >("playful");

  const examples = [
    {
      id: "rainy",
      pl: "Deszczowo",
      en: "Rainy",
      old: "/comparison_test/old/Rainy.webp",
      new: "/comparison_test/new/Rainy.webp",
    },
    {
      id: "doctor",
      pl: "Lekarz",
      en: "Doctor",
      old: "/comparison_test/old/Doctor.webp",
      new: "/comparison_test/new/Doctor.webp",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 p-6 sm:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <header className="text-center space-y-4">
          <Chip className="font-bold" color="primary" variant="flat">
            Nowy Kierunek Wizualny 🎨
          </Chip>
          <h1 className="text-4xl sm:text-6xl font-black text-neutral-900 tracking-tight uppercase">
            Plastelinowy Styl & <span className="text-primary">Białe Tło</span>
          </h1>
          <p className="text-neutral-500 text-lg max-w-2xl mx-auto">
            Porównanie nowej estetyki z &quot;plastelinowymi ludźmi&quot; na
            czystym, białym tle w zestawieniu z poprzednią wersją.
          </p>
        </header>

        {/* Comparison Section */}
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-2xl font-bold uppercase tracking-widest text-neutral-400">
              Bezpośrednie Porównanie
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {examples.map((ex) => (
              <div key={ex.id} className="space-y-4">
                <div className="flex justify-between items-end px-2">
                  <span className="text-2xl font-black uppercase text-neutral-800">
                    {ex.pl}
                  </span>
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                    ({ex.en})
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {/* OLD CARD */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-center uppercase tracking-widest text-neutral-400">
                      Stary Styl
                    </p>
                    <div className="aspect-square rounded-3xl overflow-hidden border-2 border-dashed border-neutral-200 bg-neutral-100 flex items-center justify-center grayscale opacity-60 relative">
                      <Image
                        fill
                        alt="Old version"
                        className="object-cover"
                        src={ex.old}
                      />
                    </div>
                  </div>
                  {/* NEW CARD */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-center uppercase tracking-widest text-primary">
                      Nowy Styl (CLAY)
                    </p>
                    <div className="aspect-square rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-white flex items-center justify-center relative">
                      <Image
                        fill
                        alt="New version"
                        className="object-contain p-4"
                        src={ex.new}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stages Exploration */}
        <section className="space-y-10">
          <div className="flex flex-col sm:flex-row items-center justify-between border-b pb-4 gap-4">
            <h2 className="text-2xl font-bold uppercase tracking-widest text-neutral-400">
              Wariacje dla Etapów
            </h2>
            <div className="flex gap-2">
              <Button
                className="font-bold"
                color={selectedStyle === "minimal" ? "primary" : "default"}
                size="sm"
                variant={selectedStyle === "minimal" ? "solid" : "flat"}
                onClick={() => setSelectedStyle("minimal")}
              >
                Minimal
              </Button>
              <Button
                className="font-bold"
                color={selectedStyle === "modern" ? "primary" : "default"}
                size="sm"
                variant={selectedStyle === "modern" ? "solid" : "flat"}
                onClick={() => setSelectedStyle("modern")}
              >
                Modern
              </Button>
              <Button
                className="font-bold"
                color={selectedStyle === "playful" ? "primary" : "default"}
                size="sm"
                variant={selectedStyle === "playful" ? "solid" : "flat"}
                onClick={() => setSelectedStyle("playful")}
              >
                Soft Clay
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* ETAP 1: FISZKI (Inspiracja) */}
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase">
                Etap 1: Fiszki
              </span>
              <motion.div layout>
                <Card
                  className={`overflow-hidden border-none ${
                    selectedStyle === "minimal"
                      ? "bg-white shadow-sm"
                      : selectedStyle === "modern"
                        ? "bg-neutral-800 text-white"
                        : "bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[3rem]"
                  }`}
                >
                  <CardBody className="p-8 flex flex-col items-center gap-6">
                    <div className="w-full aspect-square relative rounded-2xl overflow-hidden bg-white">
                      <Image
                        fill
                        alt="preview"
                        className="p-6 object-contain"
                        src={examples[1].new}
                      />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 italic">
                        Kliknij, aby usłyszeć
                      </p>
                      <h3 className="text-4xl font-black tracking-tighter uppercase">
                        {examples[1].en}
                      </h3>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            </div>

            {/* ETAP 2/3: DOPASOWYWANIE */}
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase">
                Etap 2: Dopasuj
              </span>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Card
                    key={i}
                    className={`p-2 border-none shadow-xl ${selectedStyle === "playful" ? "rounded-[1.5rem]" : ""}`}
                  >
                    <div className="aspect-square bg-white rounded-xl flex items-center justify-center p-2 relative">
                      <Image
                        fill
                        alt="preview"
                        className="object-contain"
                        src={i % 2 === 0 ? examples[0].new : examples[1].new}
                      />
                    </div>
                  </Card>
                ))}
              </div>
              <p className="text-sm text-neutral-500 font-medium text-center">
                Białe tło świetnie &quot;wycina&quot; postać, co ułatwia
                skupienie w grach.
              </p>
            </div>

            {/* ETAP 4: PISANIE */}
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-black uppercase">
                Etap 4: Pisanie
              </span>
              <Card
                className={`border-none shadow-2xl ${selectedStyle === "playful" ? "rounded-[2rem] bg-indigo-50/30" : "bg-white"}`}
              >
                <CardHeader className="justify-center pt-8">
                  <div className="w-32 h-32 relative bg-white rounded-3xl shadow-lg ring-8 ring-white">
                    <Image
                      fill
                      alt="preview"
                      className="p-4 object-contain"
                      src={examples[0].new}
                    />
                  </div>
                </CardHeader>
                <CardBody className="p-8 space-y-4">
                  <div className="text-center">
                    <h4 className="text-3xl font-black text-primary uppercase leading-tight">
                      {examples[0].pl}
                    </h4>
                  </div>
                  <div className="h-14 bg-white rounded-2xl border-2 border-neutral-100 flex items-center justify-center text-2xl font-black tracking-[0.5em] text-neutral-300">
                    _____
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer info */}
        <section className="bg-primary/5 rounded-[3rem] p-8 sm:p-16 text-center space-y-6">
          <h2 className="text-3xl font-black uppercase tracking-tight">
            Kolejne Kroki
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="text-4xl">🖼️</div>
              <p className="font-bold uppercase text-xs tracking-widest text-primary">
                Konwersja WebP
              </p>
              <p className="text-sm text-neutral-600">
                Przygotuj wszystkie pliki w formacie WebP dla szybkości
                ładowania.
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl">📏</div>
              <p className="font-bold uppercase text-xs tracking-widest text-primary">
                Standardy
              </p>
              <p className="text-sm text-neutral-600">
                Wymuś kwadratowe proporcje i marginesy (paddings) dla każdego
                zdjęcia.
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl">🚀</div>
              <p className="font-bold uppercase text-xs tracking-widest text-primary">
                Deployment
              </p>
              <p className="text-sm text-neutral-600">
                Podmień dotychczasowe zasoby w public/ na nowe wersje.
              </p>
            </div>
          </div>
          <div className="pt-8">
            <Button
              className="font-black uppercase tracking-widest px-12 h-16 rounded-2xl shadow-2xl"
              color="primary"
              size="lg"
            >
              Potwierdzam Wybór - Podmień Zdjęcia!
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
