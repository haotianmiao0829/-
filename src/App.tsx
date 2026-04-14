import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  ChevronRight, 
  Play, 
  BookOpen, 
  Code, 
  Mic,
  User,
  Home as HomeIcon,
  Search,
  X
} from "lucide-react";

const WechatIcon = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.007-.264-.032-.406-.032zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
  </svg>
);

// --- Types ---

type Page = 'home' | 'about' | 'projects' | 'articles' | 'podcasts' | 'article-detail';

interface Project {
  id: string;
  title: string;
  tags: string[];
  link: string;
  year: string;
}

interface Article {
  id: string;
  title: string;
  date: string;
  readTime: string;
  excerpt: string;
  category: string;
  content?: string;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
}

interface Podcast {
  id: string;
  title: string;
  duration: string;
  date: string;
  description: string;
  link?: string;
  audioSrc?: string;
}

// --- Mock Data ---

const PROJECTS: Project[] = [
  {
    id: '4',
    title: 'AI产品集',
    tags: ['AI', 'Machine Learning', 'UX Design'],
    link: '#',
    year: '2025'
  },
  {
    id: '1',
    title: '交互设计',
    tags: ['React', 'Three.js', 'WebSockets'],
    link: '#',
    year: '2024'
  },
  {
    id: '2',
    title: '视频集',
    tags: ['Rust', 'Solidity', 'Wasm'],
    link: '#',
    year: '2023'
  },
  {
    id: '3',
    title: '摄影集',
    tags: ['Design', 'Swift', 'Metal'],
    link: '#',
    year: '2023'
  }
];

