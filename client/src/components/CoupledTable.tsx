import React from "react";
import { ResultTableData } from "../@types/file";
import { adjustLength } from "../utils/adjustLength.ts";

const CoupledTable = ({ parsedData }: { parsedData: ResultTableData }) => {
  // [[현행], [개정안]] 형태의 데이터를 받아서 짧은 것이 길이를 늘려준다.
  const adjustedParsedData = adjustLength(parsedData);

  // 현행과 개정안을 한 줄로 묶어준다.
  const coupledData = adjustedParsedData[0].map((column, index) => {
    return [column, adjustedParsedData[1][index]];
  }) as ResultTableData;

  if (!coupledData[0] && !coupledData[1]) {
    return <div>파싱된 신구조문 비교 표가 없습니다.</div>;
  }

  return (
    <div className="w-1/2 h-full overflow-y-auto">
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-400 p-2 w-1/2">현행</th>
            <th className="border border-gray-400 p-2 w-1/2">개정안</th>
          </tr>
        </thead>
        <tbody>
          {coupledData.map((data, index) => (
            <tr key={index}>
              <td className="border border-gray-400 p-2">{data[0]}</td>
              <td className="border border-gray-400 p-2">{data[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CoupledTable;
