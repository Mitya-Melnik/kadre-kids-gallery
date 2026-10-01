"""One-use transfer of the locally built, reviewed patch; this branch only."""
from pathlib import Path
import base64, hashlib, lzma, os, subprocess, shutil
branch='feature/grade4-mobile-v8'
assert os.environ['GITHUB_REF']==f'refs/heads/{branch}'
assert os.environ['GITHUB_REPOSITORY']=='Mitya-Melnik/kadre-kids-gallery'
subprocess.run(['git','merge-base','--is-ancestor','997d59e7e4cf25134d3a83d32c94556570ff9408','HEAD'],check=True)
folder=Path('scripts/grade4-preview-stage')
parts=sorted(folder.glob('part-*.b64'));assert len(parts)==4
patch=lzma.decompress(base64.b64decode(''.join(p.read_text().strip() for p in parts),validate=True))
assert hashlib.sha256(patch).hexdigest()=='c23178f5157a5eded97e192702f108855f0575c3b36a626e61c5f36eed936e53'
allowed=set('''docs/grade4-mobile-v8.md
scripts/check-grade4-mobile-v8.py
scripts/check-grade4-regression.py
scripts/test-grade4-enquiry.mjs
src/components/Process.tsx
src/components/kindergarten/AlbumCatalog.tsx
src/components/kindergarten/KindergartenCatalog.tsx
src/components/kindergarten/KindergartenEnquiry.tsx
src/components/kindergarten/KindergartenFAQ.tsx
src/components/kindergarten/KindergartenMobileContent.tsx
src/components/kindergarten/KindergartenProcessMobile.tsx
src/components/school/Grade4Layouts.tsx
src/components/school/SchoolGrade4Mobile.tsx
src/components/school/SchoolLayoutsMobile.tsx
src/components/school/SchoolStories.tsx
src/components/school/grade4-mobile-v8.css
src/config/albumAudience.ts
src/config/grade4Content.ts
src/lib/kindergartenLead.ts
src/pages/SchoolGrade4.tsx'''.splitlines())
paths={line.split(' b/',1)[1] for line in patch.decode().splitlines() if line.startswith('diff --git ')}
assert paths==allowed,(paths-allowed,allowed-paths)
subprocess.run(['git','apply','--check','-'],input=patch,check=True)
subprocess.run(['git','apply','-'],input=patch,check=True)
shutil.rmtree(folder)
subprocess.run(['git','add','--',*sorted(allowed),'scripts/grade4-preview-stage'],check=True)
subprocess.run(['git','config','user.name','github-actions[bot]'],check=True)
subprocess.run(['git','config','user.email','41898282+github-actions[bot]@users.noreply.github.com'],check=True)
subprocess.run(['git','commit','-m','Add isolated grade-4 mobile page using shared approved controls; remove one-use staging'],check=True)
subprocess.run(['git','push','origin',f'HEAD:refs/heads/{branch}'],check=True)
print('Applied only the allowlisted mobile preview patch; no workflow write, merge or deployment.')
