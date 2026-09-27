import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/hiresphere.png";
import Footer from "../Footer";
import { getJobs } from "../../services/staticDataService";

const HomeScreen = () => {
  const navigate = useNavigate();
  const go = (path) => navigate(path);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await getJobs();
      if (data.success) {
        // Show first 6 jobs on homepage
        setJobs(data.jobs.slice(0, 6));
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Added min-h-screen and relative to contain the background
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col">

      {/* BACKGROUND LAYER 
          Applying the specific radial gradient from the "About" style we discussed.
      */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(circle at center, #2563eb 0%, #0f172a 100%)'
        }}
      ></div>

      {/* CONTENT CONTAINER
          Added relative and z-10 so your buttons and text sit ABOVE the background.
      */}
      <div className="relative z-10 w-full flex flex-col flex-grow">
        
        {/* HERO SECTION */}
        <section className="flex flex-col items-center justify-center min-h-[60vh] py-8 sm:py-12 md:py-16 px-4">
          {/* Logo */}
          <div className="mb-6 sm:mb-8">
            <div className="
              backdrop-blur-lg bg-white/10 
              p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl 
              shadow-2xl border border-white/20 
              max-w-xs sm:max-w-sm md:max-w-md
              hover:scale-105 transition-transform duration-500
            ">
              <img src={logo} alt="HireSphere" className="w-full object-contain" />
            </div>
          </div>

          {/* Hero Text */}
          <div className="text-center mb-8 sm:mb-12 max-w-4xl px-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-extrabold text-white mb-4 sm:mb-6 tracking-wide">
              Graduate ka na at wala ka pang trabaho?
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed mb-3 sm:mb-4">
              Tara dito sa <span className="text-blue-400 font-extrabold">HIRESPHERE!</span>
              Tutulungan ka naming magkatrabaho.
            </p>
            <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed">
              Malaki ang paniniwala ng HIRESPHERE na kinakailangan ang ibayong sipag at
              tiyaga upang maitaguyod ang mga layunin ng samahan. Hindi birong responsibilidad
              at trabaho ang kinakaharap ng HIRESPHERE, matugunan lamang ang mga serbisyong
              pangako nito sa mga mamamayan ng Taguig. Sinisikap ng samahan na matugunan ang
              bawat kahilingan ng mga nangangailangang mamamayan sa naturang lugar.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 mb-4">
            <button
              onClick={() => go("/job-listings")}
              className="group w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all transform duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              APPLY
            </button>
          </div>
        </section>

        {/* KEY FEATURES / SERVICES */}
        <section className="py-6 sm:py-8 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-white mb-6 sm:mb-8 tracking-wide">
              WHAT WE OFFER
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {/* Feature 1 */}
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl sm:rounded-2xl p-5 sm:p-6 text-center shadow-xl hover:scale-105 transition-transform duration-300">
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📋</div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 uppercase tracking-wide">Job Applications</h3>
                <p className="text-white/80 text-xs sm:text-sm">
                  Apply for opportunities and join our team of dedicated professionals
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl sm:rounded-2xl p-5 sm:p-6 text-center shadow-xl hover:scale-105 transition-transform duration-300">
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🤝</div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 uppercase tracking-wide">Community Programs</h3>
                <p className="text-white/80 text-xs sm:text-sm">
                  Participate in our various community empowerment and development programs
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl sm:rounded-2xl p-5 sm:p-6 text-center shadow-xl hover:scale-105 transition-transform duration-300">
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">💼</div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 uppercase tracking-wide">Livelihood Projects</h3>
                <p className="text-white/80 text-xs sm:text-sm">
                  Access hands-on training and livelihood opportunities for sustainable income
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <Footer />

      </div>
    </div>
  );
};

export default HomeScreen;

