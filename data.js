// Tang-Song Literature Geographic Data
const literatureData = {
    // Tang Dynasty Poetry Data
    tang: [
        {
            id: 1,
            title: "Quiet Night Thoughts (静夜思)",
            author: "李白 (Li Bai)",
            dynasty: "tang",
            year: 725,
            location: {
                name: "Chang'an",
                lat: 34.3416,
                lng: 108.9398,
                modern_name: "Xi'an"
            },
            content: `床前明月光，疑是地上霜。
举头望明月，低头思故乡。

Before my bed the bright moonlight,
Like frost upon the ground appears.
I lift my head to see the moon,
Then bow it down, homesick with tears.`,
            emotion: "nostalgia",
            emotion_analysis: "Homesickness and longing, moonlit melancholy",
            background: "Written while Li Bai was staying in Chang'an, expressing deep longing for his hometown.",
            keywords: ["moon", "hometown", "longing"]
        },
        {
            id: 2,
            title: "Seeing Off Meng Haoran at Yellow Crane Tower (黄鹤楼送孟浩然之广陵)",
            author: "李白 (Li Bai)",
            dynasty: "tang",
            year: 730,
            location: {
                name: "Jiangxia",
                lat: 30.5928,
                lng: 114.3055,
                modern_name: "Wuhan"
            },
            content: `故人西辞黄鹤楼，烟花三月下扬州。
孤帆远影碧空尽，唯见长江天际流。

My friend departs from Yellow Crane Tower in the west,
In flowery March, he sails down to Yangzhou.
A lone sail's distant shadow fades in azure sky,
Only the Yangtze flows to the horizon's edge.`,
            emotion: "sadness",
            emotion_analysis: "Parting sorrow and reluctance to say goodbye",
            background: "Li Bai bids farewell to his friend Meng Haoran at Yellow Crane Tower, expressing the pain of separation.",
            keywords: ["Yellow Crane Tower", "Yangzhou", "farewell", "Yangtze River"]
        },
        {
            id: 3,
            title: "Spring Dawn (春晓)",
            author: "孟浩然 (Meng Haoran)",
            dynasty: "tang",
            year: 720,
            location: {
                name: "Xiangyang",
                lat: 32.0420,
                lng: 112.1226,
                modern_name: "Xiangyang"
            },
            content: `春眠不觉晓，处处闻啼鸟。
夜来风雨声，花落知多少。

In spring I sleep, unaware of dawn,
Everywhere I hear the singing birds.
Last night came sounds of wind and rain,
How many flowers have fallen, I wonder?`,
            emotion: "nature",
            emotion_analysis: "Spring morning tranquility and natural harmony",
            background: "Depicts the beautiful scenery of a spring morning, reflecting the poet's love for nature.",
            keywords: ["spring", "birdsong", "fallen flowers", "nature"]
        },
        {
            id: 4,
            title: "Climbing Stork Tower (登鹳雀楼)",
            author: "王之涣 (Wang Zhihuan)",
            dynasty: "tang",
            year: 735,
            location: {
                name: "Puzhou",
                lat: 34.5950,
                lng: 110.4550,
                modern_name: "Yongji"
            },
            content: `白日依山尽，黄河入海流。
欲穷千里目，更上一层楼。

The white sun sets behind the mountains,
The Yellow River flows into the sea.
To see a thousand li in the distance,
Climb up one more floor.`,
            emotion: "joy",
            emotion_analysis: "Magnificent and open-minded, positive and upward",
            background: "Climbing the tower and gazing into the distance, expressing the poet's positive and progressive attitude toward life.",
            keywords: ["Stork Tower", "Yellow River", "distant view", "aspiration"]
        },
        {
            id: 5,
            title: "Spring View (春望)",
            author: "杜甫 (Du Fu)",
            dynasty: "tang",
            year: 757,
            location: {
                name: "Chang'an",
                lat: 34.3416,
                lng: 108.9398,
                modern_name: "Xi'an"
            },
            content: `国破山河在，城春草木深。
感时花溅泪，恨别鸟惊心。
烽火连三月，家书抵万金。
白头搔更短，浑欲不胜簪。

The country is broken, but mountains and rivers remain,
In spring the city grows thick with grass and trees.
Moved by the times, flowers shed tears,
Hating separation, birds startle the heart.
Beacon fires for three months running,
A letter from home worth ten thousand gold.
My white hair, scratched, grows ever shorter,
Soon too thin to hold a hairpin.`,
            emotion: "sadness",
            emotion_analysis: "Concern for country and people, deep sorrow and indignation",
            background: "During the An Lushan Rebellion, Du Fu witnessed the decline of the nation in Chang'an, expressing his worry for the country and people.",
            keywords: ["broken country", "family letter", "war", "patriotic concern"]
        },
        {
            id: 6,
            title: "Song of Everlasting Sorrow (Excerpt) (长恨歌节选)",
            author: "白居易 (Bai Juyi)",
            dynasty: "tang",
            year: 806,
            location: {
                name: "Huaqing Pool",
                lat: 34.3625,
                lng: 109.2122,
                modern_name: "Xi'an Lintong"
            },
            content: `在天愿作比翼鸟，在地愿为连理枝。
天长地久有时尽，此恨绵绵无绝期。

In heaven, let us be two birds flying together,
On earth, let us be two branches of one tree.
Heaven and earth may pass away,
But this regret will never end.`,
            emotion: "love",
            emotion_analysis: "Love tragedy and eternal longing",
            background: "Describes the love tragedy between Emperor Xuanzong and Yang Guifei, expressing the eternity and pain of love.",
            keywords: ["paired birds", "intertwined branches", "love", "eternity"]
        }
    ],
    
    // Song Dynasty Poetry Data
    song: [
        {
            id: 7,
            title: "Prelude to Water Melody - When Will the Moon Be Clear (水调歌头·明月几时有)",
            author: "苏轼 (Su Shi)",
            dynasty: "song",
            year: 1076,
            location: {
                name: "Mizhou",
                lat: 36.7167,
                lng: 119.3833,
                modern_name: "Zhucheng"
            },
            content: `明月几时有？把酒问青天。
不知天上宫阙，今夕是何年。
我欲乘风归去，又恐琼楼玉宇，高处不胜寒。
起舞弄清影，何似在人间。
转朱阁，低绮户，照无眠。
不应有恨，何事长向别时圆？
人有悲欢离合，月有阴晴圆缺，此事古难全。
但愿人长久，千里共婵娟。

When will the moon be clear and bright?
With wine in hand, I ask the blue sky.
I wonder what season it would be tonight
In the heavenly palace on high.
I'd like to ride the wind to fly home,
Yet I fear those crystal palaces are too high and cold.
Dancing with my shadow clear,
How does it compare to being on earth here?
The moon rounds the red mansion,
Stoops to silk-pad doors,
Shines upon the sleepless ones.
The moon should not bear any grudge.
Why does it tend to be full when people are apart?
People may have sorrow or joy, be near or far apart,
The moon may be dim or bright, wax or wane,
This has been going on since the beginning of time.
May we all live long and share the beauty of the moon together,
Though we be thousands of miles apart.`,
            emotion: "nostalgia",
            emotion_analysis: "Mid-Autumn longing for family, philosophical and open-minded",
            background: "Written during Mid-Autumn Festival while missing his brother Su Zhe, expressing philosophical reflections and good wishes.",
            keywords: ["moon", "Mid-Autumn", "family longing", "philosophy"]
        },
        {
            id: 8,
            title: "声声慢·寻寻觅觅",
            author: "李清照",
            dynasty: "song",
            year: 1135,
            location: {
                name: "临安",
                lat: 30.2741,
                lng: 120.1551,
                modern_name: "杭州"
            },
            content: `寻寻觅觅，冷冷清清，凄凄惨惨戚戚。
乍暖还寒时候，最难将息。
三杯两盏淡酒，怎敌他、晚来风急？
雁过也，正伤心，却是旧时相识。
满地黄花堆积，憔悴损，如今有谁堪摘？
守著窗儿，独自怎生得黑？
梧桐更兼细雨，到黄昏、点点滴滴。
这次第，怎一个愁字了得！`,
            emotion: "sadness",
            emotion_analysis: "孤寂愁苦，深沉悲凉",
            background: "晚年流寓临安，丈夫去世后的孤寂悲愁。",
            keywords: ["寻觅", "孤寂", "愁苦", "黄昏"]
        },
        {
            id: 9,
            title: "江城子·乙卯正月二十日夜记梦",
            author: "苏轼",
            dynasty: "song",
            year: 1075,
            location: {
                name: "密州",
                lat: 36.7167,
                lng: 119.3833,
                modern_name: "诸城"
            },
            content: `十年生死两茫茫，不思量，自难忘。
千里孤坟，无处话凄凉。
纵使相逢应不识，尘满面，鬓如霜。
夜来幽梦忽还乡，小轩窗，正梳妆。
相顾无言，惟有泪千行。
料得年年肠断处，明月夜，短松冈。`,
            emotion: "sadness",
            emotion_analysis: "悼亡之痛，刻骨铭心",
            background: "为悼念亡妻王弗而作，表达深挚的夫妻之情。",
            keywords: ["生死", "梦境", "悼亡", "思念"]
        },
        {
            id: 10,
            title: "岳阳楼记（节选）",
            author: "范仲淹",
            dynasty: "song",
            year: 1046,
            location: {
                name: "岳阳",
                lat: 29.3572,
                lng: 113.1305,
                modern_name: "岳阳"
            },
            content: `先天下之忧而忧，后天下之乐而乐。`,
            emotion: "nostalgia",
            emotion_analysis: "忧国忧民，理想抱负",
            background: "应友人之请重修岳阳楼记，表达政治理想。",
            keywords: ["岳阳楼", "忧民", "理想", "抱负"]
        },
        {
            id: 11,
            title: "钗头凤·红酥手",
            author: "陆游",
            dynasty: "song",
            year: 1155,
            location: {
                name: "绍兴",
                lat: 30.0023,
                lng: 120.5810,
                modern_name: "绍兴"
            },
            content: `红酥手，黄縢酒，满城春色宫墙柳。
东风恶，欢情薄。
一怀愁绪，几年离索。
错、错、错。
春如旧，人空瘦，泪痕红浥鲛绡透。
桃花落，闲池阁。
山盟虽在，锦书难托。
莫、莫、莫。`,
            emotion: "love",
            emotion_analysis: "爱情悲剧，痛彻心扉",
            background: "与表妹唐琬的爱情悲剧，表达对被迫分离的痛苦。",
            keywords: ["红酥手", "春色", "离别", "痛苦"]
        },
        {
            id: 12,
            title: "如梦令·常记溪亭日暮",
            author: "李清照",
            dynasty: "song",
            year: 1100,
            location: {
                name: "济南",
                lat: 36.6512,
                lng: 117.1201,
                modern_name: "济南"
            },
            content: `常记溪亭日暮，沉醉不知归路。
兴尽晚回舟，误入藕花深处。
争渡，争渡，惊起一滩鸥鹭。`,
            emotion: "joy",
            emotion_analysis: "青春欢乐，无忧无虑",
            background: "回忆青春时期的美好时光，表达对往昔的怀念。",
            keywords: ["溪亭", "沉醉", "藕花", "欢乐"]
        }
    ]
};

