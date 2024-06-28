## setup
1. 레포지토리를 clone 받아주세요
2. 메일로 보내드린 .env 파일을 루트 디렉토리에 복사해주세요.
3. 루트 디렉토리에서 다음 명령을 실행해주세요. docker-compose up --build -d
4. 루트 디렉토리에서 다음 명령을 실행해주세요.
docker-compose exec mongo mongo -u admin -p qwer1234 --authenticationDatabase admin --eval 'rs.initiate({_id: "rs0", members: [{_id: 0,host:"mongo:27017"}]});'


## 설명

클라이언트는 react, react-query, tailwind css, pdfJs를 사용했고
서버는 express, mongodb, prismaORM, pdfjs, pdf-table-extractor를 사용했습니다.

/127.0.0.1:3000 으로 접속하시면 
/ 에서 파일 업로드와 파일 목록을 조회할 수 있고
파일 목록에서 특정 파일을 클릭하시면
/file/[fileId] 에서 업로드한 파일을 확인하실 수 있습니다.



## 파싱작업

pdf table을 parse하는 것은 pdf-table-extractor 라이브러리(https://github.com/ronnywang/pdf-table-extractor)를 커스텀해서 사용했습니다.

이후 server/src/lib/table-data-formatter.ts 에서 parse된 결과를 바탕으로 구,신 의안문을 [["제1조 구"],["제1조 신"]] 형태로 변환해서, 클라이언트로 보내주었습니다.

대체적인 원리는 보내주신 이중배열 형태의 데이터를 받아서, [A,B] 형태를 두 부분으로 나누고, 각 부분에서 제__조로 시작하거나, \n제__조 이거나, 아니면 \n[\u2460-\u2473], <신 설> 일때 그 부분을 분리해서 새로운 문단으로 만들도록 했습니다.

그렇게 했을때 문단으로 분리되면 안되는 부분들은 이전 문단에 합쳐주고, 각 제__조에서 처음으로 나오는 \n[\u2460-\u2473] 의 경우에는 서로 분리하지 않고 합쳐주는 작업을 마지막으로 진행했습니다.

다만 다른 의안문으로 테스트해봤을때 분리하면 안되는 제__조 부분을 분리해버리는 문제가 있어 이 부분은 보완이 필요할 것 같습니다.




