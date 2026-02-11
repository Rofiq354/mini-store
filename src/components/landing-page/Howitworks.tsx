import { UserPlus, Store, Package, TrendingUp } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Daftar Gratis",
    description:
      "Buat akun merchant dalam 2 menit. Tidak ada biaya pendaftaran atau biaya bulanan.",
    icon: UserPlus,
    color: "from-blue-500 to-cyan-500",
  },
  {
    number: "02",
    title: "Setup Gerai Digital",
    description:
      "Atur profil warung Anda, tambahkan logo, dan informasi kontak. Buat warung Anda terlihat profesional.",
    icon: Store,
    color: "from-purple-500 to-pink-500",
  },
  {
    number: "03",
    title: "Upload Produk",
    description:
      "Tambahkan produk dengan foto, harga, dan stok. Kelola inventory dengan mudah dari dashboard.",
    icon: Package,
    color: "from-orange-500 to-red-500",
  },
  {
    number: "04",
    title: "Mulai Jualan",
    description:
      "Produk Anda langsung muncul di marketplace. Terima pesanan dan pantau penjualan real-time.",
    icon: TrendingUp,
    color: "from-green-500 to-emerald-500",
  },
];

export default function HowItWorks() {
  return (
    <section id="cara-kerja" className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            Mudah & Cepat
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Cara Kerja GeraiKu
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Hanya 4 langkah sederhana untuk memulai bisnis digital Anda
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Connector Line (Desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-linear-to-r from-primary/30 to-transparent -translate-x-8 z-0" />
                )}

                {/* Card */}
                <div className="relative bg-card border rounded-2xl p-6 h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-2 z-10">
                  {/* Step Number */}
                  <div className="absolute -top-4 -right-4 h-12 w-12 rounded-xl bg-linear-to-br from-primary to-primary/70 text-primary-foreground font-black text-lg flex items-center justify-center shadow-lg">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div
                    className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br ${step.color} shadow-lg`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            Siap memulai perjalanan digital Anda?
          </p>
          <a
            href="/signup"
            className="inline-flex items-center gap-2 text-lg font-bold text-primary hover:underline"
          >
            Buka Gerai Sekarang - Gratis Selamanya
            <svg
              className="h-5 w-5 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
