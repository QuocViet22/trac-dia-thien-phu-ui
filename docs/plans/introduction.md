# Introduction Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the Gioi thieu article page at /gioi-thieu with react-router, local images, and zero changes to dashboard behavior.

**Architecture:** App.tsx mounts BrowserRouter with two routes inside the existing SiteLayout; the new page is static JSX over a typed data.ts, styled with Tailwind like the dashboard.

**Tech Stack:** React 19, react-router, Tailwind CSS v4, Vite 8, TypeScript strict.

**Spec:** docs/specs/introduction.md

## Global Constraints

- No test runner exists in this repo; verification is npm run build plus npm run lint plus npm run dev visual check. Do not add a test framework.
- verbatimModuleSyntax is on: type-only imports must use import type or inline type qualifiers.
- erasableSyntaxOnly is on: no enums, no namespaces, no parameter properties.
- noUnusedLocals and noUnusedParameters are on: every import must be used or the build fails.
- PowerShell 5.1: chain commands with ; if ($?) { ... }, never with &&.
- Reuse the shared Img wrapper for every content image, always with a placehold.co fallback.
- Vietnamese article copy is verbatim from the live page; do not paraphrase.

## Review Focus

- Unknown path such as /gioi-thieu-sai renders a blank main area unless the catch-all redirect from Task 1 is present; Task 6 types a bad URL and expects a landing on /.
- Deep link or refresh directly on /gioi-thieu must render the article, not a 404; Task 6 reloads the page on that route in both dev and preview servers.
- A missing or blocked bundled image must swap to the fallback exactly once via Img; Task 6 blocks one image request in devtools and expects the placeholder.
- Long Vietnamese headings must wrap with no horizontal scroll at 360px width; Task 6 checks the narrow viewport.
- The nav must highlight Gioi thieu on /gioi-thieu and Trang chu on /; Task 6 asserts both states visually.

---

## File map

- Modify: package.json (react-router dependency via npm install).
- Modify: src/App.tsx (BrowserRouter with / and /gioi-thieu routes plus a catch-all redirect).
- Modify: src/components/layout/MainNav.tsx (router Links for Trang chu and Gioi thieu with active state).
- Create: src/pages/introduction/data.ts (typed article copy, no props, no fetching).
- Create: src/pages/introduction/IntroductionPage.tsx (page composition).
- Create: src/pages/introduction/components/Section.tsx (numbered heading plus body wrapper).
- Create binary: src/assets/introduction/slider-1.webp, cong-ty-trac-dia-ban-do.jpg, gioi-thieu-dich-vu.jpg.
- This plan: docs/plans/introduction.md.

---

### Task 1: Install react-router and wire routes with a stub page

**Files:**
- Modify: package.json (via npm install, do not hand-edit).
- Modify: src/App.tsx (full replacement shown below).
- Create: src/pages/introduction/IntroductionPage.tsx (stub, replaced in Task 4).

**Interfaces:**
- Consumes: SiteLayout props sidebarOpen and onToggleSidebar, DashboardPage prop sidebarOpen.
- Produces: route path /gioi-thieu rendering IntroductionPage with no props; catch-all path * redirecting to /.

- [ ] **Step 1: Install the router**

Run: npm install react-router
Expected: exit 0, package.json and package-lock.json gain react-router.

- [ ] **Step 2: Create the stub page**

```tsx
function IntroductionPage() {
  return <p>Gioi thieu</p>
}

export default IntroductionPage
```

Save as src/pages/introduction/IntroductionPage.tsx.

- [ ] **Step 3: Replace src/App.tsx with the router version**

```tsx
import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import SiteLayout from './components/layout/SiteLayout.tsx'
import DashboardPage from './pages/dashboard/DashboardPage.tsx'
import IntroductionPage from './pages/introduction/IntroductionPage.tsx'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <BrowserRouter>
      <SiteLayout sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((open) => !open)}>
        <Routes>
          <Route path="/" element={<DashboardPage sidebarOpen={sidebarOpen} />} />
          <Route path="/gioi-thieu" element={<IntroductionPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SiteLayout>
    </BrowserRouter>
  )
}

export default App
```

- [ ] **Step 4: Build and lint**

