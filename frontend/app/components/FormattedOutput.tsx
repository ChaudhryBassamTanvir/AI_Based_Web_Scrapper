interface Props {
  formattedText: string;
}

// Remove markdown/code fences and extra symbols
function cleanMarkdown(text: string) {
  return text
    .replace(/```(csv)?/g, "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/_{2,}/g, "")
    .replace(/#{1,6}\s*/g, "")
    .trim();
}

// Parse Markdown table (| col1 | col2 |) into objects
function parseMarkdownTable(markdown: string) {
  const lines = markdown.split("\n").map((l) => l.trim()).filter(Boolean);
  if (!lines.some((l) => l.includes("|"))) return [];

  const tableLines = lines.filter((l) => l.includes("|"));
  if (tableLines.length < 2) return [];

  const headers = tableLines[0].split("|").map((h) => h.trim()).filter(Boolean);

  const rows: any = tableLines.slice(2).map((line) => {
    const values = line.split("|").map((v) => v.trim()).filter(Boolean);
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = values[i] || "";
    });
    return obj;
  });

  return rows.length > 0 ? { headers, rows } : [];
}

// Download CSV from rows or raw text
function downloadCSV(tableData: any, rawText?: string) {
  let csvContent = "";

  if (tableData?.rows && tableData.rows.length) {
    csvContent = [
      tableData.headers.join(","),
      ...tableData.rows.map((row: any) =>
        tableData.headers.map((h: string) => `"${row[h] ?? ""}"`).join(",")
      ),
    ].join("\n");
  } else if (rawText) {
    csvContent = rawText;
  }

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "data.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function FormattedOutput({ formattedText }: Props) {
  const cleanText = cleanMarkdown(formattedText);
  const tableData: any = parseMarkdownTable(cleanText);

  return (
    <section className="relative w-full py-12 sm:py-16 px-4 sm:px-6 bg-black overflow-hidden rounded-xl mt-6">
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-full sm:max-w-4xl mx-auto overflow-x-auto rounded-lg">
        {/* CSV Download Button */}
        <div className="flex justify-end mb-3 sm:mb-4">
          <button
            onClick={() => downloadCSV(tableData, cleanText)}
            className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-white text-black rounded hover:bg-gray-200 transition cursor-pointer whitespace-nowrap"
          >
            Download CSV
          </button>
        </div>

        {/* Table */}
        {tableData?.rows?.length ? (
          <div className="w-full overflow-x-auto">
            <table className="min-w-[700px] w-full text-white border border-white/10 text-xs sm:text-sm">
              <thead>
                <tr>
                  {tableData.headers.map((key: string) => (
                    <th
                      key={key}
                      className="px-3 sm:px-4 py-2 border border-white/10 text-left bg-black/80 whitespace-nowrap"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.rows.map((row: any, idx: number) => (
                  <tr key={idx} className="hover:bg-white/5 transition">
                    {tableData.headers.map((h: string) => (
                      <td
                        key={h}
                        className="px-3 sm:px-4 py-2 border border-white/10 whitespace-nowrap"
                      >
                        {row[h]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <pre className="text-xs sm:text-sm text-white/80 p-3 sm:p-4 whitespace-pre-wrap break-words">
            {cleanText}
          </pre>
        )}
      </div>
    </section>
  );
}
