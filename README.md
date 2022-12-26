# clinical-trial-API-server
[Notion 개발 프로세스 문서](https://confirmed-soil-684.notion.site/d5394a877a1e4cd9aaa9dfca3ee08c35)

## 과제개요

- 제출: git repo
- 참여: 본인(1명)
- 기간: 하루 2시간씩 한달

## 프로젝트 개요

- 질병관리청 임상 DB 를 api-server 로 insert 한다. batch task 로 진행한다.
- 데이터베이스에 있는 임상정보를 검색할 수 있다.
- 임상정보를 상세히 볼 수 있다.
- 주기적으로 임상정보를 데이터베이스에 업데이트 한다. batch task 로 진행한다.

## 프로젝트 구동

- 제작 환경: macOS
- IDE: Visual Studio Code 2022
- 설치:  TypeScript / ts-node /mySQL
- 기타 외부 모듈: npm 으로 설치
    
    ```jsx
    $npm i 
    ```
    
- 명령어
    
    ```jsx
    //서버 시작
    $npm start
    
    //테스트: dev dependencies 설치 필요
    $npm test
    $npm run coverage
    
    //개발 버젼 서버 시작: dev dependencies 설치 필요
    $npm run dev
    ```
    
- 환경변수
    - dotenv: .env / .env.test
    - .env.sample 에 필요한 데이터를 남겼음
    
## 기술 스택

- 필수사항: github, git, RDBMS(**MySQL,MariaDB, PostgreSQL**)
- 선택사항: 없음
- 특이사항: 없음
- 버젼관리: github, git
- nodeJs / express / TypeScript / typeORM / mySQL / Joi / Jest
- cors / morgan / dotenv / nodemon / ts-node / supertest / node-cron / axios
- 도전: swagger, batch task, docker

## 요구사항

- 요구사항
    - [x]  **임상시험 정보를 수집하는 batch task 작성([#1](https://www.notion.so/d5394a877a1e4cd9aaa9dfca3ee08c35))**
        - [x]  [https://www.data.go.kr/data/3033869/openapi.do](https://www.data.go.kr/data/3033869/openapi.do) 사용
        - [x]  open API 스펙을 보고 이해하며 데이터를 **주기적으로 적재** 하는 기능을 구현, 실제 데이터를 추가하면서 **중복 방지에 대한 전략**을 세워야함
        - [x]  기존 데이터와 API 데이터간의 수정된 사항을 비교하여 해당 임상시험이 **업데이트 된 것인지 새로 추가된 것 인지 구별**이 가능해야함
        - [x]  실행이 완료되면 **추가된 건 수, 업데이트 된 건 수를 출력**하거나 따로 로깅해줘야함
    - [x]  **수집한 임상정보에 대한 API([#2](https://www.notion.so/d5394a877a1e4cd9aaa9dfca3ee08c35))**
        - [x]  특정 임상정보 읽기(uuid 값은 자유)
    - [x]  **수집한 임상정보 리스트 API([#3](https://www.notion.so/d5394a877a1e4cd9aaa9dfca3ee08c35))**
        - [x]  최근 일주일내에 업데이트(변경사항이 있는) 된 임상정보 리스트
        - [x]  pagination 기능 : offset, limit 으로 구현
    - [x]  **직접 API를 호출해서 볼 수 있는 API Document 작성**
    - [ ]  **임상시험 정보를 제공하는 다른 API 를 스스로 발굴하여 batch task 를 추가 (가산점)**
        - [ ]  중복되는 임상시험을 merge 할 수 있으면 규칙과 과정을 반드시 [README.md](http://README.md) 에 명시
    - [ ]  배**포하여 웹에서 사용 할 수 있도록 제공([#4](https://www.notion.so/d5394a877a1e4cd9aaa9dfca3ee08c35))**
        - [x]  [README.md](http://README.md) 에 **배포과정에 대한 가이드와 주소 제공**, 설치하지 않고 확인가능할 경우 가산점
    - [x]  **임상정보 리스트 API([#3](https://www.notion.so/d5394a877a1e4cd9aaa9dfca3ee08c35))**
        - [x]  검색 기능 제공
        - [x]  pagination 기능: offset, limit 을 구현한 뒤에 **새로운 방식을 제시하면 가산점**
- 필수사항
    - [x]  **Github Repository URL**
    - [ ]  **README.md**
        - [x]  구현한 방법과 이유, 어려웠던 점에 대한 간략한 내용 서술
        - [ ]  **누구나 따라 할 수 있을 정도의 자세한 실행 방법, 가이드대로 실행이 되지 않으면 안되므로 직접 해보고 트러블 슈팅 가이드도 함께 첨부합니다. (맥/윈도우 기준)**
        - [x]  api 명세 필수(request/response 서술 필요)
    - [x]  **데이터베이스는 MySQL,MariaDB, PostgreSQL로 구현 가능:** 테이블 이름, 갯수 제한 없음
    - [x]  **(주의1) secret key, api key 등을 레포지토리에 올리지 않도록 유의:** 커밋 히스토리에서 production용 key 값을 찾을 수 있으면 0점(예제는 가능)
    - [x]  **(주의2) Git branch 전략을 협의하여 팀원간의 동일한 전략과 commit 단위를 사용하세요**
   
## API 명세 
- 문서 크기가 커서 링크로 대체함. [API SPEC](https://www.notion.so/47cdfef27adb49a3808d5ce2ccb880e2)
- swagger UI: API 명세 문서에 사용법을 남겼음

<img width="500" alt="테스트 값 스크린샷" src="https://user-images.githubusercontent.com/88824305/209533369-438c54be-d95c-4e3c-be5c-63ef6121c4cd.jpg">

## 테스트

<img width="500" alt="테스트 값 스크린샷" src="https://user-images.githubusercontent.com/88824305/209533792-25a4fdd9-2160-44c0-af7e-19266de0badb.jpg">