Run: npm run build
Expected: exit 0.
Run: npm run lint
Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/App.tsx src/pages/introduction/IntroductionPage.tsx
git commit -m "feat: add react-router with home and gioi-thieu routes"
```

---

### Task 2: Download the 3 article images into src/assets/introduction/

**Files:**
- Create binary: src/assets/introduction/slider-1.webp.
- Create binary: src/assets/introduction/cong-ty-trac-dia-ban-do.jpg.
- Create binary: src/assets/introduction/gioi-thieu-dich-vu.jpg.

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: the exact filenames Task 4 imports; renaming a file breaks the Task 4 build.

- [ ] **Step 1: Create the folder and download all three files**

```powershell
New-Item -ItemType Directory -Path "src/assets/introduction" -Force
Invoke-WebRequest -Uri "https://bizweb.dktcdn.net/100/498/687/files/slider-1.webp?v=1741080383879" -OutFile "src/assets/introduction/slider-1.webp"
Invoke-WebRequest -Uri "https://bizweb.dktcdn.net/100/498/687/files/cong-ty-trac-dia-ban-do.jpg?v=1741080448539" -OutFile "src/assets/introduction/cong-ty-trac-dia-ban-do.jpg"
Invoke-WebRequest -Uri "https://bizweb.dktcdn.net/100/498/687/files/gioi-thieu-nhung-dich-vu-may-trac-dia-cong-ty-dia-long-1.jpg?v=1741080539682" -OutFile "src/assets/introduction/gioi-thieu-dich-vu.jpg"
```

- [ ] **Step 2: Verify the downloads**

Run: Get-ChildItem -LiteralPath "src/assets/introduction"
Expected: exactly the 3 filenames above, each with Length greater than 0. Open each file in an image viewer and confirm it shows surveying equipment, not an error page. If a download fails, retry once; if it still fails, hotlink the live URL in Task 4 and note the fallback in the commit message.

- [ ] **Step 3: Commit**

```bash
git add src/assets/introduction
git commit -m "feat: add gioi-thieu article images"
```

---

### Task 3: Create src/pages/introduction/data.ts with the verbatim article copy

**Files:**
- Create: src/pages/introduction/data.ts (only this file).

**Interfaces:**
- Consumes: nothing.
- Produces: ValueItem and ContactOffice types plus every named export Task 4 imports. Do not rename exports without updating Task 4.

- [ ] **Step 1: Write the full file exactly as shown**

```ts
export interface ValueItem {
  title: string
  text: string
}

export interface ContactOffice {
  label: string
  address: string
}

export const pageTitle = 'GIỚI THIỆU CÔNG TY TNHH THIẾT BỊ TRẮC ĐỊA THIÊN PHÚ'

export const overviewParagraphs: string[] = [
  'Công ty TNHH Thiết Bị Trắc Địa Thiên Phú là một trong những đơn vị hàng đầu tại Việt Nam chuyên cung cấp thiết bị và giải pháp trắc địa, đo đạc, bản đồ. Với nhiều năm kinh nghiệm trong ngành, Thiên Phú tự hào mang đến cho khách hàng những sản phẩm và dịch vụ chất lượng cao, góp phần nâng cao độ chính xác trong công tác khảo sát, xây dựng và quản lý đất đai.',
  'Chúng tôi cung cấp đa dạng các sản phẩm trắc địa từ các thương hiệu hàng đầu thế giới như Leica, Nikon, Topcon, Sokkia và Trimble. Với cam kết không ngừng đổi mới và nâng cao chất lượng, Thiên Phú luôn là đối tác đáng tin cậy của các công ty xây dựng, đơn vị khảo sát địa hình, tổ chức nghiên cứu và các cơ quan quản lý nhà nước.',
]

export const mission = 'Thiên Phú cam kết mang đến các sản phẩm và dịch vụ trắc địa chất lượng cao, giúp tối ưu hóa quy trình đo đạc và khảo sát, nâng cao hiệu suất làm việc cho khách hàng. Chúng tôi hướng đến việc xây dựng một hệ sinh thái công nghệ hiện đại, hỗ trợ các doanh nghiệp và tổ chức ứng dụng các giải pháp đo đạc tiên tiến nhất.'

export const vision = 'Với mục tiêu trở thành công ty hàng đầu trong lĩnh vực cung cấp thiết bị trắc địa tại Việt Nam, Thiên Phú không ngừng mở rộng hệ thống sản phẩm, dịch vụ và nâng cao năng lực kỹ thuật. Chúng tôi mong muốn góp phần phát triển ngành trắc địa trong nước, bắt kịp xu hướng công nghệ đo đạc hiện đại trên thế giới.'

