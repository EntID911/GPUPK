// calculator.js - 计算和数据处理模块
import { GPU_DATA, SCORE_TYPES } from './config.js';

/**
 * 获取分数标签
 * @param {string} scoreType - 分数类型
 * @returns {string} 标签文本
 */
export function getScoreLabel(scoreType) {
    return SCORE_TYPES[scoreType]?.label || scoreType;
}

/**
 * 获取分数描述
 * @param {string} scoreType - 分数类型
 * @returns {string} 描述文本
 */
export function getScoreDescription(scoreType) {
    return SCORE_TYPES[scoreType]?.description || '';
}

/**
 * 计算百分比差异（修复版本）
 * @param {number} value - 当前值
 * @param {number} base - 基准值
 * @returns {number} 百分比差异
 */
export function calculatePercentageDiff(value, base) {
    if (base === 0) return 0;
    
    // 统一使用相对百分比差异计算
    // 正值表示超过基准，负值表示低于基准
    return ((value - base) / base) * 100;
}

/**
 * 基准模式专用百分比计算
 * @param {number} value - 当前值
 * @param {number} base - 基准值
 * @returns {number} 相对基准的百分比
 */
export function calculateBenchmarkPercentage(value, base) {
    if (base === 0) return 0;
    
    // 基准模式：计算相对于基准的百分比
    return (value / base) * 100;
}

/**
 * 筛选GPU数据
 * @param {Array} gpuData - GPU数据数组
 * @param {Object} filters - 筛选条件
 * @returns {Array} 筛选后的数据
 */
export function filterGPUData(gpuData = GPU_DATA, filters = {}) {
    const { search = '', filter = 'all' } = filters;
    
    return gpuData.filter(gpu => {
        // 搜索筛选
        const matchesSearch = gpu.name.toLowerCase().includes(search.toLowerCase());
        
        // 品牌/类型筛选
        let matchesFilter = true;
        switch (filter) {
            case 'nvidia':
            case 'amd':
            case 'intel':
                matchesFilter = gpu.brand === filter;
                break;
            case 'desktop':
                matchesFilter = !gpu.mobile;
                break;
            case 'mobile':
                matchesFilter = gpu.mobile;
                break;
            case 'all':
            default:
                matchesFilter = true;
                break;
        }
        
        return matchesSearch && matchesFilter;
    });
}

/**
 * 排序GPU数据
 * @param {Array} gpuData - GPU数据数组
 * @param {string} scoreType - 排序依据的分数类型
 * @param {string} order - 排序方向 ('desc' | 'asc')
 * @returns {Array} 排序后的数据
 */
export function sortGPUData(gpuData, scoreType = 'timeSpy', order = 'desc') {
    return [...gpuData].sort((a, b) => {
        const scoreA = a[scoreType] || 0;
        const scoreB = b[scoreType] || 0;
        return order === 'desc' ? scoreB - scoreA : scoreA - scoreB;
    });
}

/**
 * 获取最大分数值（用于计算百分比宽度）
 * @param {Array} gpuData - GPU数据数组
 * @param {string} scoreType - 分数类型
 * @returns {number} 最大分数
 */
export function getMaxScore(gpuData, scoreType) {
    return Math.max(...gpuData.map(gpu => gpu[scoreType] || 0));
}

/**
 * 计算分数百分比（用于进度条）
 * @param {number} score - 当前分数
 * @param {number} maxScore - 最大分数
 * @returns {number} 百分比值 (0-100)
 */
export function calculateScorePercentage(score, maxScore) {
    if (maxScore === 0) return 0;
    return (score / maxScore) * 100;
}

/**
 * 比较两个GPU
 * @param {Object} gpu1 - 第一个GPU
 * @param {Object} gpu2 - 第二个GPU
 * @returns {Object} 比较结果
 */
export function compareGPUs(gpu1, gpu2) {
    const comparison = {};
    
    Object.keys(SCORE_TYPES).forEach(scoreType => {
        const score1 = gpu1[scoreType] || 0;
        const score2 = gpu2[scoreType] || 0;
        
        comparison[scoreType] = {
            gpu1Score: score1,
            gpu2Score: score2,
            winner: score1 > score2 ? gpu1 : gpu2,
            difference: Math.abs(score1 - score2),
            percentageDiff: score1 > score2 
                ? calculatePercentageDiff(score1, score2)
                : calculatePercentageDiff(score2, score1)
        };
    });
    
    return comparison;
}

