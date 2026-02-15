import JsonViewer from "./JsonViewer";

interface Props {
  data: any;
}

export default function ResultPanel({ data }: Props) {
  if (!data) return null;

  return (
    <div className="mt-10 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          Extracted Product JSON
        </h2>
        <button
          onClick={() => {
            const blob = new Blob([JSON.stringify(data, null, 2)], {
              type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "product.json";
            a.click();
          }}
          className="text-sm border border-white/20 px-4 py-2 rounded-lg hover:border-white transition"
        >
          Download JSON
        </button>
      </div>

      <JsonViewer data={data} />
    </div>
  );
}
