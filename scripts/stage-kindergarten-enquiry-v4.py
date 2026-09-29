"""One-time literal patch of reviewed files. The preview workflow removes this after success.
Only feature/kindergarten-mobile-lead-v4 may be updated. No force push or deployment.
"""
from pathlib import Path
import subprocess
BASE='67da4ff038bda1280ecc88864bdc69c552c55149'
paths=['src/pages/Kindergarten.tsx','src/config/albumPackages.ts','src/components/kindergarten/AlbumCatalog.tsx','src/components/FAQ.tsx','src/components/kindergarten/KindergartenFAQ.tsx','src/components/AlbumPromoStrip.tsx']
for path in paths:
    assert Path(path).read_bytes()==subprocess.check_output(['git','show',f'{BASE}:{path}']),f'Unreviewed concurrent change: {path}'
def patch(path,changes):
    p=Path(path);s=p.read_text()
    for old,new in changes:
        assert old in s,(path,old)
        s=s.replace(old,new)
    p.write_text(s)
patch('src/pages/Kindergarten.tsx',[
('import { Fragment } from "react";', 'import { Fragment } from "react";\nimport { KindergartenEnquiryShell, KindergartenEnquirySection } from "@/components/kindergarten/KindergartenEnquiry";'),
('form: <CTA ', 'form: mobile ? <KindergartenEnquirySection /> : <CTA '),
('<div className="kindergarten-mobile-v1','<KindergartenEnquiryShell enabled={mobile} className="kindergarten-mobile-v1'),
('    </div>\n  );','    </KindergartenEnquiryShell>\n  );')])
patch('src/config/albumPackages.ts',[
('export const albumPackages','import { albumCommercial } from "./albumCommercial";\n\nexport const albumPackages'),
('"Фотосъёмка выпускного — скидка 20%",\n      "Видеосъёмка выпускного — скидка 20%",','albumCommercial.historyPhoto,\n      albumCommercial.historyVideo,\n      albumCommercial.historyPackage,\n      albumCommercial.historyEligibility,\n      albumCommercial.historyScope,'),
('graduationBonus: "скидка 20% на фото- и видеосъёмку выпускного",','graduationBonus: albumCommercial.historySummary,'),
('"Фотосъёмка выпускного — в подарок в рамках трёх съёмочных дней",\n      "Видеосъёмка выпускного — скидка 50%",','albumCommercial.bigPhoto,\n      albumCommercial.bigVideo,'),
('graduationBonus: "фотосъёмка выпускного — в подарок в рамках трёх съёмочных дней. Видеосъёмка выпускного — со скидкой 50%",','graduationBonus: albumCommercial.bigSummary,')])
patch('src/components/kindergarten/AlbumCatalog.tsx',[
('import { albumPackages } from "@/config/albumPackages";','import { albumPackages } from "@/config/albumPackages";\nimport { albumCommercial } from "@/config/albumCommercial";'),
('graduationBonus: "Фото и видео — скидка 20%", graduationBonusTable: "Фото и видео −20%"','graduationBonus: albumCommercial.historySummary, graduationBonusTable: albumCommercial.historySummary'),
('graduationBonus: "Фотосъёмка — в подарок, видео — скидка 50%", graduationBonusTable: "Фото — подарок, видео −50%"','graduationBonus: albumCommercial.bigSummary, graduationBonusTable: albumCommercial.bigSummary'),
('{item.graduationBonusTable}','{isSchool ? schoolText(item.graduationBonusTable, audience) : item.graduationBonusTable}'),
('{item.graduationBonus.toLowerCase()}','{(isSchool ? schoolText(item.graduationBonus, audience) : item.graduationBonus).toLowerCase()}'),
('<p className="mt-1 text-sm text-muted-foreground">Коротко о том, чем отличаются три полноценных альбома.</p>','<p className="mt-1 text-sm text-muted-foreground">Коротко о том, чем отличаются три полноценных альбома.</p>\n                <p className="mt-2 text-sm text-muted-foreground">{isSchool ? schoolText(`${albumCommercial.historyEligibility}. ${albumCommercial.historyScope}`, audience) : `${albumCommercial.historyEligibility}. ${albumCommercial.historyScope}`}</p>')])
patch('src/components/FAQ.tsx',[
('import { useEffect, useState }','import { albumCommercial } from "@/config/albumCommercial";\nimport { useEffect, useState }'),
('Да. Минимальный тираж — 10 альбомов одного выбранного формата.','Минимальный общий заказ — 10 альбомов. «Наша группа» и «История детства» могут сочетаться в любом соотношении. Смешанный заказ с другими форматами согласовывается до договора.'),
('  { question: "Что такое «Письмо в будущее»?"','  { question: "Диплом и грамота — что входит в альбом?", answer: albumCommercial.gifts },\n  { question: "Когда действует скидка 20% на выпускную съёмку?", answer: `${albumCommercial.historyEligibility}. ${albumCommercial.historyPhoto}. ${albumCommercial.historyVideo}. ${albumCommercial.historyPackage}. ${albumCommercial.historyScope}` },\n  { question: "Что оплачивается отдельно для «Большой истории»?", answer: `${albumCommercial.bigPhoto}. ${albumCommercial.bigVideo}. Reels до 1 минуты — 5 000 ₽. Фотографию повторно оплачивать не нужно.` },\n  { question: "Достаточно ли предоплаты для скидки 10%?", answer: albumCommercial.earlyPayment },\n  { question: "Что такое «Письмо в будущее»?"')])
patch('src/components/kindergarten/KindergartenFAQ.tsx',[
('.replace(/группы или класса/g, "класса")','.replace(/История детства/g, "Школьные годы")\n        .replace(/группы или класса/g, "класса")')])
patch('src/components/AlbumPromoStrip.tsx',[
('Скидка 10% при оплате до 1 октября','Скидка 10% при полной оплате'),
('на все выпускные альбомы','подтверждённого заказа до 1 октября 2026 включительно')])
print('Patched only:', *paths, sep='\n')
