# BunShik RTOS 아키텍처·IPC 설계

## 목적

키오스크 주문·출력과 관리자 데이터 감시를 FreeRTOS 기반 작업으로 분리하고, 백엔드 데이터 변화와 출력 결과를 안정적으로 처리한다.

## 구성

```text
고객 키오스크
  └─ POST /api/print-jobs ──> Spring Boot ──> print_jobs
                                              │
RTOS 출력 Worker <── GET /api/print-jobs/pending
  └─ PATCH /api/print-jobs/{id}/complete ────┘

RTOS 관리자 서비스
  ├─ 주문 감시 Task
  ├─ 메뉴·옵션 카탈로그 감시 Task
  ├─ 날짜별 로그 기록 Task
  └─ backend_client / admin_service
```

## 출력 작업 흐름

1. 고객이 주문 완료 화면에서 영수증 또는 주문번호표 출력을 요청한다.
2. 백엔드는 `print_jobs`에 `PENDING` 작업을 등록한다.
3. RTOS 출력 Worker가 대기 작업을 조회해 출력 데이터를 처리한다.
4. 출력 성공 또는 실패 결과를 완료 API로 반영한다.
5. 용지 부족·걸림·잉크 부족·통신 실패 시 결과를 기록하고 재출력 안내를 제공한다.

## 동기화·IPC 원칙

- 각 감시·출력 기능은 독립 Task로 동작한다.
- 공유 출력 상태와 작업 데이터는 Mutex로 보호한다.
- 이벤트 대기·작업 완료 신호는 Semaphore와 Task Notification으로 전달한다.
- 네트워크 장애는 재시도하고, JWT 만료는 자동 재로그인 뒤 감시를 재개한다.
- 같은 데이터 변화가 반복 수신되면 중복 알림을 방지한다.

## 검증 근거

- 관리자 RTOS 자동 테스트 5개 파일 통과
- 고객 키오스크 출력 RTOS 자동 테스트 7개 파일 통과
- 주문 → 결제 → RTOS 출력 E2E 검증 완료
- 고객·관리자 React 단위 테스트: 35개 테스트 파일, 142건 통과

## 확인 범위

이 문서는 현재 BunShik 저장소의 고객 출력 API 연동 코드, DevProject Hub의 `print_jobs`·출력 API 명세, 작업 기록을 기반으로 작성했다. RTOS 원본 소스와 저수준 동기화 구현은 별도 BunShik_RTOS 저장소에서 함께 확인·관리한다.
