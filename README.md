# 🍽️ BunShik - 분식집 키오스크 프로젝트

무인 분식집 키오스크 프로젝트입니다. **고객용 주문 키오스크**와 **관리자용 관리 페이지**로 구성되어 있으며, 각각 독립된 React 프로젝트로 분리되어 있습니다.

```
BunShik/
├── kiosk-customer/   # 고객용 주문 키오스크
├── kiosk-admin/      # 관리자용 관리 페이지
├── .gitignore
└── README.md
```

---

## 목차

- [프로젝트 소개](#프로젝트-소개)
- [기술 스택](#기술-스택)
- [화면 구성](#화면-구성)
- [팝업 컴포넌트](#팝업-컴포넌트)
- [상태 관리](#상태-관리)
- [결제 시뮬레이션](#결제-시뮬레이션)
- [시작하기](#시작하기)
- [DB 설계](#db-설계)
- [API 엔드포인트](#api-엔드포인트)
- [환경 변수](#환경-변수)
- [Git 사용법](#git-사용법)
- [문서](#문서)

---

## 기술 스택

- **Framework**: React 19 (Create React App)
- **Language**: JavaScript
- **Routing**: react-router-dom
- **State Management**: Zustand
- **HTTP Client**: axios (백엔드 연동 시 사용 예정)
- **Database**: MySQL

---

## 화면 구성

### 고객용 (kiosk-customer)

| 화면      | 파일                            | 설명                                                                                   |
| --------- | ------------------------------- | -------------------------------------------------------------------------------------- |
| 홈        | `pages/kiosk/Home.jsx`          | 매장식사/포장 선택. 선택한 주문 유형은 `useOrderStore`에 저장되어 이후 화면까지 유지됨 |
| 메뉴 선택 | `pages/kiosk/Menu.jsx`          | 카테고리별 메뉴 목록 조회(로딩/에러/재시도 처리 포함), 메뉴 클릭 시 옵션 팝업          |
| 장바구니  | `pages/kiosk/Cart.jsx`          | 담은 메뉴 수량 조절/삭제, 총 금액 확인                                                 |
| 결제      | `pages/kiosk/Payment.jsx`       | 주문내역 확인 + 결제 수단 선택(네이버페이/카카오페이/카드결제)                         |
| 주문완료  | `pages/kiosk/OrderComplete.jsx` | 주문번호 안내, 영수증/주문번호 인쇄                                                    |

### 관리자용 (kiosk-admin)

| 화면            | 파일                         | 설명                                                          |
| --------------- | ---------------------------- | ------------------------------------------------------------- |
| 관리자 로그인   | `pages/admin/AdminLogin.jsx` | 아이디/비밀번호 로그인, `ProtectedRoute`로 비로그인 접근 차단 |
| 관리자 메뉴관리 | `pages/admin/AdminMenu.jsx`  | 메뉴/옵션 목록 조회·등록·수정·삭제, 대시보드 요약 통계        |
| 관리자 주문관리 | `pages/admin/AdminOrder.jsx` | 날짜/유형/상태별 주문 조회, 주문 상태 변경 및 취소            |

---

## 팝업 컴포넌트

### 고객용

| 컴포넌트                 | 설명                                                                                                                                   |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `OptionModal.jsx`        | 메뉴 선택화면에서 옵션이 있는 메뉴(라면, 떡볶이) 클릭 시 표시. 옵션 최대 2개 선택 제한                                                 |
| `PaymentMethodModal.jsx` | 결제 수단 선택 팝업 — 네이버페이 / 카카오페이 / 카드결제                                                                               |
| `PaymentFailCard.jsx`    | 결제 시도 실패 시 표시. 실패 유형(카드오류/거절/네트워크오류/타임아웃)에 따라 재시도 버튼 또는 뒤로가기 버튼만 노출되도록 props로 분기 |
| `EmptyCartModal.jsx`     | 장바구니가 빈 채로 결제 화면 진입 시 5초 카운트다운 후 메뉴 화면 자동 이동                                                             |
| `IdleWarningModal.jsx`   | 90초 무조작 시 10초 카운트다운 경고, 이후 자동 초기화(홈 화면 복귀)                                                                    |
| `CategoryTabs.jsx`       | 카테고리 탭 — 마우스 드래그 및 터치 슬라이드, 좌우 화살표 버튼 지원                                                                    |

---

## 상태 관리

Zustand로 관리되는 전역 상태입니다.

| Store           | 위치                                        | 관리하는 값                                                          |
| --------------- | ------------------------------------------- | -------------------------------------------------------------------- |
| `useCartStore`  | `kiosk-customer/src/store/useCartStore.js`  | 장바구니 항목(items), 수량 조절/삭제, 총액 계산(`getTotalPrice`)     |
| `useOrderStore` | `kiosk-customer/src/store/useOrderStore.js` | 주문 유형(orderType), 주문번호(orderNumber), 총 결제금액(totalPrice) |

---

## 결제 시뮬레이션

백엔드 연동 전까지 `api/orderApi.js`의 `submitPayment()`가 결제 API를 흉내냅니다.

| 결과                | 확률         | 처리                                      |
| ------------------- | ------------ | ----------------------------------------- |
| 성공                | 35%          | 주문번호 발급 → 완료 화면 이동            |
| 카드 인식 오류      | 30%          | 재시도 불가, 카드 재삽입 안내             |
| 승인 거절           | 30%          | 재시도 가능, 실패 사유 표시(예: 잔액부족) |
| 네트워크 오류       | 5%           | 재시도 가능                               |
| 응답 지연(타임아웃) | 10초 초과 시 | 재시도 가능                               |

---

## 시작하기

```bash
git clone https://github.com/boribabmany/BunShik.git
cd BunShik
```

고객용/관리자용을 각각 독립적으로 설치·실행합니다.

```bash
# 고객용 키오스크
cd kiosk-customer
npm install
npm start
```

```bash
# 관리자용 페이지
cd kiosk-admin
npm install
npm start
```

`http://localhost:3000`에서 확인 가능합니다.

---

## DB 설계

MySQL 기준, 기본 7개 테이블 + 관리자 기능 확장용 2개 테이블(총 9개)로 구성됩니다.

### ERD 구조

- `menus` : 메뉴 기본 정보
- `options` : 옵션 목록 (치즈, 계란, 라면사리)
- `menu_options` : 메뉴-옵션 다대다 연결
- `orders` : 주문 (1건 = 1줄)
- `order_items` : 주문에 담긴 메뉴들
- `order_item_options` : 주문 항목에 붙은 옵션
- `payments` : 결제 시도/결과 기록 (거절/재시도 로그)
- `admin_user` : 관리자 계정
- `admin_history` : 관리자 작업 변경 이력

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

| 컬럼명              | 타입                     | 설명                 |
| ------------------- | ------------------------ | -------------------- |
| option_id           | INT (PK, AUTO_INCREMENT) | 옵션 고유 ID         |
| option_name         | VARCHAR(50)              | 옵션명               |
| option_price        | INT                      | 옵션 가격            |
| option_image        | VARCHAR(255)             | 옵션 이미지 경로/URL |
| option_is_available | BOOLEAN                  | 옵션 판매 상태       |

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
| order_type   | ENUM                     | 매장 / 포장                      |
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

| 컬럼명         | 타입                     | 설명                                       |
| -------------- | ------------------------ | ------------------------------------------ |
| payment_id     | INT (PK, AUTO_INCREMENT) | 결제 시도 ID                               |
| order_id       | INT (FK)                 | orders 참조                                |
| amount         | INT                      | 결제 금액                                  |
| payment_method | ENUM                     | 카드 / 현금 / 간편결제                     |
| payment_status | ENUM                     | 성공 / 카드오류 / 거절 / 시스템오류 / 취소 |
| fail_reason    | VARCHAR(100)             | 거절/실패 사유 (잔액부족 등)               |
| attempted_at   | DATETIME                 | 결제 시도 일시                             |

### 8. admin_user (관리자 계정)

| 컬럼명        | 타입                     | 설명               |
| ------------- | ------------------------ | ------------------ |
| id            | INT (PK, AUTO_INCREMENT) | 관리자 고유 ID     |
| username      | VARCHAR(50)              | 로그인 ID (UNIQUE) |
| password_hash | VARCHAR(255)             | 암호화된 비밀번호  |
| is_active     | BOOLEAN                  | 계정 활성 여부     |
| created_at    | DATETIME                 | 생성일시           |

### 9. admin_history (관리자 변경 이력)

| 컬럼명      | 타입                     | 설명                                |
| ----------- | ------------------------ | ----------------------------------- |
| id          | INT (PK, AUTO_INCREMENT) | 이력 ID                             |
| admin_id    | INT (FK, nullable)       | admin_user 참조                     |
| title       | VARCHAR(100)             | 예: 메뉴 등록, 가격 변경, 품절 처리 |
| description | VARCHAR(255)             | 상세 설명                           |
| created_at  | DATETIME                 | 발생일시                            |

### 전체 테이블 생성 SQL

전체 CREATE TABLE / INSERT 문은 `bunshik_db_setup.sql` 파일 및 DevProject Hub DB 모델러 문서를 참고하세요.

### 참고 사항

- `price_at_order`를 따로 저장하는 이유: 나중에 메뉴 가격이 바뀌어도 과거 주문 기록은 변하지 않아야 하기 때문
- `payments`는 한 주문에 여러 번 결제 시도(거절 후 재시도)가 쌓일 수 있으므로 1:N 관계
- 옵션이 없는 메뉴(김밥, 순대, 오뎅, 콜라)는 `menu_options`에 데이터 없음
- 관리자 인증(`admin_user`)과 변경 이력(`admin_history`)은 관리자 페이지 개발에 맞춰 추가된 테이블

---

## API 엔드포인트

### 고객용

| Method | Endpoint                          | 설명           |
| ------ | --------------------------------- | -------------- |
| GET    | `/api/menus`                      | 메뉴 목록 조회 |
| GET    | `/api/options`                    | 옵션 목록 조회 |
| POST   | `/api/orders`                     | 주문 생성      |
| POST   | `/api/orders/{order_id}/payments` | 결제 시도      |
| GET    | `/api/orders/{order_id}`          | 주문 상세 조회 |

관리자용 API(로그인, 메뉴/옵션 CRUD, 주문 관리, 이력 조회)는 DevProject Hub API 명세서에 별도로 정리되어 있습니다.

> 현재 프론트엔드는 실제 서버 없이 `data/`, `api/` 폴더 내 목업 데이터와 더미 함수로 동작합니다. 백엔드 연동 시 각 API 함수(`getMenus`, `getOptions` 등) 내부만 실제 fetch/axios 호출로 교체하면 되도록 설계되어 있습니다.

---

## 환경 변수

`kiosk-customer/`, `kiosk-admin/` 각 폴더에 `.env` 파일이 필요합니다. **`.env`는 `.gitignore`에 등록되어 있어 git에 올라가지 않으므로, 각자 로컬에 직접 생성해야 합니다.**

### kiosk-admin/.env

```
REACT_APP_ADMIN_ID=관리자_아이디
REACT_APP_ADMIN_PASSWORD=관리자_비밀번호
```

### 공통 (백엔드 연동 시)

```
REACT_APP_API_URL=http://localhost:5000
```

배포 시 실제 서버 주소로 교체합니다.

> ⚠️ **`.env`는 절대 커밋하지 마세요.** 실수로 커밋된 이력이 있다면, 파일을 삭제하는 것만으로는 과거 커밋 기록에 값이 그대로 남으므로 반드시 아이디/비밀번호 값 자체를 변경(재발급)해야 합니다.

---

## Git 사용법

### 브랜치 전략

- `main` : 배포 가능한 안정 버전
- `feature/기능명` : 기능별 작업 브랜치

### 작업 규칙

- `kiosk-customer/`, `kiosk-admin/`는 각자 담당 폴더만 수정합니다. 상대방 폴더는 수정하지 않습니다.
- 작업 시작 전 항상 `git pull origin main`으로 최신 상태를 먼저 받아옵니다.
- 커밋 전 `git status`로 변경 파일 목록을 확인하고, 특히 `.env`처럼 민감한 파일이 포함되지 않았는지 확인합니다.
- 커밋 메시지는 `feat:`, `fix:`, `chore:`, `docs:` 등 접두사를 붙여 어떤 종류의 변경인지 구분합니다.

### 클론 및 설치

```bash
git clone https://github.com/boribabmany/BunShik.git
cd BunShik/kiosk-customer   # 또는 kiosk-admin
npm install
```

### 커밋 후 푸시

```bash
git checkout main
git pull origin main

# 작업...

git add kiosk-customer   # 또는 kiosk-admin
git status               # 올라갈 파일 확인
git commit -m "fix: 메뉴 화면 카테고리 탭 버그 수정"
git push origin main
```

---

## 문서

- **DB 스키마 / ERD**: DevProject Hub → DB 설계(Modeler)
- **API 명세서**: DevProject Hub → API 명세서
- **사용자 시나리오**: DevProject Hub → 사용자 시나리오
- **요구사항 정의서**: DevProject Hub → 요구사항 정의서
- **화면 설계**: DevProject Hub → 화면 설계 / Figma
