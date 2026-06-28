# Dependency Radar

Live demo: https://dependency-radar-three.vercel.app

## 한국어 소개

Dependency Radar는 국가별 의존도와 공급망 취약성을 실제 공개 통계로 비교하는 글로벌 통계 플랫폼입니다.

이 프로젝트는 임의의 100점 위험도 점수를 만들지 않고, World Bank 공개 지표의 실제 수치와 제공 연도를 기반으로 국가별 에너지, 연료, 식량, 수입, 관세, 물류 데이터를 비교합니다.

## 주요 기능

- 국가별 실제 통계 데이터 대시보드
- 세계 지도 시각화
- 국가 비교 기능
- 국가별 상세 페이지
- 시계열 추세 차트
- 지역 내 위치 분석
- 데이터 제공 여부 및 최신 연도 필터
- CSV 다운로드
- 국가명 옆 국기 표시
- 다국어 인터페이스
- 국가별 누적 방문 카운터
- 데이터 출처 페이지
- 개인정보처리방침
- 이용약관
- 면책 고지
- SEO 메타데이터
- sitemap.xml
- robots.txt
- 공유 미리보기 이미지

## 사용 데이터

현재 사용 중인 World Bank 지표는 다음과 같습니다.

| 지표 | World Bank 코드 | 설명 |
|---|---|---|
| 에너지 순수입 | EG.IMP.CONS.ZS | 에너지 사용량 대비 에너지 순수입 비율 |
| 연료 수입 비중 | TM.VAL.FUEL.ZS.UN | 전체 상품 수입 중 연료가 차지하는 비중 |
| 식량 수입 비중 | TM.VAL.FOOD.ZS.UN | 전체 상품 수입 중 식량이 차지하는 비중 |
| 수입/GDP | NE.IMP.GNFS.ZS | GDP 대비 재화 및 서비스 수입 비율 |
| 총 수입액 | NE.IMP.GNFS.CD | 현재 미국 달러 기준 총 재화 및 서비스 수입액 |
| 관세율 | TM.TAX.MRCH.WM.AR.ZS | 수입 상품에 적용되는 가중 평균 관세율 |
| 물류지수 | LP.LPI.OVRL.XQ | World Bank 물류성과지수 |

## 기술 스택

- Next.js
- TypeScript
- Tailwind CSS
- Vercel
- Upstash Redis
- World Bank API
- Natural Earth / world-atlas
- react-simple-maps

## 주요 페이지

- / : 메인 대시보드
- /country/KOR : 국가 상세 페이지 예시
- /sources : 데이터 출처
- /privacy : 개인정보처리방침
- /terms : 이용약관
- /disclaimer : 면책 고지
- /sitemap.xml : 사이트맵
- /robots.txt : 검색엔진 크롤링 설정
- /opengraph-image : 공유 미리보기 이미지

## 방문 국가 카운터

방문 국가 카운터는 국가 코드별 누적 방문 횟수를 기록합니다.

같은 사용자가 새로고침해도 방문 횟수는 다시 1회 증가합니다. 즉, 고유 방문자 수가 아니라 중복 방문을 포함한 방문 횟수 기준입니다.

이 기능은 IP 주소 전체를 저장하지 않고, 국가 코드와 방문 횟수만 저장합니다.

필요한 환경변수는 다음과 같습니다.

UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
NEXT_PUBLIC_SITE_URL

## 로컬 실행 방법

패키지 설치:

npm install

개발 서버 실행:

npm run dev

브라우저에서 열기:

http://localhost:3000

배포 전 빌드 확인:

npm run build

## 배포 방법

코드를 수정한 뒤 아래 순서로 실행합니다.

npm run build
git add .
git commit -m "Update project"
git push origin main

Vercel은 main 브랜치에 push된 내용을 자동으로 다시 배포합니다.

## 데이터 및 라이선스 고지

Dependency Radar는 World Bank 공개 데이터와 Natural Earth 지도 경계 데이터를 사용합니다.

World Bank 데이터는 일반적으로 Creative Commons Attribution 4.0 조건으로 제공되며, 특정 데이터셋이 별도 조건을 명시할 수 있습니다. 이 사이트에서는 일부 데이터를 보기 쉽게 재구성, 번역, 정렬, 필터링 또는 시각화합니다.

Natural Earth 지도 데이터는 public domain으로 제공됩니다. 투명성을 위해 지도 출처를 표시합니다.

Dependency Radar는 The World Bank, Natural Earth, OpenStreetMap, Vercel, Upstash와 제휴, 후원, 승인 관계가 없습니다.

## 면책 고지

Dependency Radar는 정보 제공, 교육, 연구 목적의 사이트입니다.

이 사이트의 정보는 투자, 법률, 무역, 관세, 물류, 정책, 사업 의사결정에 대한 전문 조언이 아닙니다. 데이터는 지연, 수정, 누락 또는 국가별 미제공 상태일 수 있습니다.

## 문의

데이터 오류, 협업, 서비스 문의:

kevinsmp123@gmail.com

---

# English Overview

Dependency Radar is a global country statistics platform that compares national dependency and supply exposure using public World Bank data.

The project avoids arbitrary 100-point risk scores and instead presents original statistical values, source years, methodology notes, and transparent data references.

## Core Features

- Global country statistics dashboard
- World map visualization
- Country comparison tool
- Country detail pages
- Historical trend charts
- Regional position analysis
- Data availability and latest-year filters
- CSV export
- Country flags using ISO country codes
- Multi-language interface
- Cumulative visitor country counter
- Data sources, privacy policy, terms, and disclaimer pages
- SEO metadata, sitemap, robots.txt, and social preview image

## Contact

kevinsmp123@gmail.com
