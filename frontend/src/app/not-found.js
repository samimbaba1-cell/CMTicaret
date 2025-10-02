import Link from "next/link";

export default function NotFound() {
  return (
    <main className="max-w-3xl mx-auto p-10 text-center">
      <h1 className="text-3xl font-semibold mb-2">Sayfa bulunamadı</h1>
      <p className="text-gray-600">Aradığınız sayfa taşınmış veya hiç var olmamış olabilir.</p>
      <Link href="/" className="inline-block mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
        Anasayfaya dön
      </Link>
    </main>
  );
}
