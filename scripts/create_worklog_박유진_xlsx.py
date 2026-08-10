import csv
from datetime import datetime, timezone
from html import escape
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "docs" / "박유진_분식집키오스크_작업일지.xlsx"
CSV_OUTPUT = ROOT / "docs" / "박유진_날짜별_작업일지.csv"
HTML_OUTPUT = ROOT / "docs" / "박유진_worklog-print.html"

DAILY = [
    ("2026-07-13", "고객용 키오스크 프로젝트를 초기화하고 홈·메뉴선택·장바구니·결제·주문완료 5개 화면의 기본 구조와 컴포넌트를 구현함."),
    ("2026-07-14", "장바구니 비어있음 검증과 결제 API 예외·타임아웃 처리를 추가하고 관리자 파일 정리, menuApi.js 통합, 홈 화면 디자인 작업에 착수함."),
    ("2026-07-15", "메뉴선택·장바구니·결제·주문완료 화면(SCR_002~005)의 디자인을 적용하고 메뉴 품절·빈 목록·빈 장바구니 상황에 대한 안내와 진입 차단 로직을 보완함."),
    ("2026-07-16", "메뉴 카테고리 사이드 메뉴와 슬라이드 화살표 UI를 추가하고, 총액 계산 로직 중복 제거, 90초 미사용 자동 초기화 및 안내 팝업, 장바구니 수량 표시 등 세부 로직을 정리함."),
    ("2026-07-20", "결제 수단 선택 팝업(네이버페이/카카오페이/카드결제)을 추가하고 장바구니·결제내역 레이아웃과 영수증·주문번호 출력 버튼을 개선함."),
    ("2026-07-21", "고객용 키오스크를 kiosk-customer 폴더로 분리하고 README·gitignore·node_modules 등 저장소 구조를 정리했으며, 다국어(한/영) 지원과 화면 크기별 자동 스케일을 적용함."),
    ("2026-07-23", "메뉴·장바구니·결제 화면을 백엔드 API와 연동함."),
    ("2026-07-24", "결제 아키텍처 분리에 맞춰 프론트엔드 결제 연동을 재정비함."),
    ("2026-07-28", "주문 상태에 '결제대기'를 추가하고 결제 오류 유형별 처리 및 자동 재시도를 구현했으며, 미결제 주문 노출 방지와 장바구니 메뉴명 표시, 떡볶이 카드 CSS를 보완함."),
    ("2026-07-29", "장바구니 폰트 크기를 조정하고 네이버페이/카카오페이 QR 결제 모달을 추가함."),
    ("2026-07-30", "옵션 품절 시 카드에 품절 표시와 선택 차단 기능을 추가함."),
    ("2026-07-31", "결제 처리 중 뒤로가기로 인한 주문 취소를 차단하고, 세트 메뉴 구성품 품절 연동과 그룹 선택형 세트 메뉴 팝업·장바구니 연동을 구현함."),
    ("2026-08-03", "떡순튀세트 옵션(떡볶이맛/순대구성) 선택 기능과 토스페이 결제(키오스크 내 결제창 직접 호출)를 추가하고, API URL 환경변수화 및 결제수단 UI를 정리함."),
    ("2026-08-06", "토스/카카오 결제 취소 안내를 개선하고 confirm API 중복 호출을 방지했으며, 떡볶이 단품 맛 선택 기능을 구현함."),
    ("2026-08-07", "고객용 키오스크 자동 테스트를 추가하고 옵션 카드가 3개 이상일 때 슬라이드 가능하도록 UI를 개선함."),
]

