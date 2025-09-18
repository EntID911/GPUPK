// config.js - 显卡数据和配置模块
import { autoDetectMobile } from './calculator.js';

// 新的、按品牌分类的显卡数据结构
// 只需输入型号和分数，程序会自动处理其他信息
// 可选 'type' 字段用于手动覆盖自动检测 ('desktop' | 'mobile')
const GPU_LIST = {
    nvidia: [
        { name: "RTX 5090D", timeSpy: 48732, timeSpyEx: 25485, portRoyal: 36673, steelNomad: 14133 },
        { name: "RTX 4090", timeSpy: 35856, timeSpyEx: 19481, portRoyal: 26093, steelNomad: 9230 },
        { name: "RTX 4090D", timeSpy: 34561, timeSpyEx: 18207, portRoyal: 24046, steelNomad: 8572 },
        { name: "RTX 5080", timeSpy: 32248, timeSpyEx: 16066, portRoyal: 22143, steelNomad: 8360 },
        { name: "RTX 4080 Super", timeSpy: 28545, timeSpyEx: 14253, portRoyal: 18355, steelNomad: 6580 },
        { name: "RTX 4080", timeSpy: 28178, timeSpyEx: 14041, portRoyal: 17911, steelNomad: 6545 },
        { name: "RTX 5070TI", timeSpy: 27622, timeSpyEx: 13532, portRoyal: 19201, steelNomad: 6502 },
        { name: "RTX 5090M", timeSpy: 25129, timeSpyEx: 12327, portRoyal: 17063, steelNomad: 6156 },
        { name: "RTX 4070TI Super", timeSpy: 23956, timeSpyEx: 11765, portRoyal: 15385, steelNomad: 5542 },
        { name: "RTX 5080M", timeSpy: 22791, timeSpyEx: 11060, portRoyal: 14853, steelNomad: 5207 },
        { name: "RTX 4070TI", timeSpy: 22655, timeSpyEx: 10908, portRoyal: 14033, steelNomad: 5016 },
        { name: "RTX 4090M", timeSpy: 22652, timeSpyEx: 11065, portRoyal: 14350, steelNomad: 5146 },
        { name: "RTX 5070", timeSpy: 22357, timeSpyEx: 10723, portRoyal: 14105, steelNomad: 5024 },
        { name: "RTX 3090TI", timeSpy: 21732, timeSpyEx: 11312, portRoyal: 14859, steelNomad: 5742 },
        { name: "RTX 4070 Super", timeSpy: 21212, timeSpyEx: 10138, portRoyal: 13201, steelNomad: 4618 },
        { name: "RTX 3090", timeSpy: 19928, timeSpyEx: 10286, portRoyal: 13639, steelNomad: 5141 },
        { name: "RTX 3080TI", timeSpy: 19586, timeSpyEx: 10036, portRoyal: 13240, steelNomad: 5081 },
        { name: "RTX 4080M", timeSpy: 19108, timeSpyEx: 9104, portRoyal: 11828, steelNomad: 4260 },
        { name: "RTX 3080 12GB", timeSpy: 18640, timeSpyEx: 9412, portRoyal: 12269, steelNomad: 4785 },
        { name: "RTX 5070TI M", timeSpy: 18087, timeSpyEx: 8720, portRoyal: 11613, steelNomad: 3846 },
        { name: "RTX 4070", timeSpy: 17826, timeSpyEx: 8368, portRoyal: 11123, steelNomad: 3844 },
        { name: "RTX 3080", timeSpy: 17680, timeSpyEx: 8893, portRoyal: 11583, steelNomad: 4429 },
        { name: "RTX 5060TI", timeSpy: 15856, timeSpyEx: 7245, portRoyal: 10289, steelNomad: 3455 },
        { name: "RTX 3070TI", timeSpy: 14806, timeSpyEx: 7403, portRoyal: 8863, steelNomad: 3475 },
        { name: "RTX 5070M", timeSpy: 14698, timeSpyEx: 6875, portRoyal: 9313, steelNomad: 3070 },
        { name: "RTX 2080TI", timeSpy: 14623, timeSpyEx: 7086, portRoyal: 9114, steelNomad: 3550 },
        { name: "RTX 5060", timeSpy: 14104, timeSpyEx: 6573, portRoyal: 8873, steelNomad: 3266 },
        { name: "RTX 3070", timeSpy: 13716, timeSpyEx: 6786, portRoyal: 8303, steelNomad: 3162 },
        { name: "RTX 4060TI", timeSpy: 13395, timeSpyEx: 6287, portRoyal: 8166, steelNomad: 2900 },
        { name: "RTX 3080TI M", timeSpy: 12898, timeSpyEx: 6164, portRoyal: 8077, steelNomad: 2861 },
        { name: "RTX 5060M", timeSpy: 12568, timeSpyEx: 5831, portRoyal: 7543, steelNomad: 2646 },
        { name: "RTX 4070M", timeSpy: 12503, timeSpyEx: 5698, portRoyal: 7366, steelNomad: 2700 },
        { name: "RTX 5050", timeSpy: 9954, timeSpyEx: 4607, portRoyal: 5912, steelNomad: 2303 },
        { name: "RTX 5050M", timeSpy: 10416, timeSpyEx: 0, portRoyal: 6193, steelNomad: 0 },
        { name: "RTX 3060TI", timeSpy: 12230, timeSpyEx: 5939, portRoyal: 7187, steelNomad: 2664 },
        { name: "RTX 3080M", timeSpy: 12006, timeSpyEx: 5545, portRoyal: 7203, steelNomad: 2644 },
        { name: "RTX 2080 Super", timeSpy: 11633, timeSpyEx: 5389, portRoyal: 7005, steelNomad: 2761 },
        { name: "RTX 3070TI M", timeSpy: 11343, timeSpyEx: 5506, portRoyal: 6848, steelNomad: 2572 },
        { name: "RTX 2080", timeSpy: 11097, timeSpyEx: 5157, portRoyal: 6447, steelNomad: 2603 },
        { name: "RTX 4060M", timeSpy: 10520, timeSpyEx: 4867, portRoyal: 5820, steelNomad: 2255 },
        { name: "RTX 3070M", timeSpy: 10479, timeSpyEx: 4935, portRoyal: 6251, steelNomad: 2380 },
        { name: "RTX 4060", timeSpy: 10474, timeSpyEx: 4947, portRoyal: 5999, steelNomad: 2289 },
        { name: "RTX 2070 Super", timeSpy: 10183, timeSpyEx: 4772, portRoyal: 6038, steelNomad: 2419 },
        { name: "GTX 1080TI", timeSpy: 9993, timeSpyEx: 4706, portRoyal: 2212, steelNomad: 2228 },
        { name: "RTX 2070", timeSpy: 9120, timeSpyEx: 4319, portRoyal: 5189, steelNomad: 2104 },
        { name: "RTX 2060 Super", timeSpy: 8778, timeSpyEx: 4142, portRoyal: 5071, steelNomad: 2015 },
        { name: "RTX 3060", timeSpy: 8732, timeSpyEx: 4096, portRoyal: 5141, steelNomad: 1960 },
        { name: "RTX 3060M", timeSpy: 8327, timeSpyEx: 3951, portRoyal: 4708, steelNomad: 1822 },
        { name: "RTX 4050M", timeSpy: 8213, timeSpyEx: 3819, portRoyal: 4627, steelNomad: 1789 },
        { name: "GTX 1080", timeSpy: 7597, timeSpyEx: 3441, portRoyal: 1639, steelNomad: 1626 },
        { name: "RTX 2060", timeSpy: 7429, timeSpyEx: 3515, portRoyal: 4146, steelNomad: 1723 },
        { name: "GTX 1070TI", timeSpy: 6849, timeSpyEx: 3149, portRoyal: 1506, steelNomad: 1468 },
        { name: "GTX 1660TI", timeSpy: 6371, timeSpyEx: 2884, portRoyal: 1658, steelNomad: 1305 },
        { name: "RTX 3050", timeSpy: 6184, timeSpyEx: 2825, portRoyal: 3531, steelNomad: 1327 },
        { name: "GTX 1070", timeSpy: 6093, timeSpyEx: 2847, portRoyal: 1250, steelNomad: 1339 },
        { name: "GTX 1660 Super", timeSpy: 6076, timeSpyEx: 2803, portRoyal: 1561, steelNomad: 1281 },
        { name: "GTX 1660", timeSpy: 5453, timeSpyEx: 2466, portRoyal: 1400, steelNomad: 1064 },
        { name: "GTX 1650 Super", timeSpy: 4701, timeSpyEx: 2071, portRoyal: 0, steelNomad: 1003 },
        { name: "GTX 1060 6G", timeSpy: 4203, timeSpyEx: 1918, portRoyal: 817, steelNomad: 906 },
        { name: "GTX 1060 5G", timeSpy: 3908, timeSpyEx: 1759, portRoyal: 0, steelNomad: 811 },
        { name: "GTX 1060 3G", timeSpy: 3867, timeSpyEx: 1777, portRoyal: 0, steelNomad: 159 },
        { name: "GTX 1650", timeSpy: 3551, timeSpyEx: 1595, portRoyal: 0, steelNomad: 332 },
        { name: "GTX 1050TI", timeSpy: 2355, timeSpyEx: 1095, portRoyal: 0, steelNomad: 302 },
        { name: "GTX 1630", timeSpy: 2100, timeSpyEx: 955, portRoyal: 0, steelNomad: 289 },
        { name: "GTX 1050", timeSpy: 1729, timeSpyEx: 419, portRoyal: 0, steelNomad: 123 },
        { name: "GT 1030", timeSpy: 1088, timeSpyEx: 171, portRoyal: 0, steelNomad: 32 },
    ],
    amd: [
        { name: "RX 7900XTX", timeSpy: 30379, timeSpyEx: 15222, portRoyal: 16434, steelNomad: 6885 },
        { name: "RX 9070XT", timeSpy: 29529, timeSpyEx: 14342, portRoyal: 18072, steelNomad: 7010 },
        { name: "RX 7900XT", timeSpy: 26536, timeSpyEx: 13038, portRoyal: 14099, steelNomad: 5626 },
        { name: "RX 9070", timeSpy: 26277, timeSpyEx: 12634, portRoyal: 15620, steelNomad: 5972 },
        { name: "RX 9070 GRE", timeSpy: 22748, timeSpyEx: 10636, portRoyal: 13726, steelNomad: 5274 },
        { name: "RX 7900GRE", timeSpy: 22284, timeSpyEx: 10535, portRoyal: 12334, steelNomad: 4801 },
        { name: "RX 6950XT", timeSpy: 21884, timeSpyEx: 10687, portRoyal: 10826, steelNomad: 4253 },
        { name: "RX 6900XT", timeSpy: 20640, timeSpyEx: 10028, portRoyal: 10395, steelNomad: 4119 },
        { name: "RX 7800XT", timeSpy: 20022, timeSpyEx: 9432, portRoyal: 10816, steelNomad: 4142 },
        { name: "RX 6800XT", timeSpy: 19198, timeSpyEx: 9273, portRoyal: 9535, steelNomad: 3720 },
        { name: "RX 7700XT", timeSpy: 17011, timeSpyEx: 7858, portRoyal: 9048, steelNomad: 3304 },
        { name: "RX 9060XT 16GB", timeSpy: 16413, timeSpyEx: 7489, portRoyal: 9736, steelNomad: 3764 },
        { name: "RX 6800", timeSpy: 15994, timeSpyEx: 7727, portRoyal: 7836, steelNomad: 3208 },
        { name: "RX 9060XT 8GB", timeSpy: 15744, timeSpyEx: 7234, portRoyal: 9047, steelNomad: 3525 },
        { name: "RX 6750XT", timeSpy: 13593, timeSpyEx: 6321, portRoyal: 6283, steelNomad: 2570 },
        { name: "RX 6700XT", timeSpy: 12807, timeSpyEx: 5966, portRoyal: 5977, steelNomad: 2458 },
        { name: "RX 6750GRE 12G", timeSpy: 12625, timeSpyEx: 5874, portRoyal: 6309, steelNomad: 2415 },
        { name: "RX6750GRE 10G", timeSpy: 11194, timeSpyEx: 4984, portRoyal: 5439, steelNomad: 2035 },
        { name: "RX 7600", timeSpy: 10984, timeSpyEx: 5228, portRoyal: 5651, steelNomad: 2290 },
        { name: "RX 7650 GRE", timeSpy: 10775, timeSpyEx: 5075, portRoyal: 5837, steelNomad: 2294 },
        { name: "RX 6650XT", timeSpy: 10026, timeSpyEx: 4572, portRoyal: 4658, steelNomad: 1874 },
        { name: "RX 6600XT", timeSpy: 9689, timeSpyEx: 4417, portRoyal: 4514, steelNomad: 1817 },
        { name: "RX 5700XT", timeSpy: 9422, timeSpyEx: 4396, portRoyal: 0, steelNomad: 2155 },
        { name: "RX 5700", timeSpy: 8312, timeSpyEx: 3994, portRoyal: 0, steelNomad: 1876 },
        { name: "RX 6600", timeSpy: 8093, timeSpyEx: 3716, portRoyal: 3757, steelNomad: 1504 },
        { name: "RX 5600XT", timeSpy: 7633, timeSpyEx: 3561, portRoyal: 0, steelNomad: 1669 },
        { name: "RX 6500XT", timeSpy: 4974, timeSpyEx: 2288, portRoyal: 369, steelNomad: 830 },
        { name: "RX 580", timeSpy: 4353, timeSpyEx: 1976, portRoyal: 0, steelNomad: 1003 },
        { name: "RX 580 2048SP", timeSpy: 3846, timeSpyEx: 1769, portRoyal: 0, steelNomad: 848 },
        { name: "RX 6400", timeSpy: 3584, timeSpyEx: 1659, portRoyal: 268, steelNomad: 176 },
    ],
    intel: [
        { name: "ARC B580", timeSpy: 14795, timeSpyEx: 7113, portRoyal: 7889, steelNomad: 3064 },
        { name: "ARC B570", timeSpy: 12518, timeSpyEx: 5969, portRoyal: 6722, steelNomad: 2648 },
        { name: "ARC A770", timeSpy: 12673, timeSpyEx: 6515, portRoyal: 7065, steelNomad: 2976 },
        { name: "ARC A750", timeSpy: 12260, timeSpyEx: 6109, portRoyal: 6616, steelNomad: 2605 },
        { name: "ARC A580", timeSpy: 10664, timeSpyEx: 5414, portRoyal: 5551, steelNomad: 2229 },
        { name: "ARC A380", timeSpy: 4386, timeSpyEx: 2033, portRoyal: 1573, steelNomad: 906 },
    ]
};

