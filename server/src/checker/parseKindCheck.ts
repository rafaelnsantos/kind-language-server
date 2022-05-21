import { Diagnostic, DiagnosticSeverity } from "vscode-languageserver";

// recebe mensagem do type checker e retorna lista de erros
// TODO: improve parser
export const parseKindCheck = (text: string): Diagnostic[] => {
  const diagnostics: Diagnostic[] = [];

  if (text.includes("Inside")) {
    const teste = text.split("':");

    teste.forEach((t) => {
      if (!t.includes(".kind:")) return;

      let lines = t
        .split("\n")
        .slice(1, -1)
        .filter((l) => !l.includes("Inside") && !l.includes("|") && l !== "");

      if (lines.some((line) => line.includes("Type mismatch."))) {
        lines = lines.slice(lines.indexOf("Type mismatch."), lines.length);
      } else if (lines.some((line) => line.includes("Undefined reference"))) {
        lines = lines.slice(lines.indexOf("Type mismatch."), lines.length);
      }

      const sss = t.split(".kind:")[1].split(":");

      const line = parseInt(sss[0]);
      const character = parseFloat(sss[1].replace("'", ""));

      diagnostics.push({
        message: lines.join("\n"),
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