AREAS = [
    ("고객용 키오스크 프론트엔드", "홈·메뉴선택·장바구니·결제·주문완료 5개 화면 구현 및 디자인, 다국어(한/영)·반응형 대응"),
    ("결제 연동", "네이버페이·카카오페이·토스페이 결제창 연동, 결제 오류 유형별 처리·자동 재시도, 결제 아키텍처 분리 대응"),
    ("장바구니·주문 로직", "수량 합산, 총액 계산 함수화, 빈 장바구니/빈 주문목록 안내 및 진입 차단, 90초 자동 초기화"),
    ("메뉴·세트 옵션", "메뉴·옵션 품절 처리, 세트 메뉴 구성품 품절 연동, 그룹 선택형 세트 메뉴 및 떡순튀세트 옵션 구현"),
    ("구조·환경 설정", "kiosk-customer 폴더 분리, API URL 환경변수화, 저장소 구조 정리"),
    ("품질 관리", "고객용 키오스크 자동 테스트 작성"),
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
    (2, 24, [(1, "담당자: 박유진 | 기간: 2026-07-13 ~ 2026-08-07", 2)]),
    (4, 24, [(1, "구분", 3), (2, "내용", 3)]),
    (5, 24, [(1, "총 커밋", 4), (2, "83건", 4)]),
    (6, 24, [(1, "작업 기간", 4), (2, "2026-07-13 ~ 2026-08-07 (26일)", 4)]),
    (7, 24, [(1, "활동일", 4), (2, f"{len(DAILY)}일", 4)]),
    (9, 24, [(1, "핵심 담당 영역", 3), (2, "주요 내용", 3)]),
]
for row_index, area in enumerate(AREAS, 10):
    summary_rows.append((row_index, 38, [(1, area[0], 4), (2, area[1], 4)]))
summary_rows.append((16, 65, [(1, "요약: 고객용 키오스크의 프론트엔드 전 화면(홈·메뉴·장바구니·결제·주문완료)을 담당하고, 네이버페이·카카오페이·토스페이 결제 연동, 세트 메뉴·품절 로직, 다국어·반응형 대응, 자동 테스트를 수행함.", 5)]))

daily_rows = [
    (1, 32, [(1, "날짜별 작업일지", 1)]),
    (3, 25, [(1, "번호", 3), (2, "날짜", 3), (3, "주요 작업", 3)]),
]
for index, (date, task) in enumerate(DAILY, 1):
    daily_rows.append((index + 3, 58, [(1, index, 6), (2, date, 6), (3, task, 4)]))

evidence_rows = [
    (1, 32, [(1, "작성 기준 및 참고", 1)]),
    (3, 25, [(1, "항목", 3), (2, "내용", 3)]),
    (4, 38, [(1, "자료 출처", 4), (2, "고객용 키오스크(kiosk-customer) 프론트엔드 Git 커밋 기록", 4)]),
    (5, 38, [(1, "담당자 식별", 4), (2, "박유진, Git 커밋 작성자 이메일 parkbori99@gmail.com 기준", 4)]),
    (6, 38, [(1, "작업일 계산", 4), (2, "해당 이메일의 커밋이 확인되는 날짜를 중복 제거하여 계산", 4)]),
    (7, 38, [(1, "주의사항", 4), (2, "커밋이 없는 기획·회의·검수 시간은 작업일 수에 포함되지 않을 수 있음", 4)]),
    (9, 38, [(1, "주요 기술", 4), (2, "React, Axios, 네이버페이/카카오페이/토스페이 SDK", 4)]),
]

