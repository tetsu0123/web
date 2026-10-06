"""Generate problems with certified shortest routes and a provably longer clearing opening.
Compile solve-exact.cpp first (C++17), then run with SUIT_SOLVER=<binary path>.
"""
import json, random, subprocess, itertools, os, time
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
R=random.Random(2026091602)
proc=subprocess.Popen([os.environ.get('SUIT_SOLVER','/tmp/suitshift-solver')],stdin=subprocess.PIPE,stdout=subprocess.PIPE,text=True,bufsize=1)
def solve(b,cap=80000,depth=12):
 proc.stdin.write(f'{cap} {depth} '+ ' '.join(map(str,b))+'\n');proc.stdin.flush()
 return json.loads(proc.stdout.readline())
def rank(n):return (n+3)//4
def suit(n):return (n-1)%4
def step(b,s,d):
 out=b[:];active=[p for p,n in enumerate(b) if n>0 and suit(n)==s]
 if d in (1,2):active.reverse()
 pairs=0
 for fr in active:
  v=b[fr]
  if out[fr]!=v:continue
  to=fr;target=None
  while True:
   x,y=to%4,to//4
   nxt=[to-4 if y>0 else -1,to+1 if x<3 else -1,to+4 if y<4 else -1,to-1 if x>0 else -1][d]
   if nxt<0 or out[nxt]==-1:break
   if out[nxt]>0:
    if rank(out[nxt])==rank(v):target=nxt
    break
   to=nxt
  if target is not None:out[fr]=out[target]=0;pairs+=1
  elif to!=fr:out[to],out[fr]=v,0
 return out,pairs
perms=list(itertools.permutations(range(4)))
def sig(b):
 signatures=[]
 for fx,fy in itertools.product((False,True),repeat=2):
  flat=[b[(4-y if fy else y)*4+(3-x if fx else x)] for y in range(5) for x in range(4)]
  rm={}
  for n in flat:
   if n>0 and rank(n) not in rm:rm[rank(n)]=len(rm)+1
  for perm in perms:signatures.append(tuple(n if n<=0 else rm[rank(n)]*4+perm[suit(n)] for n in flat))
 return min(signatures)
def replay(b,path):
 counts=[]
 for s,d in path:b,p=step(b,s,d);counts.append(p)
 assert not any(n>0 for n in b)
 return counts
old=[{"board":[0,0,0,0,25,0,0,28,0,0,0,0,13,0,0,15,0,0,0,0]},{"board":[0,0,0,0,44,0,19,0,20,0,0,0,0,42,0,7,0,8,0,0]},{"board":[0,16,0,12,0,0,0,0,0,9,0,0,0,0,14,0,6,0,0,8]},{},{},{},{},{"board":[0,0,0,0,0,10,0,21,35,0,0,34,15,11,23,0,14,0,0,0]}]
levels=[];signatures=set();stats={'seed':2026091602,'attempts':0,'shortestRejected':0,'qualityRejected':0}
def add(b,result,meta):
 signature=sig(b)
 if signature in signatures:return False
 signatures.add(signature)
 counts=replay(b,result['solution']); idx=len(levels)+1
 level={'id':idx,'board':b,'solution':result['solution'],'par':len(result['solution']),'optimal':True,'revision':2,**meta}
 level['limit']=level['par']+(1 if idx<=20 else 0)
 level['expertLimit']=level['par']
 levels.append(level)
 if len(levels)%5==0 or idx<6:print(f"accepted {idx:3}: optimum {level['par']}, delta {level.get('quality',{}).get('saving',0)}, pairs {counts}, attempts {stats['attempts']}",flush=True)
 return True
# A short tutorial precedes the first optimization puzzle.
add(old[0]['board'],solve(old[0]['board']),{'title':'まとめて消す','tip':'♥を右へスワイプ','teaching':True})
for idx in [1,2]:
 b=old[idx]['board'];r=solve(b,200000)
 add(b,r,{'title':['停止位置','同時に動かす'][idx-1],'tip':'同じマークがすべて動く。数字が違うと手前で止まる。','teaching':True})
