import csv
from datetime import datetime, timezone
from html import escape
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "docs" / "강민준_분식집키오스크_작업일지.xlsx"
CSV_OUTPUT = ROOT / "docs" / "강민준_날짜별_작업일지.csv"
HTML_OUTPUT = ROOT / "docs" / "worklog-print.html"

DAILY = [
    ("2026-07-13", "관리자 React 프로젝트의 기본 디렉터리와 공통 화면 구조를 구성하고, 로그인·메뉴·주문·매출 화면의 이동 흐름과 Git 저장소 운영 구조를 정리함."),
    ("2026-07-14", "관리자 주문관리 API 호출 코드를 화면에서 분리하고 주문 화면의 기능·디자인을 조정함. 병합 과정에서 손상된 코드와 충돌 부분을 복구하여 실행 가능한 상태로 정리함."),
    ("2026-07-15", "Zustand 기반 상태 관리를 적용하고 관리자 인증 흐름을 수정함. 메뉴 필수 입력값과 가격 유효성 검사를 추가하고 메뉴 편집 화면의 입력·저장 동작을 개선함."),
    ("2026-07-16", "관리자 메뉴·옵션 등록·조회·수정·판매 상태 변경 기능을 API와 연결함. 저장 후 목록과 입력 상태가 갱신되도록 수정하고 로그인·메뉴·옵션·주문 자동 테스트를 작성함."),
    ("2026-07-19", "관리자 프론트의 주요 화면을 점검하면서 메뉴 및 주문 관리 기능의 표시 오류와 사용자 동선을 수정하고, 공통 스타일과 화면 배치를 보완함."),
    ("2026-07-20", "관리자 매출 대시보드 페이지를 추가하고 매출 API·Zustand Store·통계 컴포넌트를 구성함. 요약 정보와 차트, 관리 화면의 CSS를 정리함."),
    ("2026-07-21", "관리자와 고객 React 프로젝트를 각각 kiosk-admin·kiosk-customer로 분리함. 관리자 메뉴 스타일을 조정하고 JWT 로그인, 토큰 저장, 보호 라우팅 구조를 구현함."),
    ("2026-07-22", "Spring Boot 백엔드에 관리자 기능 패키지를 구성하고 Controller·Service·DTO·예외 처리·공통 설정의 역할을 분리하여 API 구현 기반을 마련함."),
    ("2026-07-23", "관리자 메뉴·옵션·주문 DTO와 REST API를 구현하고 프론트 호출 구조와 연결함. 개발 환경 CORS 허용 범위를 설정하고 최근 변경 이력 조회 기능을 연동함."),
    ("2026-07-24", "메뉴·옵션 이미지의 업로드·교체·삭제 처리와 이미지 URL 반환 방식을 구현함. API 응답을 공통 ApiResponse 형식으로 감싸도록 적용함."),
    ("2026-07-26", "관리자 API별로 달랐던 성공·실패 응답 형식을 공통 ApiResponse 구조로 통일하고, 프론트에서 동일한 방식으로 데이터를 읽을 수 있도록 정리함."),
    ("2026-07-27", "JWT 관리자 로그인을 프론트·백엔드에 연결하고 Spring Security 필터와 권한 설정을 구성함. 인증 실패 401과 권한 부족 403 응답 형식을 통일하고 관련 코드를 정리함."),
    ("2026-07-28", "관리자 매출 대시보드에 매출 추이·인기 메뉴·결제 수단 차트를 구성함. 메뉴 영문 정보와 판매 중단·재개 처리를 보완하고 매출 API 응답을 화면 요구사항에 맞게 현행화함."),
    ("2026-07-29", "주문관리 화면에서 주문별 메뉴·옵션 상세 정보를 조회하도록 구현함. 백엔드 자동 테스트를 보강하고 JWT 비밀값을 환경변수로 분리했으며 README 실행·설정 내용을 정리함."),
    ("2026-07-30", "관리자 로그인·메뉴·옵션·주문·매출 관련 프론트 자동 테스트를 추가함. 테스트 중 발견된 콘솔 오류를 수정하고 서버의 주문 상태 변경 검증 로직을 보완함."),
    ("2026-07-31", "관리자에서 세트 메뉴와 구성 메뉴를 등록·수정할 수 있도록 CRUD 기능을 구현함. 선택 그룹·최대 선택 수·추가금액을 설정하고 구성품 조회·저장·유효성 검사를 연결함."),
    ("2026-08-03", "관리자 메뉴관리 화면을 폼·목록·세트 구성 컴포넌트로 분리하여 리팩터링함. 메뉴 유형과 세트 추가금액 데이터를 분리하고 완료 주문의 매출 반영, 관리자 로그인 5회 제한을 적용함."),
    ("2026-08-04", "관리자 메뉴·옵션·세트 관리 화면의 열 너비, 버튼 위치, 여백과 정렬을 조정하여 목록과 편집 영역이 일관되게 표시되도록 CSS를 보완함."),
    ("2026-08-05", "환경변수 예제 파일을 정비하고 세트·구성품을 가로 배치하도록 화면을 개선함. 목록 페이지 처리와 이미지 multipart 업로드 허용 크기를 조정함."),
    ("2026-08-06", "세트 메뉴의 맛·구성 선택 UI와 구성 전용 메뉴 필터를 적용함. 신규 주문 배지, 일정 시간 지연 주문 경고, 어느 관리자 화면에서든 표시되는 전역 주문 알림 토스트와 소리를 구현하고 테스트함."),
    ("2026-08-07", "관리자 메뉴·옵션 목록에서 내부 관리 번호가 노출되지 않도록 변경하고 관련 컴포넌트 테스트를 수정함. 메뉴관리 UI의 문구·표시·정렬을 최종 점검함."),
    ("2026-08-10", "관리자 최신 프론트 자동 테스트를 실행하고 API 주소를 localhost로 고정하던 메뉴·옵션 API 테스트를 환경변수 기준으로 보정하여 65건 전체 통과를 확인함. 실제 태블릿용 관리자 테스트 체크리스트 20개 항목을 작성하고, 관리자 프로덕션 빌드를 생성하여 배포 파일 생성 성공을 확인함. 프론트·백엔드 구조와 기술 버전을 재점검하고 프로젝트 구조 문서를 보강함."),
]

