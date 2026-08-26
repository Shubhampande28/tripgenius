'use client';

import { useState } from 'react';

export default function CopyBlock({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <div>
      <textarea
        readOnly
        value={text}
        rows={9}
        className="w-full bg-dark border border-border rounded-xl p-4 text-sm text-primary-text font-mono leading-relaxed resize-none outline-none focus:border-accent"
        onFocus={(e) => e.currentTarget.select()}
      />
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        className="mt-3 bg-accent text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-accent/90 transition-colors"
      >
        {copied ? 'Copied ✓' : 'Copy caption'}
      </button>
    </div>
  );
}