# Keep the specification's reproducible four-versus-five example as stage 4.
b=old[7]['board'];r=solve(b,250000);other,_=step(b,1,3);alt=solve(other,250000)
add(b,r,{'title':'消さない一手','tip':'すぐ消すより、先に止まる位置を整える。','quality':{'temptingMove':[1,3],'temptingPairs':1,'alternativeSolution':[[1,3]]+alt['solution'],'alternativeMoves':len(alt['solution'])+1,'saving':len(alt['solution'])+1-len(r['solution']),'preparation':True,'combo':2}})
start=time.time()
# True measured alternatives rather than random detours: the alternative opening
# must remove at least one pair and must not be part of a shortest solution.
while len(levels)<120 and stats['attempts']<20000:
 stats['attempts']+=1;idx=len(levels)+1;chapter=(idx-1)//20
 pairs=R.choice(([3,4],[4,5],[4,5],[4,5],[4,5,6],[5,6])[chapter])
 wallCount=0 if chapter<3 else 1 if chapter<5 else R.choice([1,2])
 b=[0]*20;positions=R.sample(range(20),20)
 for _ in range(wallCount):b[positions.pop()]=-1
 ranks=R.sample(range(1,14),pairs);cards=[]
 p=0
 while p<pairs:
  if chapter>=4 and p==0:
   cards += [(ranks[p]-1)*4+s+1 for s in range(4)];p+=2
  else:
   cards += [(ranks[p]-1)*4+s+1 for s in R.sample(range(4),2)];p+=1
 for card in cards:b[positions.pop()]=card
 choices=[]
 for s in range(4):
  for d in range(4):
   bb,pp=step(b,s,d)
   if pp:choices.append((pp,s,d,bb))
 if not choices:continue
 result=solve(b,60000 if chapter<4 else 90000,11)
 if result['status']!='solved':stats['shortestRejected']+=1;continue
 path=result['solution'];depth=len(path)
 if depth<([3,4,4,4,5,5][chapter]) or depth>[6,7,8,8,9,10][chapter]:continue
 counts=replay(b,path)
 if max(counts)<2:continue
 # Prefer genuine setup moves, but keep order-of-clearing problems too.
 isPrep=counts[0]==0
 if idx%4!=0 and not isPrep:continue
 choices.sort(reverse=True)
 alternative=None
 for pp,s,d,bb in choices[:6]:
  if [s,d]==path[0]:continue
  alt=solve(bb,70000 if chapter<4 else 100000,depth+5)
  if alt['status']!='solved':continue
  savings=len(alt['solution'])+1-depth
  if savings>=2:
   alternative={'temptingMove':[s,d],'temptingPairs':pp,'alternativeSolution':[[s,d]]+alt['solution'],'alternativeMoves':len(alt['solution'])+1,'saving':savings,'preparation':isPrep,'combo':max(counts)};break
 if not alternative:stats['qualityRejected']+=1;continue
 title='配置してから消す' if isPrep else '消す順を選ぶ'
 if chapter==3:title='壁を停止位置に使う'
 if chapter>=4:title='残すペアを選ぶ'
 add(b,result,{'title':title,'quality':alternative})
 if len(levels)%10==0:
  (ROOT/'docs/curation-progress.json').write_text(json.dumps({'count':len(levels),'seconds':time.time()-start,**stats}))
# Never claim a candidate was certified if exhaustive search reached a cap.
assert len(levels)==120,{'count':len(levels),**stats}
(ROOT/'docs/curated-levels.json').write_text(json.dumps(levels,separators=(',',':'),ensure_ascii=False))
subprocess.run(['node',str(ROOT/'scripts/pack-levels.cjs')],check=True)
report={**stats,'levels':len(levels),'shortestCertified':len(levels),'strategyLevels':len([l for l in levels if 'quality'in l]),'twoMoveSavings':len([l for l in levels if l.get('quality',{}).get('saving',0)>=2]),'preparationOptimal':sum(l.get('quality',{}).get('preparation',False) for l in levels),'allSolutionsReplayed':True,'structuralDeduplication':True,'elapsedSeconds':round(time.time()-start,2),'meaning':'alternativeMoves is 1 + the certified minimum from the board after temptingMove. It is not an arbitrary padded route.'}
(ROOT/'docs/levels-report.json').write_text(json.dumps(report,indent=2,ensure_ascii=False))
print(json.dumps(report),flush=True)
proc.stdin.close();proc.terminate()
