# 🍽️ BunShik - 분식집 키오스크 프로젝트

무인 분식집의 주문부터 결제, 관리자 운영까지 다루는 프론트엔드 프로젝트입니다. 고객용 키오스크와 관리자용 페이지가 각각 독립된 React 애플리케이션으로 구성되어 있습니다.

## 프로젝트 구성

```text
BunShik/
├── kiosk-customer/   # 고객용 주문 키오스크
├── kiosk-admin/      # 관리자용 관리 페이지
├── docs/             # 작업일지 및 산출 문서
└── README.md
```

## 기술 스택

- React 19, JavaScript, Create React App
- React Router DOM 7
- Zustand 5
- Axios 및 Fetch API
- Toss Payments SDK, QR Code
- Recharts
- Jest, React Testing Library, Playwright
- 백엔드 연동: REST API, MySQL

## 고객용 키오스크

### 화면과 라우트

| 경로 | 화면 | 주요 기능 |
| --- | --- | --- |
| `/` | 주문 시작 | 한국어·영어 선택, 매장 식사·포장 선택 |
| `/menu` | 메뉴 선택 | 카테고리 탐색, 판매 상태 표시, 세트 구성·옵션 선택, 장바구니 담기 |
| `/cart` | 장바구니 | 수량 변경, 항목 삭제, 주문 금액 확인 |
| `/payment` | 결제 | 주문 생성, 카드·간편결제 선택, 오류 안내와 재시도 |
| `/complete` | 주문 완료 | 주문번호와 결제 금액 안내 |
| `/payment/toss/success` | 토스 승인 | 토스 결제 승인 후 주문 완료 처리 |
| `/payment/toss/fail` | 토스 실패 | 결제 실패 기록 및 사용자 안내 |

### 주요 기능

- 1080 × 1920 키오스크 화면을 브라우저 크기에 맞춰 자동 축소합니다.
- 한국어와 영어 UI를 지원합니다.
- 카테고리 탭은 좌우 버튼, 마우스 드래그, 터치 슬라이드를 지원합니다.
- 메뉴 조회 중 로딩, 빈 목록, 오류와 재시도 상태를 구분합니다.
- 일반 메뉴의 옵션과 세트 메뉴의 구성 항목을 각각 선택할 수 있습니다.
- 장바구니에서 동일 구성 메뉴를 합산하고 수량·총액을 관리합니다.
- 빈 장바구니로 결제 화면에 접근하면 메뉴 화면으로 안내합니다.
- 홈 이외 화면에서 90초간 조작이 없으면 마지막 10초 동안 경고한 뒤 장바구니와 주문 상태를 초기화합니다.
- 주문 생성과 결제 요청의 타임아웃은 8초이며, 네트워크 오류와 타임아웃은 최대 2회 자동 재시도합니다.
- 카드 결제, 네이버페이 데모 QR, 토스페이·카카오페이 결제 흐름을 지원합니다.

### 주요 컴포넌트

| 컴포넌트 | 역할 |
| --- | --- |
| `CategoryTabs.jsx` | 메뉴 카테고리 탐색 |
| `MenuCard.jsx` | 메뉴 정보와 판매 상태 표시 |
| `OptionModal.jsx` | 단품 옵션 및 구성 선택 |
| `SetMenuModal.jsx` | 세트 메뉴 그룹별 구성 선택 |
| `CartBar.jsx`, `CartItem.jsx` | 장바구니 요약과 항목 관리 |
| `PaymentMethodModal.jsx` | 결제 수단 선택 |
| `EasyPayQRModal.jsx` | 네이버페이 데모 QR 표시 |
| `PaymentFailCard.jsx` | 결제 실패 유형별 안내와 재시도 |
| `IdleResetHandler.jsx` | 무조작 감지와 초기화 |

### 상태 관리