export const coreValues: ValueItem[] = [
  { title: 'Chất lượng', text: 'Cung cấp các sản phẩm chính hãng, đảm bảo độ chính xác cao, phục vụ hiệu quả nhu cầu của khách hàng.' },
  { title: 'Uy tín', text: 'Luôn đặt chữ tín lên hàng đầu, cam kết mang đến những sản phẩm và dịch vụ tốt nhất.' },
  { title: 'Đổi mới', text: 'Không ngừng nghiên cứu và cập nhật công nghệ mới nhất để nâng cao chất lượng dịch vụ.' },
  { title: 'Khách hàng là trọng tâm', text: 'Lắng nghe và đáp ứng tốt nhất nhu cầu của khách hàng với chính sách hỗ trợ tận tình.' },
  { title: 'Hợp tác bền vững', text: 'Xây dựng mối quan hệ lâu dài với khách hàng, đối tác dựa trên sự tin tưởng và hợp tác đôi bên cùng có lợi.' },
]

export const equipment: ValueItem[] = [
  { title: 'Máy toàn đạc điện tử', text: 'Độ chính xác cao, phù hợp với công tác đo đạc trong xây dựng, địa chính.' },
  { title: 'Máy kinh vĩ', text: 'Hỗ trợ đo góc và khoảng cách, ứng dụng trong khảo sát địa hình.' },
  { title: 'Máy GPS/GNSS', text: 'Định vị chính xác cao, phục vụ công tác khảo sát, đo đạc đất đai.' },
  { title: 'Máy thủy bình', text: 'Giúp xác định cao độ, phục vụ cho thi công hạ tầng.' },
  { title: 'Phụ kiện trắc địa', text: 'Các loại chân máy, sào gương, bộ sạc, pin,… hỗ trợ tối ưu cho thiết bị đo đạc.' },
]

export const supportServices: ValueItem[] = [
  { title: 'Bảo trì và sửa chữa thiết bị', text: 'Đội ngũ kỹ thuật viên chuyên nghiệp của chúng tôi luôn sẵn sàng kiểm tra, bảo trì và sửa chữa các loại máy trắc địa để đảm bảo hoạt động ổn định.' },
  { title: 'Đào tạo và hướng dẫn sử dụng', text: 'Cung cấp các khóa đào tạo giúp khách hàng nắm vững cách sử dụng thiết bị trắc địa một cách hiệu quả.' },
  { title: 'Tư vấn giải pháp trắc địa', text: 'Hỗ trợ khách hàng lựa chọn thiết bị phù hợp với nhu cầu, giúp tối ưu chi phí và hiệu suất công việc.' },
]

export const customerGroups: string[] = [
  'Các công ty xây dựng lớn nhỏ.',
  'Các đơn vị khảo sát và đo đạc bản đồ.',
  'Các sở ban ngành liên quan đến quản lý đất đai, quy hoạch đô thị.',
  'Các tổ chức giáo dục, nghiên cứu về địa lý, trắc địa.',
]

export const customerClosing = 'Chúng tôi tự hào là đối tác chiến lược của nhiều thương hiệu lớn trong ngành trắc địa, cam kết mang đến cho khách hàng những sản phẩm chất lượng với giá thành hợp lý nhất.'

export const commitments: ValueItem[] = [
  { title: '100% sản phẩm chính hãng', text: 'Tất cả các thiết bị do Thiên Phú cung cấp đều có nguồn gốc rõ ràng, được nhập khẩu chính hãng từ các thương hiệu nổi tiếng.' },
  { title: 'Bảo hành dài hạn', text: 'Mỗi sản phẩm đều có chế độ bảo hành chính hãng, đảm bảo quyền lợi tối đa cho khách hàng.' },
  { title: 'Hỗ trợ kỹ thuật tận tâm', text: 'Đội ngũ chuyên viên kỹ thuật giàu kinh nghiệm của chúng tôi luôn sẵn sàng hỗ trợ khách hàng trong quá trình sử dụng thiết bị.' },
  { title: 'Chính sách giá cạnh tranh', text: 'Cam kết mang đến mức giá tốt nhất trên thị trường cùng với nhiều chương trình ưu đãi hấp dẫn.' },
]

export const offices: ContactOffice[] = [
  { label: 'Trụ Sở Chính', address: 'Số 7, Đường số 2, Khu phố 7, Phường Hiệp Bình Chánh, TP. Thủ Đức, TP. Hồ Chí Minh.' },
  { label: 'Kho hàng', address: '647/24 Quốc Lộ 13, P.Hiệp Bình Phước, Tp. Thủ Đức, Tp.HCM' },
  { label: 'Vp Hà Nội', address: 'Số 23, DM6-DM8 làng nghề Vạn Phúc, Hà Đông, Tp.Hà Nội' },
  { label: 'Vp Đà Nẵng', address: '42 Hoàng Hoa Thám, Q.Thanh Khê, Tp. Đà Nẵng' },
]

