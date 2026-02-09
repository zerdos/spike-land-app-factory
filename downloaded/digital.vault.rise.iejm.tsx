import { useState } from 'react';
import { Menu, X, Mail, Linkedin, Github, ChevronDown, ArrowForward } from 'lucide-react';

export default function SuleArnoldPortfolio() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const projects = [
    {
      title: "Digitális Banki Élmény",
      category: "FinTech",
      description: "Újratervezett mobil banki alkalmazás,  amely 45%-kal növelte a felhasználói elkötelezettséget",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop",
      tags: ["UX Kutatás", "Mobil Design", "Prototípus"]
    },
    {
      title: "E-kereskedelmi Platform Áttervezése",
      category: "Kereskedelem",
      description: "Továbbfejlesztett fizetési folyamat, amely 30%-kal csökkentette a kosárelhagyást",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop",
      tags: ["Felhasználói Tesztelés", "A/B Tesztelés", "Konverzió Optimalizálás"]
    },
    {
      title: "Egészségügyi Portál",
      category: "Egészségügy",
      description: "Betegközpontú design időpontfoglaláshoz és egészségügyi nyilvántartásokhoz",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop",
      tags: ["Akadálymentesítés", "Információs Architektúra", "Felhasználói Folyamatok"]
    },
    {
      title: "SaaS Irányítópult",
      category: "Vállalati",
      description: "Komplex adatvizualizáció egyszerűsítve vállalati felhasználók számára",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop",
      tags: ["Adatvizualizáció", "Vállalati UX", "Design Rendszerek"]
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navigation - Google Style */}
      <nav className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <span className="text-xl text-blue-500 font-normal">S</span>
                <span className="text-xl text-red-500 font-normal">u</span>
                <span className="text-xl text-yellow-500 font-normal">l</span>
                <span className="text-xl text-blue-500 font-normal">e</span>
                <span className="text-xl text-green-500 font-normal ml-1">A</span>
                <span className="text-xl text-red-500 font-normal">r</span>
                <span className="text-xl text-yellow-500 font-normal">n</span>
                <span className="text-xl text-blue-500 font-normal">o</span>
                <span className="text-xl text-green-500 font-normal">l</span>
                <span className="text-xl text-red-500 font-normal">d</span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex space-x-1">
                {[
                  { label: 'Kezdőlap', id: 'home' },
                  { label: 'Rólam', id: 'about' },
                  { label: 'Munkáim', id: 'work' },
                  { label: 'Folyamat', id: 'process' },
                  { label: 'Kapcsolat', id: 'contact' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      activeSection === item.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-1">
              {[
                { label: 'Kezdőlap', id: 'home' },
                { label: 'Rólam', id: 'about' },
                { label: 'Munkáim', id: 'work' },
                { label: 'Folyamat', id: 'process' },
                { label: 'Kapcsolat', id: 'contact' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - Google Style */}
      <section id="home" className="pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-blue-50 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">UX Tervező • Brighton, UK</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-light mb-6 text-gray-900 tracking-tight">
              Digitális élmények alkotása
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 font-light leading-relaxed max-w-3xl">
              Felhasználóközpontú digitális termékeket tervezek, amelyek valós problémákat oldanak meg és örömet okoznak a felhasználóknak.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollToSection('work')}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all shadow-md hover:shadow-lg font-medium"
              >
                Munkáim megtekintése
                <ArrowForward size={18} />
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
              >
                Kapcsolatfelvétel
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Google Style */}
      <section className="py-12 px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '8+', label: 'Év tapasztalat' },
              { number: '50+', label: 'Projekt' },
              { number: '30+', label: 'Elégedett ügyfél' },
              { number: '15+', label: 'Díj' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-light text-blue-600 mb-2">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section - Google Style */}
      <section id="about" className="py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-6 text-gray-900">Rólam</h2>
            <div className="w-12 h-1 bg-blue-600 mb-8"></div>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Több mint 8 éves tapasztalattal rendelkező UX tervező vagyok, aki intuitív digitális 
              élményeket alkot. Megközelítésem egyesíti a felhasználói kutatást, az adatvezérelt 
              betekintéseket és a kreatív problémamegoldást.
            </p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Brighton-ban élek, startup-okkal és bevált cégekkel dolgoztam különböző iparágakban, 
              beleértve a FinTech-et, az egészségügyet, az e-kereskedelmet és a SaaS-t.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-6">Készségek</h3>
              <div className="space-y-4">
                {[
                  'Felhasználói Kutatás & Tesztelés',
                  'Vázlatkészítés & Prototípusok',
                  'Információs Architektúra',
                  'Design Rendszerek',
                  'Interakciós Design',
                  'Akadálymentesítés'
                ].map((skill, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-6">Eszközök</h3>
              <div className="space-y-4">
                {[
                  'Figma',
                  'Sketch',
                  'Adobe Creative Suite',
                  'Miro & FigJam',
                  'Principle',
                  'InVision'
                ].map((tool, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    <span className="text-gray-700">{tool}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Work Section - Google Style */}
      <section id="work" className="py-24 px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-6 text-gray-900">Kiemelt munkák</h2>
            <div className="w-12 h-1 bg-red-600 mb-8"></div>
            <p className="text-lg text-gray-600">
              Projektek válogatása, amelyek bemutatják megközelítésemet a komplex felhasználói élmény kihívások megoldásában
            </p>
          </div>

          <div className="space-y-8">
            {projects.map((project, index) => (
              <div
                key={index}
                className="group bg-white rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="grid md:grid-cols-5 gap-0">
                  <div className="md:col-span-2 aspect-video md:aspect-auto overflow-hidden bg-gray-100">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="md:col-span-3 p-8 md:p-12 flex flex-col justify-center">
                    <div className="text-sm text-blue-600 font-medium mb-3">{project.category}</div>
                    <h3 className="text-2xl md:text-3xl font-light mb-4 text-gray-900">{project.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section - Google Style */}
      <section id="process" className="py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-6 text-gray-900">A folyamatom</h2>
            <div className="w-12 h-1 bg-yellow-600 mb-8"></div>
            <p className="text-lg text-gray-600">
              Emberközpontú megközelítés értékes digitális élmények létrehozásához
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                number: "01",
                title: "Kutatás",
                description: "A felhasználói igények, problémák és viselkedések megértése interjúk és adatelemzés révén",
                color: "blue"
              },
              {
                number: "02",
                title: "Meghatározás",
                description: "Az betekintések szintetizálása felhasználói perszonák, utazási térképek létrehozásához",
                color: "red"
              },
              {
                number: "03",
                title: "Tervezés",
                description: "Vázlatok, prototípusok és magas minőségű designok készítése",
                color: "yellow"
              },
              {
                number: "04",
                title: "Tesztelés",
                description: "Megoldások validálása felhasználói teszteléssel és iteráció a visszajelzések alapján",
                color: "green"
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className={`text-6xl font-light mb-4 text-${item.color}-600 opacity-20`}>
                  {item.number}
                </div>
                <h3 className="text-xl font-medium mb-3 text-gray-900">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section - Google Style */}
      <section id="contact" className="py-24 px-6 lg:px-8 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-6">Dolgozzunk együtt</h2>
          <p className="text-xl font-light mb-12 opacity-90">
            Mindig nyitott vagyok új projektek, kreatív ötletek megvitatására, vagy arra, hogy részese legyek a vízióidnak.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <a
              href="mailto:sule.arnold@example.com"
              className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-md hover:bg-gray-50 transition-colors font-medium shadow-lg"
            >
              <Mail size={20} />
              Írj nekem
            </a>
            <a
              href="#"
              className="flex items-center gap-2 px-6 py-3 border-2 border-white text-white rounded-md hover:bg-white hover:text-blue-600 transition-colors font-medium"
            >
              Önéletrajz megtekintése
            </a>
          </div>
          <div className="flex justify-center gap-6">
            <a href="#" className="text-white hover:opacity-80 transition-opacity">
              <Linkedin size={24} />
            </a>
            <a href="#" className="text-white hover:opacity-80 transition-opacity">
              <Github size={24} />
            </a>
            <a href="#" className="text-white hover:opacity-80 transition-opacity">
              <Mail size={24} />
            </a>
          </div>
        </div>
      </section>

      {/* Footer - Google Style */}
      <footer className="bg-white border-t border-gray-200 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <p>© 2026 Sule Arnold. Minden jog fenntartva.</p>
            <p className="mt-2 md:mt-0">Szeretettel tervezve Brighton-ban, UK</p>
          </div>
        </div>
      </footer>
    </div>
  );
}