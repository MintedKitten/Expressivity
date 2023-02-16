import path from "path";
function getDirPath({ foldername }: { foldername: string }): string {
  try {
    return path.join(path.dirname(import.meta.url), foldername); //esm
  } catch (e) {
    return path.join(__dirname, foldername); //cjs
  }
}
export { getDirPath };
