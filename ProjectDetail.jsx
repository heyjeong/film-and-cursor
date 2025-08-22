import React from 'react';

const ProjectDetail = () => {
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 antialiased">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <a href="/" className="text-zinc-400 hover:text-zinc-100 transition-colors">
            ← Back to Portfolio
          </a>
        </div>
      </header>

      {/* Project Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Project Title */}
        <div className="mb-16">
          <h1 className="text-5xl font-medium mb-6">🎊 Brooklyn Confetti</h1>
          <p className="text-xl text-zinc-300 max-w-2xl">
            A photographic exploration of urban reflections and overlapping cityscapes, capturing the fragmented beauty of Brooklyn through multiple exposures and artistic composition.
          </p>
        </div>

        {/* Project Images */}
        <div className="space-y-16 mb-16">
          {/* Image 1 */}
          <div>
            <img
              src="/0002.jpg"
              alt="Brooklyn Confetti - Beach scene with building reflection and confetti-like light flares"
              className="w-full rounded-2xl border border-zinc-700/50"
            />
            <p className="mt-4 text-zinc-400 text-sm">
              Beach landscape with building reflection overlay, featuring confetti-like light flares creating a dreamy, festive atmosphere
            </p>
          </div>

          {/* Image 2 */}
          <div>
            <img
              src="/0003.jpg"
              alt="Brooklyn Confetti - Double exposure of city buildings with palm tree and bird wing elements"
              className="w-full rounded-2xl border border-zinc-700/50"
            />
            <p className="mt-4 text-zinc-400 text-sm">
              Double exposure effect showing overlapping city buildings with palm tree silhouettes and bird wing forms
            </p>
          </div>

          {/* Image 3 */}
          <div>
            <img
              src="/0004.jpg"
              alt="Brooklyn Confetti - Multiple layered cityscape with transparent architectural elements"
              className="w-full rounded-2xl border border-zinc-700/50"
            />
            <p className="mt-4 text-zinc-400 text-sm">
              Multi-layered urban composition with transparent architectural elements and tropical vegetation
            </p>
          </div>
        </div>

        {/* Project Details */}
        <div className="grid md:grid-cols-2 gap-16">
          {/* Left Column */}
          <div>
            <h2 className="text-2xl font-medium mb-6">Project Overview</h2>
            <p className="text-zinc-300 mb-6">
              Brooklyn Confetti explores the fragmented nature of urban experience through experimental photography techniques. 
              The series captures the overlapping realities of city life, where multiple scenes coexist in a single frame.
            </p>
            <p className="text-zinc-300 mb-6">
              Using double exposure and reflection techniques, each image reveals layers of meaning and visual complexity 
              that mirror the diverse, interconnected nature of Brooklyn's neighborhoods.
            </p>
          </div>

          {/* Right Column */}
          <div>
            <h2 className="text-2xl font-medium mb-6">Technical Details</h2>
            <ul className="space-y-3 text-zinc-300">
              <li className="flex items-start">
                <span className="text-zinc-400 mr-3">•</span>
                <span><strong>Medium:</strong> Digital Photography</span>
              </li>
              <li className="flex items-start">
                <span className="text-zinc-400 mr-3">•</span>
                <span><strong>Technique:</strong> Multiple Exposure, Reflection</span>
              </li>
              <li className="flex items-start">
                <span className="text-zinc-400 mr-3">•</span>
                <span><strong>Location:</strong> Brooklyn, New York</span>
              </li>
              <li className="flex items-start">
                <span className="text-zinc-400 mr-3">•</span>
                <span><strong>Year:</strong> 2024</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetail;
