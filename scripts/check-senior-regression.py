"""Reuse the existing strict DOM/pixel comparison engine without weakening assertions.
Only the route matrix, reference label, and shared capture date change.
The reference itself is built by prepare-senior-reference.py from frozen e587ecb.
"""
from pathlib import Path
import subprocess
path='scripts/check-grade4-regression.py'
source=Path(path).read_text()
assert source==subprocess.check_output(['git','show','e587ecb3d7828522ec9957d11e83d1ef296b0425:'+path],text=True)
old="[('/school/4',768),('/school/4',1024),('/school/4',1440),('/kindergarten',390),('/kindergarten',1440),('/school/9-11',390),('/school/9-11',1440),('/albums',390),('/albums',1440),('/',390),('/',1440)]"
new="[('/school/9-11',768),('/school/9-11',1024),('/school/9-11',1440),('/school/4',390),('/school/4',768),('/school/4',1440),('/kindergarten',390),('/kindergarten',1440),('/albums',390),('/albums',1440),('/',390),('/',1440)]"
assert source.count(old)==1
source=source.replace(old,new).replace('1673a16 approved release','e587ecb plus explicitly approved school order text only')
source=source.replace('datetime.datetime(2026,10,1,12,','datetime.datetime(2026,10,2,12,')
exec(compile(source,path,'exec'))
