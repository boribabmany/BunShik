import csv
from datetime import datetime, timezone
from html import escape
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile


ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
XLSX_OUTPUT = DOCS / "분식집키오스크_팀전체_작업일지.xlsx"
CSV_OUTPUT = DOCS / "분식집키오스크_팀전체_날짜별작업.csv"
HTML_OUTPUT = DOCS / "team-worklog-print.html"

ROWS = [
    ("2026-07-13", "공동", "기획·환경", "페이지 구성안과 사용자 화면 흐름을 정리하고 공유 DB 적용 방향 및 Git 저장소 폴더 구조를 확정함."),
    ("2026-07-13", "강민준", "관리자 프론트", "관리자 React 프로젝트 뼈대를 구성하고 로그인·메뉴·주문·매출 관리 화면의 기본 구조를 작성함."),
    ("2026-07-13", "박유진", "고객 프론트", "고객 키오스크 React 환경을 구성하고 홈·메뉴·옵션·장바구니·결제·주문 완료 화면과 기본 상태 관리를 구현함."),
    ("2026-07-14", "강민준", "관리자 프론트", "병합 중 손상된 관리자 코드를 복구하고 주문관리 API를 화면에서 분리했으며 관리자 기능과 디자인을 수정함."),
    ("2026-07-14", "박유진", "고객 프론트", "빈 장바구니의 주문 버튼을 비활성화하고 결제 API 예외·타임아웃 처리와 홈 화면 구성을 보완함."),
    ("2026-07-15", "강민준", "관리자 프론트", "Zustand 상태 관리와 관리자 인증을 정비하고 메뉴 필수값·가격 유효성 검사 및 편집 화면을 개선함."),
    ("2026-07-15", "박유진", "고객 프론트", "메뉴·옵션·장바구니·결제·완료 화면 디자인을 적용하고 품절·조회 실패·빈 주문 안내와 영수증 출력 흐름을 구현함."),
    ("2026-07-16", "강민준", "관리자 품질", "메뉴·옵션 CRUD와 주문 상태 변경을 화면에 연결하고 저장 후 초기화 처리 및 로그인·CRUD·주문 자동 테스트를 작성함."),
    ("2026-07-16", "박유진", "고객 기능", "사이드 카테고리와 슬라이드 탐색, 90초 유휴 경고·초기화, 네트워크 오류 안내, 장바구니 수량 계산을 구현함."),
    ("2026-07-19", "강민준", "관리자 프론트", "관리자 주요 화면의 기능과 사용자 동선을 점검하고 공통 배치와 스타일을 보완함."),
    ("2026-07-20", "강민준", "관리자 대시보드", "매출 대시보드 페이지와 API·Store·통계 컴포넌트를 구성하고 관리자 화면 CSS를 1차 정리함."),
    ("2026-07-20", "박유진", "고객 결제", "장바구니와 결제 내역 배치를 조정하고 네이버페이·카카오페이·카드 결제수단 선택 팝업 및 출력 버튼을 개선함."),
    ("2026-07-21", "공동", "저장소 통합", "관리자와 고객 프로젝트를 kiosk-admin·kiosk-customer로 분리하고 루트 README·gitignore·병합 구조를 정리함."),
    ("2026-07-21", "강민준", "관리자 프론트", "관리자 JWT 로그인·토큰 저장·보호 라우팅을 구성하고 메뉴 관리 화면과 CSS 오류를 수정함."),
    ("2026-07-21", "박유진", "고객 프론트", "홈·메뉴·장바구니·결제·완료 화면에 한영 다국어와 화면 크기별 자동 스케일을 적용함."),
    ("2026-07-22", "공동", "백엔드 기반", "Spring Boot 프로젝트 초기 설정과 패키지 재배치, 데이터 접근 구조와 공통 설정의 병합 기반을 마련함."),
    ("2026-07-22", "강민준", "관리자 백엔드", "관리자 Controller·Service·DTO·예외 처리 패키지를 구성하고 관리자 기능 구현 기반을 정리함."),
    ("2026-07-22", "박유진", "고객 백엔드", "키오스크 패키지·공용 Entity·Mapper 구조와 DB 연결 설정을 구성하고 프로젝트 실행 설정을 보완함."),
    ("2026-07-23", "강민준", "관리자 연동", "관리자 메뉴·옵션·주문 DTO/API, CORS 설정과 최근 변경 이력 저장·조회 기능을 구현하고 프론트에 연결함."),
    ("2026-07-23", "박유진", "고객 연동", "메뉴·옵션 한영 조회, 이미지 제공, 주문·결제 API와 MyBatis 매퍼를 구현하고 고객 화면과 실제 연동함."),
    ("2026-07-24", "강민준", "관리자 백엔드", "메뉴·옵션 이미지 업로드·교체·삭제 처리와 공통 ApiResponse 적용을 시작하고 관련 프론트 API를 수정함."),
    ("2026-07-24", "박유진", "주문·결제", "주문과 결제 아키텍처를 분리하고 주문 항목·선택 옵션 생성, 서버 가격 검증, 결제 결과 저장 및 상태 연동을 구현함."),
    ("2026-07-26", "강민준", "공통 응답", "관리자 API별 성공·실패 응답을 공통 ApiResponse 형식으로 통일하고 프론트 데이터 처리 방식을 맞춤."),
    ("2026-07-27", "강민준", "인증·보안", "JWT 로그인과 Spring Security 필터·권한 설정을 연결하고 401/403 응답, 비밀키 환경변수, 교체 이미지 삭제를 정비함."),
    ("2026-07-28", "강민준", "관리자 운영", "매출 KPI·30일 추이·인기 메뉴 차트와 판매중단 처리를 보완하고 관리자 API 명세를 현행화함."),
    ("2026-07-28", "박유진", "결제 안정성", "결제 실패를 유형별로 구분하고 자동 재시도 정책, 미결제 주문 관리자 노출 방지, 고객 화면 영문·이미지 표시를 보완함."),
    ("2026-07-29", "강민준", "관리자 주문·품질", "주문별 메뉴·옵션 상세 조회, JWT 환경변수, 백엔드 관리자 자동 테스트와 README 실행 문서를 정리함."),
    ("2026-07-29", "박유진", "간편결제", "네이버페이·카카오페이 QR 모달과 결제 실패·포기·중복 결제 방지 흐름을 구현하고 Security CORS 연결을 수정함."),
    ("2026-07-30", "강민준", "관리자 테스트", "관리자 로그인·메뉴·옵션·주문·매출 프론트 테스트를 추가하고 콘솔 오류와 주문 상태 검증 문제를 수정함."),
    ("2026-07-30", "박유진", "주문 검증", "옵션 최대 2개, 주문 유형, 품절·판매중단 메뉴 및 옵션에 대한 서버 검증을 추가하고 품절 표시용 응답을 보완함."),
    ("2026-07-31", "공동", "세트 메뉴 통합", "관리자 세트 구성 기능과 고객 그룹 선택형 세트 주문 기능을 통합하고 Mapper 충돌 및 데이터 명칭을 정리함."),
    ("2026-07-31", "강민준", "관리자 세트", "세트 메뉴·구성 메뉴 CRUD, 선택 그룹·최대 선택 수·추가금액 설정 및 구성 조회·저장·검증을 구현함."),
    ("2026-07-31", "박유진", "고객 세트·결제", "구성품 품절 시 세트 자동 품절, 그룹 선택형 세트 가격 계산·주문 검증, 결제 중 뒤로가기 차단과 실패 UI를 구현함."),
    ("2026-08-03", "강민준", "관리자 고도화", "관리자 메뉴관리 컴포넌트를 분리하고 메뉴 유형·세트 추가금액 데이터를 정비했으며 완료 주문 매출 반영과 로그인 5회 제한을 적용함."),
    ("2026-08-03", "박유진", "세트·간편결제", "떡순튀세트 맛·구성 선택과 Toss Payments 승인 API를 추가하고 토스페이·카카오페이 결제수단을 구분 저장하도록 구현함."),
    ("2026-08-04", "강민준", "관리자 UI", "메뉴·옵션·세트 관리 화면의 열 너비, 버튼 위치, 여백과 정렬을 조정함."),
    ("2026-08-05", "강민준", "설정·관리 화면", "프론트·백엔드 환경변수 예제를 정비하고 관리자 세트·구성품 가로 배치, 페이지 처리, multipart 업로드 제한을 개선함."),
    ("2026-08-06", "강민준", "관리자 알림·세트", "신규 주문 배지·지연 경고·전역 토스트 알림을 구현하고 세트 선택 그룹 데이터와 구성 전용 메뉴 필터를 보완함."),
    ("2026-08-06", "박유진", "고객 결제·옵션", "토스·카카오 결제 취소 안내와 승인 API 중복 호출 방지를 적용하고 떡볶이 단품 맛 선택 기능을 구현함."),
    ("2026-08-07", "강민준", "관리자 마무리", "관리자 메뉴·옵션 목록의 내부 번호를 숨기고 관련 자동 테스트와 메뉴관리 표시·정렬을 수정함."),
    ("2026-08-07", "박유진", "고객 품질", "고객 키오스크 자동 테스트를 추가하고 옵션 카드 3개 이상 가로 슬라이드, 환경변수 예제와 결제 화면 구성을 정리함."),
    ("2026-08-10", "강민준", "검증·문서", "관리자 자동 테스트 65건 전체 통과를 확인하고 태블릿 체크리스트와 프로덕션 빌드, 프로젝트 구조도 및 개인·팀 작업일지를 정리함."),
]

