// Exact bounded breadth-first solver. Inputs: nodeCap depthCap followed by 20 cells.
// Outputs one JSON result per line; "limit" never means proof of unsolvability.
#include <array>
#include <vector>
#include <unordered_map>
#include <algorithm>
#include <iostream>
#include <cstdint>
#include <string>
using Board = std::array<int8_t,20>;
struct Hash {size_t operator()(Board const& b) const noexcept {uint64_t h=1469598103934665603ULL;for(auto v:b){h^=static_cast<unsigned char>(v);h*=1099511628211ULL;}return h;}};
struct Node {Board b;int parent;uint8_t action,depth;};
struct Move {Board b;uint8_t action,pairs;};
int rankof(int n){return (n+3)/4;} int suitof(int n){return (n-1)%4;}
int next(int p,int d){if(d==0)return p>=4?p-4:-1;if(d==1)return p%4<3?p+1:-1;if(d==2)return p<16?p+4:-1;return p%4>0?p-1:-1;}
Move step(Board const& b,int s,int d){Move m{b,uint8_t(s*4+d),0};std::array<int,20> active{};int size=0;
 for(int p=0;p<20;++p)if(b[p]>0&&suitof(b[p])==s)active[size++]=p;
 if(d==1||d==2)std::reverse(active.begin(),active.begin()+size);
 for(int j=0;j<size;++j){int from=active[j],id=b[from];if(m.b[from]!=id)continue;int to=from,target=-1;
  while(true){int n=next(to,d);if(n<0||m.b[n]==-1)break;if(m.b[n]>0){if(rankof(m.b[n])==rankof(id))target=n;break;}to=n;}
  if(target>=0){m.b[from]=0;m.b[target]=0;m.pairs++;}else if(to!=from){m.b[from]=0;m.b[to]=id;}
 }return m;}
bool empty(Board const& b){for(int v:b)if(v>0)return false;return true;}
void solve(Board const& initial,int cap,int maxDepth){
 if(empty(initial)){std::cout<<"{\"status\":\"solved\",\"solution\":[],\"nodes\":0,\"optimal\":true}\n";return;}
 std::vector<Node> q; q.reserve(cap+1); q.push_back({initial,-1,0,0});
 std::unordered_map<Board,int,Hash> seen; seen.reserve(cap+1);seen.emplace(initial,0);
 bool depthLimit=false;int found=-1;size_t head=0;
 for(;head<q.size()&&int(q.size())<cap;head++){
  const Node n=q[head]; if(n.depth>=maxDepth){depthLimit=true;continue;}
  std::vector<Move> moves;unsigned suits=0;for(int id:n.b)if(id>0)suits|=1<<suitof(id);
  for(int s=0;s<4;s++)if(suits&(1<<s))for(int d=0;d<4;d++){auto m=step(n.b,s,d);if(m.b!=n.b)moves.push_back(m);}
  // Stable ordering finds preparatory shortest routes before equally short greedy ones.
  std::stable_sort(moves.begin(),moves.end(),[](Move const& a,Move const& b){return a.pairs<b.pairs;});
  for(auto const& m:moves){if(seen.count(m.b))continue;int idx=q.size();q.push_back({m.b,int(head),m.action,uint8_t(n.depth+1)});seen.emplace(m.b,idx);
   if(empty(m.b)){found=idx;break;}if(int(q.size())>=cap)break;
  }if(found>=0)break;
 }
 if(found>=0){std::vector<int> path;int cursor=found;while(q[cursor].parent>=0){path.push_back(q[cursor].action);cursor=q[cursor].parent;}std::reverse(path.begin(),path.end());
  std::cout<<"{\"status\":\"solved\",\"nodes\":"<<q.size()<<",\"optimal\":true,\"solution\":[";bool comma=false;for(int a:path){if(comma)std::cout<<",";std::cout<<"["<<a/4<<","<<a%4<<"]";comma=true;}std::cout<<"]}\n";
 }else std::cout<<"{\"status\":\""<<((head<q.size()||depthLimit)?"limit":"unsolvable")<<"\",\"nodes\":"<<q.size()<<"}\n";
}
int main(){std::ios::sync_with_stdio(false);std::cin.tie(nullptr);int cap,depth,n;while(std::cin>>cap>>depth){Board b;for(int i=0;i<20;i++){std::cin>>n;b[i]=n;}solve(b,cap,depth);std::cout.flush();}}