// 诗人信息
const poets = {
    libai: {
        name: "李白",
        dynasty: "tang",
        birth_year: 701,
        death_year: 762,
        birth_place: "剑南道绵州",
        style: "豪放派",
        representative_works: ["静夜思", "黄鹤楼送孟浩然之广陵", "将进酒"],
        description: "唐代伟大的浪漫主义诗人，被誉为'诗仙'。"
    },
    dufu: {
        name: "杜甫",
        dynasty: "tang",
        birth_year: 712,
        death_year: 770,
        birth_place: "河南巩县",
        style: "现实主义",
        representative_works: ["春望", "茅屋为秋风所破歌", "登高"],
        description: "唐代伟大的现实主义诗人，被誉为'诗圣'。"
    },
    sushi: {
        name: "苏轼",
        dynasty: "song",
        birth_year: 1037,
        death_year: 1101,
        birth_place: "眉山",
        style: "豪放派",
        representative_works: ["水调歌头", "江城子", "念奴娇"],
        description: "北宋文学家，唐宋八大家之一，豪放派词人代表。"
    },
    liqingzhao: {
        name: "李清照",
        dynasty: "song",
        birth_year: 1084,
        death_year: 1155,
        birth_place: "济南",
        style: "婉约派",
        representative_works: ["声声慢", "如梦令", "一剪梅"],
        description: "宋代女词人，婉约派代表，被誉为'千古第一才女'。"
    }
};