styles = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<fonts count="4"><font><sz val="10"/><name val="맑은 고딕"/></font><font><b/><color rgb="FFFFFFFF"/><sz val="18"/><name val="맑은 고딕"/></font><font><color rgb="FF555555"/><sz val="11"/><name val="맑은 고딕"/></font><font><b/><sz val="10"/><name val="맑은 고딕"/></font></fonts>
<fills count="4"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFAE3018"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFF2E5CE"/><bgColor indexed="64"/></patternFill></fill></fills>
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
    archive.writestr("xl/worksheets/sheet1.xml", sheet_xml(summary_rows, [24, 85, 4, 4], ["A1:D1", "A2:D2", f"A16:D16"]))
    archive.writestr("xl/worksheets/sheet2.xml", sheet_xml(daily_rows, [8, 15, 120], ["A1:C1"], 3, f"A3:C{len(DAILY) + 3}"))
    archive.writestr("xl/worksheets/sheet3.xml", sheet_xml(evidence_rows, [20, 100, 4], ["A1:C1"]))
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    archive.writestr("docProps/core.xml", f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>박유진 분식집 키오스크 작업일지</dc:title><dc:creator>Claude Code</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">{timestamp}</dcterms:created></cp:coreProperties>''')
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
  <title>박유진 분식집 키오스크 작업일지</title>
  <style>
    @page {{ size: A4 landscape; margin: 10mm; }}
    * {{ box-sizing: border-box; }}
    body {{ margin: 0; color: #241C1A; font-family: "Malgun Gothic", sans-serif; font-size: 11px; }}
    h1 {{ margin: 0 0 6px; font-size: 26px; }}
    h2 {{ margin: 16px 0 8px; color: #7A2110; font-size: 17px; }}
    .subtitle {{ margin-bottom: 14px; color: #6E5F58; font-size: 13px; }}
    .summary {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }}
    .card {{ border: 1px solid #DFD2CB; border-radius: 8px; padding: 10px; background: #FBF6F3; }}
    .card strong {{ display: block; margin-bottom: 4px; color: #7A2110; font-size: 14px; }}
    table {{ width: 100%; border-collapse: collapse; table-layout: fixed; }}
    th {{ padding: 7px; color: white; background: #AE3018; border: 1px solid #AE3018; }}
    td {{ padding: 6px 8px; border: 1px solid #DFD2CB; vertical-align: top; line-height: 1.45; }}
    tbody tr:nth-child(even) {{ background: #FBF6F3; }}
    .no {{ width: 6%; text-align: center; }}
    .date {{ width: 14%; text-align: center; white-space: nowrap; }}
    .areas {{ display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }}
    .area {{ border-left: 5px solid #AE3018; background: #F1E9E5; padding: 9px 12px; }}
    .area b {{ color: #7A2110; }}
    .note {{ margin-top: 14px; padding: 11px; border: 1px solid #f0b429; background: #fff9e8; line-height: 1.6; }}
    .source {{ margin-top: 9px; color: #6E5F58; font-size: 9px; }}
    tr {{ break-inside: avoid; }}
  </style>
</head>
<body>
  <h1>분식집 키오스크 프로젝트 작업일지</h1>
  <div class="subtitle">담당자: 박유진 · 기간: 2026-07-13 ~ 2026-08-07</div>
  <div class="summary">
    <div class="card"><strong>총 커밋</strong>83건</div>
    <div class="card"><strong>작업 기간</strong>26일</div>
    <div class="card"><strong>활동일</strong>{len(DAILY)}일</div>
  </div>
  <h2>날짜별 상세 작업일지</h2>
  <table>
    <thead><tr><th class="no">번호</th><th class="date">날짜</th><th>주요 작업 및 결과</th></tr></thead>
    <tbody>{daily_html}</tbody>
  </table>
  <h2>핵심 담당 영역</h2>
  <div class="areas">{areas_html}</div>
  <div class="note"><b>업무 요약</b><br>고객용 키오스크의 프론트엔드 전 화면(홈·메뉴·장바구니·결제·주문완료)을 담당하고, 네이버페이·카카오페이·토스페이 결제 연동, 세트 메뉴·품절 로직, 다국어·반응형 대응, 자동 테스트를 수행함.</div>
  <div class="source">작성 근거: 고객용 키오스크(kiosk-customer) 프론트엔드 Git 커밋 기록 (author: parkbori99@gmail.com).</div>
</body>
</html>'''
HTML_OUTPUT.write_text(html, encoding="utf-8")
print(HTML_OUTPUT)
