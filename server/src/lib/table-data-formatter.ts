type ArticleAmendment = [string, string];
type Section = ArticleAmendment[];
type LegislationData = Section[];

type ResultColumn = string[];

export type ResultTableData = [ResultColumn, ResultColumn];

const customSplitRegex = /(?=^제\d+조)|(?=\n[\u2460-\u2473])|(?=\n<신 설>)/gm;

export default function PdfTableFormatter(result: any) {
  let originalData = [];
  const pageTables = result.pageTables;

  for (const page of pageTables) {
    originalData.push(page.tables);
  }

  return formatter(originalData);
}

function formatter(data: LegislationData): ResultTableData {
  let resultColumn1: ResultColumn = [];
  let resultColumn2: ResultColumn = [];

  let currentBuffer = "";
  let proposedBuffer = "";

  let flag = false;

  for (let i = 0; i < data.length; i++) {
    for (let [current, proposed] of data[i]) {
      current = current.trim();
      proposed = proposed.trim();

      if (current === "현행" || current === "개  정  안") {
        flag = true;
        continue;
      }

      if (!flag) {
        continue;
      }

      if (current) {
        const currentMatches = current.match(customSplitRegex);

        if (currentMatches) {
          let splitCurrent = current.split(customSplitRegex);

          if (!splitCurrent[0].match(customSplitRegex)) {
            currentBuffer += splitCurrent.shift();
          }

          if (currentBuffer) {
            resultColumn1.push(currentBuffer.trim());
            currentBuffer = "";
          }

          let lastCurrent = splitCurrent.pop();
          if (lastCurrent) {
            currentBuffer += lastCurrent;
          }

          resultColumn1 = resultColumn1.concat(
            splitCurrent.map((s) => s.trim())
          );
        } else {
          currentBuffer += current + " ";
        }
      }

      if (proposed) {
        const proposedMatches = proposed.match(customSplitRegex);

        if (proposedMatches) {
          let splitProposed = proposed.split(customSplitRegex);

          // 마지막 것이 다음 셀의 시작점이랑 merge되어야 할 수도 있다.
          if (!splitProposed[0].match(customSplitRegex)) {
            proposedBuffer += splitProposed.shift();
          }

          if (proposedBuffer) {
            resultColumn2.push(proposedBuffer.trim());
            proposedBuffer = "";
          }

          let last = splitProposed.pop();

          if (last) {
            proposedBuffer += last;
          }

          resultColumn2 = resultColumn2.concat(
            splitProposed.map((s) => s.trim())
          );
        } else {
          proposedBuffer += proposed + " ";
        }
      }
    }
  }

  if (currentBuffer) resultColumn1.push(currentBuffer.trim());
  if (proposedBuffer) resultColumn2.push(proposedBuffer.trim());

  return [resultColumn1, resultColumn2];
}
