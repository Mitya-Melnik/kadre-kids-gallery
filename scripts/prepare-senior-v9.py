"""One-use, allowlisted source edit on the explicitly authorized feature branch only.
No server, main, backup branches, credentials or workflow files are changed here.
"""
from pathlib import Path
import os, subprocess, hashlib
p=Path.cwd()
assert os.environ['GITHUB_REPOSITORY']=='Mitya-Melnik/kadre-kids-gallery'
assert os.environ['GITHUB_REF']=='refs/heads/feature/senior-mobile-v9'
BASE='e587ecb3d7828522ec9957d11e83d1ef296b0425'
allowed={
'src/components/AnalyticsConsent.tsx','src/components/kindergarten/AlbumCatalog.tsx','src/components/kindergarten/KindergartenCatalog.tsx','src/components/kindergarten/KindergartenFAQ.tsx','src/components/kindergarten/KindergartenMobileContent.tsx','src/components/school/SchoolGrade4Mobile.tsx','src/components/school/SchoolLayouts.tsx','src/components/school/SchoolLayoutsMobile.tsx','src/components/school/SchoolStories.tsx','src/pages/School.tsx','src/components/school/SchoolMobilePage.tsx','src/config/albumOrderRules.ts','src/config/seniorContent.ts'}
for name in allowed:
 if (p/name).exists(): assert (p/name).read_bytes()==subprocess.check_output(['git','show',f'{BASE}:{name}']),name

def update(fn,a,b):
 f=p/fn;s=f.read_text();assert a in s,(fn,a);f.write_text(s.replace(a,b))