const ARTICLES: Article[] = [
  {
    id: '1',
    title: '致2024年-19岁的自己',
    date: '2025年10月',
    readTime: '20 分钟',
    excerpt: '嗨，19岁你好，我是20岁的你，如今我坐着K7707趟列车从北京始向石家庄...',
    category: '成长',
    content: `嗨，19岁
你好
我是20岁的你，如今我坐着K7707趟列车从北京始向石家庄
2024年你说你想去北京实习，可受制于自己的能力的原因，你未曾去往北京，而如今，我已有了两段实习，或许并不是大厂，但在北京这座城市我可以做到自己的温饱
2024年的你说你想买一个相机，赚够一万块钱，而如今相机有了，钱也赚够了（等10号发工资哈哈）但是赚是赚到了，可是没有办法存够一万块钱，因为要吃饭、租房、买运动相机、去旅游还要自己留够可以生活的生活费，大概算了一下，来北京家里转了3000块钱，青旅住了三天，租房加中介费加押金2500，是的第一个月你用了500块钱吃饭，你很厉害，但是要对自己好一点，第一个月发工资3000，你交了1500的房租，还剩下1500，第二个月你发了4000多，恰好在此时你投中了一家乙方设计公司，工资给的还蛮高的，所以你下定决心再干一个月，你第一次提下离职，又去说服学院导员、老师，在这里我非常感谢学校的老师，谢谢你们，那回到话题，你入职设计公司，每天面对电脑，让你很头痛，你看电脑看一两个小时你的眼睛就聚不了焦了，你第一次跟甲方进行会议沟通，第一次沟通需求，第一次被甲方说你做的是什么东西，这些都没有打倒你，反而让你更强大，在九月份这个月里，你不用再算今天花多少明天花多少钱，不用算多花一块钱你就要饿一顿饭，你吃了贵的饭，约了朋友出去玩，但也发现贵的饭也不那么好吃哈哈，在这三个月里，你成长了很多，知道了钱难挣，知道了之后的路要怎么走，见识了更多的世界，见了北京的繁华，让你一个小镇做题家开了眼界…你也逐渐的从小镇做题家往职场思维递进，你去了天安门，去了什刹海，去了国贸，去了三里屯，去了北海公园等，坐过早八的地铁，挤过五号线，坐过晚上九十点的国贸站，第一次加班，第一次被单拉出来开小灶，第一次自己去医院，第一次租房，第一次挤地铁，第一次淋雨，第一次尝试吃不同的食物，第一次吃一个外卖把外卖配送起送价吃上去，第一次去不同的地方感受人间冷暖，你在椅子上看孩子打闹，看老爷爷老奶奶锻炼身体，看情侣安静依偎聊天，看也有像你一样的一个人独自坐在那里，这时你是安静的，你是放松的，你没有特别想家，你也没有哭过一次，因为你长大了

去年你说想去实习但你没有做下去，或许是外界因素，或许是自身原因，这不用彷徨，不用悲伤，我也并不觉得你那样做不好，是不正道的想法，而如今我看下来，我是开心的
2024年初，你遇到了完全可以说改变你事业一生的人，他告诉你大学生在学校学的东西没有用，告诉了你有太多的人在大学里面已经有了好几段实习，告诉了你实习没有这么难，告诉了你有了作品集就可以投递，虽然你都做了，但是还不够，你的作品集不够精美，没有可以商业落地的项目，所以你需要沉淀沉淀
2024年中，你遇到了改变你对另一半看法的人，他俩是2024年抖音最火的两对之一，你看到了对爱情的向往，你学到了很多东西，你熬夜追他俩的任何细节，但你的收获很大，这对于你来说是爱情观的塑造，他对她做的事情都出乎你的意料，他做的每一件事都是很man的人，他俩对你的未来产生了很大的影响，或许你对未来的另一半要求会更高，对你来说这绝对也是你对另一半的看法，你对她做的事，你对爱一个人的能力更高了
2024年末，你认识了一个喜欢摄影的人，他带你入了摄影的行，你也喜欢上了摄影，你也认识了很多喜欢摄影的人

在这一年里，或许你没有很多事业上的成长，但你认识的任何一个人都对你产生上了心灵上的影响，你所认识的每一个人，做的每一件事，都是对你的磨砺，你现在就像一颗石头，要被打磨，要被刮两层皮才会逐渐露出一小颗玉石，哪怕没有玉石，也会刮去灰尘，露出独属于你自己的石头
2025年1月，你喜欢的i播开了个语音厅，你用心想去为那些来厅里的老师做一些事情，所以你学习剪辑，开了会员，进群当过管理，也被不受重视过，但那又如何，你知道了你只有两个i播，除他俩之外其他人管你何事，你帮她们她们给你回馈是她们好，不回馈不也是你的一厢情愿吗，但是也不用后悔，你也因此认识了很多人，也学习了剪辑，让你的心灵可以有一定的成长
2025年2月，你认识了很多跟你一样喜欢他俩的人，他们跟你一起扯皮，跟你打游戏，跟你一起聊i播，一起聊一件事，骂过人，扯过皮
2025年3月，你第一次跟i播一起做公益，虽然不多，但是有了这份心
2025年4月，你两去璧山，见了你i播之一，认识了很多老师，见了在网上一直聊天的朋友
2025年5月，你逐渐的离开了老师们的群聊，你知道该去让自己进行提升了
2025年6月，你学校的课程基本结束，你准备更改你的作品集，用这份作品集，成功投下一家设计公司，但给的钱不多，并且你跟家里面人说，也错失了时机，但也不用担心，你会有更好的选择…与此同时你用你省吃省喝留下的钱买下一台相机，从此开始了你摄影
2025年7月，你把准备好的作品集在boss上投了又投，你很不幸投的一开始刚好是周五六日，你心里很急，在想为什么没有后续，你心里已经凉了半截，后来才发现五六日谁会投简历…在此时家里也在给你施加压力，让你不要白费功夫，让你在饭店干活得了，但是你自己据理力争，想要争取一个去大城市的机会，你投了又投，在boss和实习僧上投了将近1500份简历，10+面试，都无后续，也恭喜你，在7号这天收到了第一个offer，你很开心，虽然这不是你专业相关的，但是公司起码是个小厂，是个上市公司，工资还可以，你就同意了这个offer，准备去往北京，在去北京的这一天，乌云密布，一出门就要大下大雨，你看天气预报报着一天有雨，你义无反顾的买下中午的票，你打车，半个小时打不到，终于打上了，你在想出不出去，一出去万一下雨怎么办，不出去确实下与不下的之间，你狠下心来就出去了，也不付你望，一出小区门，就下了大暴雨，你的裤子，鞋，行李箱，书包都湿了，你把行李放后备箱，你做进车子里，在想直接打到车站还是地铁站坐地铁去，你犹豫片刻选择改目的地，可是不幸的是大路被淹了，上高架桥就堵车，一堵就是一个小时，这就是上天给你的磨炼吗，上车没多久天晴了雨停了，上天怕也是被你感动了，想要为你接风洗尘呢，同时你在10号这天连面3家，有二面有三面，你的面试结果不理想，但是面试官非常好，她们细心点播你，提出你的问题，告诉你作品集哪里错误，所以你应该记住这一天。你一个人去了北京见识了繁华，感受了很多，但是你的目的是生存
2025年8月，你发了工资可以有最基本的生活了，在八月中，你调整简历，随机投了一些，还不错你有了一些收获，有一家在广州，一家在北京但是钱很少，你在想要开学了，还去不去拼一把，你想算了，等之后吧
2025年9月，你想随机投一投，面面试，了解一下行业，你很幸运，你面了很多家，最多的一天面了5家，而这一天你还要上班…你又很幸运你这几天是晚班，所以你9点多醒了，就在准备10点半的面试，随后11点半，你下一场面试在14点半，你15点上班，你怕来不及，所以你去公司打了卡，又回来，在家里面试，面完去了公司露了一下脸，15点半又是一场面试，然后16点又是一场，然后又去公司上班，你这么来了三天，有一面有二面，最终收获三家offer，现在工作的这俩给的钱很多，offer下发很快，当天面试，隔了几个小时就给了消息，所以你准备留下来再干一个月，你学到了很多东西，你又可以从新包装你的作品集了，在此之间，你在网上刷到了很多面试指南、实习指南、工作指南、作品指南，所以你成长了很多，你也发现了你之前的面试是很有问题的，所以你接下来是要有很大的问题需要解决

2025年10月
你好，20岁
如今我坐在K7707趟列车，想要写下我接下来的路，我不知道能不能成功，我不知道能不能走下去，但是我要写下来
接下来你要准备买一个大疆运动相机，买一个大疆mini麦，去理发，去修电脑，去过一个在家里面的生日，去跟你朋友过一个他的生日，陪一陪家人，问一问哥哥关于代码的事情，回北京，干三天，回学校，补作业，播客，拍照，去云南，做年终总结，重做作品集，学英语，这是2025年接下来要走的路
2026年
去广州、深圳、上海、杭州实习，如果可以每一个地方呆一个月就更好了，每一个地方都要去当地实习一段，然后回家，准备秋招，如果你做的足够好，你将拿着6段实习去打下秋招这条路
接下来面试的岗位
产品经理
内容运营
产品运营
产品设计
数据分析
UI设计
等不限于
如果有ai岗就更好了
当然这只是我目前的想法，这是我这一个月以来的想法改进，如果你的想法改进了更好，要按照你自己的来
我从想干设计到现在不想干设计，我需要去试，所以这也只是基于我现在 此时此刻的经历去写下这段路
以下是大方向
自媒体
播客
长视频
健身
作品集
秋招
北京
你会更好的对吧
在21岁这年，你会成长到怎样一个地步呢，我很想知道！
当然如果你累了你就休息休息，我也不会怎么样的，记住你只是你，不需要向别人怎么样
这几年你成长很快，你的三观还没有成完全体，你的思维逻辑还没有达到闭环，所以你依旧要去不断打磨自己，或许出错，或许出丑，或许不被理解，或许被骂，或许会哭，但是要记得美好！这世界或许很糟糕，但是要相信自己！加油！
最后，我不想以诗歌结尾，不想以煽情结尾，不想以要求结尾，我想以祝愿结尾，祝愿你平安 喜乐 律己 成长！
此致
敬礼
Respect`
  },
  {
    id: '2',
    title: 'No.2【叁水漫聊】聊低谷、谈行业、话社交，畅聊未来的N种可能',
    date: '2025年',
    readTime: '30 分钟',
    excerpt: '与柴露一起聊低谷期、行业趋势、社交与未来的无限可能...',
    category: '对话',
    content: `哈喽大家好，欢迎来到叁水漫聊频道，我是阿淼，不知道各位的生活中有没有这样一位同学，既能在学校学习成绩名列前茅，也能在各类活动中脱颖而出，并且还能收获很多人的一致好评？今天呢，我就把这位同学邀请到我们的频道里来，一起来探讨对事情的看法，也来了解一下他。
柴露，可以简单介绍一下自己吗？
最近生活如何呢，感觉忙碌吗
你觉得你是大众认为的好学生吗
你从小到大最难忘的经历是什么？第一想法（我问到这个问题你想到的是什么？可以是一片空白）
你感觉最低谷的时候是什么呢？
你感觉最难堪的时候是什么呢？
目前一年你的专业上的想法是什么呢
那你认为这个专业在之后会有怎样的发展呢（可以稍微预测一下）
你对这个行业的认知是什么（可以简单概括一下吗）
你所认为什么样是关系好的象征呢
你是如何处理一段不平等的关系呢 例如：老师与学生 长辈与晚辈 领导与同级业务层面等等
你的个人爱好是什么呢
那我们聊一聊这个爱好吧（那你说我们在平常生活中，如果没有个人爱好支撑可以支撑多远，还是你觉得人只需要工作）
那你说你十年之后你是什么样子呢 可以无限幻想
用十个词语描述一下你现在的情况、处境、生活
在你工作中，总会遇到不同的人 有不同的想法 那你怎么去说服别人可以听你的意见呢
目前你认识的人里有没有你自己特别敬佩的人呢，认为他是你学习的榜样一类的，可以是虚拟的人也可以是明星一类的
有：细讲
无：从小学校就教我们要有一个目标 要有一个人可以追随，这样我们不会迷失方向 那你没有目标你是怎么保证自己可以一直走一个适合你自己的路呢
你有没有特别想回到某一天或者某一个时间段去看看曾经的自己 或者跟曾经的自己说句话
你现在的你是你曾经想成为的样子吗
对你来说社交是什么 社交的定义是什么
总有人说要向上社交，你认为可行吗？
有人说社交是消耗，消耗时间 消耗金钱 消耗自己 你赞同吗
你说长大的定义是什么
你说人的一生是由什么构成的呢
如果有一天所有人都在针对你你会怎么样（如果有一天你成为了公众人物你做的都是你所认为正确的事情但不被认可还被人唾弃你会怎么样）
你是悲观者还是乐观者
悲观者：习惯放大风险与负面结果，倾向于“先看到失去”，但往往对潜在问题预判更精准，能提前规避风险
乐观者：更关注机会与积极可能性，倾向于“先看到获得”，但可能因低估困难而显得盲目，不过行动力和情绪韧性更强
也有人说悲观者总是正确，乐观者正在前行
悲观者永远正确，乐观者永远前行。悲观者的自我预言总是会一一得到验证，因为他们有自知之明，容易自我设限,最后活成他们预判的样子。而乐观者从不会想太多,从来不认命，即使局势不利，也不会早早下结论。可能失败很多次,但是人这一辈子成功一次可能就够了。所以,宁愿做一个经常犯错的乐观者，也不要做一个经常正确的悲观者。你的世界没有你想的那么糟糕,当你不再给自己下定义,当你相信自己有无限可能,那你一定会活出不一样的自己。 
如果有一天你赚了一笔很容易的钱，你会怎么办呢（是自己肆意挥霍还是给父母 还是存起来还是做工资）
你觉得你是一个怎样的人
你觉得我是一个什么样的人
你去的所有地方感觉哪里最好，最贴近你的城市
那你认为我现在做的这个视频播客是正经的吗
你有没有问我的问题
好，那就本期频道就结束了，也欢迎大家可以把自己的想法打在评论区里，我们可以一起讨论，最后我想用一句话结尾，这句话是我刷抖音刷到的，我觉得这句话很好所以我用这句话结尾，是可以让人思考的一句话 :“坚持自己所坚持的 然后去影响更多的人”
那么各位再见`
  }
];

