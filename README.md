# 🍽️ BunShik - 분식집 키오스크 프로젝트

분식집 키오스크 주문/결제 시스템 프론트엔드 프로젝트입니다.

---

## 목차

- [기술 스택](#기술-스택)
- [화면 구성](#화면-구성)
- [시작하기](#시작하기)
- [DB 설계](#db-설계)
- [환경 변수](#환경-변수)
- [Git 사용법](#git-사용법)

---

## 기술 스택

- **Framework**: React (Create React App)
- **Language**: JavaScript
- **Routing**: react-router-dom
- **HTTP Client**: axios
- **Database**: MySQL

---

## 화면 구성

| 화면            | 파일                         | 설명                                         |
| --------------- | ---------------------------- | -------------------------------------------- |
| 홈              | `pages/Home.jsx`             | 매장식사/포장 선택                           |
| 메뉴 선택       | `pages/Menu.jsx`             | 카테고리별 메뉴 목록, 메뉴 클릭 시 옵션 팝업 |
| 장바구니        | `pages/Cart.jsx`             | 담은 메뉴 수량 조절/삭제                     |
| 결제            | `pages/Payment.jsx`          | 주문내역 확인 + 카드 결제                    |
| 주문완료        | `pages/OrderComplete.jsx`    | 주문번호 안내                                |
| 관리자 로그인   | `pages/admin/AdminLogin.jsx` | 아이디/비밀번호 로그인                       |
| 관리자 메뉴관리 | `pages/admin/AdminMenu.jsx`  | 메뉴 목록 조회/수정/삭제                     |
| 관리자 주문관리 | `pages/admin/AdminOrder.jsx` | 날짜/유형/상태별 주문 조회                   |

### 팝업 컴포넌트

- **옵션추가 팝업 (`OptionModal.jsx`)**: 메뉴 선택화면에서 옵션이 있는 메뉴(라면, 떡볶이) 클릭 시 표시
- **결제 거절/실패 팝업 (`PaymentFailCard.jsx`)**: 결제 시도 실패 시 표시 (거절/재시도 버튼 또는 뒤로가기 버튼, props로 분기)

---

## 시작하기

```bash
git clone https://github.com/boribabmany/BunShik.git
cd BunShik/react-app
npm install
npm start
```

`http://localhost:3000` 에서 확인 가능합니다.

---

## DB 설계

MySQL 기준, 총 7개 테이블로 구성됩니다.

### ERD 구조

- `menus` : 메뉴 기본 정보
- `options` : 옵션 목록 (치즈, 계란, 라면사리)
- `menu_options` : 메뉴-옵션 다대다 연결
- `orders` : 주문 (1건 = 1줄)
- `order_items` : 주문에 담긴 메뉴들
- `order_item_options` : 주문 항목에 붙은 옵션
- `payments` : 결제 시도/결과 기록 (거절/재시도 로그)

### 1. menus

| 컬럼명                  | 타입                     | 설명                    |
| ----------------------- | ------------------------ | ----------------------- |
| menu_id                 | INT (PK, AUTO_INCREMENT) | 메뉴 고유 ID            |
| menu_name               | VARCHAR(50)              | 메뉴명                  |
| price                   | INT                      | 가격                    |
| category                | VARCHAR(30)              | 카테고리                |
| image_url               | VARCHAR(255)             | 메뉴 사진 경로/URL      |
| description             | VARCHAR(200)             | 메뉴 한 줄 설명         |
| is_available            | BOOLEAN                  | 판매 상태 (TRUE=판매중) |
| sold_out_reason         | VARCHAR(100)             | 미판매 사유             |
| created_at / updated_at | DATETIME                 | 생성/수정일시           |

### 2. options

| 컬럼명              | 타입                     | 설명           |
| ------------------- | ------------------------ | -------------- |
| option_id           | INT (PK, AUTO_INCREMENT) | 옵션 고유 ID   |
| option_name         | VARCHAR(50)              | 옵션명         |
| option_price        | INT                      | 옵션 가격      |
| option_is_available | BOOLEAN                  | 옵션 판매 상태 |

### 3. menu_options (다대다 연결)

| 컬럼명    | 타입         | 설명                   |
| --------- | ------------ | ---------------------- |
| menu_id   | INT (PK, FK) | menus.menu_id 참조     |
| option_id | INT (PK, FK) | options.option_id 참조 |

### 4. orders (주문)

| 컬럼명       | 타입                     | 설명                             |
| ------------ | ------------------------ | -------------------------------- |
| order_id     | INT (PK, AUTO_INCREMENT) | 주문 고유 ID                     |
| order_number | VARCHAR(20)              | 화면 표시용 주문번호 (예: A-015) |
| total_price  | INT                      | 총 결제 금액                     |
| order_status | ENUM                     | 접수 / 조리중 / 완료 / 취소      |
| created_at   | DATETIME                 | 주문 생성일시                    |

### 5. order_items (주문 항목)

| 컬럼명         | 타입                     | 설명                    |
| -------------- | ------------------------ | ----------------------- |
| order_item_id  | INT (PK, AUTO_INCREMENT) | 주문 항목 ID            |
| order_id       | INT (FK)                 | orders 참조             |
| menu_id        | INT (FK)                 | menus 참조              |
| quantity       | INT                      | 수량                    |
| price_at_order | INT                      | 주문 당시 가격 (스냅샷) |

### 6. order_item_options (주문 항목 옵션)

| 컬럼명        | 타입         | 설명             |
| ------------- | ------------ | ---------------- |
| order_item_id | INT (PK, FK) | order_items 참조 |
| option_id     | INT (PK, FK) | options 참조     |

### 7. payments (결제 시도/결과)

| 컬럼명         | 타입                     | 설명                    |
| -------------- | ------------------------ | ----------------------- |
| payment_id     | INT (PK, AUTO_INCREMENT) | 결제 시도 ID            |
| order_id       | INT (FK)                 | orders 참조             |
| amount         | INT                      | 결제 금액               |
| payment_method | ENUM                     | 카드 / 현금 / 간편결제  |
| payment_status | ENUM                     | 성공 / 거절 / 취소      |
| fail_reason    | VARCHAR(100)             | 거절 사유 (잔액부족 등) |
| attempted_at   | DATETIME                 | 결제 시도 일시          |

### 전체 테이블 생성 SQL

전체 CREATE TABLE / INSERT 문은 `bunshik_db_setup.sql` 파일을 참고하세요.

### 참고 사항

- `price_at_order`를 따로 저장하는 이유: 나중에 메뉴 가격이 바뀌어도 과거 주문 기록은 변하지 않아야 하기 때문
- `payments`는 한 주문에 여러 번 결제 시도(거절 후 재시도)가 쌓일 수 있으므로 1:N 관계
- 옵션이 없는 메뉴(김밥, 순대, 오뎅, 콜라)는 `menu_options`에 데이터 없음
- 관리자 페이지 확장 시 `admins`, `categories` 테이블 추가 고려

---

## 환경 변수

`react-app/.env` 파일 생성 (git에는 올라가지 않음, 각자 로컬에 생성 필요)

```
REACT_APP_API_URL=http://localhost:5000
```

배포 시 실제 서버 주소로 교체합니다.

---

## Git 사용법

### 클론

```bash
git clone https://github.com/boribabmany/BunShik.git
cd BunShik/react-app
npm install
```

### 브랜치 전략 (예시)

- `main` : 배포 가능한 안정 버전
- `feature/기능명` : 기능별 작업 브랜치

### 커밋 후 푸시

```bash
git add .
git commit -m "설명"
git push origin main
```