(p/'src/config/albumOrderRules.ts').write_text('''/** Owner confirmed: 10 total albums per class; mix 6 and 10 pages in any ratio.
 * Other combinations still require agreement. This is not a graduation discount threshold.
 */
export const albumOrderRules = {
  minimum: 10,
  schoolMixedSummary: "6 и 10 страниц можно сочетать",
  schoolMixedDetails: "Альбомы «Наш класс» на 6 страниц и «Школьные годы» на 10 страниц можно сочетать в любом соотношении. Минимум считается суммарно на класс, а не отдельно по каждому формату.",
  otherFormats: "Сочетание с папкой, трио или «Большой историей» согласовываем отдельно до заключения договора.",
} as const;
export const schoolMinimumAnswer = `Да. Минимальный общий заказ класса — ${albumOrderRules.minimum} альбомов. ${albumOrderRules.schoolMixedDetails} ${albumOrderRules.otherFormats}`;
''')
update('src/components/kindergarten/AlbumCatalog.tsx','import { albumCommercial } from "@/config/albumCommercial";','import { albumCommercial } from "@/config/albumCommercial";\nimport { albumOrderRules } from "@/config/albumOrderRules";')
update('src/components/kindergarten/AlbumCatalog.tsx','{isSchool ? "15" : "10"}','{albumOrderRules.minimum}')
update('src/components/kindergarten/KindergartenCatalog.tsx','import { albumPackages } from "@/config/albumPackages";','import { albumPackages } from "@/config/albumPackages";\nimport { albumOrderRules } from "@/config/albumOrderRules";')
update('src/components/kindergarten/KindergartenCatalog.tsx','// Preserve the current school minimum. The removed discount threshold is a different rule.\n  const minimum = isSchool ? 15 : 10;','// Total order minimum; independent of the graduation shooting discount.\n  const minimum = albumOrderRules.minimum;')
update('src/components/kindergarten/KindergartenCatalog.tsx','<p>21×30 см · заказ от {minimum} альбомов</p>','<p>21×30 см · заказ от {minimum} альбомов</p>\n          {isSchool && <p>{albumOrderRules.schoolMixedSummary}</p>}')
update('src/components/kindergarten/KindergartenCatalog.tsx','<li>Формат — 21×30 см. Минимальный тираж — от {minimum} альбомов.</li>','<li>Формат — 21×30 см. Минимальный тираж — от {minimum} альбомов.</li>\n                  {isSchool && <><li>{albumOrderRules.schoolMixedDetails}</li><li>{albumOrderRules.otherFormats}</li></>}')
update('src/components/kindergarten/KindergartenFAQ.tsx','import { MobileQuestions } from "./KindergartenMobileContent";','import { MobileQuestions } from "./KindergartenMobileContent";\nimport { schoolMinimumAnswer } from "@/config/albumOrderRules";')
update('src/components/kindergarten/KindergartenFAQ.tsx','"Да. Минимальный тираж для школы — 15 альбомов одного выбранного формата."','schoolMinimumAnswer')
f=p/'src/pages/School.tsx';s=f.read_text()
hero=s[s.index('const schoolHeroImages ='):s.index('const SchoolHeroGallery =')].replace('const schoolHeroImages','export const schoolHeroImages')
roles=s[s.index('const participantBenefits ='):s.index('const scrollToSection =')].replace('const participantBenefits','export const seniorParticipantBenefits')
(p/'src/config/seniorContent.ts').write_text('import { Building2, UserCheck, UsersRound } from "lucide-react";\n\n'+hero+roles)
s=s.replace(s[s.index('const schoolHeroImages ='):s.index('const SchoolHeroGallery =')],'')
s=s.replace(s[s.index('const participantBenefits ='):s.index('const scrollToSection =')],'')
s=s.replace('import { Building2, Check, UserCheck, UsersRound } from "lucide-react";','import { Check } from "lucide-react";\nimport { schoolHeroImages, seniorParticipantBenefits as participantBenefits } from "@/config/seniorContent";\nimport { useKindergartenMobile } from "@/components/kindergarten/KindergartenMobileContent";\nimport SchoolMobilePage from "@/components/school/SchoolMobilePage";')
s=s.replace('const School = () => (','const School = () => {\n  const mobile = useKindergartenMobile();\n  if (mobile) return <SchoolMobilePage audience="school" />;\n  return (')
s=s.replace('\n);\n\nexport default School;','\n  );\n};\n\nexport default School;')
f.write_text(s)
update('src/components/school/SchoolStories.tsx','const schoolStoryImages:','export const schoolStoryImages:')
update('src/components/school/SchoolLayouts.tsx','const schoolLayouts:','export const schoolLayouts:')
f=p/'src/components/kindergarten/KindergartenMobileContent.tsx';s=f.read_text()
s=s.replace('Picture, school = false }','Picture, school = false, senior = false }').replace('school?: boolean }','school?: boolean; senior?: boolean }')
s=s.replace('school ? "Фотографии 4-го класса" : "Фотографии выпускной группы"','school ? senior ? "Фотографии 9–11-х классов" : "Фотографии 4-го класса" : "Фотографии выпускной группы"')
f.write_text(s)
f=p/'src/components/school/SchoolLayoutsMobile.tsx';s=f.read_text()
s=s.replace('import { grade4Layouts } from "./Grade4Layouts";','import { grade4Layouts } from "./Grade4Layouts";\nimport { schoolLayouts } from "./SchoolLayouts";')
s=s.replace('export default function SchoolLayoutsMobile() {','export default function SchoolLayoutsMobile({ audience = "grade4" }: { audience?: "grade4" | "school" }) {\n  const senior = audience === "school";\n  const layouts = senior ? schoolLayouts : grade4Layouts;')
s=s.replace('const layout = grade4Layouts[selected];','const layout = layouts[selected];').replace('`/layouts-grade4/${layout.slug}/${page}`','`/${senior ? "layouts-school" : "layouts-grade4"}/${layout.slug}/${page}`')
s=s.replace('для 4 класса, страница ${page}','для ${senior ? "9–11 классов" : "4 класса"}, страница ${page}')
s=s.replace('Макеты альбомов для 4 класса</h2>','{senior ? "Макеты школьных альбомов" : "Макеты альбомов для 4 класса"}</h2>')
s=s.replace('grade4Layouts.map','layouts.map');f.write_text(s)
f=p/'src/components/school/SchoolGrade4Mobile.tsx';s=f.read_text()
s=s.replace('import { grade4HeroImages, participantBenefits }','import { grade4HeroImages, participantBenefits as grade4Benefits }')
s=s.replace('import { grade4StoryImages, SCHOOL_STORY_ASSET_VERSION }','import { grade4StoryImages, schoolStoryImages, SCHOOL_STORY_ASSET_VERSION }')
s=s.replace('const processSteps = getProcessSteps(albumSteps, "grade4");','import { schoolHeroImages, seniorParticipantBenefits } from "@/config/seniorContent";\n\nconst seniorProcessSteps = getProcessSteps(albumSteps, "school");\nconst grade4ProcessSteps = getProcessSteps(albumSteps, "grade4");')
s=s.replace('/** Opt-in route only:', 'const SeniorPicture = ({ image, className, loading }: PictureProps) => <picture>\n  <source media="(max-width: 767px)" srcSet={`/school-stories/${image.slug}-mobile.webp?v=${SCHOOL_STORY_ASSET_VERSION}`} />\n  <img src={`/school-stories/${image.slug}.webp?v=${SCHOOL_STORY_ASSET_VERSION}`} alt={image.alt} className={className} loading={loading} decoding="async" />\n</picture>;\n\n/** Opt-in route only:')
s=s.replace('export default function SchoolGrade4Mobile() {','export default function SchoolMobilePage({ audience = "grade4" }: { audience?: "grade4" | "school" }) {\n  const senior = audience === "school";\n  const pagePath = senior ? "/school/9-11" : "/school/4";\n  const heroImages = senior ? schoolHeroImages : grade4HeroImages;\n  const participantBenefits = senior ? seniorParticipantBenefits : grade4Benefits;\n  const processSteps = senior ? seniorProcessSteps : grade4ProcessSteps;\n  const heading = senior ? "История класса, которую захочется пересматривать" : "Четыре первых школьных года — в одной живой истории";\n  const intro = senior ? "Живые портреты, друзья и важные события школьной жизни — в современном выпускном альбоме с понятными условиями и сроками." : "Сохраним первую учительницу, друзей, уроки, перемены и события класса. Родители выбирают портрет ребёнка и подтверждают персональный разворот до печати.";')
s=s.replace('enabled audience="grade4" className="grade4-mobile-v8 kindergarten-mobile-v1 kindergarten-mobile-content-v3 min-h-screen overflow-x-clip bg-background pb-16"','enabled audience={audience} className={`grade4-mobile-v8 ${senior ? "senior-mobile-v9 " : ""}kindergarten-mobile-v1 kindergarten-mobile-content-v3 min-h-screen overflow-x-clip bg-background pb-16`}')
s=s.replace('<title>Выпускные альбомы для 4 класса в СПб | Дети в кадре</title>','<title>{senior ? "Выпускные альбомы для 9 и 11 классов в СПб | Дети в кадре" : "Выпускные альбомы для 4 класса в СПб | Дети в кадре"}</title>')
s=s.replace('content="Выпускные альбомы для 4 класса в Санкт-Петербурге: первая учительница, друзья и события начальной школы, выбор портрета родителями, бесплатная досъёмка, договор и доставка СДЭК."','content={senior ? "Современные выпускные альбомы для 9 и 11 классов Санкт-Петербурга: личный выбор портрета, бесплатная досъёмка, проверка макетов, договор, печать и доставка СДЭК." : "Выпускные альбомы для 4 класса в Санкт-Петербурге: первая учительница, друзья и события начальной школы, выбор портрета родителями, бесплатная досъёмка, договор и доставка СДЭК."}')
s=s.replace('href="https://detivkadre.spb.ru/school/4"','href={`https://detivkadre.spb.ru${pagePath}`}').replace('content="https://detivkadre.spb.ru/school/4"','content={`https://detivkadre.spb.ru${pagePath}`}')
s=s.replace('content="Выпускные альбомы для 4 класса — Дети в кадре"','content={senior ? "Выпускные альбомы для 9 и 11 классов — Дети в кадре" : "Выпускные альбомы для 4 класса — Дети в кадре"}')
s=s.replace('content="Четыре первых школьных года — в одной живой истории с понятными условиями и контролем родителей до печати."','content={senior ? "Живые портреты, друзья и важные события школьной жизни — в современном выпускном альбоме с понятными условиями и сроками." : "Четыре первых школьных года — в одной живой истории с понятными условиями и контролем родителей до печати."}')
s=s.replace('<p className="g4-eyebrow">Выпускные альбомы для 4 класса</p>','<p className="g4-eyebrow">{senior ? "Выпускные альбомы для 9 и 11 классов" : "Выпускные альбомы для 4 класса"}</p>')
s=s.replace('<h1>Четыре первых школьных года — в одной живой истории</h1>','<h1>{heading}</h1>')
s=s.replace('<p>Сохраним первую учительницу, друзей, уроки, перемены и события класса. Родители выбирают портрет ребёнка и подтверждают персональный разворот до печати.</p>','<p>{intro}</p>')
s=s.replace('count={grade4HeroImages.length} label="Примеры выпускных альбомов для 4 класса"','count={heroImages.length} label={senior ? "Примеры школьных выпускных альбомов" : "Примеры выпускных альбомов для 4 класса"}')
s=s.replace('grade4HeroImages[index]','heroImages[index]')
s=s.replace('href="/school/4#albums"','href={`${pagePath}#albums`}').replace('href="/school/4#cta"','href={`${pagePath}#cta`}')
s=s.replace('{["Портрет ребёнка выбираете вы", "Бесплатно доснимем отсутствовавших", "Все удачные фотографии — в подарок", "Стоимость и сроки — в договоре"].map', '{(senior ? ["Личный выбор портрета и разворота", "Бесплатная досъёмка отсутствующих", "Все удачные фотографии — в подарок", "Стоимость и сроки — в договоре"] : ["Портрет ребёнка выбираете вы", "Бесплатно доснимем отсутствовавших", "Все удачные фотографии — в подарок", "Стоимость и сроки — в договоре"]).map')
s=s.replace('audience="grade4"','audience={audience}')
s=s.replace('images={grade4StoryImages} Picture={Grade4Picture} school','images={senior ? schoolStoryImages : grade4StoryImages} Picture={senior ? SeniorPicture : Grade4Picture} school senior={senior}')
s=s.replace('<h2>Понятный процесс для родителей, класса и школы</h2>','<h2>{senior ? "Понятный процесс для класса и школы" : "Понятный процесс для родителей, класса и школы"}</h2>')
s=s.replace('<p>Дети снимаются в знакомой школьной обстановке, родители контролируют персональный результат, а ответственный за класс ведёт согласование по понятным этапам.</p>','<p>{senior ? "Выпускники участвуют в выборе, родители контролируют персональные страницы, а школа заранее знает график и условия работы." : "Дети снимаются в знакомой школьной обстановке, родители контролируют персональный результат, а ответственный за класс ведёт согласование по понятным этапам."}</p>')
s=s.replace('<SchoolLayoutsMobile />','<SchoolLayoutsMobile audience={audience} />').replace('schoolLevel="grade4"','schoolLevel={senior ? "grade9_11" : "grade4"}')
(p/'src/components/school/SchoolMobilePage.tsx').write_text(s)
f.write_text('/** Grade-4 defaults preserve the reviewed mobile page. Senior school opts in explicitly. */\nexport { default } from "./SchoolMobilePage";\n')
update('src/components/AnalyticsConsent.tsx','["/kindergarten", "/school/4"]','["/kindergarten", "/school/4", "/school/9-11"]')
update('src/components/kindergarten/KindergartenMobileContent.tsx','export function MobileQuestions({ items, school = false }','export function MobileQuestions({ items, school = false, senior = false }')
update('src/components/kindergarten/KindergartenMobileContent.tsx','const priority = ["Что входит в стоимость?", "Как родители выбирают портрет ребёнка?", "Что делать, если ребёнок пропустил съёмку?", "Когда будут готовы альбомы?"];','const priority = ["Что входит в стоимость?", senior ? "Как выпускник выбирает портрет для альбома?" : "Как родители выбирают портрет ребёнка?", senior ? "Что делать, если выпускник пропустил съёмку?" : "Что делать, если ребёнок пропустил съёмку?", "Когда будут готовы альбомы?"];')
update('src/components/kindergarten/KindergartenFAQ.tsx','<MobileQuestions school={isSchoolAudience}', '<MobileQuestions school={isSchoolAudience} senior={audience === "school"}')
expected={
'src/components/AnalyticsConsent.tsx':'edcbc93cc3eebab214be288ebae2caac996100816e2226094b6e8293c556e041',
'src/components/kindergarten/AlbumCatalog.tsx':'e5d22d495bbd77c87397b5e2e771ff396ac454be8f0a639431221fb12c936c05',
'src/components/kindergarten/KindergartenCatalog.tsx':'6fe83efdae5bed47438318622717025d24dd700096c80d345d575c65d5502f77',
'src/components/kindergarten/KindergartenFAQ.tsx':'7df83c3d8330f25c846d64143949f1cb53875cb679e7e096a0e3f12e3e7f5942',
'src/components/kindergarten/KindergartenMobileContent.tsx':'93fd055f709b7ebe535a106cfe46ab0feb1922d40b865511c7084645dafa5551',
'src/components/school/SchoolGrade4Mobile.tsx':'539a32a4d70a61673d2d96d92ddde777bf6ccee4e1bd4cdb6475b71fc7dd84ac',
'src/components/school/SchoolLayouts.tsx':'88da560cf2418289279eaf35136a56bcbc975d096723033f63c70c791b5880a7',
'src/components/school/SchoolLayoutsMobile.tsx':'b3b7d7d23172df97099c0042624c1a4d8529aab26f560fdf2bb370b9dece2e24',
'src/components/school/SchoolStories.tsx':'1b365524b4a12495a6e0a4962ea47462392ea9bbcd16b3d0e72eeec43ddeec4a',
'src/pages/School.tsx':'3a12189ec2ebfd2a3b54924be4bf7264584b8e5a14668973c12bd5afdcb45052',
'src/components/school/SchoolMobilePage.tsx':'4a6953223b24b0ce7a6de96c9bdfd85a3fbccf839f6d6c17957a6e48b2fe9b0b',
'src/config/albumOrderRules.ts':'171802203cb4f4670c688803a9a961425334e9f2d4ccd1ed8795d15e065d367b',
'src/config/seniorContent.ts':'c71946ea0124ff4a31aaf566bae05b5b6dc1905c898ebbd067523caa9dbe0c5e'}
assert set(expected)==allowed
for name,digest in expected.items(): assert hashlib.sha256((p/name).read_bytes()).hexdigest()==digest,name
self_path='scripts/prepare-senior-v9.py'
(p/self_path).unlink()
subprocess.run(['git','add','--',*sorted(allowed),self_path],check=True)
changed=set(subprocess.check_output(['git','diff','--cached','--name-only'],text=True).splitlines())
assert changed==allowed|{self_path},changed
subprocess.run(['git','config','user.name','github-actions[bot]'],check=True)
subprocess.run(['git','config','user.email','41898282+github-actions[bot]@users.noreply.github.com'],check=True)
subprocess.run(['git','commit','-m','Apply verified school minimum and senior mobile page; preserve desktop and prior previews'],check=True)
subprocess.run(['git','push','origin','HEAD:refs/heads/feature/senior-mobile-v9'],check=True)
