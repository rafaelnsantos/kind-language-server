import { CompletionItem, Position, TextDocumentPositionParams } from "vscode-languageserver";
import { getTypeFunctions } from "./getTypeFunctions";
import { getTypes } from "./getTypes";

export const getSuggestions = (text: string, position: Position): CompletionItem[] => {
  const lines = text.split(/\r?\n/);

  try {
    const words = lines[position.line].split(".");

    const lastWord = words[words.length - 2].replace(/\s/g, "");

    return getTypeFunctions(lastWord);
  } catch (e) {
    return getTypes();
  }
};
