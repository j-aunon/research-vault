export default function LoadingSpinner({ fullScreen = false }) {
  const body = (
    <div className="flex items-center gap-2 text-cyan-400">
      <div className="w-5 h-5 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
      <span className="text-sm">Loading...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        {body}
      </div>
    );
  }

  return body;
}
