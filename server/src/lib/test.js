// console.log("test.js");

// Image = function () {
//   console.log("Image");
// };

const { default: PdfTableFormatter } = require("./table-data-formatter.ts");

async function test() {
  const result = await require("./custom-table-extractor.js")(
    "https://codit-practice.s3.ap-northeast-2.amazonaws.com/2100113_%E1%84%8B%E1%85%B4%E1%84%89%E1%85%A1%E1%84%80%E1%85%AE%E1%86%A8%20%E1%84%8B%E1%85%B4%E1%84%8B%E1%85%A1%E1%86%AB%E1%84%80%E1%85%AA_%E1%84%8B%E1%85%B4%E1%84%8B%E1%85%A1%E1%86%AB%E1%84%8B%E1%85%AF%E1%86%AB%E1%84%86%E1%85%AE%E1%86%AB%20%282%29%20%281%29.pdf"
  );

  console.log(PdfTableFormatter(result));
}

test();
