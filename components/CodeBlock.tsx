'use client';

import { useState } from 'react';

export default function CodeBlock({ code, language }: { code: string, language: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="relative">
      <pre className="bg-gray-800 text-green-100 text-sm rounded-md p-4 pr-16 overflow-x-auto my-4">
        <code className={`language-${language}`}>{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold py-1 px-2 rounded"
      >
        {isCopied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
}