const PODCASTS: Podcast[] = [
  {
    id: '1',
    title: 'No.1【叁水漫聊】致2024年-19岁',
    duration: '按链接播放',
    date: '2024年',
    description: '嗨，19岁你好我是20岁的你...',
    link: 'https://www.xiaoyuzhoufm.com/episode/6926f546f8a9e1d1629013e7'
  },
  {
    id: '2',
    title: 'No.2【叁水漫聊】聊低谷、谈行业、话社交，畅聊未来的N种可能',
    duration: '按链接播放',
    date: '2025年',
    description: '聊聊低谷期、行业趋势、社交与未来的无限可能...',
    link: 'https://www.xiaoyuzhoufm.com/episode/691dfabb6018cc2c98aa9f61'
  },
  {
    id: '3',
    title: 'No.3【叁水漫聊】聊爱情、谈自我、话成长，探索自我的无限可能',
    duration: '按链接播放',
    date: '2025年',
    description: '探讨爱情、自我认知与成长，突破自我设限的枷锁...',
    link: 'https://www.xiaoyuzhoufm.com/episode/6942eaf95fca03e88855a08c'
  },
  {
    id: '4',
    title: 'No.4【叁水漫聊】昆明-大理之旅，收获与成长',
    duration: '按链接播放',
    date: '2025年',
    description: '在昆明-大理一路以来的收获是给自己的一份生日礼物，也是放松心情的一份选择...',
    link: 'https://www.xiaoyuzhoufm.com/episode/6945b1329f70e5d6b343ef5f'
  },
  {
    id: '5',
    title: 'No.5【叁水漫聊】至我的一生',
    duration: '按链接播放',
    date: '2025年',
    description: '这是我仅的一生，有悔有过有喜有悲太多太多了...',
    link: 'https://www.xiaoyuzhoufm.com/episode/694942890f2ae6a8678e5a8a'
  }
];

