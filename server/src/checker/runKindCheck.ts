import { writeFileSync, rmSync } from "fs";
import { join } from "path";
import { Diagnostic } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import { execSync } from "child_process";
import { parseKindCheck } from "./parseKindCheck";
import { getDocumentSettings } from "../server";

export const runKindCheck = async (textDocument: TextDocument): Promise<Diagnostic[]> => {
  // texto do arquivo aberto
  const text = textDocument.getText();

  // get Project root dir from settings
  const { projectRootFolder } = await getDocumentSettings(textDocument.uri);
  const projectDir = join(process.cwd(), projectRootFolder);

  const teste = textDocument.uri.replace(projectDir, "").replace("file:///", "");

  // workspace.fs.copy(projectDir, workspace.)
  // salva texto em um arquivo temporario para ser checado
  const t = textDocument.uri.split("/");
  const filename = t[t.length - 1];

  const dir = textDocument.uri.split(filename)[0].replace("file://", "");
  const temporaryFilename = "." + filename;
  const temporaryFile = join(dir, temporaryFilename);

  writeFileSync(temporaryFile, text);

  // roda kind check no arquivo temporario
  // response é a mensagem do type check do kind
  const response = execSync(
    `cd ${projectDir} && kind ${teste.replace(filename, temporaryFilename)}`,
    {
      encoding: "utf8",
    }
  );

  // deleta o arquivo temporario
  rmSync(temporaryFile);
  return parseKindCheck(response);
};
