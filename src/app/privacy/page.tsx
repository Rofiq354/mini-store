// src/app/privacy/page.tsx

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-slate-800">
      <h1 className="text-3xl font-bold mb-6">Kebijakan Privasi Geraiku</h1>
      <p className="mb-4 text-sm text-slate-500">
        Terakhir diperbarui: 19 Februari 2026
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          1. Informasi yang Kami Kumpulkan
        </h2>
        <p className="mb-2">
          Saat Anda menggunakan Geraiku, kami mengumpulkan informasi berikut:
        </p>
        <ul className="list-disc ml-6 space-y-2">
          <li>
            <strong>Informasi Akun:</strong> Nama, alamat email, dan foto profil
            yang Anda berikan saat login melalui Google atau pendaftaran manual.
          </li>
          <li>
            <strong>Informasi Transaksi:</strong> Data pesanan, alamat
            pengiriman, dan nomor telepon untuk keperluan logistik.
          </li>
          <li>
            <strong>Informasi Pembayaran:</strong> Semua transaksi diproses
            secara aman melalui Midtrans. Kami tidak menyimpan informasi kartu
            kredit atau detail perbankan Anda di server kami.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">2. Penggunaan Informasi</h2>
        <p>Kami menggunakan informasi Anda untuk:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Memproses dan mengirimkan pesanan Anda.</li>
          <li>Mengirimkan notifikasi status pesanan via email.</li>
          <li>Meningkatkan layanan dan keamanan website kami.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. Keamanan Data</h2>
        <p>
          Kami berkomitmen untuk melindungi data pribadi Anda. Kami menggunakan
          infrastruktur <strong>Supabase</strong> yang terenkripsi dan standar
          keamanan industri untuk mencegah akses tidak sah ke informasi Anda.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">4. Hak Pengguna</h2>
        <p>
          Anda memiliki hak untuk mengakses, memperbarui, atau meminta
          penghapusan data pribadi Anda dengan menghubungi tim dukungan kami
          atau melalui pengaturan akun.
        </p>
      </section>

      <footer className="mt-12 pt-6 border-t">
        <p className="text-sm text-slate-600">
          Jika ada pertanyaan mengenai Kebijakan Privasi ini, silakan hubungi
          kami di <strong>support@geraiku-mar.vercel.app</strong>
        </p>
      </footer>
    </div>
  );
}
