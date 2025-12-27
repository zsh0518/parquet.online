interface GuideTocItem {
  id: string;
  label: string;
}

interface GuideTocProps {
  items: GuideTocItem[];
}

export function GuideToc({ items }: GuideTocProps) {
  if (!items.length) return null;

  return (
    <nav
      className="w-full lg:w-60 lg:shrink-0"
      aria-label="Guide quick navigation"
    >
      <div className="sticky top-4 rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-900">On this page</p>
        </div>
        <div className="flex lg:block overflow-x-auto px-2 py-3 lg:py-2 gap-2 lg:gap-0">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="block whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              aria-label={`Jump to ${item.label}`}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
