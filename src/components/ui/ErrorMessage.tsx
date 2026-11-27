type ErrorMessageProps = {
  message?: string;
  onRetry?: () => void;
};

export default function ErrorMessage({
  message = 'An error occurred.',
  onRetry
}: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 rounded-lg border border-red-200 bg-red-50 p-6 text-center"
    >
      <p className="font-medium text-red-700">{message}</p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Retry
        </button>
      )}
    </div>
  );
}
