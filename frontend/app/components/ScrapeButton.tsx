interface Props {
  onClick: () => void;
  loading: boolean;
}

export default function ScrapeButton({ onClick, loading }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="bg-gray-200 text-black px-6 py-3 rounded-lg 
                 font-medium hover:bg-gray-400 transition-all  cursor-pointer
                 disabled:opacity-50"
    >
      {loading ? "Scraping..." : "Scrape Product"}
    </button>
  );
}
