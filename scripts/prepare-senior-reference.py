"""Build a comparison reference from e587ecb + ONLY owner-approved school order wording.
This never changes the working app, school page structure, styling, or media.
"""
from pathlib import Path
import shutil, sys
root=Path(sys.argv[1])
def replace(path,old,new):
 f=root/path;s=f.read_text();assert old in s,(path,old);f.write_text(s.replace(old,new))
shutil.copy2('src/config/albumOrderRules.ts',root/'src/config/albumOrderRules.ts')
replace('src/components/kindergarten/AlbumCatalog.tsx','import { albumCommercial } from "@/config/albumCommercial";','import { albumCommercial } from "@/config/albumCommercial";\nimport { albumOrderRules } from "@/config/albumOrderRules";')
replace('src/components/kindergarten/AlbumCatalog.tsx','{isSchool ? "15" : "10"}','{albumOrderRules.minimum}')
replace('src/components/kindergarten/KindergartenCatalog.tsx','import { albumPackages } from "@/config/albumPackages";','import { albumPackages } from "@/config/albumPackages";\nimport { albumOrderRules } from "@/config/albumOrderRules";')
replace('src/components/kindergarten/KindergartenCatalog.tsx','// Preserve the current school minimum. The removed discount threshold is a different rule.\n  const minimum = isSchool ? 15 : 10;','// Total order minimum; independent of the graduation shooting discount.\n  const minimum = albumOrderRules.minimum;')
replace('src/components/kindergarten/KindergartenCatalog.tsx','<p>21×30 см · заказ от {minimum} альбомов</p>','<p>21×30 см · заказ от {minimum} альбомов</p>\n          {isSchool && <p>{albumOrderRules.schoolMixedSummary}</p>}')
replace('src/components/kindergarten/KindergartenCatalog.tsx','<li>Формат — 21×30 см. Минимальный тираж — от {minimum} альбомов.</li>','<li>Формат — 21×30 см. Минимальный тираж — от {minimum} альбомов.</li>\n                  {isSchool && <><li>{albumOrderRules.schoolMixedDetails}</li><li>{albumOrderRules.otherFormats}</li></>}')
replace('src/components/kindergarten/KindergartenFAQ.tsx','import { MobileQuestions } from "./KindergartenMobileContent";','import { MobileQuestions } from "./KindergartenMobileContent";\nimport { schoolMinimumAnswer } from "@/config/albumOrderRules";')
replace('src/components/kindergarten/KindergartenFAQ.tsx','"Да. Минимальный тираж для школы — 15 альбомов одного выбранного формата."','schoolMinimumAnswer')
