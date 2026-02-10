  import React, { useState, useReducer, useEffect, useMemo } from 'react';
  import { motion, AnimatePresence } from 'framer-motion';
  import confetti from 'canvas-confetti';
  import { Toaster, toast } from 'sonner';
  import { formatDistanceToNow } from 'date-fns';
  import { AreaChart, Area, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer } from 'recharts';
  import {
    Heart, MessageCircle, Share2, Bookmark, Search, Bell, Home, User, Settings,
    MoreHorizontal, Send, Smile, Plus, Camera, Image, BarChart3, MapPin, Link2,
    Calendar, X, Check, TrendingUp, Users, Hash, Flame, Copy, Repeat2,
    Sparkles, Globe, Lock, AtSign, Zap, Trash2, AlertTriangle, Mail
  } from 'lucide-react';
  import { Button } from '@/components/ui/button';
  import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
  import { Avatar, AvatarFallback } from '@/components/ui/avatar';
  import { Badge } from '@/components/ui/badge';
  import { Input } from '@/components/ui/input';
  import { Label } from '@/components/ui/label';
  import { Textarea } from '@/components/ui/textarea';
  import { Progress } from '@/components/ui/progress';
  import { Separator } from '@/components/ui/separator';
  import { Skeleton } from '@/components/ui/skeleton';
  import { Switch } from '@/components/ui/switch';
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
  import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
  import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
  import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
  import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
  import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
  import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
  import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
  import { Slider } from '@/components/ui/slider';
  import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
  import { ScrollArea } from '@/components/ui/scroll-area';
  import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
  import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
  import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
  import { cn } from '@/lib/utils';

  type RT = 'like'|'love'|'fire'|'laugh';
  type PT = 'text'|'poll'|'media';
  type NavT = 'feed'|'profile'|'settings'|'notifications';
  type FF = 'foryou'|'following'|'trending';

  interface UP { id:string; name:string; handle:string; bio:string; grad:string; coverGrad:string; verified:boolean; following:boolean; stats:{posts:number;followers:number;following:number;likes:number} }
  interface Cmt { id:string; authorId:string; content:string; createdAt:Date; likes:number; liked:boolean }
  interface PO { text:string; votes:number }
  interface Post { id:string; authorId:string; content:string; type:PT; createdAt:Date; reactions:Record<RT,number>; userReaction:RT|null; comments:Cmt[]; bookmarked:boolean; pinned:boolean; tags:string[]; poll?:{options:PO[];voted:number|null;total:number}; media?:{grad:string;title:string;sub:string}; views:number; showComments:boolean }
  interface Notif { id:string; type:string; fromId:string; postId?:string; content:string; createdAt:Date; read:boolean }

  interface St {
    tab:NavT; ff:FF; users:Record<string,UP>; posts:Post[]; notifs:Notif[];
    trending:{tag:string;count:number}[]; suggested:string[]; uid:string; loading:boolean;
    cc:string; ct:PT; cm:string; cpo:string[]; searchOpen:boolean; editOpen:boolean;
    storyOpen:boolean; storyIdx:number; theme:string; dark:boolean; fontSize:number;
    np:{likes:boolean;replies:boolean;follows:boolean;mentions:boolean};
    pv:string; dm:string; online:boolean;
  }

  type Act =
    |{type:'TAB';v:NavT}|{type:'FF';v:FF}|{type:'LOADING';v:boolean}
    |{type:'REACT';pid:string;r:RT}|{type:'BM';pid:string}|{type:'TCMT';pid:string}
    |{type:'ACMT';pid:string;c:string}|{type:'LCMT';pid:string;cid:string}
    |{type:'VOTE';pid:string;i:number}|{type:'POST'}|{type:'DEL';pid:string}
    |{type:'COMP';f:string;v:string|string[]|PT}|{type:'FOLLOW';uid:string}
    |{type:'NREAD';nid:string}|{type:'NREADALL'}|{type:'SEARCH';v:boolean}
    |{type:'EDIT';v:boolean}|{type:'UPROF';u:Partial<UP>}
    |{type:'STORY';open:boolean;i?:number}|{type:'THEME';v:string}
    |{type:'DARK';v:boolean}|{type:'FONT';v:number}|{type:'NP';k:string;v:boolean}
    |{type:'PRIV';k:string;v:string|boolean};

  const RXS:{type:RT;emoji:string}[] = [{type:'like',emoji:'👍'},{type:'love',emoji:'❤️'},{type:'fire',emoji:'🔥'},{type:'laugh',emoji:'😂'}];
  const EMOJIS = '😀😂🥰😎🤔😢🔥💯👏🎉❤️💪🙌✨🚀👀💡🎯'.match(/./gu)!;
  const MOODS = [{e:'😊',l:'Happy'},{e:'🤔',l:'Thoughtful'},{e:'🔥',l:'Fired Up'},{e:'😴',l:'Chill'},{e:'🎉',l:'Celebrating'},{e:'💪',l:'Motivated'}];
  const THEMES:{n:string;v:string;p:string}[] = [
    {n:'Violet',v:'violet',p:'262 83% 58%'},{n:'Blue',v:'blue',p:'221 83% 53%'},
    {n:'Emerald',v:'emerald',p:'160 84% 39%'},{n:'Rose',v:'rose',p:'347 77% 50%'},
    {n:'Amber',v:'amber',p:'38 92% 50%'},{n:'Slate',v:'slate',p:'215 16% 47%'},
  ];
  const GRADS = ['from-violet-500 to-fuchsia-500','from-cyan-500 to-blue-500','from-emerald-500 to-teal-500','from-rose-500 to-pink-500','from-amber-500 to-orange-500','from-indigo-500 to-purple-500','from-lime-500 to-green-500','from-red-500 to-rose-500'];

  const rn = (n:number) => Math.floor(Math.random()*n);
  const h = (hrs:number) => new Date(Date.now()-hrs*36e5);

  function mkUsers():Record<string,UP> {
    const d:[string,string,string,string,string,boolean][] = [
      ['me','You','@you','Building cool things with code ✨','from-violet-500 to-fuchsia-500',true],
      ['alice','Alice Chen','@alicechen','Product designer & pixel perfectionist 🎨','from-cyan-500 to-blue-500',true],
      ['bob','Bob Martinez','@bobcodes','Full-stack dev. Open source advocate 🚀','from-emerald-500 to-teal-500',true],
      ['carol','Carol Kim','@carolwrites','Tech journalist & coffee enthusiast ☕','from-rose-500 to-pink-500',true],
      ['dave','Dave Patel','@davep','AI researcher at DeepMind 🧠','from-amber-500 to-orange-500',true],
      ['emma','Emma Liu','@emmaliu','Startup founder | YC W24','from-indigo-500 to-purple-500',false],
      ['frank','Frank Obi','@frankobi','Music producer & creative coder 🎵','from-lime-500 to-green-500',false],
      ['grace','Grace Park','@gracepark','UX researcher | A11y advocate ♿','from-red-500 to-rose-500',false],
    ];
    const u:Record<string,UP>={};
    d.forEach(([id,name,handle,bio,grad,verified])=>{
      u[id]={id,name,handle,bio,grad,coverGrad:id==='me'?'from-violet-600 via-fuchsia-500 to-pink-500':grad,verified,following:id!=='me',
        stats:{posts:40+rn(200),followers:500+rn(5000),following:100+rn(500),likes:1000+rn(10000)}};
    });
    u.me.stats={posts:142,followers:2847,following:389,likes:8234};
    u.me.following=false;
    return u;
  }

  function mkPosts():Post[] {
    const bp=(id:string,a:string,c:string,hrs:number,tags:string[]):Post=>({
      id,authorId:a,content:c,type:'text',createdAt:h(hrs),
      reactions:{like:rn(50),love:rn(20),fire:rn(15),laugh:rn(10)},
      userReaction:null,comments:[],bookmarked:false,pinned:false,tags,
      views:100+rn(2000),showComments:false,
    });
    return [
      {...bp('p1','alice','Just shipped the new design system! 200+ components, fully accessible, dark mode ready 🎉',2,['design','a11y']),
        pinned:true,comments:[
          {id:'c1',authorId:'bob',content:'This looks incredible! Amazing attention to detail.',createdAt:h(1.5),likes:12,liked:false},
          {id:'c2',authorId:'carol',content:'Writing a feature on this for TechDaily!',createdAt:h(1),likes:5,liked:false},
        ]},
      {...bp('p2','bob','Hot take: TypeScript is just Java with extra steps 🗻',4,['typescript','programming']),
        comments:[{id:'c3',authorId:'dave',content:"As someone who writes both... you're not entirely wrong 😅",createdAt:h(3),likes:24,liked:false}]},
      {...bp('p3','carol','Interview with the founders of that new AI startup just dropped.',6,['ai','startups']),
        type:'media',media:{grad:'from-purple-600 to-indigo-600',title:'The Future of AI is Multimodal',sub:'TechDaily Exclusive'}},
      {...bp('p4','dave',"What's the most important problem in AI right now?",8,['ai','research']),
        type:'poll',poll:{options:[{text:'Alignment & Safety',votes:342},{text:'Reasoning & Planning',votes:256},{text:'Efficiency & Cost',votes:189},{text:'Multimodal Understanding',votes:213}],voted:null,total:1000}},
      bp('p5','emma','Just closed our Series A! $12M to revolutionize dev tools. Hiring across the board 🚀',3,['startups','hiring']),
      {...bp('p6','frank','Made a generative music visualizer using WebGL shaders 🎵✨',10,['creative','webgl']),
        type:'media',media:{grad:'from-emerald-500 to-cyan-500',title:'Sonic Landscapes',sub:'Generative Music Viz'}},
      bp('p7','grace',"A11y isn't a feature, it's a right. Published our research on screen reader compat across 100 web apps.",12,['a11y','research']),
      bp('p8','me','Working on something exciting — a social platform that respects your attention. More soon 👀',1,['building','social']),
      {...bp('p9','alice','Which design tool do you use the most in 2025?',14,['design','tools']),
        type:'poll',poll:{options:[{text:'Figma',votes:523},{text:'Framer',votes:187},{text:'Sketch',votes:45},{text:'Other',votes:92}],voted:null,total:847}},
      bp('p10','bob','Open sourced my terminal emulator in Rust. 3x faster than anything else. Link in bio.',16,['opensource','rust']),
      bp('p11','dave','The gap between AI in the lab and in production is still massive. Better MLOps > bigger models.',20,['ai','mlops']),
      bp('p12','carol','10 underrated dev tools that will change your workflow — thread incoming 🧵',5,['tools','productivity']),
    ];
  }

  function mkNotifs():Notif[] {
    return [
      {id:'n1',type:'like',fromId:'alice',postId:'p8',content:'liked your post',createdAt:h(0.5),read:false},
      {id:'n2',type:'follow',fromId:'emma',content:'started following you',createdAt:h(1),read:false},
      {id:'n3',type:'comment',fromId:'bob',postId:'p8',content:'commented on your post',createdAt:h(2),read:false},
      {id:'n4',type:'mention',fromId:'carol',postId:'p12',content:'mentioned you',createdAt:h(4),read:true},
      {id:'n5',type:'repost',fromId:'dave',postId:'p8',content:'reposted your post',createdAt:h(6),read:true},
      {id:'n6',type:'like',fromId:'frank',postId:'p8',content:'liked your post',createdAt:h(8),read:true},
    ];
  }

  const TRENDING = [{tag:'AI2025',count:12400},{tag:'DesignSystems',count:8200},{tag:'RustLang',count:6800},{tag:'OpenSource',count:5400},{tag:'Accessibility',count:4100},{tag:'WebDev',count:3700},{tag:'StartupLife',count:3200},{tag:'TypeScript',count:2900}];
  const mkChart = () => Array.from({length:30},(_,i)=>({day:i+1,posts:rn(8)+1,likes:rn(40)+5}));

  function init():St {
    return {
      tab:'feed',ff:'foryou',users:mkUsers(),posts:mkPosts(),notifs:mkNotifs(),
      trending:TRENDING,suggested:['emma','frank','grace','dave'],uid:'me',loading:true,
      cc:'',ct:'text',cm:'',cpo:['',''],searchOpen:false,editOpen:false,
      storyOpen:false,storyIdx:0,theme:'violet',dark:true,fontSize:16,
      np:{likes:true,replies:true,follows:true,mentions:true},
      pv:'public',dm:'everyone',online:true,
    };
  }

  function red(s:St,a:Act):St {
    switch(a.type){
      case 'TAB': return {...s,tab:a.v};
      case 'FF': return {...s,ff:a.v};
      case 'LOADING': return {...s,loading:a.v};
      case 'REACT': {
        const posts=s.posts.map(p=>{
          if(p.id!==a.pid)return p;
          const prev=p.userReaction, next=prev===a.r?null:a.r;
          const rx={...p.reactions};
          if(prev)rx[prev]=Math.max(0,rx[prev]-1);
          if(next)rx[next]=rx[next]+1;
          return {...p,reactions:rx,userReaction:next};
        });
        return {...s,posts};
      }
      case 'BM': return {...s,posts:s.posts.map(p=>p.id===a.pid?{...p,bookmarked:!p.bookmarked}:p)};
      case 'TCMT': return {...s,posts:s.posts.map(p=>p.id===a.pid?{...p,showComments:!p.showComments}:p)};
      case 'ACMT': return {...s,posts:s.posts.map(p=>p.id!==a.pid?p:{...p,comments:[...p.comments,{id:`c${Date.now()}`,authorId:'me',content:a.c,createdAt:new Date(),likes:0,liked:false}],showComments:true})};
      case 'LCMT': return {...s,posts:s.posts.map(p=>p.id!==a.pid?p:{...p,comments:p.comments.map(c=>c.id!==a.cid?c:{...c,liked:!c.liked,likes:c.liked?c.likes-1:c.likes+1})})};
      case 'VOTE': return {...s,posts:s.posts.map(p=>{
        if(p.id!==a.pid||!p.poll||p.poll.voted!==null)return p;
        const opts=p.poll.options.map((o,i)=>i===a.i?{...o,votes:o.votes+1}:o);
        return {...p,poll:{...p.poll,options:opts,voted:a.i,total:p.poll.total+1}};
      })};
      case 'POST': {
        if(!s.cc.trim()&&s.ct==='text')return s;
        const np:Post={id:`p${Date.now()}`,authorId:'me',content:s.cc,type:s.ct,createdAt:new Date(),
          reactions:{like:0,love:0,fire:0,laugh:0},userReaction:null,comments:[],bookmarked:false,pinned:false,
          tags:s.cc.match(/#\w+/g)?.map(t=>t.slice(1))||[],views:0,showComments:false,
          ...(s.ct==='poll'?{poll:{options:s.cpo.filter(o=>o.trim()).map(t=>({text:t,votes:0})),voted:null,total:0}}:{}),
          ...(s.ct==='media'?{media:{grad:GRADS[rn(GRADS.length)],title:'New Post',sub:'Shared media'}}:{})};
        return {...s,posts:[np,...s.posts],cc:'',ct:'text',cm:'',cpo:['','']};
      }
      case 'DEL': return {...s,posts:s.posts.filter(p=>p.id!==a.pid)};
      case 'COMP': {
        if(a.f==='cpo')return {...s,cpo:a.v as string[]};
        if(a.f==='ct')return {...s,ct:a.v as PT};
        if(a.f==='cc')return {...s,cc:a.v as string};
        if(a.f==='cm')return {...s,cm:a.v as string};
        return s;
      }
      case 'FOLLOW': return {...s,users:{...s.users,[a.uid]:{...s.users[a.uid],following:!s.users[a.uid].following}}};
      case 'NREAD': return {...s,notifs:s.notifs.map(n=>n.id===a.nid?{...n,read:true}:n)};
      case 'NREADALL': return {...s,notifs:s.notifs.map(n=>({...n,read:true}))};
      case 'SEARCH': return {...s,searchOpen:a.v};
      case 'EDIT': return {...s,editOpen:a.v};
      case 'UPROF': return {...s,users:{...s.users,me:{...s.users.me,...a.u}},editOpen:false};
      case 'STORY': return {...s,storyOpen:a.open,storyIdx:a.i??0};
      case 'THEME': return {...s,theme:a.v};
      case 'DARK': return {...s,dark:a.v};
      case 'FONT': return {...s,fontSize:a.v};
      case 'NP': return {...s,np:{...s.np,[a.k]:a.v}};
      case 'PRIV':
        if(a.k==='pv')return {...s,pv:a.v as string};
        if(a.k==='dm')return {...s,dm:a.v as string};
        if(a.k==='online')return {...s,online:a.v as boolean};
        return s;
      default: return s;
    }
  }

  function Av({u,sz='md',status=false}:{u:UP;sz?:'sm'|'md'|'lg';status?:boolean}) {
    const c=sz==='sm'?'h-8 w-8':sz==='lg'?'h-20 w-20':'h-10 w-10';
    const t=sz==='sm'?'text-xs':sz==='lg'?'text-2xl':'text-sm';
    return <div className="relative">
      <Avatar className={c}><AvatarFallback className={cn('bg-gradient-to-br text-white font-bold',u.grad,t)}>{u.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback></Avatar>
      {status&&<span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background animate-pulse"/>}
    </div>;
  }

  function PC({post:p,users:u,d}:{post:Post;users:Record<string,UP>;d:React.Dispatch<Act>}) {
    const a=u[p.authorId];
    const [rc,setRc]=useState('');
    const tr=Object.values(p.reactions).reduce((a,b)=>a+b,0);

    const react=(r:RT)=>{
      d({type:'REACT',pid:p.id,r});
      if(r==='love'||r==='fire')confetti({particleCount:30,spread:60,origin:{y:0.7},colors:r==='love'?['#ff6b6b','#ee5a9d']:['#ff6b35','#ffa726']});
    };
    const addCmt=()=>{if(!rc.trim())return;d({type:'ACMT',pid:p.id,c:rc});setRc('');};
    const ht=(t:string)=>t.split(/(#\w+)/g).map((s,i)=>s.startsWith('#')?<span key={i} className="text-primary cursor-pointer hover:underline">{s}</span>:s);

    return <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} transition={{type:'spring',stiffness:300,damping:30}}>
      <Card className="bg-card/40 backdrop-blur-md border-border/30 hover:shadow-md hover:border-border/50 transition-all duration-300">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              <HoverCard><HoverCardTrigger asChild><button><Av u={a}/></button></HoverCardTrigger>
                <HoverCardContent className="w-72"><div className="flex gap-3"><Av u={a}/>
                  <div><div className="flex items-center gap-1"><span className="font-semibold text-sm">{a.name}</span>{a.verified&&<Check className="h-3 w-3 text-primary"/>}</div>
                  <p className="text-xs text-muted-foreground">{a.handle}</p><p className="text-xs mt-1">{a.bio}</p>
                  <div className="flex gap-3 mt-2 text-xs text-muted-foreground"><span><strong className="text-foreground">{a.stats.followers.toLocaleString()}</strong> followers</span></div></div></div>
                </HoverCardContent></HoverCard>
              <div><div className="flex items-center gap-1"><span className="font-semibold text-sm">{a.name}</span>{a.verified&&<Check className="h-3 w-3 text-primary"/>}
                {p.pinned&&<Badge variant="secondary" className="text-[10px] h-4 px-1 ml-1">Pinned</Badge>}</div>
                <p className="text-xs text-muted-foreground">{a.handle} · {formatDistanceToNow(p.createdAt,{addSuffix:true})}</p></div>
            </div>
            <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4"/></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={()=>d({type:'BM',pid:p.id})}><Bookmark className="h-4 w-4 mr-2"/>{p.bookmarked?'Remove Bookmark':'Bookmark'}</DropdownMenuItem>
                {p.authorId!=='me'&&<DropdownMenuItem onClick={()=>d({type:'FOLLOW',uid:p.authorId})}><Users className="h-4 w-4 mr-2"/>{u[p.authorId].following?'Unfollow':'Follow'}</DropdownMenuItem>}
                {p.authorId==='me'&&<DropdownMenuItem className="text-destructive" onClick={()=>d({type:'DEL',pid:p.id})}><Trash2 className="h-4 w-4 mr-2"/>Delete</DropdownMenuItem>}
              </DropdownMenuContent></DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          {p.type==='text'&&<p className="text-sm leading-relaxed whitespace-pre-wrap">{ht(p.content)}</p>}
          {p.type==='media'&&p.media&&<>{p.content&&<p className="text-sm mb-3">{ht(p.content)}</p>}<div className={cn('rounded-xl p-6 bg-gradient-to-br text-white',p.media.grad)}><h3 className="font-bold text-lg">{p.media.title}</h3><p className="text-sm opacity-80 mt-1">{p.media.sub}</p></div></>}
          {p.type==='poll'&&p.poll&&<><p className="text-sm font-medium mb-3">{p.content}</p>
            <div className="space-y-2">{p.poll.options.map((o,i)=>{
              const pct=p.poll!.total>0?Math.round(o.votes/p.poll!.total*100):0;
              const v=p.poll!.voted!==null, sel=p.poll!.voted===i;
              return <button key={i} disabled={v} onClick={()=>d({type:'VOTE',pid:p.id,i})} className={cn('w-full text-left rounded-lg border p-3 relative overflow-hidden transition-all',v?'cursor-default':'cursor-pointer hover:border-primary',sel&&'border-primary')}>
                {v&&<motion.div initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:0.8}} className={cn('absolute inset-y-0 left-0 rounded-lg',sel?'bg-primary/20':'bg-muted/50')}/>}
                <div className="relative flex justify-between"><span className="text-sm">{o.text}</span>{v&&<span className="text-sm font-medium">{pct}%</span>}</div>
              </button>;
            })}<p className="text-xs text-muted-foreground">{p.poll.total.toLocaleString()} votes</p></div></>}
          {tr>0&&<div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">{RXS.filter(r=>p.reactions[r.type]>0).map(r=><span key={r.type}>{r.emoji}</span>)}<span className="ml-1">{tr}</span></div>}
        </CardContent>
        <Separator className="opacity-30"/>
        <CardFooter className="pt-2 pb-2 flex justify-between">
          <Popover><PopoverTrigger asChild><Button variant="ghost" size="sm" className={cn('gap-1',p.userReaction&&'text-primary')}>
            {p.userReaction?RXS.find(r=>r.type===p.userReaction)?.emoji:<Heart className="h-4 w-4"/>}<span className="text-xs">{tr||''}</span>
          </Button></PopoverTrigger><PopoverContent className="w-auto p-2" side="top"><div className="flex gap-1">
            {RXS.map(r=><motion.button key={r.type} whileHover={{scale:1.3,y:-4}} className={cn('text-xl p-1.5 rounded-lg hover:bg-muted',p.userReaction===r.type&&'bg-primary/20')} onClick={()=>react(r.type)}>{r.emoji}</motion.button>)}
          </div></PopoverContent></Popover>
          <Button variant="ghost" size="sm" className="gap-1" onClick={()=>d({type:'TCMT',pid:p.id})}><MessageCircle className="h-4 w-4"/><span className="text-xs">{p.comments.length||''}</span></Button>
          <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm"><Share2 className="h-4 w-4"/></Button></DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={()=>{navigator.clipboard?.writeText(`https://social.app/p/${p.id}`);toast.success('Link copied!');}}><Copy className="h-4 w-4 mr-2"/>Copy Link</DropdownMenuItem>
              <DropdownMenuItem onClick={()=>toast.success('Reposted!')}><Repeat2 className="h-4 w-4 mr-2"/>Repost</DropdownMenuItem>
              <DropdownMenuItem onClick={()=>toast.success('Sent!')}><Send className="h-4 w-4 mr-2"/>Send DM</DropdownMenuItem>
            </DropdownMenuContent></DropdownMenu>
          <Button variant="ghost" size="sm" onClick={()=>d({type:'BM',pid:p.id})}><Bookmark className={cn('h-4 w-4',p.bookmarked&&'fill-primary text-primary')}/></Button>
        </CardFooter>
        <Collapsible open={p.showComments}><CollapsibleContent><div className="px-4 pb-3 space-y-3"><Separator className="opacity-30"/>
          {p.comments.map(c=>{const ca=u[c.authorId];return <div key={c.id} className="flex gap-2"><Av u={ca} sz="sm"/>
            <div className="flex-1 min-w-0"><div className="bg-muted/50 rounded-xl px-3 py-2"><span className="text-xs font-medium">{ca.name}</span><p className="text-sm">{c.content}</p></div>
            <div className="flex gap-3 mt-1 text-xs text-muted-foreground"><span>{formatDistanceToNow(c.createdAt,{addSuffix:true})}</span>
              <button className={cn('hover:text-foreground',c.liked&&'text-primary font-medium')} onClick={()=>d({type:'LCMT',pid:p.id,cid:c.id})}>{c.likes>0?`${c.likes} likes`:'Like'}</button></div></div></div>;})}
          <div className="flex gap-2"><Av u={u.me} sz="sm"/><div className="flex-1 flex gap-2">
            <Input placeholder="Write a reply..." value={rc} onChange={e=>setRc(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addCmt()} className="h-8 text-sm bg-muted/30"/>
            <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={addCmt} disabled={!rc.trim()}><Send className="h-3 w-3"/></Button></div></div>
        </div></CollapsibleContent></Collapsible>
      </Card>
    </motion.div>;
  }

  export default function App() {
    const [s,d]=useReducer(red,undefined,init);
    const chart=useMemo(()=>mkChart(),[]);
    const unread=s.notifs.filter(n=>!n.read).length;
    const me=s.users.me;
    const storyUsers=useMemo(()=>Object.values(s.users).filter(u=>u.id!=='me'),[s.users]);
    const tc=THEMES.find(t=>t.v===s.theme)||THEMES[0];

    useEffect(()=>{const t=setTimeout(()=>d({type:'LOADING',v:false}),800);return ()=>clearTimeout(t);},[]);
    useEffect(()=>{const h=(e:KeyboardEvent)=>{if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();d({type:'SEARCH',v:true});}};window.addEventListener('keydown',h);return ()=>window.removeEventListener('keydown',h);},[]);

    const tv={'--primary':tc.p,'--ring':tc.p,fontSize:`${s.fontSize}px`} as React.CSSProperties;

    if(s.loading) return <div className="min-h-screen bg-background text-foreground p-4 max-w-2xl mx-auto space-y-4" style={tv}>
      <Toaster position="top-center" richColors/>
      <div className="flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-full"/><div className="space-y-2 flex-1"><Skeleton className="h-4 w-32"/><Skeleton className="h-3 w-24"/></div></div>
      <div className="flex gap-3 overflow-hidden">{Array.from({length:5}).map((_,i)=><Skeleton key={i} className="h-16 w-16 rounded-full shrink-0"/>)}</div>
      {Array.from({length:3}).map((_,i)=><Card key={i} className="bg-card/40 border-border/30"><CardContent className="pt-4 space-y-3">
        <div className="flex gap-3"><Skeleton className="h-10 w-10 rounded-full"/><div className="space-y-2 flex-1"><Skeleton className="h-4 w-40"/><Skeleton className="h-3 w-24"/></div></div>
        <Skeleton className="h-16 w-full"/></CardContent></Card>)}
    </div>;

    return <TooltipProvider><div className={cn('min-h-screen bg-background text-foreground',s.dark&&'dark')} style={tv}>
      <Toaster position="top-center" richColors/>
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">SocialCanvas</h1>
          <div className="flex items-center gap-2">
            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={()=>d({type:'SEARCH',v:true})}><Search className="h-5 w-5"/></Button></TooltipTrigger><TooltipContent>Search (⌘K)</TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="relative" onClick={()=>d({type:'TAB',v:'notifications'})}><Bell className="h-5 w-5"/>
              {unread>0&&<span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"/>}</Button></TooltipTrigger><TooltipContent>Notifications</TooltipContent></Tooltip>
            <button onClick={()=>d({type:'TAB',v:'profile'})}><Av u={me} sz="sm"/></button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 px-4 py-4">
        <main>
          <div className="hidden sm:flex items-center gap-1 mb-4">
            {([['feed',Home,'Feed'],['profile',User,'Profile'],['notifications',Bell,'Notifications'],['settings',Settings,'Settings']] as const).map(([t,I,l])=>
              <Button key={t} variant={s.tab===t?'default':'ghost'} size="sm" className="gap-1.5" onClick={()=>d({type:'TAB',v:t as NavT})}>
                <I className="h-4 w-4"/>{l}{t==='notifications'&&unread>0&&<Badge variant="destructive" className="h-4 min-w-4 text-[10px] px-1">{unread}</Badge>}
              </Button>)}
          </div>

          <AnimatePresence mode="wait">
            {s.tab==='feed'&&<motion.div key="feed" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}>
              <ScrollArea className="mb-4"><div className="flex gap-3 pb-2">
                <button className="flex flex-col items-center gap-1 shrink-0" onClick={()=>toast('Stories coming soon!')}>
                  <div className="h-14 w-14 rounded-full border-2 border-dashed border-muted-foreground/40 flex items-center justify-center"><Plus className="h-5 w-5 text-muted-foreground"/></div>
                  <span className="text-[10px] text-muted-foreground">Add Story</span></button>
                {storyUsers.map((u,i)=><button key={u.id} className="flex flex-col items-center gap-1 shrink-0" onClick={()=>d({type:'STORY',open:true,i})}>
                  <div className={cn('h-14 w-14 rounded-full p-0.5 bg-gradient-to-br',u.grad)}><div className="h-full w-full rounded-full bg-background flex items-center justify-center">
                    <Avatar className="h-11 w-11"><AvatarFallback className={cn('bg-gradient-to-br text-white text-xs font-bold',u.grad)}>{u.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback></Avatar>
                  </div></div><span className="text-[10px] text-muted-foreground truncate w-14 text-center">{u.name.split(' ')[0]}</span></button>)}
              </div></ScrollArea>

              <Tabs value={s.ff} onValueChange={v=>d({type:'FF',v:v as FF})} className="mb-4">
                <TabsList className="w-full bg-muted/30"><TabsTrigger value="foryou" className="flex-1">For You</TabsTrigger><TabsTrigger value="following" className="flex-1">Following</TabsTrigger><TabsTrigger value="trending" className="flex-1">Trending</TabsTrigger></TabsList>
              </Tabs>
              {s.ff==='trending'&&<div className="flex flex-wrap gap-2 mb-4">{s.trending.slice(0,5).map(t=><Badge key={t.tag} variant="secondary" className="cursor-pointer hover:bg-primary/20">#{t.tag}</Badge>)}</div>}

              <Card className="bg-card/40 backdrop-blur-md border-border/30 mb-4"><CardContent className="pt-4"><div className="flex gap-3"><Av u={me}/>
                <div className="flex-1 space-y-3">
                  <Textarea placeholder="What's on your mind?" value={s.cc} onChange={e=>d({type:'COMP',f:'cc',v:e.target.value})} className="min-h-[80px] bg-transparent border-none resize-none focus-visible:ring-0 p-0 text-sm" maxLength={500}/>
                  {s.cc.length>0&&<div className="flex items-center gap-2"><Progress value={s.cc.length/500*100} className="h-1 flex-1"/><span className={cn('text-xs',s.cc.length>450?'text-destructive':'text-muted-foreground')}>{500-s.cc.length}</span></div>}
                  {s.cm&&<Badge variant="secondary" className="gap-1">{MOODS.find(m=>m.l===s.cm)?.e} {s.cm}<button onClick={()=>d({type:'COMP',f:'cm',v:''})}><X className="h-3 w-3"/></button></Badge>}
                  {s.ct==='poll'&&<div className="space-y-2">{s.cpo.map((o,i)=><Input key={i} placeholder={`Option ${i+1}`} value={o} onChange={e=>{const opts=[...s.cpo];opts[i]=e.target.value;d({type:'COMP',f:'cpo',v:opts});}} className="h-8 text-sm bg-muted/30"/>)}
                    {s.cpo.length<4&&<Button variant="ghost" size="sm" onClick={()=>d({type:'COMP',f:'cpo',v:[...s.cpo,'']})}><Plus className="h-3 w-3 mr-1"/>Add Option</Button>}</div>}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <ToggleGroup type="single" value={s.ct} onValueChange={v=>v&&d({type:'COMP',f:'ct',v})}>
                        <ToggleGroupItem value="text" size="sm"><Sparkles className="h-4 w-4"/></ToggleGroupItem>
                        <ToggleGroupItem value="media" size="sm"><Image className="h-4 w-4"/></ToggleGroupItem>
                        <ToggleGroupItem value="poll" size="sm"><BarChart3 className="h-4 w-4"/></ToggleGroupItem>
                      </ToggleGroup>
                      <Separator orientation="vertical" className="h-5 mx-1"/>
                      <Popover><PopoverTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><Smile className="h-4 w-4"/></Button></PopoverTrigger>
                        <PopoverContent className="w-56 p-2"><div className="grid grid-cols-6 gap-1">{EMOJIS.map(e=><button key={e} className="text-lg p-1 rounded hover:bg-muted" onClick={()=>d({type:'COMP',f:'cc',v:s.cc+e})}>{e}</button>)}</div></PopoverContent></Popover>
                      <Popover><PopoverTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><Zap className="h-4 w-4"/></Button></PopoverTrigger>
                        <PopoverContent className="w-48 p-2"><p className="text-xs font-medium mb-2 text-muted-foreground">Set Mood</p><div className="grid grid-cols-3 gap-1">{MOODS.map(m=><button key={m.l} className={cn('flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-muted text-xs',s.cm===m.l&&'bg-primary/20')} onClick={()=>d({type:'COMP',f:'cm',v:m.l})}>{m.e}<span>{m.l}</span></button>)}</div></PopoverContent></Popover>
                    </div>
                    <Button size="sm" className="bg-gradient-to-r from-primary to-purple-500 text-white" disabled={!s.cc.trim()&&s.ct==='text'}
                      onClick={()=>{d({type:'POST'});confetti({particleCount:40,spread:70,origin:{y:0.6}});toast.success('Post published! 🎉');}}><Send className="h-4 w-4 mr-1"/>Post</Button>
                  </div>
                </div>
              </div></CardContent></Card>

              <div className="space-y-4">{s.posts.filter(p=>{
                if(s.ff==='following')return s.users[p.authorId]?.following||p.authorId==='me';
                if(s.ff==='trending')return p.reactions.like+p.reactions.love+p.reactions.fire>20;
                return true;
              }).map(p=><PC key={p.id} post={p} users={s.users} d={d}/>)}</div>
            </motion.div>}

            {s.tab==='profile'&&<motion.div key="profile" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} className="space-y-4">
              <Card className="bg-card/40 backdrop-blur-md border-border/30 overflow-hidden">
                <div className={cn('h-32 bg-gradient-to-r',me.coverGrad)}/>
                <CardContent className="pt-0 -mt-10"><div className="flex items-end justify-between"><Av u={me} sz="lg" status={s.online}/>
                  <Button variant="outline" size="sm" onClick={()=>d({type:'EDIT',v:true})}>Edit Profile</Button></div>
                  <div className="mt-3"><div className="flex items-center gap-1"><h2 className="text-xl font-bold">{me.name}</h2>{me.verified&&<Check className="h-4 w-4 text-primary"/>}</div>
                  <p className="text-sm text-muted-foreground">{me.handle}</p><p className="text-sm mt-2">{me.bio}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3"/>San Francisco</span>
                    <span className="flex items-center gap-1"><Link2 className="h-3 w-3"/>you.dev</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3"/>Joined Jan 2023</span></div></div>
                  <div className="grid grid-cols-4 gap-4 mt-4">{Object.entries(me.stats).map(([k,v])=><div key={k} className="text-center"><p className="text-lg font-bold">{v.toLocaleString()}</p><p className="text-xs text-muted-foreground capitalize">{k}</p></div>)}</div>
                </CardContent></Card>
              <Card className="bg-card/40 backdrop-blur-md border-border/30"><CardHeader className="pb-2"><CardTitle className="text-sm">Activity (30 days)</CardTitle></CardHeader>
                <CardContent><ResponsiveContainer width="100%" height={160}><AreaChart data={chart}>
                  <defs><linearGradient id="cL" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/></linearGradient></defs>
                  <XAxis dataKey="day" tick={false} axisLine={false}/><YAxis hide/><RTooltip contentStyle={{background:'hsl(var(--card))',border:'1px solid hsl(var(--border))',borderRadius:'8px',fontSize:'12px'}}/>
                  <Area type="monotone" dataKey="likes" stroke="hsl(var(--primary))" fill="url(#cL)" strokeWidth={2}/><Area type="monotone" dataKey="posts" stroke="hsl(var(--muted-foreground))" fill="transparent" strokeWidth={1} strokeDasharray="4 4"/>
                </AreaChart></ResponsiveContainer></CardContent></Card>
              <Tabs defaultValue="posts"><TabsList className="w-full bg-muted/30"><TabsTrigger value="posts" className="flex-1">Posts</TabsTrigger><TabsTrigger value="replies" className="flex-1">Replies</TabsTrigger><TabsTrigger value="likes" className="flex-1">Likes</TabsTrigger><TabsTrigger value="media" className="flex-1">Media</TabsTrigger></TabsList>
                <TabsContent value="posts" className="space-y-4 mt-4">{s.posts.filter(p=>p.authorId==='me').map(p=><PC key={p.id} post={p} users={s.users} d={d}/>)}
                  {s.posts.filter(p=>p.authorId==='me').length===0&&<p className="text-center text-muted-foreground text-sm py-8">No posts yet</p>}</TabsContent>
                <TabsContent value="replies"><p className="text-center text-muted-foreground text-sm py-8">No replies yet</p></TabsContent>
                <TabsContent value="likes"><p className="text-center text-muted-foreground text-sm py-8">Posts you like will appear here</p></TabsContent>
                <TabsContent value="media"><p className="text-center text-muted-foreground text-sm py-8">No media posts yet</p></TabsContent>
              </Tabs>
            </motion.div>}

            {s.tab==='notifications'&&<motion.div key="notifs" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} className="space-y-3">
              <div className="flex items-center justify-between"><h2 className="text-lg font-bold">Notifications</h2>
                {unread>0&&<Button variant="ghost" size="sm" onClick={()=>d({type:'NREADALL'})}>Mark all read</Button>}</div>
              {s.notifs.map(n=>{const fu=s.users[n.fromId];const icons:Record<string,typeof Heart>={like:Heart,follow:Users,comment:MessageCircle,mention:AtSign,repost:Repeat2};const I=icons[n.type]||Bell;
                return <motion.div key={n.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} className={cn('flex items-start gap-3 p-3 rounded-xl transition-colors cursor-pointer',n.read?'bg-transparent hover:bg-muted/30':'bg-primary/5 hover:bg-primary/10')} onClick={()=>d({type:'NREAD',nid:n.id})}>
                  <div className="relative"><Av u={fu} sz="sm"/><div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-background flex items-center justify-center"><I className="h-3 w-3 text-primary"/></div></div>
                  <div className="flex-1 min-w-0"><p className="text-sm"><strong>{fu.name}</strong> {n.content}</p><p className="text-xs text-muted-foreground mt-0.5">{formatDistanceToNow(n.createdAt,{addSuffix:true})}</p></div>
                  {!n.read&&<span className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0"/>}</motion.div>;})}
            </motion.div>}

            {s.tab==='settings'&&<motion.div key="settings" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}>
              <h2 className="text-lg font-bold mb-4">Settings</h2>
              <Accordion type="multiple" defaultValue={['appearance','notifs','privacy']} className="space-y-2">
                <AccordionItem value="appearance" className="bg-card/40 backdrop-blur-md border border-border/30 rounded-xl px-4">
                  <AccordionTrigger className="text-sm font-medium">Appearance</AccordionTrigger><AccordionContent className="space-y-4 pb-4">
                    <div className="flex items-center justify-between"><Label className="text-sm">Dark Mode</Label><Switch checked={s.dark} onCheckedChange={v=>d({type:'DARK',v})}/></div>
                    <div><Label className="text-sm mb-2 block">Theme Color</Label><div className="flex gap-2">{THEMES.map(t=><button key={t.v} onClick={()=>d({type:'THEME',v:t.v})} className={cn('h-8 w-8 rounded-full transition-all',s.theme===t.v&&'ring-2 ring-offset-2 ring-offset-background')} style={{background:`hsl(${t.p})`}} title={t.n}/>)}</div></div>
                    <div><Label className="text-sm mb-2 block">Font Size ({s.fontSize}px)</Label><Slider value={[s.fontSize]} min={12} max={20} step={1} onValueChange={([v])=>d({type:'FONT',v})}/></div>
                  </AccordionContent></AccordionItem>
                <AccordionItem value="notifs" className="bg-card/40 backdrop-blur-md border border-border/30 rounded-xl px-4">
                  <AccordionTrigger className="text-sm font-medium">Notifications</AccordionTrigger><AccordionContent className="space-y-3 pb-4">
                    {Object.entries(s.np).map(([k,v])=><div key={k} className="flex items-center justify-between"><Label className="text-sm capitalize">{k}</Label><Switch checked={v} onCheckedChange={val=>d({type:'NP',k,v:val})}/></div>)}
                  </AccordionContent></AccordionItem>
                <AccordionItem value="privacy" className="bg-card/40 backdrop-blur-md border border-border/30 rounded-xl px-4">
                  <AccordionTrigger className="text-sm font-medium">Privacy & Safety</AccordionTrigger><AccordionContent className="space-y-4 pb-4">
                    <div><Label className="text-sm mb-2 block">Profile Visibility</Label><RadioGroup value={s.pv} onValueChange={v=>d({type:'PRIV',k:'pv',v})}>
                      <div className="flex items-center gap-2"><RadioGroupItem value="public" id="pub"/><Label htmlFor="pub" className="text-sm"><Globe className="h-3 w-3 inline mr-1"/>Public</Label></div>
                      <div className="flex items-center gap-2"><RadioGroupItem value="private" id="priv"/><Label htmlFor="priv" className="text-sm"><Lock className="h-3 w-3 inline mr-1"/>Private</Label></div>
                    </RadioGroup></div>
                    <div><Label className="text-sm mb-2 block">Direct Messages</Label><Select value={s.dm} onValueChange={v=>d({type:'PRIV',k:'dm',v})}><SelectTrigger className="w-full"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="everyone">Everyone</SelectItem><SelectItem value="followers">Followers Only</SelectItem><SelectItem value="nobody">Nobody</SelectItem></SelectContent></Select></div>
                    <div className="flex items-center justify-between"><Label className="text-sm">Show Online Status</Label><Switch checked={s.online} onCheckedChange={v=>d({type:'PRIV',k:'online',v})}/></div>
                    <Separator/>
                    <div className="space-y-2"><p className="text-sm font-medium text-destructive">Danger Zone</p>
                      <AlertDialog><AlertDialogTrigger asChild><Button variant="destructive" size="sm" className="w-full"><AlertTriangle className="h-4 w-4 mr-1"/>Delete Account</Button></AlertDialogTrigger>
                        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Account?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. All your data will be permanently deleted.</AlertDialogDescription></AlertDialogHeader>
                          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={()=>toast.error('Account deletion disabled in demo mode')}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div>
                  </AccordionContent></AccordionItem>
              </Accordion>
              <Button className="w-full mt-4" onClick={()=>toast.success('Settings saved!')}>Save Settings</Button>
            </motion.div>}
          </AnimatePresence>
        </main>

        <aside className="hidden lg:block space-y-4">
          <Card className="bg-card/40 backdrop-blur-md border-border/30"><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-1"><TrendingUp className="h-4 w-4"/>Trending Now</CardTitle></CardHeader>
            <CardContent className="space-y-3">{s.trending.map(t=><div key={t.tag} className="flex items-center justify-between group cursor-pointer">
              <div><p className="text-sm font-medium group-hover:text-primary transition-colors">#{t.tag}</p><p className="text-xs text-muted-foreground">{(t.count/1000).toFixed(1)}K posts</p></div><Hash className="h-4 w-4 text-muted-foreground"/></div>)}</CardContent></Card>
          <Card className="bg-card/40 backdrop-blur-md border-border/30"><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-1"><Users className="h-4 w-4"/>Who to Follow</CardTitle></CardHeader>
            <CardContent className="space-y-3">{s.suggested.map(uid=>{const u=s.users[uid];if(!u)return null;return <div key={uid} className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0"><Av u={u} sz="sm"/><div className="min-w-0"><p className="text-sm font-medium truncate">{u.name}</p><p className="text-xs text-muted-foreground truncate">{u.handle}</p></div></div>
              <Button variant={u.following?'secondary':'default'} size="sm" className="shrink-0 h-7 text-xs" onClick={()=>d({type:'FOLLOW',uid})}>{u.following?'Following':'Follow'}</Button></div>;})}</CardContent></Card>
        </aside>
      </div>

      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border/30 z-50"><div className="flex items-center justify-around h-14">
        {([['feed',Home],['profile',User],['notifications',Bell],['settings',Settings]] as const).map(([t,I])=>
          <button key={t} className={cn('flex flex-col items-center gap-0.5 p-2',s.tab===t?'text-primary':'text-muted-foreground')} onClick={()=>d({type:'TAB',v:t as NavT})}>
            <div className="relative"><I className="h-5 w-5"/>{t==='notifications'&&unread>0&&<span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"/>}</div>
            <span className="text-[10px] capitalize">{t}</span></button>)}
      </div></nav>

      {s.tab==='feed'&&<motion.button initial={{scale:0}} animate={{scale:1}} className="sm:hidden fixed bottom-20 right-4 z-50 h-14 w-14 rounded-full bg-gradient-to-r from-primary to-purple-500 text-white shadow-lg flex items-center justify-center"
        onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}><Plus className="h-6 w-6"/></motion.button>}

      <CommandDialog open={s.searchOpen} onOpenChange={o=>d({type:'SEARCH',v:o})}><CommandInput placeholder="Search users, posts, topics..."/><CommandList><CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Users">{Object.values(s.users).filter(u=>u.id!=='me').map(u=><CommandItem key={u.id} onSelect={()=>{d({type:'SEARCH',v:false});d({type:'TAB',v:'profile'});}}>
          <div className="flex items-center gap-2"><Av u={u} sz="sm"/><div><p className="text-sm font-medium">{u.name}</p><p className="text-xs text-muted-foreground">{u.handle}</p></div></div></CommandItem>)}</CommandGroup>
        <CommandGroup heading="Trending">{s.trending.map(t=><CommandItem key={t.tag}><Hash className="h-4 w-4 mr-2"/>#{t.tag}<span className="ml-auto text-xs text-muted-foreground">{(t.count/1000).toFixed(1)}K</span></CommandItem>)}</CommandGroup>
        <CommandGroup heading="Posts">{s.posts.slice(0,5).map(p=><CommandItem key={p.id} onSelect={()=>d({type:'SEARCH',v:false})}><MessageCircle className="h-4 w-4 mr-2 shrink-0"/><span className="truncate">{p.content.slice(0,60)}{p.content.length>60?'...':''}</span></CommandItem>)}</CommandGroup>
      </CommandList></CommandDialog>

      <Dialog open={s.storyOpen} onOpenChange={o=>d({type:'STORY',open:o})}><DialogContent className="max-w-sm p-0 overflow-hidden bg-black">
        {storyUsers[s.storyIdx]&&(()=>{const su=storyUsers[s.storyIdx];return <div className={cn('h-[500px] bg-gradient-to-b flex flex-col justify-between p-4',su.grad)}>
          <div><div className="flex gap-1 mb-3">{storyUsers.map((_,i)=><div key={i} className={cn('h-0.5 flex-1 rounded-full',i<=s.storyIdx?'bg-white':'bg-white/30')}/>)}</div>
            <div className="flex items-center gap-2"><Avatar className="h-8 w-8"><AvatarFallback className="bg-white/20 text-white text-xs">{su.name.split(' ').map(n=>n[0]).join('')}</AvatarFallback></Avatar>
              <span className="text-white text-sm font-medium">{su.name}</span><span className="text-white/60 text-xs">2h ago</span></div></div>
          <div className="text-white text-center"><p className="text-lg font-medium mb-4">{su.bio}</p>
            <div className="flex justify-center gap-3">{s.storyIdx>0&&<Button variant="ghost" size="sm" className="text-white" onClick={()=>d({type:'STORY',open:true,i:s.storyIdx-1})}>Previous</Button>}
              {s.storyIdx<storyUsers.length-1&&<Button variant="ghost" size="sm" className="text-white" onClick={()=>d({type:'STORY',open:true,i:s.storyIdx+1})}>Next</Button>}</div></div>
        </div>;})()}</DialogContent></Dialog>

      <Dialog open={s.editOpen} onOpenChange={o=>d({type:'EDIT',v:o})}><DialogContent className="max-w-md"><DialogHeader><DialogTitle>Edit Profile</DialogTitle></DialogHeader>
        <EPF u={me} d={d}/></DialogContent></Dialog>

      <div className="sm:hidden h-16"/>
    </div></TooltipProvider>;
  }

  function EPF({u,d}:{u:UP;d:React.Dispatch<Act>}) {
    const [name,sn]=useState(u.name);
    const [handle,sh]=useState(u.handle);
    const [bio,sb]=useState(u.bio);
    const [loc,sl]=useState('San Francisco');
    const [web,sw]=useState('you.dev');
    return <div className="space-y-4">
      <div className={cn('h-20 rounded-lg bg-gradient-to-r relative',u.coverGrad)}><button className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg opacity-0 hover:opacity-100 transition-opacity"><Camera className="h-5 w-5 text-white"/></button></div>
      <div className="space-y-3">
        <div><Label className="text-xs">Name</Label><Input value={name} onChange={e=>sn(e.target.value)} className="h-8 text-sm"/></div>
        <div><Label className="text-xs">Handle</Label><Input value={handle} onChange={e=>sh(e.target.value)} className="h-8 text-sm"/></div>
        <div><div className="flex items-center justify-between"><Label className="text-xs">Bio</Label><span className="text-xs text-muted-foreground">{bio.length}/160</span></div>
          <Textarea value={bio} onChange={e=>sb(e.target.value.slice(0,160))} className="text-sm min-h-[60px]" maxLength={160}/><Progress value={bio.length/160*100} className="h-1 mt-1"/></div>
        <div><Label className="text-xs">Location</Label><Input value={loc} onChange={e=>sl(e.target.value)} className="h-8 text-sm"/></div>
        <div><Label className="text-xs">Website</Label><Input value={web} onChange={e=>sw(e.target.value)} className="h-8 text-sm"/></div>
      </div>
      <DialogFooter><Button variant="outline" size="sm" onClick={()=>d({type:'EDIT',v:false})}>Cancel</Button>
        <Button size="sm" onClick={()=>{d({type:'UPROF',u:{name,handle,bio}});toast.success('Profile updated!');}}>Save Changes</Button></DialogFooter>
    </div>;
  }
