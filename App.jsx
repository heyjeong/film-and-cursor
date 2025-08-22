import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProjectDetail from './components/ProjectDetail';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <main className="min-h-screen bg-zinc-900 text-zinc-100 antialiased relative">
            {/* LNB Menu */}
            <nav className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50">
              <ul className="space-y-4">
                <li>
                  <a 
                    href="#experience" 
                    className="block w-8 h-0.5 bg-zinc-600 hover:bg-zinc-400 transition-all duration-300 hover:w-12"
                    title="Experience"
                  ></a>
                </li>
                <li>
                  <a 
                    href="#works" 
                    className="block w-8 h-0.5 bg-zinc-600 hover:bg-zinc-400 transition-all duration-300 hover:w-12"
                    title="Works"
                  ></a>
                </li>
                <li>
                  <a 
                    href="#contact" 
                    className="block w-8 h-0.5 bg-zinc-600 hover:bg-zinc-400 transition-all duration-300 hover:w-12"
                    title="Contact"
                  ></a>
                </li>
              </ul>
            </nav>

            {/* Hero */}
            <section className="max-w-3xl mx-auto px-6 py-64">
              <h1 className="text-4xl font-medium">Heejung</h1>
              <p className="mt-4 text-lg text-zinc-300">
                10+ years of UX/UI design experience, taking products from 0→1 at startups and scaling them in corporate environments — with a focus on mobility, SaaS, and AI projects.
              </p>
              <a href="#works" className="inline-block mt-8 underline text-zinc-300 hover:text-zinc-100">
                View Work
              </a>
            </section>

                        {/* Works */}
            <section id="works" className="max-w-3xl mx-auto px-6 py-20">
              <h2 className="text-xl font-medium mb-6">Selected Works</h2>
              <div className="space-y-8">
                {/* Project 1 */}
                <a href="/project-01" className="block">
                  <article className="relative group">
                    <img
                      src="/0002.jpg"
                      alt="Brooklyn Confetti"
                      className="w-full"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                      <h3 className="text-white text-xl font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        in Miami beach
                      </h3>
                    </div>
                  </article>
                </a>

                {/* Project 2 */}
                <a href="/project-02" className="block">
                  <article>
                    <img
                      src="/images/project-02.jpg"
                      alt="Project 02"
                      className="w-full"
                    />
                    <div className="mt-4">
                      <h3 className="font-medium text-lg">Project 02</h3>
                    </div>
                  </article>
                </a>

                {/* Project 3 */}
                <a href="/project-03" className="block">
                  <article>
                    <img
                      src="/images/project-03.jpg"
                      alt="Project 03"
                      className="w-full"
                    />
                    <div className="mt-4">
                      <h3 className="font-medium text-lg">Project 03</h3>
                    </div>
                  </article>
                </a>

                {/* Project 4 */}
                <a href="/project-04" className="block">
                  <article>
                    <img
                      src="/images/project-04.jpg"
                      alt="Project 04"
                      className="w-full"
                    />
                    <div className="mt-4">
                      <h3 className="font-medium text-lg">Project 04</h3>
                    </div>
                  </article>
                </a>
              </div>
            </section>

            {/* Experience */}
            <section id="experience" className="max-w-3xl mx-auto px-6 py-10">
              <div className="bg-zinc-800/50 rounded-2xl p-8 border border-zinc-700/50">
                <h2 className="text-xl font-medium mb-6">Experience</h2>
                <ul className="space-y-3 text-zinc-300">
                  <li className="flex items-start">
                    <span className="text-zinc-400 mr-3">•</span>
                    <span><strong>2023–Present:</strong> Senior Product Designer, 42dot</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-zinc-400 mr-3">•</span>
                    <span><strong>2022–2023:</strong> Founding Designer, Ramper</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-zinc-400 mr-3">•</span>
                    <span><strong>2020–2023:</strong> UX/UI Designer, Sendbird</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-zinc-400 mr-3">•</span>
                    <span><strong>2017–2019:</strong> UX/UI Designer, AKQA</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Contact */}
            <section id="contact" className="max-w-3xl mx-auto px-6 py-20">
              <div className="bg-zinc-800/50 rounded-2xl p-8 border border-zinc-700/50">
                <h2 className="text-xl font-medium mb-6">Contact</h2>
                <ul className="space-y-3 text-zinc-300">
                  <li>
                    <a className="underline text-zinc-300 hover:text-zinc-100 transition-colors" href="mailto:heyjeong111@gmail.com">
                      heyjeong111(a)gmail.com
                    </a>
                  </li>
                  <li>
                    <a className="underline text-zinc-300 hover:text-zinc-100 transition-colors" href="https://www.linkedin.com/in/hjseong/" target="_blank">
                      LinkedIn
                    </a>
                  </li>
                </ul>
              </div>
            </section>
          </main>
        } />
        <Route path="/project-01" element={<ProjectDetail />} />
      </Routes>
    </Router>
  );
}