MEMBERS = [
    ("강민준", "관리자 React 및 관련 백엔드", "JWT 인증, 메뉴·옵션·세트 관리, 주문 운영, 매출 대시보드, 신규 주문 알림, 테스트·문서화"),
    ("박유진", "고객 키오스크 및 주문·결제 백엔드", "홈·메뉴·옵션·장바구니·결제 UI, 다국어, 주문 검증, 그룹형 세트, Toss·Kakao 결제, 고객 테스트"),
    ("공동", "프로젝트 기반 및 통합", "화면 흐름, 공유 DB 방향, Git 구조, 프론트 분리, 백엔드 기반, 세트 메뉴 통합과 충돌 해결"),
]


def col_name(number):
    result = ""
    while number:
        number, remainder = divmod(number - 1, 26)
        result = chr(65 + remainder) + result
    return result


def cell(row, column, value, style=0):
    ref = f"{col_name(column)}{row}"
    if isinstance(value, int):
        return f'<c r="{ref}" s="{style}"><v>{value}</v></c>'
    return f'<c r="{ref}" s="{style}" t="inlineStr"><is><t>{escape(str(value))}</t></is></c>'


def sheet_xml(rows, widths, merges=(), freeze_row=None, auto_filter=None):
    columns = "".join(
        f'<col min="{index}" max="{index}" width="{width}" customWidth="1"/>'
        for index, width in enumerate(widths, 1)
    )
    row_xml = "".join(
        f'<row r="{index}" ht="{height}" customHeight="1">'
        + "".join(cell(index, col, value, style) for col, value, style in values)
        + "</row>"
        for index, height, values in rows
    )
    last_row = max(row[0] for row in rows)
    dimension = f'<dimension ref="A1:{col_name(len(widths))}{last_row}"/>'
    if freeze_row:
        views = f'<sheetViews><sheetView workbookViewId="0"><pane ySplit="{freeze_row}" topLeftCell="A{freeze_row + 1}" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>'
    else:
        views = '<sheetViews><sheetView workbookViewId="0"/></sheetViews>'
    merge_xml = ""
    if merges:
        merge_xml = f'<mergeCells count="{len(merges)}">' + "".join(f'<mergeCell ref="{item}"/>' for item in merges) + "</mergeCells>"
    filter_xml = f'<autoFilter ref="{auto_filter}"/>' if auto_filter else ""
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
{dimension}{views}<cols>{columns}</cols><sheetData>{row_xml}</sheetData>{merge_xml}{filter_xml}
<pageMargins left="0.4" right="0.4" top="0.6" bottom="0.6" header="0.2" footer="0.2"/>
</worksheet>'''


summary_rows = [
    (1, 32, [(1, "분식집 키오스크 팀 전체 작업일지", 1)]),
    (2, 24, [(1, "팀원: 강민준, 박유진 | 기간: 2026-07-13 ~ 2026-08-10", 2)]),
    (4, 24, [(1, "구분", 3), (2, "내용", 3)]),
    (5, 28, [(1, "DevProject Hub", 4), (2, "WBS·요구사항·추적성·QA 진행률 100%, 등록 결함 0건", 4)]),
    (6, 28, [(1, "완료 WBS", 4), (2, "강민준 27건 · 박유진 22건 · 공동 3건 · 담당 미지정 6건", 4)]),
    (8, 24, [(1, "담당", 3), (2, "주요 역할 및 결과", 3)]),
]
for index, (member, role, detail) in enumerate(MEMBERS, 9):
    summary_rows.append((index, 48, [(1, f"{member} · {role}", 4), (2, detail, 4)]))
summary_rows.append((13, 60, [(1, "팀 결과: React 관리자·고객 키오스크와 Spring Boot·MyBatis·MySQL 백엔드를 연동하고, 메뉴·옵션·세트·주문·결제·매출·인증·알림·자동 테스트까지 구현함.", 5)]))

daily_rows = [
    (1, 32, [(1, "날짜별·팀원별 작업일지", 1)]),
    (3, 25, [(1, "번호", 3), (2, "날짜", 3), (3, "담당자", 3), (4, "구분", 3), (5, "주요 작업 및 결과", 3)]),
]
for index, (date, member, area, task) in enumerate(ROWS, 1):
    daily_rows.append((index + 3, 52, [(1, index, 6), (2, date, 6), (3, member, 6), (4, area, 4), (5, task, 4)]))

evidence_rows = [
    (1, 32, [(1, "작성 기준 및 참고", 1)]),
    (3, 25, [(1, "항목", 3), (2, "내용", 3)]),
    (4, 42, [(1, "자료 출처", 4), (2, "DevProject Hub 워크스페이스 ID 5 WBS, 프론트·백엔드 Git 전체 커밋 기록", 4)]),
    (5, 50, [(1, "작성자 식별", 4), (2, "강민준: 나다·Kingみんじゅん·workspace 계정 / 박유진: pyouji99@naver.com·boribabmany", 4)]),
    (6, 50, [(1, "담당 미지정 WBS", 4), (2, "영수증 인쇄, 유휴 초기화, 빈 장바구니 차단, 카테고리 탐색, 주문 상태 검증, 메인 화면 등은 Git 근거가 있는 날짜·담당자 작업에 포함하되 WBS 통계에서는 미지정으로 유지", 4)]),
    (7, 50, [(1, "주의사항", 4), (2, "커밋과 WBS에 나타난 구현 작업을 기준으로 요약했으며 회의·구두 검수 등 기록이 없는 활동은 누락될 수 있음", 4)]),
]

styles = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<fonts count="4"><font><sz val="10"/><name val="맑은 고딕"/></font><font><b/><color rgb="FFFFFFFF"/><sz val="18"/><name val="맑은 고딕"/></font><font><color rgb="FF555555"/><sz val="11"/><name val="맑은 고딕"/></font><font><b/><sz val="10"/><name val="맑은 고딕"/></font></fonts>
<fills count="4"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF175C36"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFD9EAD3"/></patternFill></fill></fills>
<borders count="2"><border/><border><left style="thin"><color rgb="FFD9D9D9"/></left><right style="thin"><color rgb="FFD9D9D9"/></right><top style="thin"><color rgb="FFD9D9D9"/></top><bottom style="thin"><color rgb="FFD9D9D9"/></bottom></border></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="7"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="2" fillId="0" borderId="0" applyFont="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="3" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="1" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="1" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf></cellXfs>
<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>'''

