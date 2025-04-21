export default function Loader() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-[6px] border-primary-500 border-t-transparent animate-spin"></div>
        <div className="absolute inset-3 rounded-full backdrop-blur-xl bg-white/30 shadow-inner shadow-primary-100"></div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
