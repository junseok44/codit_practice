/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_API_KEY: string; // 선택적 환경 변수의 경우 ?를 추가합니다.
  }
}