workbook = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="팀 요약" sheetId="1" r:id="rId1"/><sheet name="날짜별 팀 작업" sheetId="2" r:id="rId2"/><sheet name="근거 및 참고" sheetId="3" r:id="rId3"/></sheets></workbook>'''

DOCS.mkdir(parents=True, exist_ok=True)
with ZipFile(XLSX_OUTPUT, "w", ZIP_DEFLATED) as archive:
    archive.writestr("[Content_Types].xml", '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/worksheets/sheet3.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>''')
    archive.writestr("_rels/.rels", '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>''')
    archive.writestr("xl/_rels/workbook.xml.rels", '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet3.xml"/><Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>''')
    archive.writestr("xl/workbook.xml", workbook)
    archive.writestr("xl/styles.xml", styles)
    archive.writestr("xl/worksheets/sheet1.xml", sheet_xml(summary_rows, [38, 100, 4, 4, 4], ["A1:E1", "A2:E2", "A13:E13"]))
    archive.writestr("xl/worksheets/sheet2.xml", sheet_xml(daily_rows, [8, 15, 14, 20, 105], ["A1:E1"], 3, f"A3:E{len(ROWS) + 3}"))
    archive.writestr("xl/worksheets/sheet3.xml", sheet_xml(evidence_rows, [24, 115, 4], ["A1:C1"]))
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    archive.writestr("docProps/core.xml", f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>분식집 키오스크 팀 전체 작업일지</dc:title><dc:creator>OpenAI Codex</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">{timestamp}</dcterms:created></cp:coreProperties>''')
    archive.writestr("docProps/app.xml", '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>Microsoft Excel</Application></Properties>''')

with CSV_OUTPUT.open("w", encoding="utf-8-sig", newline="") as csv_file:
    writer = csv.writer(csv_file)
    writer.writerow(["번호", "날짜", "담당자", "구분", "주요 작업 및 결과"])
    for index, row in enumerate(ROWS, 1):
        writer.writerow([index, *row])

daily_html = "\n".join(
    f'<tr><td class="no">{index}</td><td class="date">{escape(date)}</td><td class="member">{escape(member)}</td><td class="area">{escape(area)}</td><td>{escape(task)}</td></tr>'
    for index, (date, member, area, task) in enumerate(ROWS, 1)
)
member_html = "\n".join(
    f'<div class="card"><strong>{escape(member)}</strong><b>{escape(role)}</b><br>{escape(detail)}</div>'
    for member, role, detail in MEMBERS
)
html = f'''<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><title>분식집 키오스크 팀 전체 작업일지</title>
<style>
@page {{ size:A4 landscape; margin:9mm; }} * {{ box-sizing:border-box; }}
body {{ margin:0; color:#172033; font-family:"Malgun Gothic",sans-serif; font-size:10px; }}
h1 {{ margin:0 0 5px; font-size:25px; }} h2 {{ margin:14px 0 7px; color:#175c36; font-size:16px; }}
.subtitle {{ margin-bottom:12px; color:#596273; font-size:12px; }} .summary {{ display:grid; grid-template-columns:repeat(3,1fr); gap:8px; }}
.card {{ border:1px solid #cbd5e1; border-radius:7px; padding:9px; background:#f8fafc; line-height:1.5; }} .card strong {{ display:block; color:#175c36; font-size:14px; }}
table {{ width:100%; border-collapse:collapse; table-layout:fixed; }} th {{ padding:6px; color:white; background:#175c36; border:1px solid #175c36; }}
td {{ padding:5px 7px; border:1px solid #cbd5e1; vertical-align:top; line-height:1.4; }} tbody tr:nth-child(even) {{ background:#f6faf7; }}
.no {{ width:5%; text-align:center; }} .date {{ width:11%; text-align:center; }} .member {{ width:9%; text-align:center; }} .area {{ width:13%; }} tr {{ break-inside:avoid; }}
.note {{ margin-top:12px; padding:10px; border:1px solid #f0b429; background:#fff9e8; line-height:1.55; }} .source {{ margin-top:8px; color:#596273; font-size:9px; }}
</style></head><body>
<h1>분식집 키오스크 팀 전체 작업일지</h1><div class="subtitle">팀원: 강민준 · 박유진 | 기간: 2026-07-13 ~ 2026-08-10</div>
<div class="summary">{member_html}</div>
<div class="note"><b>완료 현황</b><br>DevProject Hub 기준 WBS·요구사항·추적성·QA 진행률 100%, 등록 결함 0건. 완료 WBS: 강민준 27건, 박유진 22건, 공동 3건, 담당 미지정 6건.</div>
<h2>날짜별·팀원별 상세 작업</h2><table><thead><tr><th class="no">번호</th><th class="date">날짜</th><th class="member">담당자</th><th class="area">구분</th><th>주요 작업 및 결과</th></tr></thead><tbody>{daily_html}</tbody></table>
<div class="source">작성 근거: DevProject Hub 워크스페이스 ID 5 WBS 및 프론트·백엔드 전체 Git 커밋 기록. 기록이 없는 회의·구두 검수 활동은 누락될 수 있음.</div>
</body></html>'''
HTML_OUTPUT.write_text(html, encoding="utf-8")

print(XLSX_OUTPUT)
print(CSV_OUTPUT)
print(HTML_OUTPUT)