export const hotline = '0983.927.945 - 0707.927.945'

export const techSupport = '0915.178.945 - 0382.460.511'

export const website = 'https://tracdia247.vn'

export const conclusionParagraphs: string[] = [
  'Với sứ mệnh mang đến những giải pháp trắc địa hiện đại và chính xác, Công ty TNHH Thiết Bị Trắc Địa Thiên Phú luôn sẵn sàng đồng hành cùng khách hàng trong mọi dự án. Chúng tôi không chỉ cung cấp sản phẩm chất lượng mà còn mang đến dịch vụ hậu mãi chuyên nghiệp, giúp khách hàng đạt được hiệu quả cao nhất trong công việc.',
  'Chọn Thiên Phú – Chọn sự chính xác và bền vững!',
]
```

- [ ] **Step 2: Typecheck the file**

Run: npm run build
Expected: exit 0. An unused export is fine; an unused import inside this file is not, so keep imports at zero.

- [ ] **Step 3: Commit**

```bash
git add src/pages/introduction/data.ts
git commit -m "feat: add gioi-thieu article data"
```

---

### Task 4: Create Section wrapper and the IntroductionPage composition

**Files:**
- Create: src/pages/introduction/components/Section.tsx.
- Modify: src/pages/introduction/IntroductionPage.tsx (replace the Task 1 stub with the full page below).

**Interfaces:**
- Consumes: every export from Task 3 data.ts, the Img wrapper props src plus fallback plus alt, and image files from Task 2.
- Produces: the default IntroductionPage component with no props, rendered by the /gioi-thieu route.

- [ ] **Step 1: Create src/pages/introduction/components/Section.tsx**

```tsx
import type { ReactNode } from 'react'

interface SectionProps {
  index: string
  heading: string
  children: ReactNode
}

function Section({ index, heading, children }: SectionProps) {
  return (
    <section>
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
        {index}. {heading}
      </h2>
      <div className="space-y-3 text-sm md:text-base leading-relaxed text-gray-700">{children}</div>
    </section>
  )
}

export default Section
```

- [ ] **Step 2: Replace IntroductionPage.tsx with the full page below**

```tsx
import { Link } from 'react-router'
import Img from '../../components/Img.tsx'
import Section from './components/Section.tsx'
import slider1 from '../../assets/introduction/slider-1.webp'
import companyPhoto from '../../assets/introduction/cong-ty-trac-dia-ban-do.jpg'
import servicePhoto from '../../assets/introduction/gioi-thieu-dich-vu.jpg'
import { commitments, conclusionParagraphs, coreValues, customerClosing, customerGroups, equipment, hotline, mission, offices, overviewParagraphs, pageTitle, supportServices, techSupport, type ValueItem, vision, website } from './data.ts'


const fallback = 'https://placehold.co/800x450?text=Thien+Phu'

function BulletList({ items }: { items: ValueItem[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.title}>
          <strong className="text-gray-900">{item.title}</strong>
: {item.text}
        </li>
      ))}
    </ul>
  )
}

function IntroductionPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-3">
        <Link to="/" className="hover:text-brand">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">Giới thiệu</span>
      </nav>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Giới thiệu</h1>
      <p className="text-lg md:text-xl font-bold text-gray-900 mb-6">{pageTitle}</p>
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-8 flex flex-col gap-8">
        <Section index="1" heading="Giới thiệu tổng quan về công ty">
          {overviewParagraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
          <Img src={slider1} fallback={fallback} alt="Thiết bị trắc địa Thiên Phú" className="w-full rounded-lg" loading="lazy" />
        </Section>
        <Section index="2" heading="Sứ mệnh và tầm nhìn">
          <h3 className="font-bold text-gray-900">Sứ mệnh</h3>
          <p>{mission}</p>
          <h3 className="font-bold text-gray-900">Tầm nhìn</h3>
          <p>{vision}</p>
        </Section>
        <Section index="3" heading="Giá trị cốt lõi">
          <BulletList items={coreValues} />
          <Img src={companyPhoto} fallback={fallback} alt="Công ty trắc địa bản đồ" className="w-full rounded-lg" loading="lazy" />
        </Section>
        <Section index="4" heading="Sản phẩm và dịch vụ">
          <h3 className="font-bold text-gray-900">Thiết bị trắc địa</h3>
          <BulletList items={equipment} />
          <h3 className="font-bold text-gray-900">Dịch vụ hỗ trợ kỹ thuật</h3>
          <BulletList items={supportServices} />
        </Section>
        <Section index="5" heading="Khách hàng và đối tác">
          <ul className="list-disc pl-5 space-y-1">
            {customerGroups.map((group) => (
              <li key={group}>{group}</li>
            ))}
          </ul>
          <p>{customerClosing}</p>
          <Img src={servicePhoto} fallback={fallback} alt="Dịch vụ máy trắc địa Thiên Phú" className="w-full rounded-lg" loading="lazy" />
        </Section>
        <Section index="6" heading="Cam kết chất lượng">
          <BulletList items={commitments} />
        </Section>
        <Section index="7" heading="Liên hệ với chúng tôi">
          <ul className="space-y-2">
            {offices.map((office) => (
              <li key={office.label}>
                <strong className="text-gray-900">{office.label}:</strong> {office.address}
              </li>
            ))}
          </ul>
          <p><strong className="text-gray-900">Hotline:</strong> {hotline}</p>
          <p><strong className="text-gray-900">Hỗ trợ kỹ thuật:</strong> {techSupport}</p>
          <p><strong className="text-gray-900">Website:</strong> <a href={website} target="_blank" rel="noreferrer" className="text-brand hover:underline">{website}</a></p>
          {conclusionParagraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </Section>
      </div>
    </div>
  )
}