// 情感分类定义
const emotionTypes = {
    joy: {
        name: "喜悦",
        description: "欢乐、豁达、积极向上的情感",
        color: "#FFD700",
        examples: ["欢乐", "豁达", "积极", "开朗"]
    },
    sadness: {
        name: "忧伤",
        description: "思念、愁苦、悲伤的情感",
        color: "#4682B4", 
        examples: ["思念", "愁苦", "悲伤", "离别"]
    },
    nostalgia: {
        name: "怀古",
        description: "缅怀、感慨、怀古的情感",
        color: "#8B7355",
        examples: ["缅怀", "感慨", "怀古", "思乡"]
    },
    nature: {
        name: "自然",
        description: "山水、田园、自然景观的描绘",
        color: "#228B22",
        examples: ["山水", "田园", "自然", "风景"]
    },
    love: {
        name: "爱情", 
        description: "相思、离别、爱情主题",
        color: "#DC143C",
        examples: ["相思", "爱情", "离别", "思君"]
    }
};

// 地理区域定义
const regions = {
    central: {
        name: "中原地区",
        bounds: [[32, 110], [37, 117]],
        description: "政治文化中心，包括长安、洛阳等重要城市"
    },
    jiangnan: {
        name: "江南地区", 
        bounds: [[28, 115], [32, 122]],
        description: "文化繁荣地区，包括杭州、苏州等城市"
    },
    shandong: {
        name: "山东地区",
        bounds: [[34, 115], [38, 122]], 
        description: "齐鲁文化发源地"
    }
};

