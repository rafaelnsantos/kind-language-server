import { randomUUID } from "crypto";
import {
  rmSync,
  mkdirSync,
  existsSync,
  statSync,
  readdirSync,
  copyFileSync,
  writeFileSync,
} from "fs";
import { homedir } from "os";
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

const cacheDir = join(homedir(), ".kind-cache");

export const TempDir = (): TempDir => {
  // initialization
  try {
    mkdirSync(cacheDir);
  } catch (err) {
    // console.error(err);
  }

  const dir = join(cacheDir, randomUUID());
  mkdirSync(dir);

  const cleanup = () => {
    rmSync(dir, { recursive: true });
  };

  const writeFile = (path: string, text: string) => {
    const tempPath = path.replace(process.cwd(), dir);
    try {
      writeFileSync(tempPath, text);
    } catch (err) {
      console.error(err);
    }
    return tempPath;
  };

  cleanup();

  copyRecursiveSync(process.cwd(), dir);

  return { cleanup, dir, writeFile };
};
