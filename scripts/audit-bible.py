#!/usr/bin/env python3
"""Audit static WEB Bible JSON after import. Nonzero exit on errors."""
import json,re,pathlib,sys
root=pathlib.Path(__file__).resolve().parents[1]/'bible-data'
manifest=json.loads((root/'manifest.json').read_text(encoding='utf-8'))
errors=[];chapters=verses=0
if len(manifest.get('codes',[]))!=66 or len(set(manifest.get('codes',[])))!=66:errors.append('Expected 66 unique book codes')
for code in manifest['codes']:
 path=root/(code+'.json')
 if not path.exists():errors.append('Missing '+str(path));continue
 book=json.loads(path.read_text(encoding='utf-8'));chapters+=len(book)
 for chapter,items in book.items():
  if not chapter.isdigit() or not isinstance(items,dict) or not items:errors.append(f'{code} chapter {chapter} invalid');continue
  for verse,body in items.items():
   verses+=1
   if not verse.isdigit() or not isinstance(body,str) or not body.strip():errors.append(f'{code} {chapter}:{verse} empty or invalid');continue
   if re.search(r'\\[a-zA-Z]|\|strong=|\\f\*|\\w\*',body):errors.append(f'{code} {chapter}:{verse} leftover USFM markup')
if chapters!=1189:errors.append(f'Expected 1189 chapters; got {chapters}')
if verses!=manifest.get('verses'):errors.append(f'Manifest {manifest.get("verses")} does not match {verses}')
if verses<30000:errors.append(f'Too few verse entries: {verses}')
print(json.dumps({'books':len(manifest['codes']),'chapters':chapters,'verses':verses,'errors':len(errors),'samples':errors[:20]},indent=2))
sys.exit(bool(errors))