| Store | 관리 대상 |
| --- | --- |
| `useCartStore` | 장바구니 항목, 수량, 옵션·세트 구성, 총액 |
| `useOrderStore` | 주문 유형, 주문번호, 결제 금액, 진행 중 주문 ID |
| `useLanguageStore` | 한국어·영어 선택 |

## 관리자 페이지

### 화면과 라우트

| 경로 | 화면 | 주요 기능 |
| --- | --- | --- |
| `/adminlogin` | 관리자 로그인 | 계정 인증, JWT와 로그인 상태 저장, 오류 안내 |
| `/adminmenu` | 관리자 메인 | 운영 요약, 메뉴·옵션 조회, 검색·카테고리·판매 상태 필터, 변경 이력 |
| `/adminmenuedit` | 메뉴·옵션 관리 | 등록·수정, 이미지 미리보기, 판매 중지·재개, 세트 구성 관리 |
| `/adminorder` | 주문 관리 | 주문 목록·상세, 상태별 표시, 개별·일괄 상태 변경과 취소 |
| `/adminsales` | 매출 대시보드 | 매출 요약·추이·인기 메뉴·결제 수단·내역, 기간 조회와 내보내기 |

### 주요 기능

- 로그인 화면을 제외한 경로는 `ProtectedRoute`로 보호합니다.
- API 요청에 JWT를 자동으로 추가하며, `401` 또는 `403` 응답 시 인증 정보를 지우고 로그인 화면으로 이동합니다.
- 1시간 동안 조작이 없으면 자동 로그아웃하고, 종료 1분 전에 남은 시간을 안내합니다.
- 관리자 메인에서 메뉴명·옵션명 검색, 카테고리 선택, 판매 상태 필터를 한 줄에서 사용할 수 있습니다.
- 메뉴·옵션·주문 데이터 중 일부 조회만 실패해도 정상 데이터는 유지하고, 실패 항목만 안내·재조회할 수 있습니다.
- 메뉴와 옵션의 이미지 등록·수정 및 원본 이미지 미리보기를 지원합니다.
- 메뉴·옵션 가격 입력란은 천 단위 쉼표를 표시하고 저장 시 숫자로 변환합니다.
- 작업 결과를 성공·실패 메시지로 표시하고, 주문 상태는 상태별 색상으로 구분합니다.
- 변경 이력에는 작업 내용, 처리자와 처리 시간을 표시합니다.
- 새 주문을 주기적으로 확인하고 관리자 화면에 알림과 선택적 알림음을 제공합니다.

### 컴포넌트 구조

```text
kiosk-admin/src/components/admin/
├── menu/               # AdminMenu 전용 컴포넌트
├── menu-edit/          # AdminMenuEdit 전용 컴포넌트
├── sales-dashboard/    # AdminSalesDashboard 전용 컴포넌트
└── shared/             # 보호 라우트, 세션 모달, 주문 알림, 이미지 모달
```

`AdminLogin`과 `AdminOrder`는 현재 별도 하위 컴포넌트가 없어 페이지 파일에서 화면을 구성합니다.

### 상태 관리

| Store | 관리 대상 |
| --- | --- |
| `menuStore` | 메뉴 목록과 조회 |
| `optionStore` | 옵션 목록과 조회 |
| `adminOrderStore` | 주문 목록, 상태 변경, 새 주문 감지 |
| `salesStore` | 매출 요약, 인기 메뉴, 내역과 분석 |

## API 연동

API 응답은 백엔드의 실제 데이터를 사용합니다. 이미지 등록·수정 요청은 `multipart/form-data` 형식입니다.

### 고객용

| Method | Endpoint | 기능 |
| --- | --- | --- |
| GET | `/api/menus` | 메뉴·옵션·세트 구성 조회 |
| GET | `/api/options` | 옵션 조회 |
| POST | `/api/orders` | 주문 생성 |
| PATCH | `/api/orders/{orderId}/cancel` | 진행 중 주문 취소 |
| POST | `/api/payments` | 카드·네이버페이 결제 요청 |
| POST | `/api/toss/confirm` | 토스 결제 승인 |
| POST | `/api/toss/fail` | 토스 결제 실패 기록 |

