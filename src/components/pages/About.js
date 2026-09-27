import React from "react";
import { useNavigate } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, CardBody, Typography, List, Button } from "@material-tailwind/react";
import aceLogo from "../../assets/hiresphere.png";
import Footer from "../Footer";

export default function MissionVisionPanel() {
  const navigate = useNavigate(); 

  return (
    // ROOT CONTAINER: Added relative to hold the background
    <div className="min-h-screen w-full relative flex flex-col">
      
      {/* BACKGROUND LAYER 
          Applying the specific radial gradient:
          Center: #2563eb (Lighter Green)
          Edges: #0f172a (Darker Green)
      */}
      <div 
        className="absolute inset-0 z-0 fixed" 
        style={{
          background: 'radial-gradient(circle at center, #2563eb 0%, #0f172a 100%)',
          height: '100%', // Ensures it covers full height even when scrolling
          width: '100%'
        }}
      ></div>

      {/* CONTENT WRAPPER: relative and z-10 to sit ON TOP of the background */}
      <div className="relative z-10 flex flex-col flex-grow w-full">

        

        {/* MAIN CONTENT */}
        <main className="flex-1 flex justify-center items-center p-4 sm:p-6 md:p-12">
          
          {/* LANDSCAPE LAYOUT GRID */}
          <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">

              {/* LEFT COLUMN: Logo + Mission + Vision */}
              <div className="lg:col-span-1 flex flex-col gap-4 sm:gap-6">
                  
                  {/* Logo Card - CHANGED TO WHITE GLASS */}
                  <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 flex justify-center items-center shadow-xl">
                       <img src={aceLogo} alt="HireSphere Logo" className="h-24 sm:h-32 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform duration-500" />
                  </div>

                  {/* MISYON CARD - CHANGED TO WHITE GLASS */}
                  <Card className="flex-1 bg-white/10 backdrop-blur-md border border-white/10 shadow-xl rounded-xl sm:rounded-2xl overflow-hidden hover:border-blue-400/50 transition-colors duration-300">
                      <CardBody className="p-4 sm:p-6">
                          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 border-b border-white/10 pb-2">
                               <div className="w-1 h-6 sm:h-8 bg-blue-400 rounded-full"></div>
                               <Typography variant="h4" className="font-bold uppercase tracking-wider text-white text-base sm:text-lg md:text-xl">
                                  MISYON
                               </Typography>
                          </div>
                          <List className="text-left space-y-3 sm:space-y-4 text-gray-200 font-normal text-sm sm:text-base">
                              <div className="flex gap-2 sm:gap-3">
                                  <span className="text-blue-400 mt-1 flex-shrink-0">•</span>
                                  <p>Magbigay ng madaling paraan para sa mga naghahanap ng trabaho na matuklasan at ma-access ang mga angkop na oportunidad sa employment.</p>
                              </div>
                              <div className="flex gap-2 sm:gap-3">
                                  <span className="text-blue-400 mt-1 flex-shrink-0">•</span>
                                  <p>Mapaayos at mapadali ang proseso ng paghahanap, pag-aapply, at pagsusuri ng mga aplikante gamit ang teknolohiya.</p>
                              </div>
                              <div className="flex gap-2 sm:gap-3">
                                  <span className="text-blue-400 mt-1 flex-shrink-0">•</span>
                                  <p>Makatulong sa mga employer na makahanap ng mga kwalipikadong aplikante sa pamamagitan ng isang organisado at maaasahang recruitment platform.</p>
                              </div>
                          </List>
                      </CardBody>
                  </Card>

                  {/* BISYON CARD - CHANGED TO WHITE GLASS */}
                  <Card className="flex-1 bg-white/10 backdrop-blur-md border border-white/10 shadow-xl rounded-xl sm:rounded-2xl overflow-hidden hover:border-blue-400/50 transition-colors duration-300">
                      <CardBody className="p-4 sm:p-6">
                           <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 border-b border-white/10 pb-2">
                               <div className="w-1 h-6 sm:h-8 bg-blue-400 rounded-full"></div>
                               <Typography variant="h4" className="font-bold uppercase tracking-wider text-white text-base sm:text-lg md:text-xl">
                                  BISYON
                               </Typography>
                          </div>
                          <List className="text-left space-y-3 sm:space-y-4 text-gray-200 font-normal text-sm sm:text-base">
                              <div className="flex gap-2 sm:gap-3">
                                  <span className="text-blue-400 mt-1 flex-shrink-0">•</span>
                                  <p>Maging isang maaasahang digital platform na nag-uugnay sa mga job seeker at employer tungo sa mas maraming oportunidad sa trabaho.</p>
                              </div>
                              <div className="flex gap-2 sm:gap-3">
                                  <span className="text-blue-400 mt-1 flex-shrink-0">•</span>
                                  <p>Maging bahagi ng pagbuo ng isang mas accessible at mahusay na employment process para sa mga mamamayan ng Taguig.</p>
                              </div>
                              <div className="flex gap-2 sm:gap-3">
                                  <span className="text-blue-400 mt-1 flex-shrink-0">•</span>
                                  <p>Makalikha ng mas mabilis, organisado, at transparent na paraan ng recruitment na kapaki-pakinabang para sa parehong aplikante at employer.</p>
                              </div>
                          </List>
                      </CardBody>
                  </Card>
              </div>

              {/* RIGHT COLUMN: History - CHANGED TO WHITE GLASS */}
              <div className="lg:col-span-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col">
                  
                  {/* Background Watermark */}
                  <div
                      className="absolute -right-10 sm:-right-20 -bottom-10 sm:-bottom-20 opacity-10 pointer-events-none hidden md:block"
                  >
                      <img src={aceLogo} alt="Watermark" className="h-[300px] sm:h-[400px] md:h-[500px] w-[300px] sm:w-[400px] md:w-[500px] grayscale" />
                  </div>

                  <div className="relative z-10">
                      <Typography variant="h3" className="font-extrabold uppercase text-left tracking-wide text-white mb-4 sm:mb-6 md:mb-8 border-l-4 border-blue-400 pl-3 sm:pl-4 text-lg sm:text-xl md:text-2xl">
                          KASAYSAYAN NG <span className="text-blue-400">HIRESPHERE</span>
                      </Typography>

                      <div className="text-white/90 leading-relaxed text-justify space-y-4 sm:space-y-6 text-sm sm:text-base md:text-lg">
                          <p>
                              Ang <strong className="text-blue-400">HireSphere</strong> ay isang web-based job portal na binuo upang mapadali ang proseso ng paghahanap at pag-aapply ng trabaho para sa mga job seeker, gayundin ang paghahanap ng mga kwalipikadong aplikante para sa mga employer. Nabuo ang konsepto ng HireSphere mula sa pangangailangang magkaroon ng mas organisado, mabilis, at accessible na paraan ng pag-uugnay sa mga naghahanap ng trabaho at mga kumpanyang may bakanteng posisyon.
                          </p>
                          <p>
                              Sa pamamagitan ng HireSphere, maaaring gumawa ng account ang mga aplikante, maghanap ng mga available na trabaho, tingnan ang mga detalye ng bawat job posting, at magsumite ng kanilang aplikasyon at kinakailangang dokumento. Para naman sa mga employer at administrator, nagbibigay ang system ng mga tool para sa pag-post at pamamahala ng job vacancies, pag-review ng mga aplikante, at pagsubaybay sa status ng bawat application.
                          </p>
                          <p>
                              Habang patuloy na umuunlad ang teknolohiya, idinisenyo ang HireSphere upang maging mas simple at sistematiko ang recruitment process. Layunin nitong mabawasan ang oras at effort na kinakailangan sa paghahanap at pagsusuri ng mga aplikante sa pamamagitan ng isang centralized online platform.
                          </p>
                          <p>
                              Sa kasalukuyan, ang HireSphere ay nagsisilbing digital platform na nag-uugnay sa mga job seeker at employer sa iisang sistema. Sa pamamagitan ng mga feature nito para sa job searching, application management, at applicant evaluation, layunin ng HireSphere na gawing mas maayos, accessible, at efficient ang proseso ng paghahanap at pagkuha ng trabaho.
                          </p>
                      </div>
                  </div>
              </div>

          </div>
        </main>

        {/* FOOTER */}
        <Footer />
      </div>
    </div>
  );
}

