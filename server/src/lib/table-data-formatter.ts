import { PdfParseResult } from "../@types/pdf-formatter";

type Coupled = [string, string];
type Section = Coupled[];
type LegislationData = Section[];

export const example: LegislationData = [
  [
    ["의 안 번 호", "113"],
    ["제안이유", ""],
  ],
  [
    ["현행", "개  정  안"],
    [
      "제7조(부정경쟁행위 등의 조사 등) ①ᆞ② (생 략)\n<신 설>\n<신 설>\n③(생 략)\n<신 설>\n제8조(위반행위의 시정권고)특허청장, 시·도지사 또는 시장·군수·구청장은 제2조제1호(아목과 카목은 제외한다)의 부정경쟁",
      "제7조(부정경쟁행위 등의 조사 등) ①ᆞ② (현행과 같음)\n③ 특허청장, 시·도지사 또는 시장·군수·구청장은 제1항에 따라 부정경쟁행위 등에 대한 조사당사자 등이 조사 진행 중에 「발명진흥법」 제43조에 따른 조정(이하 “분쟁조정”이라 한다)을 신청한 경우에는 그 조사를 중지할 수 있다.\n④ 특허청장, 시·도지사 또는 시장·군수·구청장은 제3항에 따라 신청한 분쟁조정이 성립된 경우에는 그 조사를 종결할 수 있다.\n⑤(현행 제3항과 같음)\n⑥ 그 밖에 부정경쟁행위 등의 조사절차에 관하여 필요한 사항은 대통령령으로 정한다.\n제8조(위반행위의 시정권고 등)\n①----------------------\n-------------------------\n-------------------------",
    ],
    ["", ""],
    ["", ""],
    ["", ""],
    ["", ""],
    ["", ""],
    ["", ""],
    ["", ""],
    ["", ""],
    ["", ""],
    ["", ""],
    ["", ""],
    ["", ""],
    ["", ""],
    ["", ""],
    ["", ""],
    ["", ""],
    ["", ""],
    ["", ""],
  ],
  [
    [
      "행위나 제3조, 제3조의2제1항 또는 제2항을 위반한 행위가 있다고 인정되면 그 위반행위를 한 자에게 30일 이내의 기간을 정하여 그 행위를 중지하거나 표지를 제거 또는 폐기할 것 등 그 시정에 필요한 권고를 할 수 있다.\n<신 설>",
      "-------------------------\n-------------------------\n-------------------------\n-------------------------\n-----------시정----------\n-------------------------\n-----------.\n②특허청장, 시.도지사 또는",
    ],
    ["", ""],
    ["", ""],
    ["", ""],
    // 그 line에 \n이 없는 경우에는, 다음 line에 붙여서 출력
    ["", "시장.군수.구청장은 제1항에"],
    ["", "따른 시정권고가 다음 각 호에"],
    ["", "해당하는 경우에는 시정권고"],
    ["", "사실을 일간신문 또는 소속 기"],
    ["", "관의 인터넷 홈페이지를 통해"],
    ["", "공표할 수 있다.\n1. 위반행위로 인해 국민의 생"],
    ["", ""],
    ["", "명과 신체의 안전 및 재산권"],
    ["", "보호에 심각한 위협이 발생할"],
    ["", "우려가 있어 국민들이 즉시"],
    ["", "알 필요가 있는 경우\n2. 향후 유사한 위반행위 발생"],
    ["", ""],
    ["", "이 예상되는 등 위반행위의"],
    ["", "내용을 국민들에게 알려 혼동"],
    ["", "을 방지할 필요가 있는 경우\n3. 시정권고 전 오보 또는 추측"],
    ["", ""],
    ["", "성 보도로 인해 시정권고 관"],
    ["", ""],
  ],
  [
    [
      "",
      "련 위반행위에 대한 명확한 사실관계 전달이 필요한 경우\n4. 제8조에 따른 시정권고를 3",
    ],
    ["", ""],
    ["", ""],
    ["", ""],
    ["", "회 이상 받은 경우"],
    ["", ""],
    [
      "제14조의2(손해액의 추정 등) ① ～ ⑤ (생 략)\n⑥ 법원은 영업비밀 침해행위가고의적인 것으로 인정되는 경우에는 제11조에도 불구하고 제1항부터 제5항까지의 규정에 따라 손해로 인정된 금액의 3 배를 넘지 아니하는 범위에서 배상액을 정할 수 있다.\n⑦ (생 략)",
      "제14조의2(손해액의 추정 등) ① ～ ⑤ (현행과 같음)\n⑥  ------제2조제1호차목의 행위 및 영업비밀 침해행위가 -------------------------\n-------------------------\n-------------------------\n-------------------------\n------------------.\n⑦ (현행과 같음)",
    ],
    ["", ""],
    ["", ""],
  ],
];

