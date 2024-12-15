<div align="center">
<h2>리그 오브 레전드 게임 시작 알림 서비스</h2>

<h3><u>Backend</u></h3>

![TypeScript Badge](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff&style=flat)
![Node.js Badge](https://img.shields.io/badge/Node.js-20.18.0-5FA04E?logo=nodedotjs&logoColor=5FA04E&style=flat)
![NestJS Badge](https://img.shields.io/badge/NestJS-10.0.0-E0234E?logo=nestjs&logoColor=E0234E&style=flat)
![Socket.io Badge](https://img.shields.io/badge/Socket.io-4.8.1-010101?logo=socketdotio&logoColor=fff&style=flat)
![NGINX Badge](https://img.shields.io/badge/NGINX-latest-009639?logo=nginx&logoColor=009639&style=flat)
![Docker Badge](https://img.shields.io/badge/Docker-25.0.3-2496ED?logo=docker&logoColor=2496ED&style=flat)
<br>

![MySQL Badge](https://img.shields.io/badge/MySQL-8.0.40-4479A1?logo=mysql&logoColor=4479A1&style=flat)
![TypeORM Badge](https://img.shields.io/badge/TypeORM-0.3.20-FE0803?logo=typeorm&logoColor=FE0803&style=flat)
![Redis Badge](https://img.shields.io/badge/Redis-7.4.1-FF4438?logo=redis&logoColor=fff&style=flat)
<br>

![Swagger Badge](https://img.shields.io/badge/Swagger-8.0.1-85EA2D?logo=swagger&logoColor=85EA2D&style=flat)

<h3><u>Frontend</u></h3>

![JavaScript Badge](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000&style=flat)
![Handlebars.js Badge](https://img.shields.io/badge/Handlebars.js-4.2.0-000?logo=handlebarsdotjs&logoColor=fff&style=flat)
![Socket.io Badge](https://img.shields.io/badge/Socket.io-4.7.2-010101?logo=socketdotio&logoColor=fff&style=flat)

<h3><u>Desktop App</u></h3>

![JavaScript Badge](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000&style=flat)
![Node.js Badge](https://img.shields.io/badge/Node.js-20.18.0-5FA04E?logo=nodedotjs&logoColor=5FA04E&style=flat)
![Electron Badge](https://img.shields.io/badge/Electron-33.2.1-47848F?logo=electron&logoColor=fff&style=flat)
![electron-builder Badge](https://img.shields.io/badge/electron--builder-25.1.8-000?logo=electronbuilder&logoColor=fff&style=flat)
![Socket.io Badge](https://img.shields.io/badge/Socket.io-4.8.1-010101?logo=socketdotio&logoColor=fff&style=flat)
<br>

<h3><u>Open API</u></h3>

![Riot Games Badge](https://img.shields.io/badge/Riot%20Games-EB0029?logo=riotgames&logoColor=fff&style=flat)

<h3><u>Architecture</u></h3>

![아키텍처](https://github.com/user-attachments/assets/75fece89-1744-4397-8f4c-53fcbf552a15)

##

[1. 서비스 기능](#1-서비스-기능)

[2. 주요 구현 기능](#2-주요-구현-기능)

[3. 유저 플로우](#3-유저-플로우)

[4. 폴더 구조](#4-폴더-구조)

</div>

## 1. 서비스 기능

- 회원 가입
- 로그인/로그아웃
- 리그 오브 레전드 계정 등록/삭제
- 게임 클라이언트 상태 조회 (로비, 챔피언 픽, 로딩, 시작)
- 실시간 게임 진행 시간 조회

## 2. 주요 구현 기능

### 이메일 인증 기능

- 회원 가입 시, 해당 이메일로 인증 코드를 발송하여 이메일 인증
- 인증 코드는 서버에 캐싱 되어 n분 동안 유효

### 로그인/로그아웃 기능

- 로그인 시, 액세스 토큰과 리프레시 토큰 발급
- 리프레시 토큰은 쿠키로 전달하고 토큰의 유효 기간 동안 서버에 캐싱
- 로그아웃 시, 클라이언트 쿠키를 삭제하고 로그아웃 처리

### 중복 로그인 방지 기능

- 새로운 클라이언트로 로그인 시, 리프레시 토큰을 다시 캐싱하고 새로운 세션 생성
- 이후에 기존 클라이언트에서 액세스 토큰 갱신 시, 해당 클라이언트 쿠키를 삭제하고 로그아웃 처리

### 리그 오브 레전드 계정 등록 기능

- 라이엇 소셜 로그인을 통해 해당 계정 정보 DB 저장

### 게임 클라이언트 상태 조회 기능

- 일렉트론 앱에서 게임 클라이언트 상태 정보를 감지하여 서버로 전송
- 클라이언트에서 소켓 인증 후, 서버로부터 실시간 게임 클라이언트 상태 정보 응답

## 3. 유저 플로우

1. 리그 오브 레전드 게임 클라이언트가 실행된 환경에서 데스크탑 앱을 실행하고, 시작 버튼을 눌러 서버에 연결합니다.
2. 웹으로 접속하여 회원 가입 및 로그인을 합니다.
3. 리그 오브 레전드 게임 클라이언트에서 로그인 된 계정을 등록합니다.
4. 조회할 계정을 선택합니다.
5. 조회 버튼을 클릭하여 현재 연결된 데스크탑 앱이 있는지 확인합니다.
6. 연결된 데스크탑 앱이 존재하면, 서버에 연결합니다.
7. 서버에서 클라이언트의 연결이 감지되면, 데스크탑 앱에서 리그 오브 레전드 클라이언트 상태 정보 구독을 시작합니다.
8. 서버에 연결되면, 리그 오브 레전드 게임 클라이언트의 실시간 상태 정보를 확인합니다.
9. 게임 시작 시, 현재 게임 진행 시간 정보를 실시간으로 확인합니다.
10. 게임 시작 후 1분이 경과되면, 클라이언트에서 서버 소켓 연결을 종료합니다.

## 4. 폴더 구조

```
src
├───auth          # 인증 모듈
│   └───token     # jwt 모듈
├───common        # 공통 관심사
├───core          # 코어 모듈
│   ├───config    # 환경 변수 설정 모듈
│   ├───redis     # 레디스 클라이언트 모듈 (레포지토리 추상 및 구현 클래스)
│   └───type-orm  # 데이터베이스 모듈 (엔티티, 레포지토리 추상 및 구현 클래스)
├───mail          # 이메일 모듈
├───socket        # 데스크탑 앱, 클라이언트 웹 소켓 모듈
├───summoner      # 롤 계정 모듈
│   └───http      # 라이엇 API 요청 모듈
└───users         # 유저 모듈

```

---
