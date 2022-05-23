import {
  mkdtempSync,
  rmSync,
  mkdirSync,
  existsSync,
  statSync,
  readdirSync,
  copyFileSync,
  writeFileSync,
} from "fs";
import { tmpdir } from "os";
import { join } from "path";

/**
 * Look ma, it's cp -R.
 * @param {string} src  The path to the thing to copy.
 * @param {string} dest The path to the new copy.
 */
const copyRecursiveSync = (src: string, dest: string) => {
  const exists = existsSync(src);
  const stats = exists && statSync(src);
  const isDirectory = stats && stats.isDirectory();
  if (isDirectory) {
    mkdirSync(dest);
    readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(join(src, childItemName), join(dest, childItemName));
    });
  } else {
    copyFileSync(src, dest);
  }
};

export interface TempDir {
  dir: string;
  cleanup: () => void;
  writeFile: (path: string, text: string) => string;
}

export const TempDir = (): TempDir => {
  // initialization
  const dir = mkdtempSync(tmpdir());

  const cleanup = () => {
    rmSync(dir, { recursive: true });
  };

  const writeFile = (path: string, text: string) => {
    const tempPath = path.replace(process.cwd(), dir);
    writeFileSync(tempPath, text);
    return tempPath;
  };

  cleanup();

  copyRecursiveSync(process.cwd(), dir);

  return { cleanup, dir, writeFile };
};