// 时间轴数据
const timeline = {
    tang: {
        start: 618,
        end: 907,
        periods: [
            { name: "初唐", start: 618, end: 712 },
            { name: "盛唐", start: 713, end: 766 },
            { name: "中唐", start: 767, end: 835 },
            { name: "晚唐", start: 836, end: 907 }
        ]
    },
    song: {
        start: 960,
        end: 1279,
        periods: [
            { name: "北宋", start: 960, end: 1127 },
            { name: "南宋", start: 1127, end: 1279 }
        ]
    }
};

// 获取所有数据
function getAllData() {
    return [...literatureData.tang, ...literatureData.song];
}

// 按朝代筛选
function getDataByDynasty(dynasty) {
    if (dynasty === 'all') return getAllData();
    return literatureData[dynasty] || [];
}

// 按情感筛选  
function getDataByEmotion(emotions) {
    const allData = getAllData();
    return allData.filter(item => emotions.includes(item.emotion));
}

// 按年代筛选
function getDataByYear(startYear, endYear) {
    const allData = getAllData();
    return allData.filter(item => item.year >= startYear && item.year <= endYear);
}

// 按诗人筛选
function getDataByPoet(poetId) {
    const allData = getAllData();
    const poetName = poets[poetId]?.name;
    return allData.filter(item => item.author === poetName);
}

// 搜索功能
function searchData(keyword) {
    const allData = getAllData();
    const lowerKeyword = keyword.toLowerCase();
    
    return allData.filter(item => 
        item.title.includes(keyword) ||
        item.author.includes(keyword) ||
        item.content.includes(keyword) ||
        item.location.name.includes(keyword) ||
        item.location.modern_name.includes(keyword) ||
        item.keywords.some(k => k.includes(keyword))
    );
} 