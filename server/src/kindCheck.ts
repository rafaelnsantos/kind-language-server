import { writeFileSync } from "fs";
import { join } from "path";
import { Diagnostic } from "vscode-languageserver";
import { TextDocument } from "vscode-languageserver-textdocument";
import { execSync } from "child_process";

import * as kind from 'kind-lang'

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

export const kindCheck = async(textDocument: TextDocument): Promise<Diagnostic[]> => {
  return []
  const text = textDocument.getText();

  const t = textDocument.uri.split('/')

  const filename = t[t.length - 1]

  const temporaryFile = join(__dirname, filename)

  writeFileSync(temporaryFile, text)

  const diagnostics: Diagnostic[] = []

  const response = execSync(`cd ${__dirname} && kind ${filename} -- check`, { encoding: 'utf8' })

  if (response.includes(".kind:")) {
    const teste = response.split(".kind:")[1].split(":")
    const line = parseInt(teste[0])
    const character = parseFloat(teste[1].replace("'", ""))

    diagnostics.push({
      message: response,
      range: {
        start: {
          line: line - 1,
          character: character - 1
        },
        end: {
          line: line - 1,
          character: 1000,
        }
      }
    })
  }


  console.log(response)
  
  return diagnostics
}