// --- Components ---

const NavItem = ({ active, onClick, label, icon: Icon }: { active: boolean; onClick: () => void; label: string; icon: any }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 transition-all duration-300 group cursor-pointer ${
      active ? 'text-accent' : 'text-white/50 hover:text-white'
    }`}
  >
    <Icon size={16} className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
    <span className="font-mono text-xs uppercase tracking-widest">
      {active && <span className="mr-1 animate-pulse">_</span>}
      {label}
    </span>
  </button>
);

const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="mb-12">
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-4 mb-2"
    >
      <div className="h-px w-12 bg-accent" />
      <span className="font-mono text-accent text-xs uppercase tracking-[0.3em]">{title}</span>
    </motion.div>
    {subtitle && (
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-4xl md:text-5xl font-light tracking-tight"
      >
        {subtitle}
      </motion.h2>
    )}
  </div>
);

// --- Page Views ---

const HomeView = ({ setPage }: { setPage: (p: Page) => void }) => (
  <div className="space-y-32">
    <section className="min-h-[70vh] flex flex-col justify-center items-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-6xl md:text-8xl font-light tracking-tighter mb-8 leading-none">
          浩天<span className="text-accent">淼</span>
        </h1>
        <p className="max-w-xl text-white/60 text-lg md:text-xl font-light leading-relaxed mb-12">
          我只是一个Agent
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <button 
            onClick={() => setPage('projects')}
            className="px-8 py-4 bg-white text-black font-mono text-sm uppercase tracking-widest hover:bg-accent transition-colors flex items-center gap-2 cursor-pointer"
          >
            探索作品 <ChevronRight size={16} />
          </button>
          <button 
             onClick={() => setPage('about')}
            className="px-8 py-4 border border-white/20 font-mono text-sm uppercase tracking-widest hover:border-white transition-colors cursor-pointer"
          >
            个人故事
          </button>
        </div>
      </motion.div>
    </section>

    <section>
      <SectionHeader title="精选" subtitle="近期作品" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PROJECTS.filter(project => project.title === 'AI产品集' || project.title === '交互设计').map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ 
              scale: 1.05,
              y: -5,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setPage('projects')}
            className="group p-8 glass hover:border-accent/50 transition-all duration-500 cursor-pointer relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-6">
              <span className="font-mono text-xs text-white/30">{project.year}</span>
              <ExternalLink size={16} className="text-white/30 group-hover:text-accent transition-colors" />
            </div>
            <h3 className="text-2xl font-light mb-4 group-hover:text-accent transition-colors">{project.title}</h3>
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map(tag => (
                <span key={tag} className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 bg-white/5 border border-white/10">
                  {tag}
                </span>
              ))}
            </div>
            
            {/* View Details Button */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2">
              <span className="text-black font-mono text-[10px] font-bold uppercase tracking-widest">查看详情</span>
              <ChevronRight size={14} className="text-black" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  </div>
);

const AboutView = () => {
  const [copyMessage, setCopyMessage] = useState("");
  
  const copyWechat = async () => {
    try {
      await navigator.clipboard.writeText("Z18132013791");
      setCopyMessage("微信号已复制!");
      setTimeout(() => setCopyMessage(""), 2000);
    } catch (err) {
      setCopyMessage("复制失败");
      setTimeout(() => setCopyMessage(""), 2000);
    }
  };

  const internships = [
    {
      company: "北京饼干科技有限公司（像素绽放PixelBloom）",
      role: "产品运营",
      period: "2025.6-2025.9",
      description: "负责核心AIGC产品（AI PPT/写作）的运营与迭代，建立了从用户反馈到需求定义的完整流程，实现了用户增长与核心功能按时高质量上线。"
    },
    {
      company: "辉塔信息技术咨询（北京）有限公司",
      role: "产品体验设计",
      period: "2025.9-2025.11",
      description: "负责中国工商银行、极氪汽车等核心B端大客户的项目落地，通过重构产品逻辑提升了用户易用性与操作效率。"
    },
    {
      company: "重庆库田科技有限公司",
      role: "AI数据运营",
      period: "2025.11-2025.12",
      description: "深度参与AI图形训练项目，建立了高效的数据处理流程与监控机制，提升了模型识别准确率。"
    }
  ];

  const campusExperiences = [
    {
      title: "校级官方抖音号 | 核心运营负责人",
      period: "2023.10-2024.12",
      description: "负责校级官方抖音号的整体运营，将传统的官微思维转变为双向互动的社区模式，策划了校园生存指南、专业趣贴等贴近学生的系列选题，在短期内成功打造出校园官方账号的年轻化转型。"
    }
  ];

  const personalProjects = [
    {
      title: "个人抖音IP（校园博主捕主）｜创作者/账号主理人",
      period: "2024.4-2025.11",
      description: "从0到1独立孵化校园摄影/捕主类垂直类抖音账号，主导定位引入校园日常之美的核心人设，深度参与视觉美学与AI工具辅助的内容创作，仅用1个月实现账号粉丝从0突破至1万。"
    },
    {
      title: "云漾空间小程序-AI驱动的音频内容发现平台",
      period: "2025.11-2025.12",
      description: "为验证AIGC如何优化音频内容分发与消费体验的假设，完成了一款AIGC对话式MV产品，组织了50名真实用户进行测试验证。"
    }
  ];

  const skills = {
    aiTools: ["ChatGPT", "Claude", "Gemini", "Nanobanana", "千问", "元宝", "Kimi", "豆包"],
    designTools: ["Figma", "sketch up", "Axure", "墨刀", "Agent", "coze", "Stable diffusion", "Pr", "After Effects", "AI", "blender", "3dmax"],
    officeTools: ["飞书", "Excel", "Word", "WPS"]
  };

  return (
    <div className="max-w-4xl mx-auto py-20">
      <SectionHeader title="探索" subtitle="关于我" />
      
      <div className="text-center space-y-8 text-white/70 text-lg font-light leading-relaxed mb-64 py-24">
        <p>
          一定要做有思考的设计，一定要做有温度的产品，持续迭代，持续成长，持续向前，坚持不懈
        </p>
        <p>
          改逻辑，塑人生，忘忧愁，得永生
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-24"
      >
        <h2 className="text-2xl font-light mb-8 flex items-center gap-3">
          <span className="text-accent">_</span>个人信息
        </h2>
        <motion.div 
          className="glass p-6"
          whileHover={{ scale: 1.02, borderColor: 'rgba(0,255,157,0.3)' }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4 flex flex-col justify-center">
              <p className="text-white/80 hover:text-white transition-colors"><span className="text-accent">姓名：</span>周兴跃</p>
              <p className="text-white/80 hover:text-white transition-colors"><span className="text-accent">性别：</span>男</p>
              <p className="text-white/80 hover:text-white transition-colors"><span className="text-accent">电话：</span>18132013791</p>
              <p className="text-white/80 hover:text-white transition-colors"><span className="text-accent">邮箱：</span>2587944602@qq.com</p>
            </div>
            <div className="md:col-span-1 flex items-center justify-center">
              <div className="w-full max-w-[180px] aspect-square bg-white/5 border border-white/10 relative overflow-hidden group">
                <div className="absolute inset-0 tech-grid opacity-20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <img 
                    src="https://picsum.photos/seed/haitian/400/400" 
                    alt="个人照片" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-24"
      >
        <h2 className="text-2xl font-light mb-8 flex items-center gap-3">
          <span className="text-accent">_</span>实习经历
        </h2>
        <div className="space-y-6">
          {internships.map((internship, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ 
                scale: 1.03, 
                x: 10,
                borderColor: 'rgba(0,255,157,0.4)'
              }}
              className="glass p-6 cursor-pointer"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                <div>
                  <h3 className="text-xl font-light text-white group-hover:text-accent transition-colors">{internship.role}</h3>
                  <p className="text-accent font-mono text-sm">{internship.company}</p>
                </div>
                <span className="text-white/30 font-mono text-sm mt-2 md:mt-0">{internship.period}</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">{internship.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-24"
      >
        <h2 className="text-2xl font-light mb-8 flex items-center gap-3">
          <span className="text-accent">_</span>校园经历
        </h2>
        <div className="space-y-6">
          {campusExperiences.map((experience, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
              whileHover={{ 
                scale: 1.03, 
                x: 10,
                borderColor: 'rgba(0,255,157,0.4)'
              }}
              className="glass p-6 cursor-pointer"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                <h3 className="text-xl font-light text-white group-hover:text-accent transition-colors">{experience.title}</h3>
                <span className="text-white/30 font-mono text-sm mt-2 md:mt-0">{experience.period}</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">{experience.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mb-24"
      >
        <h2 className="text-2xl font-light mb-8 flex items-center gap-3">
          <span className="text-accent">_</span>个人项目
        </h2>
        <div className="space-y-6">
          {personalProjects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.15 }}
              whileHover={{ 
                scale: 1.03, 
                x: 10,
                borderColor: 'rgba(0,255,157,0.4)'
              }}
              className="glass p-6 cursor-pointer"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                <h3 className="text-xl font-light text-white group-hover:text-accent transition-colors">{project.title}</h3>
                <span className="text-white/30 font-mono text-sm mt-2 md:mt-0">{project.period}</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">{project.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mb-24"
      >
        <h2 className="text-2xl font-light mb-8 flex items-center gap-3">
          <span className="text-accent">_</span>教育经历
        </h2>
        <motion.div 
          className="glass p-6"
          whileHover={{ scale: 1.02, borderColor: 'rgba(0,255,157,0.3)' }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
            <div>
              <h3 className="text-xl font-light text-white">数字媒体艺术专业</h3>
              <p className="text-accent font-mono text-sm">长江师范学院</p>
            </div>
            <span className="text-white/30 font-mono text-sm mt-2 md:mt-0">2023.9-2027.6</span>
          </div>
          <p className="text-white/60 text-sm leading-relaxed">
            主修课程：AIGC工具实战基础、UI交互设计与用户体验、广告设计、三维数字建模、展示设计、影视广告设计、数字摄影、计算机基础、心理学等
          </p>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h2 className="text-2xl font-light mb-8 flex items-center gap-3">
          <span className="text-accent">_</span>个人技能
        </h2>
        <div className="space-y-6">
          <motion.div 
            className="glass p-6"
            whileHover={{ scale: 1.02, borderColor: 'rgba(0,255,157,0.3)' }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="text-accent font-mono text-sm uppercase tracking-widest mb-4">AI 工具</h4>
            <div className="flex flex-wrap gap-2">
              {skills.aiTools.map((skill, i) => (
                <motion.span 
                  key={i}
                  className="text-sm px-3 py-1 bg-white/5 border border-white/10 text-white/70 cursor-pointer"
                  whileHover={{ 
                    scale: 1.1, 
                    backgroundColor: 'rgba(0,255,157,0.1)',
                    borderColor: 'rgba(0,255,157,0.5)',
                    color: 'rgba(0,255,157,1)'
                  }}
                  transition={{ duration: 0.2 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
          <motion.div 
            className="glass p-6"
            whileHover={{ scale: 1.02, borderColor: 'rgba(0,255,157,0.3)' }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="text-accent font-mono text-sm uppercase tracking-widest mb-4">设计工具</h4>
            <div className="flex flex-wrap gap-2">
              {skills.designTools.map((skill, i) => (
                <motion.span 
                  key={i}
                  className="text-sm px-3 py-1 bg-white/5 border border-white/10 text-white/70 cursor-pointer"
                  whileHover={{ 
                    scale: 1.1, 
                    backgroundColor: 'rgba(0,255,157,0.1)',
                    borderColor: 'rgba(0,255,157,0.5)',
                    color: 'rgba(0,255,157,1)'
                  }}
                  transition={{ duration: 0.2 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
          <motion.div 
            className="glass p-6"
            whileHover={{ scale: 1.02, borderColor: 'rgba(0,255,157,0.3)' }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="text-accent font-mono text-sm uppercase tracking-widest mb-4">办公工具</h4>
            <div className="flex flex-wrap gap-2">
              {skills.officeTools.map((skill, i) => (
                <motion.span 
                  key={i}
                  className="text-sm px-3 py-1 bg-white/5 border border-white/10 text-white/70 cursor-pointer"
                  whileHover={{ 
                    scale: 1.1, 
                    backgroundColor: 'rgba(0,255,157,0.1)',
                    borderColor: 'rgba(0,255,157,0.5)',
                    color: 'rgba(0,255,157,1)'
                  }}
                  transition={{ duration: 0.2 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

const ProjectsView = () => (
  <div className="py-20">
    <SectionHeader title="归档" subtitle="精选作品" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {PROJECTS.map((project, i) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          transition={{ delay: i * 0.1 }}
          className="group relative cursor-pointer"
        >
          <div className="aspect-video bg-white/5 border border-white/10 mb-6 overflow-hidden relative">
            <div className="absolute inset-0 tech-grid opacity-10 group-hover:opacity-20 transition-opacity" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
              <div className="flex flex-col items-center gap-4">
                <span className="font-mono text-xs uppercase tracking-[0.5em] bg-black/80 px-8 py-4 border border-accent/50 text-accent">查看详情</span>
                <div className="w-12 h-px bg-accent/50" />
              </div>
            </div>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <span className="font-mono text-[10px] text-accent mb-2 block uppercase tracking-widest">{project.tags.join(' / ')}</span>
              <h3 className="text-3xl font-light group-hover:translate-x-2 transition-transform duration-500">{project.title}</h3>
            </div>
            <span className="font-mono text-xs text-white/20">{project.year}</span>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

const ArticleDetailView = ({ article, onBack }: { article: Article; onBack: () => void }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentAuthor, setNewCommentAuthor] = useState("");
  const [newCommentContent, setNewCommentContent] = useState("");

  const renderContent = () => {
    if (!article.content) return null;
    return article.content.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-6 text-white/80 leading-relaxed">
        {paragraph}
      </p>
    ));
  };

  const handleAddComment = () => {
    if (newCommentAuthor.trim() && newCommentContent.trim()) {
      const newComment: Comment = {
        id: Date.now().toString(),
        author: newCommentAuthor,
        content: newCommentContent,
        date: new Date().toLocaleDateString('zh-CN')
      };
      setComments([newComment, ...comments]);
      setNewCommentAuthor("");
      setNewCommentContent("");
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/50 hover:text-accent transition-colors font-mono text-sm uppercase tracking-widest"
        >
          <ChevronRight size={16} className="rotate-180" />
          返回文章列表
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-12"
      >
        <div className="flex items-center gap-4 mb-6">
          <span className="font-mono text-[10px] text-accent uppercase tracking-widest">{article.category}</span>
          <div className="h-px flex-1 bg-white/10" />
          <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">{article.date}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-light tracking-tight">{article.title}</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass p-8 mb-12"
      >
        {renderContent()}
        {!article.content && (
          <p className="text-white/50">文章内容待添加...</p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-light mb-8 flex items-center gap-3">
          <span className="text-accent">_</span>评论区
        </h2>

        <div className="glass p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="你的昵称"
              value={newCommentAuthor}
              onChange={(e) => setNewCommentAuthor(e.target.value)}
              className="bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/30 outline-none focus:border-accent transition-colors"
            />
          </div>
          <textarea
            placeholder="写下你的评论..."
            value={newCommentContent}
            onChange={(e) => setNewCommentContent(e.target.value)}
            className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/30 outline-none focus:border-accent transition-colors resize-none h-32 mb-4"
          />
          <button
            onClick={handleAddComment}
            disabled={!newCommentAuthor.trim() || !newCommentContent.trim()}
            className="px-6 py-3 bg-accent text-black font-mono text-sm uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            发表评论
          </button>
        </div>

        <div className="space-y-6">
          {comments.length === 0 ? (
            <p className="text-white/30 font-mono text-sm uppercase tracking-widest text-center py-12">
              还没有评论，来发表第一条评论吧！
            </p>
          ) : (
            comments.map((comment, i) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-accent font-mono text-sm">{comment.author}</span>
                  <span className="text-white/30 font-mono text-xs">{comment.date}</span>
                </div>
                <p className="text-white/70 leading-relaxed">{comment.content}</p>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

const ArticlesView = ({ onArticleClick }: { onArticleClick: (id: string) => void }) => (
  <div className="max-w-3xl mx-auto py-20">
    <SectionHeader title="志" subtitle="文章" />
    <div className="space-y-16">
      {ARTICLES.map((article, i) => (
        <motion.article
          key={article.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="group cursor-pointer"
          onClick={() => onArticleClick(article.id)}
        >
          <div className="flex items-center gap-4 mb-4">
            <span className="font-mono text-[10px] text-accent uppercase tracking-widest">{article.category}</span>
            <div className="h-px flex-1 bg-white/10" />
            <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">{article.date}</span>
          </div>
          <h3 className="text-3xl font-light mb-4 group-hover:text-accent transition-colors">{article.title}</h3>
          <p className="text-white/50 leading-relaxed mb-6">{article.excerpt}</p>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/30 group-hover:text-white transition-colors">
            阅读文章 <ChevronRight size={12} />
          </div>
        </motion.article>
      ))}
    </div>
  </div>
);

const PodcastsView = () => {
  return (
    <div className="max-w-4xl mx-auto py-20">
      <SectionHeader title="音频" subtitle="叁水漫聊" />
      <div className="grid grid-cols-1 gap-6">
        {PODCASTS.map((podcast, i) => (
          <motion.div
            key={podcast.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 glass flex flex-col md:flex-row gap-8 items-center cursor-pointer group"
            onClick={() => podcast.link && window.open(podcast.link, '_blank')}
          >
            <button className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center hover:border-accent hover:bg-accent/10 transition-all shrink-0 group">
              <Play size={24} className="text-white group-hover:text-accent ml-1" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">{podcast.date}</span>
                <span className="font-mono text-[10px] text-accent uppercase tracking-widest">{podcast.duration}</span>
              </div>
              <h3 className="text-xl font-medium mb-2 group-hover:text-accent transition-colors">{podcast.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{podcast.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentArticleId, setCurrentArticleId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);

  useEffect(() => {
    setIsPageTransitioning(true);
    const timer = setTimeout(() => setIsPageTransitioning(false), 800);
    return () => clearTimeout(timer);
  }, [currentPage]);

  const allContent = [
    ...PROJECTS.map(p => ({ ...p, type: '项目', page: 'projects' as Page })),
    ...ARTICLES.map(a => ({ ...a, type: '文章', page: 'articles' as Page })),
    ...PODCASTS.map(p => ({ ...p, type: '播客', page: 'podcasts' as Page })),
  ];

  const filteredResults = searchQuery.trim() === "" 
    ? [] 
    : allContent.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item as any).description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item as any).excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item as any).tags?.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  const renderContent = () => {
    if (currentArticleId) {
      const article = ARTICLES.find(a => a.id === currentArticleId);
      if (article) {
        return (
          <ArticleDetailView 
            article={article} 
            onBack={() => {
              setCurrentArticleId(null);
              setCurrentPage('articles');
            }} 
          />
        );
      }
    }
    
    switch (currentPage) {
      case 'home': return <HomeView setPage={setCurrentPage} />;
      case 'about': return <AboutView />;
      case 'projects': return <ProjectsView />;
      case 'articles': return (
        <ArticlesView 
          onArticleClick={(id) => {
            setCurrentArticleId(id);
            setCurrentPage('article-detail');
          }} 
        />
      );
      case 'podcasts': return <PodcastsView />;
      default: return <HomeView setPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden tech-grid">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full" />
        {/* Subtle Green Corner Glows */}
        <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-[400px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-t-0 border-x-0">
        {/* Page Transition Progress Bar */}
        <AnimatePresence>
          {isPageTransitioning && (
            <motion.div
              initial={{ width: "0%", opacity: 1 }}
              animate={{ width: "100%", opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute top-0 left-0 h-[2px] bg-accent z-[60] shadow-[0_0_10px_rgba(0,255,157,0.5)]"
            />
          )}
        </AnimatePresence>

        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button 
            onClick={() => setCurrentPage('home')}
            className="font-mono font-bold text-xl tracking-tighter group cursor-pointer"
          >
            <span className="text-accent group-hover:animate-pulse">_</span>淼
          </button>
          
          <div className="hidden md:flex items-center gap-2">
            <NavItem active={currentPage === 'home'} onClick={() => { setCurrentPage('home'); setCurrentArticleId(null); }} label="首页" icon={HomeIcon} />
            <NavItem active={currentPage === 'about'} onClick={() => { setCurrentPage('about'); setCurrentArticleId(null); }} label="关于我" icon={User} />
            <NavItem active={currentPage === 'projects'} onClick={() => { setCurrentPage('projects'); setCurrentArticleId(null); }} label="作品" icon={Code} />
            <NavItem active={currentPage === 'articles' || currentPage === 'article-detail'} onClick={() => { setCurrentPage('articles'); setCurrentArticleId(null); }} label="文章" icon={BookOpen} />
            <NavItem active={currentPage === 'podcasts'} onClick={() => { setCurrentPage('podcasts'); setCurrentArticleId(null); }} label="播客" icon={Mic} />
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-white/50 hover:text-accent transition-colors cursor-pointer"
              aria-label="搜索"
            >
              <Search size={20} />
            </button>
            <div className="h-8 w-px bg-white/10 hidden md:block" />
            <button className="p-2 text-white/50 hover:text-accent transition-colors cursor-pointer">
              <Github size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav (Simple) */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 glass rounded-full px-6 py-3 flex gap-6">
         <HomeIcon size={20} onClick={() => { setCurrentPage('home'); setCurrentArticleId(null); }} className={`cursor-pointer ${currentPage === 'home' ? 'text-accent' : 'text-white/50'}`} />
         <User size={20} onClick={() => { setCurrentPage('about'); setCurrentArticleId(null); }} className={`cursor-pointer ${currentPage === 'about' ? 'text-accent' : 'text-white/50'}`} />
         <Code size={20} onClick={() => { setCurrentPage('projects'); setCurrentArticleId(null); }} className={`cursor-pointer ${currentPage === 'projects' ? 'text-accent' : 'text-white/50'}`} />
         <BookOpen size={20} onClick={() => { setCurrentPage('articles'); setCurrentArticleId(null); }} className={`cursor-pointer ${currentPage === 'articles' || currentPage === 'article-detail' ? 'text-accent' : 'text-white/50'}`} />
         <Mic size={20} onClick={() => { setCurrentPage('podcasts'); setCurrentArticleId(null); }} className={`cursor-pointer ${currentPage === 'podcasts' ? 'text-accent' : 'text-white/50'}`} />
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentArticleId || currentPage}
            initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
            transition={{ 
              duration: 0.5, 
              ease: [0.22, 1, 0.36, 1] // Custom cubic-bezier for "fluent" feel
            }}
            className="min-h-[60vh] flex flex-col items-center justify-center text-center"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Subtle Footer Accent */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-white/5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500/40 animate-pulse" />
            <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em]">
              Digital Ether / <span className="text-emerald-500/40">Miao</span>
            </p>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-mono text-white/10 uppercase tracking-widest">Est. 2024</span>
            <div className="w-8 h-[1px] bg-emerald-500/20" />
            <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest hover:text-accent transition-colors cursor-pointer">Back to Top</span>
          </div>
        </div>
      </footer>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col"
          >
            <div className="max-w-4xl mx-auto w-full px-6 pt-32">
              <div className="flex items-center gap-4 border-b border-white/10 pb-4 mb-8">
                <Search size={24} className="text-accent" />
                <input
                  autoFocus
                  type="text"
                  placeholder="搜索项目、文章、播客..."
                  className="flex-1 bg-transparent border-none outline-none text-2xl font-light placeholder:text-white/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Escape' && setIsSearchOpen(false)}
                />
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="overflow-y-auto max-h-[60vh] custom-scrollbar">
                {filteredResults.length > 0 ? (
                  <div className="space-y-6">
                    {filteredResults.map((item, i) => (
                      <motion.div
                        key={`${item.type}-${item.id}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => {
                          if (item.type === '文章') {
                            setCurrentArticleId(item.id);
                            setCurrentPage('article-detail');
                          } else {
                            setCurrentPage(item.page);
                          }
                          setIsSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="group p-6 border border-white/5 hover:border-accent/30 hover:bg-white/5 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 bg-accent/10 text-accent border border-accent/20">
                            {item.type}
                          </span>
                          <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">
                            {(item as any).year || (item as any).date}
                          </span>
                        </div>
                        <h4 className="text-xl font-light group-hover:text-accent transition-colors">{item.title}</h4>
                      </motion.div>
                    ))}
                  </div>
                ) : searchQuery.trim() !== "" ? (
                  <div className="text-center py-20 text-white/30 font-mono text-sm uppercase tracking-widest">
                    未找到匹配结果
                  </div>
                ) : (
                  <div className="text-center py-20 text-white/20 font-mono text-xs uppercase tracking-[0.3em]">
                    输入关键字开始搜索
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] text-white/20 uppercase tracking-widest">系统状态</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-widest">所有系统运行正常</span>
            </div>
          </div>
          <div className="font-mono text-[10px] text-white/20 uppercase tracking-widest">
            © 2024 创意技术专家。精工细作。
          </div>
          <div className="flex gap-6">
            <Github size={16} className="text-white/20 hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  );
}
