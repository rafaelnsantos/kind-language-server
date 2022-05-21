import { writeFileSync } from "fs";
import { join } from "path";
import { Diagnostic } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import { execSync } from "child_process";
import { parseKindCheck } from "./parseKindCheck";

export const runKindCheck = async (textDocument: TextDocument): Promise<Diagnostic[]> => {
  // texto do arquivo aberto
  const text = textDocument.getText();

  // salva texto em um arquivo temporario para ser checado
  const t = textDocument.uri.split("/");
  const filename = t[t.length - 1];
  const temporaryFile = join(__dirname, filename);
  writeFileSync(temporaryFile, text);

  // roda kind check no arquivo temporario
  // response é a mensagem do type check do kind
  const response = execSync(`cd ${__dirname} && kind ${filename} -- check`, {
    encoding: "utf8",
  });

  return parseKindCheck(response);
};
