import { join } from "path";
import { Diagnostic } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import { execSync } from "child_process";
import { parseKindCheck } from "./parseKindCheck";
import { getDocumentSettings } from "../server";
import { TempDir } from "./TempDir";
import { URI } from "vscode-uri";

// TODO: copy project to temporary folder
export const runKindCheck = async (
  textDocument: TextDocument,
  tempDir: TempDir
): Promise<Diagnostic[]> => {
  const filePath = URI.parse(textDocument.uri).path;

  // get Project root dir from settings
  const { projectRootFolder } = await getDocumentSettings(textDocument.uri);

  // salva o arquivo no diretorio temporario
  const temporaryFilePath = tempDir.writeFile(filePath, textDocument.getText());
  const path = temporaryFilePath.includes(projectRootFolder)
    ? join(tempDir.dir, projectRootFolder)
    : tempDir.dir;

  const command = `cd ${path} && kind ${temporaryFilePath}`;
  console.log(command);
  return parseKindCheck(execSync(command, { encoding: "utf8" }));
};
