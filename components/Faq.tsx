interface FaqItem {
  question: string;
  answer: string;
}

interface FaqProps {
  items: FaqItem[];
}

export function Faq({ items }: FaqProps) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-900">FAQ</h3>
      <dl className="space-y-3">
        {items.map((item, index) => (
          <div
            key={`${item.question}-${index}`}
            className="p-4 rounded-lg border border-gray-200 bg-white"
          >
            <dt className="font-semibold text-gray-900">{item.question}</dt>
            <dd className="mt-1 text-gray-600 text-sm leading-relaxed">
              {item.answer}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
