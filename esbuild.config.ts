import {
  readdirSync,
  statSync,
  existsSync,
  mkdirSync,
  rmSync,
  createReadStream,
  writeFileSync,
} from "fs";
import path, { join } from "path";
import esbuild from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";
import readline from "readline";
import { Parser } from "acorn";
import acorn_jsx from "acorn-jsx";

interface DefaultAcornNode {
  type: string;
  start: number;
  end: number;
  // rome-ignore lint/suspicious/noExplicitAny: Because acorn .d.ts is broken
  [x: string]: any;
}

interface ProgramAcornNode extends DefaultAcornNode {
  type: "Program";
  body: AcornNodes[];
  sourceType: "module" | "script";
}

interface ImportDeclarationAcornNode extends DefaultAcornNode {
  type: "ImportDeclaration";
  specifiers: (ImportDefaultSpecifierAcornNode | ImportSpecifierAcornNode)[];
  source: LiteralAcornNode;
}

interface ImportDefaultSpecifierAcornNode extends DefaultAcornNode {
  type: "ImportDefaultSpecifier";
  local: IdentifierAcornNode;
}

interface LiteralAcornNode extends DefaultAcornNode {
  type: "Literal";
  value: string;
  raw: string;
}

interface IdentifierAcornNode extends DefaultAcornNode {
  type: "Identifier";
  name: string;
}

interface ImportSpecifierAcornNode extends DefaultAcornNode {
  type: "ImportSpecifier";
  imported: IdentifierAcornNode;
  local: IdentifierAcornNode;
}

interface VariableDeclarationAcornNode extends DefaultAcornNode {
  type: "VariableDeclaration";
  // rome-ignore lint/suspicious/noExplicitAny: not done
  declarations: any[];
  kind: "const" | "var" | "let";
}

type AcornNodes =
  | ImportDeclarationAcornNode
  | ImportDefaultSpecifierAcornNode
  | LiteralAcornNode
  | IdentifierAcornNode
  | ImportSpecifierAcornNode
  | VariableDeclarationAcornNode;

const sourceDirectory: string = "src";
const outputDirectory: string = "build";
const outputFormat: esbuild.Format = "esm";
const minifying: boolean = false;
const clearPreviousBuild: boolean = true;

const entryPoints: string[] = [];
const folderLookups: string[] = [""];
const outtypeFormat: string = outputFormat === "esm" ? "mjs" : "js";
for (const folder of folderLookups) {
  readdirSync(join(process.cwd(), sourceDirectory, folder)).filter(
    (fileCandidate) => {
      const entryPoint = join(folder, fileCandidate);
      const r = statSync(join(process.cwd(), sourceDirectory, entryPoint));
      if (r.isFile()) {
        if (fileCandidate.endsWith(".ts"))
          entryPoints.push(join(folder, fileCandidate));
      } else if (r.isDirectory()) {
        folderLookups.push(join(folder, fileCandidate));
      }
    }
  );
}
const outFolder = join(process.cwd(), outputDirectory);
if (existsSync(outFolder)) {
  rmSync(outFolder, { recursive: true });
}
mkdirSync(outFolder);
await esbuild
  .build({
    entryPoints: entryPoints.map((file) => {
      return join(sourceDirectory, file);
    }),
    outdir: outputDirectory,
    outExtension: { ".js": `.${outtypeFormat}` },
    bundle: false,
    sourcemap: false,
    minify: minifying,
    splitting: false,
    format: outputFormat,
    platform: "node",
    target: "esnext",
    allowOverwrite: clearPreviousBuild,
    plugins: [nodeExternalsPlugin()],
  })
  .then((res) => {
    console.log(res);
  })
  .catch((e) => {
    console.log(e);
  });
if (outputFormat === "esm") {
  await esmUpdateLocalImport(entryPoints)
    .then((r) => {
      console.log(r);
    })
    .catch((er) => {
      console.log(er);
    });
}

async function esmUpdateLocalImport(entryPoints: string[]) {
  for (let index = 0; index < entryPoints.length; index++) {
    const fileName = entryPoints[index];
    let hasUpdateImport = false;
    let correctedLine = "";
    const unformatRawFile = path.parse(join(outputDirectory, fileName));
    const formattedRawFilePath = `${unformatRawFile.dir}/${unformatRawFile.name}.${outtypeFormat}`;
    await new Promise<boolean>((resolve, reject) => {
      try {
        const reader = readline.createInterface({
          input: createReadStream(formattedRawFilePath),
          crlfDelay: Infinity,
        });
        reader
          .on("line", (rline) => {
            const codeStructure = Parser.extend(acorn_jsx()).parse(rline, {
              ecmaVersion: "latest",
              sourceType: "module",
            }) as unknown as ProgramAcornNode;
            const codeBody = codeStructure.body;
            for (let index = 0; index < codeBody.length; index++) {
              const codeLine = codeBody[index];
              try {
                if (codeLine.type === "ImportDeclaration") {
                  const pathCandidate = rline
                    .substring(
                      codeLine.source.start + 1,
                      codeLine.source.end - 1
                    )
                    .trim();
                  const importPath = join(
                    unformatRawFile.dir,
                    `${pathCandidate}.${outtypeFormat}`
                  );
                  if (existsSync(importPath)) {
                    correctedLine += `${rline.substring(
                      codeLine.start,
                      codeLine.source.end - 1
                    )}.${outtypeFormat}${rline.substring(
                      codeLine.source.end - 1,
                      codeLine.end
                    )}`;
                    hasUpdateImport = true;
                  } else {
                    throw new Error("Import is not local file");
                  }
                } else {
                  throw new Error("Not an Import statement");
                }
              } catch (e) {
                correctedLine += rline.substring(codeLine.start, codeLine.end);
              }
            }
          })
          .on("close", () => {
            console.log(`${fileName} has been scanned`);
            resolve(true);
          });
      } catch (e) {
        reject(`Update error on file name: ${fileName}`);
      }
    });
    if (hasUpdateImport) {
      console.log(join(process.cwd(), formattedRawFilePath));
      writeFileSync(formattedRawFilePath, correctedLine, {
        flag: "w",
      });
    }
  }
  return true;
}
