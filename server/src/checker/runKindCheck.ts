import { writeFileSync, rmSync } from "fs";
import { join, posix } from "path";
import { Diagnostic } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import { execSync } from "child_process";
import { parseKindCheck } from "./parseKindCheck";
import { getDocumentSettings } from "../server";

// TODO: copy project to temporary folder
export const runKindCheck = async (textDocument: TextDocument): Promise<Diagnostic[]> => {
  // texto do arquivo aberto
  const text = textDocument.getText();

  // get Project root dir from settings
  const { projectRootFolder } = await getDocumentSettings(textDocument.uri);
  const projectDir = join(process.cwd(), projectRootFolder);

  const fileWithDir = textDocument.uri.split(projectDir + posix.sep).pop();

  if (!fileWithDir) return [];

  // salva texto em um arquivo temporario para ser checado
  const filename = posix.basename(textDocument.uri);

  const temporaryFilename = fileWithDir.replace(filename, "." + filename);
  const temporaryFile = join(projectDir, temporaryFilename);

  writeFileSync(temporaryFile, text);
  // console.log(teste.replace(filename, temporaryFilename), posix.dirname(fileWithDir));
  // roda kind check no arquivo temporario
  // response é a mensagem do type check do kind
  const response = execSync(`cd ${projectDir} && kind ${temporaryFilename}`, {
    encoding: "utf8",
  });

  // deleta o arquivo temporario
  rmSync(temporaryFile);
  return parseKindCheck(response);
};
