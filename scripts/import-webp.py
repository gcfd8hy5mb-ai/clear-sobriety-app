#!/usr/bin/env python3
"""Import official public-domain WEB Protestant USFM text into static CLEAR JSON."""
import io,json,re,urllib.request,zipfile,pathlib,sys
URL="https://ebible.org/engwebp/engwebp_usfm.zip"
ROOT=pathlib.Path(__file__).resolve().parents[1]/"bible-data"
CODES="GEN EXO LEV NUM DEU JOS JDG RUT 1SA 2SA 1KI 2KI 1CH 2CH EZR NEH EST JOB PSA PRO ECC SNG ISA JER LAM EZK DAN HOS JOL AMO OBA JON MIC NAM HAB ZEP HAG ZEC MAL MAT MRK LUK JHN ACT ROM 1CO 2CO GAL EPH PHP COL 1TH 2TH 1TI 2TI TIT PHM HEB JAS 1PE 2PE 1JN 2JN 3JN JUD REV".split()
def clean(s):
 s=re.sub(r'\\\\(?:f|x)\\+.*?\\\\(?:f|x)\\*','',s)
 s=re.sub(r'\\\\(?:w|+w)\s+([^|\\\\]+)(?:\|[^\\\\]+)?\\\\(?:w|+w)\\*',r'\1',s)
 s=re.sub(r'\\\\[+a-zA-Z0-9*]+(?:\s+)?',' ',s)
 return re.sub(r'\s+',' ',s).strip()
with urllib.request.urlopen(URL,timeout=90) as response: payload=response.read()
z=zipfile.ZipFile(io.BytesIO(payload));found={}
for name in z.namelist():
 if not name.lower().endswith('.usfm'):continue
 raw=z.read(name).decode('utf-8-sig',errors='replace')
 match=re.search(r'(?m)^\\\\id\s+([A-Za-z0-9]+)',raw)
 if not match:continue
 code=match.group(1).upper()
 if code not in CODES:continue
 chapters={};chapter=None;verse=None
 def flush():
  if chapter and verse and segments:
   text=clean(' '.join(segments))
   if text:chapters.setdefault(str(chapter),{})[str(verse)]=text
 segments=[]
 for line in raw.splitlines():
  line=line.strip()
  cm=re.match(r'^\\\\c\s+(\d+)',line)
  if cm:
   flush();chapter=int(cm.group(1));verse=None;segments=[];continue
  vm=re.match(r'^\\\\v\s+(\d+)(?:[-–]\d+)?\s*(.*)',line)
  if vm:
   flush();verse=int(vm.group(1));segments=[vm.group(2)];continue
  if chapter and verse and line and not re.match(r'^\\\\(?:s|ms|mt|h|toc|cl|d|r)\b',line):segments.append(line)
 flush()
 if chapters:found[code]=chapters
missing=[x for x in CODES if x not in found]
total=sum(len(v) for book in found.values() for v in book.values())
if missing or sum(map(len,[v for v in found.values()]))<1189 or total<30000:
 sys.exit(f"Bible integrity check failed: missing={missing}, chapters={sum(map(len,found.values()))}, verses={total}")
ROOT.mkdir(parents=True,exist_ok=True)
for code,chapters in found.items():
 (ROOT/(code+'.json')).write_text(json.dumps(chapters,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
(ROOT/'manifest.json').write_text(json.dumps({'translation':'World English Bible Protestant Edition','source':URL,'publicDomain':True,'books':len(found),'chapters':sum(len(v) for v in found.values()),'verses':total,'codes':CODES},indent=2),encoding='utf-8')
print('Imported',len(found),'books and',total,'verse entries.')
