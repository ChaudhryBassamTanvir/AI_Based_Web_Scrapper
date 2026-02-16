interface Props {
  formattedText: string;
}

function cleanMarkdown(text: string) {
  return text
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/_{2,}/g, "")
    .replace(/#{1,6}\s*/g, "")
    .trim();
}

// Parse vertical Markdown steps into proper table rows
function parseVerticalSteps(markdown: string) {
  const lines = markdown
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const steps: any[] = [];
  let stepCounter = 1;
  let stepSectionStarted = false;

  for (const line of lines) {
    if (line.toLowerCase() === "step") {
      stepSectionStarted = true;
      continue;
    }

    if (!stepSectionStarted) continue;

    if (line === ":---" || /^\*+$/.test(line)) continue;

    const clean = cleanMarkdown(line);

    if (/^\d+$/.test(clean)) continue;

    if (clean.toLowerCase().includes("important") || clean.toLowerCase().includes("summary")) {
      break;
    }

    if (clean.length < 5) continue;

    steps.push({
      Step: stepCounter.toString(),
      Stage: clean,
    });

    stepCounter++;
  }

  return steps.length >= 2 ? steps : [];
}

// Parse Markdown table (| col1 | col2 |)
function extractMarkdownTable(markdown: string) {
  const lines = markdown.split("\n");

  const tableStart = lines.findIndex((l) => l.includes("|") && l.includes("---"));
  if (tableStart === -1) return [];

  const tableLines: string[] = [];
  for (let i = tableStart - 1; i < lines.length; i++) {
    const line = lines[i]?.trim();
    if (!line || !line.includes("|")) break;
    tableLines.push(line);
  }

  if (tableLines.length < 2) return [];

  const headers = tableLines[0]
    .split("|")
    .map((h) => cleanMarkdown(h))
    .filter(Boolean);

  const rows = tableLines.slice(2).map((line) => {
    const values = line
      .split("|")
      .map((v) => cleanMarkdown(v))
      .filter(() => true);

    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = values[i] || "";
    });
    return obj;
  });

  return rows;
}

function downloadCSV(data: any[]) {
  if (!data.length) return;

  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(","),
    ...data.map((row) =>
      headers.map((h) => `"${row[h] ?? ""}"`).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "data.csv";
  a.click();

  URL.revokeObjectURL(url);
}

export default function FormattedOutput({ formattedText }: Props) {
  let parsedData: any = null;
  let isTable = false;

  // 1️⃣ Try JSON
  try {
    parsedData = JSON.parse(formattedText);
    if (Array.isArray(parsedData) && typeof parsedData[0] === "object") {
      isTable = true;
    }
  } catch (e) {
    parsedData = null;
  }

  // 2️⃣ Try Markdown table
  if (!isTable && formattedText.includes("|")) {
    const tableData = extractMarkdownTable(formattedText);
    if (tableData.length > 0) {
      parsedData = tableData;
      isTable = true;
    }
  }

  // 3️⃣ Try vertical steps
  if (!isTable && formattedText.toLowerCase().includes("step")) {
    const rows = parseVerticalSteps(formattedText);
    if (rows.length > 0) {
      parsedData = rows;
      isTable = true;
    }
  }

  return (
    <section className="relative w-full py-16 px-6 bg-black overflow-hidden rounded-xl mt-6">
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-4xl mx-auto overflow-auto rounded-lg">
        {isTable && (
          <div className="flex justify-end mb-4">
            <button
              onClick={() => downloadCSV(parsedData)}
              className="px-4 py-2 text-sm bg-white text-black rounded hover:bg-gray-200 transition"
            >
              Download CSV
            </button>
          </div>
        )}

        {isTable ? (
          <table className="min-w-full text-white border border-white/10">
            <thead>
              <tr>
                {Object.keys(parsedData[0]).map((key) => (
                  <th
                    key={key}
                    className="px-4 py-2 border border-white/10 text-left bg-black/80"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {parsedData.map((row: any, idx: number) => (
                <tr key={idx} className="hover:bg-white/5 transition">
                  {Object.values(row).map((val: any, i) => (
                    <td key={i} className="px-4 py-2 border border-white/10">
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <pre className="text-sm text-white/80 p-4">{cleanMarkdown(formattedText)}</pre>
        )}
      </div>
    </section>
  );
}
