import Card from "../../components/ui/Card";
import LazyImage from "../../components/LazyImage";

export default function AboutPage() {
  const stats = [
    { number: "50,000+", label: "Mutlu Müşteri" },
    { number: "100,000+", label: "Başarılı Teslimat" },
    { number: "5+", label: "Yıllık Deneyim" },
    { number: "24/7", label: "Müşteri Desteği" }
  ];

  const values = [
    {
      icon: (
        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: "Müşteri Odaklılık",
      description: "Müşterilerimizin memnuniyeti bizim önceliğimizdir. Her kararımızı müşteri deneyimini iyileştirmek için alırız."
    },
    {
      icon: (
        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Kalite",
      description: "Sadece en kaliteli ürünleri müşterilerimize sunarız. Kalite kontrol süreçlerimizle her ürünü titizlikle inceleriz."
    },
    {
      icon: (
        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "Güvenilirlik",
      description: "Müşterilerimizin güvenini kazanmak için şeffaf ve dürüst bir yaklaşım benimseriz. Verileriniz güvende."
    },
    {
      icon: (
        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "İnovasyon",
      description: "Teknolojinin gücünü kullanarak sürekli kendimizi geliştirir ve müşteri deneyimini iyileştiririz."
    }
  ];

  const team = [
    {
      name: "Ahmet Yılmaz",
      position: "Kurucu & CEO",
      image: "/team/ahmet.jpg",
      description: "10 yıllık e-ticaret deneyimi ile şirketimizi kurdu."
    },
    {
      name: "Fatma Demir",
      position: "CTO",
      image: "/team/fatma.jpg", 
      description: "Teknoloji alanında uzman, sürekli gelişim odaklı."
    },
    {
      name: "Mehmet Kaya",
      position: "Operasyon Müdürü",
      image: "/team/mehmet.jpg",
      description: "Lojistik ve operasyon süreçlerinde deneyimli."
    },
    {
      name: "Ayşe Özkan",
      position: "Müşteri Hizmetleri Müdürü",
      image: "/team/ayse.jpg",
      description: "Müşteri memnuniyeti konusunda uzman."
    }
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          CM Ticaret Hakkında
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          2020 yılından beri müşterilerimize en kaliteli ürünleri en uygun fiyatlarla sunarak, 
          güvenilir ve hızlı teslimat hizmeti veriyoruz.
        </p>
      </section>

      {/* Stats Section */}
      <section className="mb-16">
        <Card className="p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Mission & Vision */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Misyonumuz</h2>
            <p className="text-gray-600 leading-relaxed">
              Müşterilerimize en iyi alışveriş deneyimini sunarak, kaliteli ürünleri 
              uygun fiyatlarla ve hızlı teslimat ile ulaştırmak. Teknoloji ve 
              müşteri odaklı yaklaşımımızla e-ticaret sektöründe öncü olmak.
            </p>
          </Card>

          <Card className="p-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Vizyonumuz</h2>
            <p className="text-gray-600 leading-relaxed">
              Türkiye&apos;nin en güvenilir ve tercih edilen e-ticaret platformu olmak. 
              Müşteri memnuniyetini her şeyin üstünde tutarak, sürekli gelişim 
              ve inovasyon ile sektörde lider konumda olmak.
            </p>
          </Card>
        </div>
      </section>

      {/* Values Section */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Değerlerimiz</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            İş yapış şeklimizi ve müşteri ilişkilerimizi şekillendiren temel değerlerimiz
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <Card key={index} className="p-6 text-center">
              <div className="flex justify-center mb-4">
                {value.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {value.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {value.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ekibimiz</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Deneyimli ve uzman ekibimizle size en iyi hizmeti sunuyoruz
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <Card key={index} className="p-6 text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full overflow-hidden">
                <LazyImage
                  src={member.image}
                  alt={member.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {member.name}
              </h3>
              <p className="text-primary font-medium mb-3">
                {member.position}
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                {member.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <Card className="p-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Bizimle Çalışmak İster misiniz?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Yetenekli ve tutkulu insanlar arıyoruz. Kariyerinizi bizimle geliştirin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              İletişime Geç
            </a>
            <a
              href="mailto:ik@cmticaret.com"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              CV Gönder
            </a>
          </div>
        </Card>
      </section>
    </main>
  );
}
