import { join, posix } from "path";
import { Diagnostic } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import { execSync } from "child_process";
import { parseKindCheck } from "./parseKindCheck";
import { getDocumentSettings } from "../server";
import { TempDir } from "./TempDir";

// TODO: copy project to temporary folder
export const runKindCheck = async (
  textDocument: TextDocument,
  tempDir: TempDir
): Promise<Diagnostic[]> => {
  // texto do arquivo aberto
  const text = textDocument.getText();

  // get Project root dir from settings
  const { projectRootFolder } = await getDocumentSettings(textDocument.uri);
  const projectDir = join(process.cwd(), projectRootFolder);

  const fileWithDir = textDocument.uri.split(projectDir + posix.sep).pop();

  if (!fileWithDir) return [];

  // salva o arquivo no diretorio temporario
  tempDir.writeFile(join(projectRootFolder, fileWithDir), text);
  console.log(`cd ${join(tempDir.dir, projectRootFolder)} && kind ${fileWithDir}`);
  // roda kind check no arquivo temporario
  // response é a mensagem do type check do kind
  const response = execSync(`cd ${join(tempDir.dir, projectRootFolder)} && kind ${fileWithDir}`, {
    encoding: "utf8",
  });

  return parseKindCheck(response);
};
