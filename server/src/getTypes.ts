import { CompletionItem, CompletionItemKind } from "vscode-languageserver"
import * as path from 'path'
import { readdirSync } from "fs"

const basePath = path.join(__dirname, '..', '..', 'Kind', 'base')

export const getTypes = (): CompletionItem[] =>{
  const content = readdirSync(basePath)  

  let files = content.filter(name => name.includes('.kind'))

  return files.map(file => ({
    label: file.replace(".kind", ""),
    kind: CompletionItemKind.Field
  }))
}