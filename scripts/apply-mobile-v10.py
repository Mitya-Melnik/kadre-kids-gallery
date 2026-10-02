"""One-use, explicit source edits for the owner's three requests. No main/deploy writes."""
from pathlib import Path
import os, subprocess
BRANCH='feature/mobile-layouts-benefits-v10'
assert os.environ['GITHUB_REF']==f'refs/heads/{BRANCH}'
assert os.environ['GITHUB_REPOSITORY']=='Mitya-Melnik/kadre-kids-gallery'
BASE='09d2757fd6de2e3a534aa9c7d2677a3c822f470f'
edits={
 'src/components/kindergarten/KindergartenLayouts.tsx': [('const layoutDesigns = [','export const layoutDesigns = [')],
 'src/pages/Kindergarten.tsx': [
  ('import KindergartenLayouts from "@/components/kindergarten/KindergartenLayouts";','import KindergartenLayouts from "@/components/kindergarten/KindergartenLayouts";\nimport KindergartenLayoutsMobile from "@/components/kindergarten/KindergartenLayoutsMobile";'),
  ('layouts: <KindergartenLayouts />,','layouts: mobile ? <KindergartenLayoutsMobile /> : <KindergartenLayouts />,'),
  ('? ["hero", "promotion", "catalog", "controls", "gallery", "story", "advantages",','? ["hero", "promotion", "catalog", "controls", "gallery", "advantages",'),
  ('<Footer kindergartenPage />','<Footer kindergartenPage hideKindergartenCase={mobile} />')],
 'src/components/school/SchoolMobilePage.tsx': [
  ('import { Check } from "lucide-react";\n',''),
  ('const seniorProcessSteps =','const heroBenefitIcons = ["🖼️", "📷", "🎁", "📄"] as const;\n\nconst seniorProcessSteps ='),
  ('.map((item) => <p key={item}><Check size={18} aria-hidden="true" /><span>{item}</span></p>)','.map((item, index) => <p key={item}><span className="g4-benefit-icon" aria-hidden="true">{heroBenefitIcons[index]}</span><span>{item}</span></p>)')],
 'src/components/school/grade4-mobile-v8.css': [
  ('.g4-hero-benefits p { display: flex; gap: .375rem; padding: .625rem;','.g4-hero-benefits p { display: flex; flex-direction: column; gap: .25rem; padding: .75rem;'),
  ('  .grade4-mobile-v8 .g4-hero-benefits svg { color: var(--km-accent); flex-shrink: 0; margin-top: .2rem; }','  .grade4-mobile-v8 .g4-benefit-icon { font-size: 1.25rem; line-height: 1.4; flex-shrink: 0; }')],
 'src/components/Footer.tsx': [
  ('  kindergartenPage?: boolean;','  kindergartenPage?: boolean;\n  hideKindergartenCase?: boolean;'),
  ('kindergartenPage = false, schoolPage','kindergartenPage = false, hideKindergartenCase = false, schoolPage'),
  ('{quickLinks.map((link, index) => (','{quickLinks.filter((link) => !hideKindergartenCase || link.href !== "#case-kindergarten-108").map((link, index) => (')],
 'src/components/kindergarten/MobileContentViewportControls.tsx': [('.kg3-advantages-wrap, .kgp6"','.kg3-advantages-wrap, .kgp6, .kg10-layouts"')],
}
for name,replacements in edits.items():
 p=Path(name);s=p.read_text()
 assert s==subprocess.check_output(['git','show',BASE+':'+name],text=True),name
 for old,new in replacements:
  assert s.count(old)==1,(name,old);s=s.replace(old,new,1)
 if name.endswith('grade4-mobile-v8.css'):
  s+='\n@media (max-width: 359px) {\n  .grade4-mobile-v8 .g4-hero-benefits { grid-template-columns: 1fr; }\n  .grade4-mobile-v8 .g4-hero-benefits p { flex-direction: row; gap: .75rem; }\n}\n'
 p.write_text(s)
Path(__file__).unlink()
subprocess.run(['git','add','--',*edits,'scripts/apply-mobile-v10.py'],check=True)
subprocess.run(['git','config','user.name','github-actions[bot]'],check=True)
subprocess.run(['git','config','user.email','41898282+github-actions[bot]@users.noreply.github.com'],check=True)
subprocess.run(['git','commit','-m','Apply mobile-only kindergarten layouts and school benefit icons; omit mobile case'],check=True)
subprocess.run(['git','push','origin',f'HEAD:refs/heads/{BRANCH}'],check=True)