export default IntroductionPage
```

Save the last block as src/pages/introduction/IntroductionPage.tsx, replacing the Task 1 stub.

- [ ] **Step 3: Build and lint**

Run: npm run build
Expected: exit 0. If tsc reports a missing image module, re-check the Task 2 filenames letter by letter.
Run: npm run lint
Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/pages/introduction/IntroductionPage.tsx src/pages/introduction/components/Section.tsx
git commit -m "feat: add gioi-thieu article page"
```

---

### Task 5: Point the MainNav Trang chu and Gioi thieu items at the router

**Files:**
- Modify: src/components/layout/MainNav.tsx (only the two list items below; every other item keeps its href placeholder).

**Interfaces:**
- Consumes: route paths / and /gioi-thieu from Task 1.
- Produces: nav active state driven by useLocation pathname.

- [ ] **Step 1: Edit MainNav.tsx**

Add this import at the top:

```tsx
import { Link, useLocation } from 'react-router'
```

Inside the component body, before the return statement, add:

```tsx
const location = useLocation()
const activeLink = "px-5 py-4 block custom-orange border-b-2 border-custom-orange"
const idleLink = "px-5 py-4 block hover:text-brand transition-colors"
```

Replace the Trang chu list item with:

```tsx
<li className="whitespace-nowrap"><Link to="/" className={location.pathname === "/" ? activeLink : idleLink}>Trang chủ</Link></li>
```

Replace the Gioi thieu list item with:

```tsx
<li className="whitespace-nowrap"><Link to="/gioi-thieu" className={location.pathname === "/gioi-thieu" ? activeLink : idleLink}>Giới thiệu <i className="fa-solid fa-angle-down text-[10px]"></i></Link></li>
```

- [ ] **Step 2: Build and lint**

Run: npm run build
Expected: exit 0.
Run: npm run lint
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/MainNav.tsx
git commit -m "feat: link main nav home and gioi-thieu to router"
```

---

### Task 6: Final verification pass (no new code)

**Files:** none. This task only verifies; if anything fails, fix it in the owning task above and re-run that task commit.

- [ ] **Step 1: Run the full build and lint**

Run: npm run build
Expected: exit 0.
Run: npm run lint
Expected: exit 0.

- [ ] **Step 2: Check the homepage is unchanged**

Run: npm run dev, open /, confirm the dashboard renders exactly as before (hero slider autoplays, sidebar toggle works, no console errors), then stop the server.

- [ ] **Step 3: Check /gioi-thieu against the live page**

Run: npm run dev, open /gioi-thieu, confirm in order: breadcrumb Trang chủ / Giới thiệu, H1 Giới thiệu, the company title line, sections 1 through 7 with all 3 photos, the 4 offices, both phone lines, the website link, and the closing Chon Thien Phu line. Confirm the nav highlights Giới thiệu.

- [ ] **Step 4: Check routing edge cases and responsiveness**

On the dev server: refresh directly on /gioi-thieu and expect the article (Review Focus line 2); visit /gioi-thieu-sai and expect a redirect to / (Review Focus line 1); block one article image in devtools and expect the placeholder to appear once (Review Focus line 3); set the viewport to 360px wide and expect no horizontal scroll (Review Focus line 4). Then run npm run preview and repeat the direct refresh on /gioi-thieu.

