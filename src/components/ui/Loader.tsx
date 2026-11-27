type LoaderProps = {
  message?: string;
};

export default function Loader({ message = 'Loading books...' }: LoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-3 py-10"
    >
      <div
        className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"
        aria-hidden="true"
      />

      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}
