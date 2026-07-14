import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
  delay?: number;
}

export default function FAQItem({ question, answer, delay = 0 }: FAQItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="card overflow-hidden"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
        aria-expanded={open}
      >
        <span className="text-base font-semibold text-ink-strong">{question}</span>
        <span
          className={`flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-edge/5 text-ink-muted transition-all duration-300 ${
            open ? 'rotate-180 bg-blaze-500/10 text-blaze-500 dark:text-blaze-400' : ''
          }`}
        >
          <ChevronDown className="h-4 w-4" />
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <p className="px-5 pb-5 text-sm leading-relaxed text-ink-muted">{answer}</p>
      </div>
    </div>
  );
}