### 관리자용

| Method | Endpoint | 기능 |
| --- | --- | --- |
| POST | `/api/admin/login` | 관리자 인증 및 JWT 발급 |
| GET·POST·PUT | `/api/admin/menus` | 메뉴 조회·등록·수정 |
| GET·PUT | `/api/admin/menus/{id}/components` | 세트 구성 조회·수정 |
| PATCH | `/api/admin/menus/{id}/stop`, `/resume` | 메뉴 판매 중지·재개 |
| GET·POST·PUT | `/api/admin/options` | 옵션 조회·등록·수정 |
| PATCH | `/api/admin/options/{id}/stop`, `/resume` | 옵션 판매 중지·재개 |
| GET | `/api/admin/orders`, `/api/admin/orders/{id}/detail` | 주문 목록·상세 조회 |
| PATCH | `/api/admin/orders/{id}/status`, `/cancel` | 주문 상태 변경·취소 |
| PATCH | `/api/admin/orders/bulk/status`, `/bulk/cancel` | 주문 일괄 처리 |
| GET | `/api/admin/sales/summary`, `/popular`, `/history`, `/analytics` | 매출 조회와 분석 |
| GET | `/api/admin/history` | 관리자 변경 이력 조회 |

자세한 요청·응답 명세는 DevProject Hub의 API 명세서를 기준으로 합니다.

## 환경 변수

각 앱의 루트에 `.env`를 생성합니다.

### `kiosk-customer/.env`

```env
REACT_APP_API_BASE_URL=http://localhost:8080
REACT_APP_TOSS_CLIENT_KEY=토스_클라이언트_키
```

### `kiosk-admin/.env`

```env
REACT_APP_API_BASE_URL=http://localhost:8080
```

환경 변수 변경 후 개발 서버를 다시 시작해야 합니다. `.env`와 실제 인증 키는 Git에 커밋하지 않습니다.

## 설치와 실행

고객용과 관리자용은 각각 의존성을 설치하고 실행합니다.

```bash
git clone https://github.com/boribabmany/BunShik.git
cd BunShik/kiosk-customer
npm install
npm start
```

```bash
cd BunShik/kiosk-admin
npm install
npm start
```

두 앱을 동시에 실행하려면 포트가 겹치지 않도록 한쪽 앱에 다른 포트를 지정합니다.

## 테스트

각 앱 폴더에서 다음 명령을 실행합니다.

```bash
npm test -- --watchAll=false
npm run test:e2e
```

2026-08-18 기준 단위·컴포넌트 테스트 결과:

- 고객용: 13개 테스트 스위트, 62개 테스트 통과
- 관리자용: 22개 테스트 스위트, 78개 테스트 통과
- 합계: 35개 테스트 스위트, 140개 테스트 통과

## 데이터베이스와 문서

주요 테이블은 `menus`, `options`, `menu_options`, `orders`, `order_items`, `order_item_options`, `payments`, `admin_user`, `admin_history`입니다. 세트 구성과 관리자 기능에 필요한 확장 구조는 백엔드 스키마를 기준으로 합니다.

- DB 스키마·ERD: DevProject Hub → DB 설계(Modeler)
- API 명세서: DevProject Hub → API 명세서
- 요구사항·테스트·WBS: DevProject Hub의 각 관리 메뉴
- 화면 설계: DevProject Hub → 화면 설계 / Figma
- 작업일지: `docs/`

## Git 작업 규칙

- `main`: 배포 가능한 안정 버전
- `feature/기능명`: 기능 단위 작업 브랜치
- 작업 전에 최신 변경을 받고, 커밋 전에 `git status`와 민감 파일 포함 여부를 확인합니다.
- 커밋 메시지는 `feat:`, `fix:`, `test:`, `docs:`, `chore:` 등의 접두사로 구분합니다.
