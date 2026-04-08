import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-12 px-4">
      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Handwritten Numerals Recognition
        </h1>
        <p className="text-neutral-400 text-sm max-w-sm">
          A digit recognition model trained on handwritten numerals, built with Julia and Flux.jl
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        <Link href="/predictor">
          <div className="group flex flex-col gap-3 border border-neutral-700 hover:border-neutral-400 rounded-xl p-8 w-64 cursor-pointer transition-colors">
            <span className="text-3xl">🔍</span>
            <div>
              <h2 className="text-lg font-semibold group-hover:text-white transition-colors">
                Predictor
              </h2>
              <p className="text-neutral-400 text-sm mt-1">
                Draw a digit and let the model recognize it
              </p>
            </div>
          </div>
        </Link>

        <Link href="/contribute">
          <div className="group flex flex-col gap-3 border border-neutral-700 hover:border-neutral-400 rounded-xl p-8 w-64 cursor-pointer transition-colors">
            <span className="text-3xl">✏️</span>
            <div>
              <h2 className="text-lg font-semibold group-hover:text-white transition-colors">
                Contribute
              </h2>
              <p className="text-neutral-400 text-sm mt-1">
                Write digits 0–9 to help expand the training dataset
              </p>
            </div>
          </div>
        </Link>
      </div>
    </main>
  );
}
