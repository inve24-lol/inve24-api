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

<h3>(1) 웹으로 접속하여 <u>회원 가입</u> 및 <u>로그인</u>을 합니다.</h3>

<details>
<summary><u>자세히 보기</u></summary>

![2](https://github.com/user-attachments/assets/5893fefe-5f4e-4cb7-89d9-6fc3653fc7e6)

</details>

<h3>(2) <u>리그 오브 레전드 클라이언트</u>에서 로그인 한 계정을 <u>등록</u>합니다.</h3>

> 리그 오브 레전드 계정이 등록된 사용자에게는 게임 조회 접근 권한이 주어집니다.

<details>
<summary><u>자세히 보기</u></summary>

![3](https://github.com/user-attachments/assets/af311287-6015-4d2c-90c3-30d897c38455)

</details>

<h3>(3) 리그 오브 레전드 클라이언트가 실행 중인 환경에서 <u>데스크탑 앱</u>을 <u>실행</u>하고, 시작 버튼을 눌러 서버에 연결합니다.</h3>

> 서버 소켓 게이트웨이에서 DB에 등록된 리그 오브 레전드 계정인지 검증합니다. <br>
> 검증에 성공하면, 동일한 사용자가 웹에서 접근했을 때 식별이 가능한 값으로 소켓 룸을 생성합니다. <br>
> 동시에 해당 값을 '대기' 상태로 레디스에 저장 합니다. <br>

<details>
<summary><u>자세히 보기</u></summary>

![1](https://github.com/user-attachments/assets/a7cba44c-54b7-4fbd-83f4-571608a13481)

</details>

<h3>(4) 조회할 계정을 <u>선택</u>합니다.</h3>

<details>
<summary><u>자세히 보기</u></summary>

![4](https://github.com/user-attachments/assets/f3de94bc-147f-4e47-b162-0bbe6597aa07)

</details>

<h3>(5) <u>조회 버튼</u>을 클릭하여 현재 연결된 데스크탑 앱이 있는지 확인합니다.</h3>

> 앞서 클라이언트가 식별 가능한 값을 통해, 레디스에 '대기' 상태의 캐싱 된 값이 있는지 확인합니다. <br>
> 해당 값이 존재하지 않는다면, 데스크탑 앱이 아직 실행되지 않았거나, 연결 실패로 판단합니다. <br>

<details>
<summary><u>자세히 보기</u></summary>

![5](https://github.com/user-attachments/assets/c91c16c1-4b12-4eee-bd73-b153c0759574)

</details>

<h3>(6) <u>연결된 데스크탑 앱</u>이 <u>존재</u>하면, 서버에 자동으로 연결됩니다.</h3>

> 서버 소켓 게이트웨이에서 사용자의 권한 및 사용자 세션을 검증합니다. <br>
> 검증에 성공하면, 일렉트론 앱으로부터 생성된 소켓 룸과 동일한 값으로 소켓 룸을 생성합니다. <br>
> 동시에 '대기' 상태의 레디스 값을 '활성' 상태로 업데이트합니다. <br>

<details>
<summary><u>자세히 보기</u></summary>

![6](https://github.com/user-attachments/assets/36ccbf09-f033-40c0-9b67-815095749337)

</details>

<h3>(7) 서버에서 <u>클라이언트의 연결</u>이 <u>감지</u>되면, 데스크탑 앱에서 리그 오브 레전드 클라이언트 상태 정보 조회를 시작합니다.</h3>

> 서버에서 일렉트론 앱으로 클라이언트의 소켓 연결 성공 메시지를 전달합니다. <br>
> 동시에 일렉트론 앱은 리그 오브 레전드 클라이언트 상태 정보 구독을 시작합니다. <br>

<details>
<summary><u>자세히 보기</u></summary>

![7](https://github.com/user-attachments/assets/5f667da5-0183-4e65-ab04-0412d3227a0d)

</details>

<h3>(8) 리그 오브 레전드 클라이언트의 <u>상태 변경</u>이 <u>감지</u>될 때 마다 클라이언트에서 이를 확인합니다.</h3>

<details>
<summary><u>자세히 보기</u> - 로비 상태</summary>

![9](https://github.com/user-attachments/assets/27bc9f51-5be2-41a2-a34d-f3540ad88b44)
![8](https://github.com/user-attachments/assets/61615e2c-f3de-456a-bbea-2674a0b5b3db)

</details>

<details>
<summary><u>자세히 보기</u> - 챔피언 선택 상태</summary>

![11](https://github.com/user-attachments/assets/3be82a88-e619-4f48-983e-cfa44cd61e88)
![10](https://github.com/user-attachments/assets/9cc969de-dea3-4633-ade7-cfc9627ad076)

</details>

<h3>(9) <u>챔피언 선택</u>이 <u>종료</u>되면, <u>로딩 상태 정보</u>를 2초 간격으로 확인합니다.</h3>

<details>
<summary><u>자세히 보기</u></summary>

![12](https://github.com/user-attachments/assets/e2b6c9ab-99db-4ec9-84b5-af40924095bc)

</details>

<h3>(10) <u>게임이 시작</u>되면, 실시간 <u>게임 진행 시간 정보</u>를 확인합니다.</h3>

<details>
<summary><u>자세히 보기</u></summary>

![13](https://github.com/user-attachments/assets/5cc54a3a-aad6-4d3d-8e2c-70db8e0ea022)

</details>

<h3>(11) <u>게임 시작 후 1분이 경과</u>되면, 클라이언트에서 <u>서버 소켓 연결</u>을 <u>종료</u>합니다.</h3>

<details>
<summary><u>자세히 보기</u></summary>

![15](https://github.com/user-attachments/assets/b6fc04c6-e347-41b8-aed6-c512f5eb0361)
![16](https://github.com/user-attachments/assets/43e6c1e9-ce69-4f5e-b0b9-4be9d57489de)

</details>

<h3>(12) 빠른 참여를 위해, 게임 진행 시간은 <u>1초</u> 빠르게 표시됩니다.</u></h3>

<details>
<summary><u>자세히 보기</u></summary>

![14](https://github.com/user-attachments/assets/30a1b260-df1b-4e6a-93e1-ec08ec9c77c6)

</details>

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