export type ResultTableData = [string[], string[]];

// parser의 result를 받아서, table data를 반환
export default function PdfTableFormatter(
  result: PdfParseResult
): ResultTableData {
  function isCoupled(data: any): data is Coupled {
    return Array.isArray(data) && data.length >= 2;
  }
  let originalData: LegislationData = [];

  const pageTables = result.pageTables;

  for (const page of pageTables) {
    let current: Coupled[] = [];

    for (let i = 0; i < page.tables.length; i++) {
      if (isCoupled(page.tables[i])) {
        current.push(page.tables[i] as Coupled);
      }
    }

    originalData.push(current);
  }

  return formatter(originalData);
}

function formatter(data: LegislationData): ResultTableData {
  const customSplitRegex =
    /(?=^제\d+조)|(?=\n제\d+조)|(?=\n[\u2460-\u2473])|(?=<신 설>)/gm;
  const firstStartRegex = /^제\d+조/;
  const specialRegex = /^\n[\u2460-\u2473]/;

  let currentParts: string[] = [];
  let proposedParts: string[] = [];

  let flag = false;

  for (let i = 0; i < data.length; i++) {
    for (let section of data[i]) {
      let current = section[0]?.trim() || "";
      let proposed = section[1]?.trim() || "";

      if (firstStartRegex.test(current) || firstStartRegex.test(proposed)) {
        flag = true;
      }

      if (!flag) continue;

      if (current) {
        let parts = current
          .split(customSplitRegex)
          .filter((part) => part.trim());

        // 만약 자른 부분 중에서 첫번째 부분이 문단의 시작 부분이 아니라 잘못 들어간 부분이라고 한다면
        // 그 이전 문단의 마지막 부분에 붙여준다.
        if (currentParts.length > 0 && !customSplitRegex.test(parts[0])) {
          currentParts[currentParts.length - 1] += " " + parts.shift();
        }
        currentParts = currentParts.concat(parts);
      }
      if (proposed) {
        let parts = proposed
          .split(customSplitRegex)
          .filter((part) => part.trim());

        // 만약 자른 부분 중에서 첫번째 부분이 문단의 시작 부분이 아니라 잘못 들어간 부분이라고 한다면
        // 그 이전 문단의 마지막 부분에 붙여준다.
        if (proposedParts.length > 0 && !customSplitRegex.test(parts[0])) {
          proposedParts[proposedParts.length - 1] += " " + parts.shift();
        }
        proposedParts = proposedParts.concat(parts);
      }
    }
  }

  // 제__조가 나오는데, 거기에 번호가 없고, 그 다음에 번호가 나오는 경우,
  // 그 번호는 제__조와 붙여준다.
  for (let i = 0; i < currentParts.length; i++) {
    if (
      currentParts[i].trim().match(/^제\d+조/) &&
      !currentParts[i].trim().match(/[\u2460-\u2473]/)
    ) {
      if (specialRegex.test("\n" + currentParts[i + 1]?.trim())) {
        currentParts[i] += "\n" + currentParts[i + 1].trim();
        currentParts.splice(i + 1, 1);
      }
    }
  }

  // 제__조가 나오는데, 거기에 번호가 없고, 그 다음에 번호가 나오는 경우,
  // 그 번호는 제__조와 붙여준다.
  for (let i = 0; i < proposedParts.length; i++) {
    if (
      proposedParts[i].trim().match(/^제\d+조/) &&
      !proposedParts[i].trim().match(/[\u2460-\u2473]/)
    ) {
      if (specialRegex.test("\n" + proposedParts[i + 1]?.trim())) {
        proposedParts[i] += "\n" + proposedParts[i + 1].trim();
        proposedParts.splice(i + 1, 1);
      }
    }
  }

  return [currentParts, proposedParts];
}

// console.log(formatter(example));
