import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col h-screen bg-black text-green-400 font-mono text-sm p-8 terminal-glow justify-center">
      <div className="max-w-lg">
        <p className="text-xl mb-4">SIGNAL LOST.</p>
        <p className="mb-2">Agent, you&apos;ve wandered off-grid.</p>
        <p className="mb-8">This sector does not exist — or has been classified above your clearance.</p>
        <Link href="/" className="hover:text-green-300 transition-colors">
          &gt; return home
        </Link>
      </div>
    </div>
  );
}
