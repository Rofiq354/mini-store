// src/app/terms/page.tsx

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-slate-800">
      <h1 className="text-3xl font-bold mb-6">Syarat dan Ketentuan Geraiku</h1>
      <p className="mb-4 text-sm text-slate-500">
        Terakhir diperbarui: 19 Februari 2026
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. Penerimaan Ketentuan</h2>
        <p>
          Dengan mengakses dan berbelanja di Geraiku, Anda dianggap telah
          membaca, memahami, dan menyetujui semua syarat dan ketentuan yang
          berlaku di bawah ini.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          2. Transaksi dan Pembayaran
        </h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>Semua transaksi dilakukan secara mata uang Rupiah (IDR).</li>
          <li>
            Pembayaran wajib dilakukan melalui metode yang tersedia (Midtrans).
            Pesanan akan diproses hanya setelah pembayaran terkonfirmasi.
          </li>
          <li>
            Kesalahan input data saat pembayaran di luar tanggung jawab Geraiku.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. Pengiriman Barang</h2>
        <p>
          Kami menggunakan jasa pihak ketiga untuk pengiriman. Estimasi waktu
          pengiriman tergantung pada lokasi pembeli dan penyedia jasa kurir.
          Geraiku tidak bertanggung jawab atas keterlambatan yang disebabkan
          oleh pihak kurir.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          4. Pembatalan dan Pengembalian
        </h2>
        <p>
          Pesanan yang sudah dibayar tidak dapat dibatalkan secara sepihak
          kecuali stok barang tidak tersedia. Pengembalian barang (retur) hanya
          diterima jika barang yang diterima cacat atau tidak sesuai pesanan,
          dibuktikan dengan video unboxing.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">5. Perubahan Layanan</h2>
        <p>
          Geraiku berhak mengubah harga, deskripsi produk, atau menghentikan
          layanan kapan saja tanpa pemberitahuan sebelumnya.
        </p>
      </section>

      <footer className="mt-12 pt-6 border-t text-sm text-slate-600">
        <p>
          Pertanyaan lebih lanjut mengenai syarat dan ketentuan ini dapat
          dikirimkan ke <strong>support@geraiku-mar.vercel.app</strong>
        </p>
      </footer>
    </div>
  );
}
