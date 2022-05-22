import { Diagnostic, DiagnosticSeverity, Position } from "vscode-languageserver";

const getPosition = (lineWithPosition: string): Position => {
  const sss = lineWithPosition.split(".kind:")[1].split(":");

  const line = parseInt(sss[0]);
  const character = parseFloat(sss[1].replace("'", ""));

  return {
    line,
    character,
  };
};

// recebe mensagem do type checker e retorna lista de erros
// TODO: improve parser with REGEX?
export const parseKindCheck = (text: string): Diagnostic[] => {
  const diagnostics: Diagnostic[] = [];

  if (text.includes("Inside")) {
    const lines = text.split(/\n{2,}/g);
    const errors = lines.length > 1 ? lines.slice(1, lines.length) : lines;

    errors.forEach((error) => {
      const test = error.split("\n").filter((line) => !line.includes("|"));

      if (test.length < 2) return;

      const lineWithPosition = test[0].includes("Inside") ? test.shift() : test.pop();

      if (!lineWithPosition) return;

      const message = test.join("\n");

      const { line, character } = getPosition(lineWithPosition);

      diagnostics.push({
        message,
        severity: DiagnosticSeverity.Error,
        range: {
          start: {
            line: line - 1,
            character: character - 1,
          },
          end: {
            line: line - 1,
            character: 1000,
          },
        },
      });
    });
  }

  return diagnostics;
};
