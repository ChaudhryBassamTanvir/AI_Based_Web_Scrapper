interface Props {
  formattedText: string;
}

// Parse vertical Markdown steps into proper table rows
function parseVerticalSteps(markdown: string) {
  const lines = markdown
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("###") && !l.startsWith("*") && l !== ":---"); // skip headings / bullets

  if (lines.length === 0) return [];

  return lines.map((line, idx) => {
    // Remove ** and bullets
    const cleanLine = line.replace(/\*\*/g, "").replace(/^\*+\s*/, "");

    // If line contains colon, split as Stage:Description
    const [stage, description] = cleanLine.includes(":")
      ? cleanLine.split(":").map((t) => t.trim())
      : [cleanLine, ""];

    return {
      Step: (idx + 1).toString(),
      Stage: stage,
      Description: description,
    };
  });
}

// Parse Markdown table (| col1 | col2 |)
function parseMarkdownTable(markdown: string) {
  const lines = markdown.trim().split("\n").filter(Boolean);
  if (lines.length < 2) return [];

  const headers = lines[0]
    .split("|")
    .map((h) => h.trim())
    .filter(Boolean);

  const rows = lines.slice(2).map((line) => {
    const values = line.split("|").map((v) => v.trim()).filter(Boolean);
    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      obj[h] = values[idx] || "";
    });
    return obj;
  });

  return rows;
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
    const rows = parseMarkdownTable(formattedText);
    if (rows.length > 0) {
      parsedData = rows;
      isTable = true;
    }
  }

  // 3️⃣ Try vertical steps Markdown
  if (!isTable) {
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
          <pre className="text-sm text-white/80 p-4">{formattedText}</pre>
        )}
      </div>
    </section>
  );
}
