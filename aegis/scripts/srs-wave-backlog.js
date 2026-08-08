import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export function extractWaveItemsFromMarkdown(markdown) {
  const lines = markdown.split(/\r?\n/);
  const tableStart = lines.findIndex((line) => line.includes('## Wave-ready backlog bridge'));

  if (tableStart === -1) {
    return [];
  }

  const rows = [];
  let inTable = false;

  for (const line of lines.slice(tableStart + 1)) {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      continue;
    }

    if (trimmedLine.startsWith('|') && trimmedLine.includes('---')) {
      continue;
    }

    if (trimmedLine.startsWith('|')) {
      inTable = true;
      rows.push(line);
      continue;
    }

    if (inTable) {
      break;
    }
  }

  if (rows.length < 2) {
    return [];
  }

  return rows
    .slice(1)
    .filter((row) => row.includes('|'))
    .map((row) => {
      const cells = row.split('|').slice(1, -1).map((cell) => cell.trim());
      if (cells.length < 5) {
        return null;
      }

      const requirementIds = cells[2]
        .replace(/`/g, '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

      return {
        waveItem: cells[0],
        scope: cells[1],
        requirementIds,
        owner: cells[3],
        validationCheckpoint: cells[4],
      };
    })
    .filter(Boolean);
}

export function generateWaveBacklogJson(inputPath, outputPath) {
  const markdown = fs.readFileSync(inputPath, 'utf8');
  const items = extractWaveItemsFromMarkdown(markdown);

  const payload = {
    generatedAt: new Date().toISOString(),
    items,
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2), 'utf8');
  return payload;
}

export function runCli(argv = process.argv.slice(2)) {
  const [inputPathArg, outputPathArg] = argv;

  if (!inputPathArg || !outputPathArg) {
    console.error('Usage: node aegis/scripts/srs-wave-backlog.js <input-md> <output-json>');
    process.exitCode = 1;
    return null;
  }

  const inputPath = path.resolve(inputPathArg);
  const outputPath = path.resolve(outputPathArg);
  const payload = generateWaveBacklogJson(inputPath, outputPath);

  console.log(`Generated ${payload.items.length} wave backlog items into ${path.relative(process.cwd(), outputPath)}`);
  return payload;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runCli();
}