/**
 * 基准模式计算（修复版本）
 * @param {Array} gpuData - GPU数据数组
 * @param {Object} baseGPU - 基准GPU
 * @param {string} scoreType - 分数类型
 * @returns {Array} 带有百分比信息的GPU数据
 */
export function calculateBenchmarkPercentages(gpuData, baseGPU, scoreType) {
    const baseScore = baseGPU[scoreType] || 0;
    
    return gpuData.map(gpu => {
        const score = gpu[scoreType] || 0;
        const benchmarkPercentage = calculateBenchmarkPercentage(score, baseScore);
        const percentageDiff = calculatePercentageDiff(score, baseScore);
        
        return {
            ...gpu,
            benchmarkPercentage: benchmarkPercentage,
            percentageDiff: percentageDiff,
            isBase: gpu.name === baseGPU.name
        };
    });
}

/**
 * 自动检测显卡是否为移动端
 * @param {string} gpuName - 显卡名称
 * @returns {boolean} 是否为移动端显卡
 */
export function autoDetectMobile(gpuName) {
    // 移动端标识符
    const mobileIndicators = {
        suffixes: ['M', 'Mobile', 'Max-Q'],
        patterns: [
            /M$/,                    // 以M结尾，如 RTX 4090M
            /Mobile$/i,              // 以Mobile结尾
            /Max-Q$/i,               // Max-Q系列
            /\s+M$/,                 // 空格+M结尾
        ],
        // 特殊情况手动配置
        exceptions: {
            'RTX 5090M': true,
            'RTX 5080M': true,
            'RTX 5070TI M': true,
            'RTX 5070M': true,
            'RTX 5060M': true,
            'RTX 5050M': true,
            'RTX 4090M': true,
            'RTX 4080M': true,
            'RTX 4070M': true,
            'RTX 4060M': true,
            'RTX 4050M': true,
            'RTX 3080TI M': true,
            'RTX 3080M': true,
            'RTX 3070TI M': true,
            'RTX 3070M': true,
            'RTX 3060M': true,
        }
    };
    
    // 1. 检查特殊情况
    if (mobileIndicators.exceptions.hasOwnProperty(gpuName)) {
        return mobileIndicators.exceptions[gpuName];
    }
    
    // 2. 检查后缀
    if (mobileIndicators.suffixes.some(suffix => gpuName.endsWith(suffix))) {
        return true;
    }
    
    // 3. 检查模式匹配
    return mobileIndicators.patterns.some(pattern => pattern.test(gpuName));
}

/**
 * 搜索建议
 * @param {string} query - 搜索查询
 * @param {Array} gpuData - GPU数据数组
 * @param {number} limit - 建议数量限制
 * @returns {Array} 搜索建议列表
 */
export function getSearchSuggestions(query, gpuData = GPU_DATA, limit = 5) {
    if (!query || query.length < 2) return [];
    
    const lowerQuery = query.toLowerCase();
    const suggestions = gpuData
        .filter(gpu => gpu.name.toLowerCase().includes(lowerQuery))
        .map(gpu => gpu.name)
        .slice(0, limit);
    
    return suggestions;
}

/**
 * 数据验证
 * @param {Object} gpu - GPU对象
 * @returns {boolean} 是否有效
 */
export function validateGPUData(gpu) {
    if (!gpu || typeof gpu !== 'object') return false;
    if (!gpu.name || typeof gpu.name !== 'string') return false;
    
    // 检查必需的分数字段
    const requiredFields = Object.keys(SCORE_TYPES);
    return requiredFields.every(field => 
        typeof gpu[field] === 'number' && gpu[field] >= 0
    );
}

/**
 * 统计信息计算
 * @param {Array} gpuData - GPU数据数组
 * @param {string} scoreType - 分数类型
 * @returns {Object} 统计信息
 */
export function calculateStatistics(gpuData, scoreType) {
    const scores = gpuData.map(gpu => gpu[scoreType] || 0).filter(score => score > 0);
    
    if (scores.length === 0) {
        return {
            count: 0,
            min: 0,
            max: 0,
            average: 0,
            median: 0
        };
    }
    
    const sortedScores = [...scores].sort((a, b) => a - b);
    const sum = scores.reduce((a, b) => a + b, 0);
    
    return {
        count: scores.length,
        min: Math.min(...scores),
        max: Math.max(...scores),
        average: sum / scores.length,
        median: sortedScores[Math.floor(sortedScores.length / 2)]
    };
}