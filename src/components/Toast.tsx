import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

export type ToastState = {
  tone: 'success' | 'error' | 'info';
  message: string;
};

export function Toast({ toast }: { toast: ToastState }) {
  const Icon = toast.tone === 'success' ? CheckCircle2 : toast.tone === 'error' ? AlertCircle : Info;

  return (
    <div className={`radio-toast toast-${toast.tone}`} role="status">
      <Icon aria-hidden="true" size={18} />
      {toast.message}
    </div>
  );
}