/**
 * 数据处理函数
 * 遍历 GPU_LIST，自动添加品牌和平台信息，生成最终的扁平化数组
 * @returns {Array} 处理后的GPU数据
 */
function processGPUData() {
    const processedData = [];
    for (const brand in GPU_LIST) {
        GPU_LIST[brand].forEach(gpu => {
            // 检查是否有手动指定的 type
            const isMobile = gpu.type ? gpu.type === 'mobile' : autoDetectMobile(gpu.name);
            
            processedData.push({
                ...gpu,
                brand: brand, // 添加品牌信息
                mobile: isMobile, // 添加平台信息
            });
        });
    }
    return processedData;
}

// 生成并导出最终的GPU数据
export const GPU_DATA = processGPUData();

// 分数类型配置
export const SCORE_TYPES = {
    timeSpy: {
        key: 'timeSpy',
        label: 'Time Spy',
        description: '2K光栅'
    },
    timeSpyEx: {
        key: 'timeSpyEx',
        label: 'Time Spy Extreme',
        description: '4K光栅'
    },
    portRoyal: {
        key: 'portRoyal',
        label: 'Port Royal',
        description: '光追'
    },
    steelNomad: {
        key: 'steelNomad',
        label: 'Steel Nomad',
        description: '4K重度光栅'
    }
};

