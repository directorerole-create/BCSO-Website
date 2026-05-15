export const dynamic = "force-dynamic";

const SHEET_ID = "1E_tIWj0bcgdLBf5bdDCjH3nMhxUtO73TNlRW2CwSIkk";
const GID      = "2065550040";
const CSV_URL  = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch   = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') { field += '"'; i++; }
      else if (ch === '"')             { inQuotes = false; }
      else                             { field += ch; }
    } else {
      if      (ch === '"')                       { inQuotes = true; }
      else if (ch === ',')                       { row.push(field); field = ""; }
      else if (ch === '\r' && next === '\n')     { row.push(field); field = ""; rows.push(row); row = []; i++; }
      else if (ch === '\n')                      { row.push(field); field = ""; rows.push(row); row = []; }
      else                                       { field += ch; }
    }
  }
  if (row.length > 0 || field) { row.push(field); rows.push(row); }
  return rows;
}

async function fetchSheet(): Promise<{ headers: string[]; rows: string[][]; error: string | null }> {
  try {
    const res = await fetch(CSV_URL, { cache: "no-store" });
    if (!res.ok) return { headers: [], rows: [], error: `HTTP ${res.status} — is the sheet set to "Anyone with the link can view"?` };
    const text = await res.text();
    const all  = parseCSV(text).filter(r => r.some(c => c.trim()));
    if (all.length === 0) return { headers: [], rows: [], error: "Sheet returned no data." };
    const [headers, ...rows] = all;
    return { headers, rows, error: null };
  } catch (e) {
    return { headers: [], rows: [], error: String(e) };
  }
}

export default async function RosterGSPage() {
  const { headers, rows, error } = await fetchSheet();

  return (
    <div className="p-8 min-h-screen">
      <div className="mb-6">
        <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Test Page</span>
        <h1 className="text-2xl font-bold mt-1 mb-1">Roster — Google Sheets</h1>
        <p className="text-xs text-gray-500 font-mono break-all">{CSV_URL}</p>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-500/50 bg-red-900/20 p-5 text-red-300 text-sm">
          <strong className="block mb-1">Failed to load sheet</strong>
          {error}
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-400 mb-4">
            <span className="font-semibold text-white">{rows.length}</span> rows ·{" "}
            <span className="font-semibold text-white">{headers.length}</span> columns
          </p>

          <div className="overflow-x-auto rounded-lg border border-gray-700">
            <table className="text-xs border-collapse w-full">
              <thead>
                <tr>
                  {headers.map((h, i) => (
                    <th
                      key={i}
                      className="border-b border-r border-gray-700 bg-gray-800 px-3 py-2 text-left whitespace-nowrap font-mono text-yellow-300 last:border-r-0"
                    >
                      {h || `col_${i}`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => (
                  <tr key={ri} className="even:bg-gray-800/30 hover:bg-gray-700/40">
                    {headers.map((_, ci) => (
                      <td
                        key={ci}
                        className="border-b border-r border-gray-700/40 px-3 py-1.5 text-gray-300 whitespace-nowrap last:border-r-0"
                      >
                        {row[ci] ?? ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