AREAS = [
    ("관리자 프론트엔드", "관리자 React 화면 전반, 메뉴·옵션·세트 관리 UI, 주문 관리, 매출 대시보드"),
    ("인증·보안", "JWT 로그인, 보호 라우팅, Spring Security, 401/403 공통 응답, 환경변수 분리"),
    ("관리자 백엔드", "관리자 Controller·Service·MyBatis Mapper, 메뉴·옵션·주문·매출·이력 API"),
    ("데이터·세트 메뉴", "메뉴 유형, 세트 구성, 추가금액, 선택 그룹, is_component_only 필터"),
    ("주문 운영", "주문 상세 조회, 상태 변경·취소, 신규 주문 배지, 지연 경고, 전역 토스트"),
    ("품질 관리", "프론트·백엔드 자동 테스트, API 명세 현행화, README와 .env.example 정비"),
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
    pane = ""
    if freeze_row:
        pane = f'<sheetViews><sheetView workbookViewId="0"><pane ySplit="{freeze_row}" topLeftCell="A{freeze_row + 1}" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>'
    else:
        pane = '<sheetViews><sheetView workbookViewId="0"/></sheetViews>'
    merge_xml = ""
    if merges:
        merge_xml = f'<mergeCells count="{len(merges)}">' + "".join(f'<mergeCell ref="{m}"/>' for m in merges) + "</mergeCells>"
    filter_xml = f'<autoFilter ref="{auto_filter}"/>' if auto_filter else ""
    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
{pane}<cols>{columns}</cols><sheetData>{row_xml}</sheetData>{merge_xml}{filter_xml}
<pageMargins left="0.4" right="0.4" top="0.6" bottom="0.6" header="0.2" footer="0.2"/>
</worksheet>'''


summary_rows = [
    (1, 32, [(1, "분식집 키오스크 프로젝트 작업일지", 1)]),
    (2, 24, [(1, "담당자: 강민준 | 기간: 2026-07-13 ~ 2026-08-10", 2)]),
    (4, 24, [(1, "구분", 3), (2, "내용", 3)]),
    (5, 24, [(1, "확인 가능한 작업일", 4), (2, "22일", 4)]),
    (6, 24, [(1, "단독 담당 WBS", 4), (2, "27건 (모두 DONE)", 4)]),
    (7, 24, [(1, "공동 담당 WBS", 4), (2, "3건 (모두 DONE)", 4)]),
    (9, 24, [(1, "핵심 담당 영역", 3), (2, "주요 내용", 3)]),
]
for row_index, area in enumerate(AREAS, 10):
    summary_rows.append((row_index, 38, [(1, area[0], 4), (2, area[1], 4)]))
summary_rows.append((18, 65, [(1, "요약: 관리자 키오스크의 프론트엔드 전반과 관련 백엔드 API를 담당하고, 메뉴·옵션·세트 관리, 주문 처리, JWT 인증, 매출 대시보드, 신규 주문 알림, 자동 테스트, 실기기 체크리스트 및 빌드·문서화를 수행함.", 5)]))

daily_rows = [
    (1, 32, [(1, "날짜별 작업일지", 1)]),
    (3, 25, [(1, "번호", 3), (2, "날짜", 3), (3, "주요 작업", 3)]),
]
for index, (date, task) in enumerate(DAILY, 1):
    daily_rows.append((index + 3, 58, [(1, index, 6), (2, date, 6), (3, task, 4)]))

evidence_rows = [
    (1, 32, [(1, "작성 기준 및 참고", 1)]),
    (3, 25, [(1, "항목", 3), (2, "내용", 3)]),
    (4, 38, [(1, "자료 출처", 4), (2, "DevProject Hub 분식집 키오스크 워크스페이스(ID 5) WBS 및 프론트·백엔드 Git 커밋 기록", 4)]),
    (5, 38, [(1, "담당자 식별", 4), (2, "강민준 및 Git 작성자 별칭 '나다', 'Kingみんじゅん', 관련 workspace 계정을 동일 담당자로 간주", 4)]),
    (6, 38, [(1, "작업일 계산", 4), (2, "Git에서 관련 담당자 커밋이 확인되는 날짜를 중복 제거하여 계산", 4)]),
    (7, 38, [(1, "주의사항", 4), (2, "커밋이 없는 기획·회의·검수 시간은 작업일 수에 포함되지 않을 수 있음", 4)]),
    (9, 38, [(1, "주요 기술", 4), (2, "React, Zustand, Axios, Recharts, Spring Boot, Spring Security, JWT, MyBatis, MySQL", 4)]),
]

styles = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<fonts count="4"><font><sz val="10"/><name val="맑은 고딕"/></font><font><b/><color rgb="FFFFFFFF"/><sz val="18"/><name val="맑은 고딕"/></font><font><color rgb="FF555555"/><sz val="11"/><name val="맑은 고딕"/></font><font><b/><sz val="10"/><name val="맑은 고딕"/></font></fonts>
<fills count="4"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFC65911"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFD9EAD3"/><bgColor indexed="64"/></patternFill></fill></fills>
<borders count="2"><border/><border><left style="thin"><color rgb="FFD9D9D9"/></left><right style="thin"><color rgb="FFD9D9D9"/></right><top style="thin"><color rgb="FFD9D9D9"/></top><bottom style="thin"><color rgb="FFD9D9D9"/></bottom></border></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="7"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="2" fillId="0" borderId="0" applyFont="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="3" fillId="3" borderId="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="1" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="1" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf></cellXfs>
<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>'''

workbook = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="요약" sheetId="1" r:id="rId1"/><sheet name="날짜별 작업일지" sheetId="2" r:id="rId2"/><sheet name="근거 및 참고" sheetId="3" r:id="rId3"/></sheets></workbook>'''

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
with ZipFile(OUTPUT, "w", ZIP_DEFLATED) as archive:
    archive.writestr("[Content_Types].xml", '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/worksheets/sheet3.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>''')
    archive.writestr("_rels/.rels", '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>''')
    archive.writestr("xl/_rels/workbook.xml.rels", '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet3.xml"/><Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>''')
    archive.writestr("xl/workbook.xml", workbook)
    archive.writestr("xl/styles.xml", styles)
    archive.writestr("xl/worksheets/sheet1.xml", sheet_xml(summary_rows, [24, 85, 4, 4], ["A1:D1", "A2:D2", "A18:D18"]))
    archive.writestr("xl/worksheets/sheet2.xml", sheet_xml(daily_rows, [8, 15, 120], ["A1:C1"], 3, f"A3:C{len(DAILY) + 3}"))
    archive.writestr("xl/worksheets/sheet3.xml", sheet_xml(evidence_rows, [20, 100, 4], ["A1:C1"]))
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    archive.writestr("docProps/core.xml", f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>강민준 분식집 키오스크 작업일지</dc:title><dc:creator>OpenAI Codex</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">{timestamp}</dcterms:created></cp:coreProperties>''')
    archive.writestr("docProps/app.xml", '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>Microsoft Excel</Application></Properties>''')

print(OUTPUT)

with CSV_OUTPUT.open("w", encoding="utf-8-sig", newline="") as csv_file:
    writer = csv.writer(csv_file)
    writer.writerow(["번호", "날짜", "주요 작업"])
    for index, (date, task) in enumerate(DAILY, 1):
        writer.writerow([index, date, task])

print(CSV_OUTPUT)

daily_html = "\n".join(
    f'<tr><td class="no">{index}</td><td class="date">{escape(date)}</td><td>{escape(task)}</td></tr>'
    for index, (date, task) in enumerate(DAILY, 1)
)
areas_html = "\n".join(
    f'<div class="area"><b>{escape(area)}</b><br>{escape(description)}</div>'
    for area, description in AREAS
)
html = f'''<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <title>강민준 분식집 키오스크 작업일지</title>
  <style>
    @page {{ size: A4 landscape; margin: 10mm; }}
    * {{ box-sizing: border-box; }}
    body {{ margin: 0; color: #172033; font-family: "Malgun Gothic", sans-serif; font-size: 11px; }}
    h1 {{ margin: 0 0 6px; font-size: 26px; }}
    h2 {{ margin: 16px 0 8px; color: #175c36; font-size: 17px; }}
    .subtitle {{ margin-bottom: 14px; color: #596273; font-size: 13px; }}
    .summary {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }}
    .card {{ border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; background: #f8fafc; }}
    .card strong {{ display: block; margin-bottom: 4px; color: #175c36; font-size: 14px; }}
    table {{ width: 100%; border-collapse: collapse; table-layout: fixed; }}
    th {{ padding: 7px; color: white; background: #175c36; border: 1px solid #175c36; }}
    td {{ padding: 6px 8px; border: 1px solid #cbd5e1; vertical-align: top; line-height: 1.45; }}
    tbody tr:nth-child(even) {{ background: #f6faf7; }}
    .no {{ width: 6%; text-align: center; }}
    .date {{ width: 14%; text-align: center; white-space: nowrap; }}
    .areas {{ display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }}
    .area {{ border-left: 5px solid #16835a; background: #f1f8f4; padding: 9px 12px; }}
    .area b {{ color: #175c36; }}
    .note {{ margin-top: 14px; padding: 11px; border: 1px solid #f0b429; background: #fff9e8; line-height: 1.6; }}
    .source {{ margin-top: 9px; color: #596273; font-size: 9px; }}
    tr {{ break-inside: avoid; }}
  </style>
</head>
<body>
  <h1>분식집 키오스크 프로젝트 작업일지</h1>
  <div class="subtitle">담당자: 강민준 · 기간: 2026-07-13 ~ 2026-08-10</div>
  <div class="summary">
    <div class="card"><strong>확인 가능한 작업일</strong>{len(DAILY)}일</div>
    <div class="card"><strong>단독 담당 WBS</strong>27건 · 모두 DONE</div>
    <div class="card"><strong>공동 담당 WBS</strong>3건 · 모두 DONE</div>
  </div>
  <h2>날짜별 상세 작업일지</h2>
  <table>
    <thead><tr><th class="no">번호</th><th class="date">날짜</th><th>주요 작업 및 결과</th></tr></thead>
    <tbody>{daily_html}</tbody>
  </table>
  <h2>핵심 담당 영역</h2>
  <div class="areas">{areas_html}</div>
  <div class="note"><b>업무 요약</b><br>관리자 키오스크의 프론트엔드 전반과 관련 백엔드 API를 담당하고, 메뉴·옵션·세트 관리, 주문 처리, JWT 인증, 매출 대시보드, 신규 주문 알림, 자동 테스트, 실기기 체크리스트 및 빌드·문서화를 수행함.</div>
  <div class="source">작성 근거: DevProject Hub 워크스페이스 ID 5 WBS, 프론트·백엔드 Git 커밋 기록 및 2026-08-10 실제 작업 결과.</div>
</body>
</html>'''
HTML_OUTPUT.write_text(html, encoding="utf-8")
print(HTML_OUTPUT)
