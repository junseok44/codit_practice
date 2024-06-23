declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_API_KEY: string; // 선택적 환경 변수의 경우 ?를 추가합니다.
    REACT_APP_AWS_ACCESS_KEY_ID: string;
    REACT_APP_AWS_SECRET_ACCESS_KEY: string;
    REACT_APP_AWS_REGION: string;
  }
}
