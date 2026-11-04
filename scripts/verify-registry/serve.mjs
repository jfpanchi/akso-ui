// Minimal static server for the registry copy. Usage: node serve.mjs <dir> <port>
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join, normalize } from "node:path";

const [dir, port] = process.argv.slice(2);
createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^(\.\.[/\\])+/, "");
  try {
    const body = await readFile(join(dir, path));
    res.writeHead(200, { "content-type": "application/json" }).end(body);
  } catch {
    res.writeHead(404).end("Not found");
  }
}).listen(Number(port), () => console.log(`Serving ${dir} on :${port}`));