// 筛选配置
export const FILTER_TYPES = {
    all: 'all',
    nvidia: 'nvidia',
    amd: 'amd',
    intel: 'intel',
    desktop: 'desktop',
    mobile: 'mobile'
};

// GPU品牌映射
export const GPU_BRANDS = {
    nvidia: {
        keywords: ['RTX', 'GTX', 'GT'],
        color: '#76b900'
    },
    amd: {
        keywords: ['RX'],
        color: '#ed1c24'
    },
    intel: {
        keywords: ['ARC'],
        color: '#0071c5'
    }
};

// 应用配置
export const APP_CONFIG = {
    updateDate: '2025.7.14',
    version: '0.2.0',
    maxDisplayItems: 1000, // 最大显示条目数
    animationDuration: 500, // 动画持续时间
    searchDelay: 300 // 搜索延迟
};

// 更新日志数据
export const CHANGELOG = [
    {
        date: '画饼',
        version: 'Before 0.1.0',
        changes: [
            '1.UI大改，更改美术风格',
            '2.GPU类加入更多对比项目/加入更多显卡',
            '3.CPU类',
            '4.继续完善本站'
        ]
    },
    {
        date: '2025.07.14',
        version: '0.2.0',
        changes: [
            '1.增加了更新日志',
            '2.优化站点结构',
            '3.接入了EdgeOne',
            '4.增加了三张显卡（B570，5050，5050M）',
            '5.优化了基准模式下的计算逻辑',
            '6.移除了herobrine'
        ]
    },
    {
        date: '2025.06.16',
        version: '0.1.0',
        changes: [
            '这个站点的起始点'
        ]
    }
];