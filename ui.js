// ui.js - 用户界面管理模块
import { GPU_DATA, SCORE_TYPES, FILTER_TYPES, APP_CONFIG } from './config.js';
import { 
    getScoreLabel,
    filterGPUData,
    sortGPUData,
    getMaxScore, 
    calculateScorePercentage, 
    compareGPUs, 
    calculateBenchmarkPercentages,
    calculatePercentageDiff
} from './calculator.js';

/**
 * 应用状态管理
 */
class AppState {
    constructor() {
        this.currentScoreType = 'timeSpy';
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.comparisonState = {
            left: null,
            right: null
        };
        this.benchmarkMode = false;
        this.benchmarkBase = null;
    }

    // 更新当前分数类型
    setScoreType(scoreType) {
        this.currentScoreType = scoreType;
    }

    // 更新筛选器
    setFilter(filter) {
        this.currentFilter = filter;
    }

    // 更新搜索词
    setSearchTerm(term) {
        this.searchTerm = term;
    }

    // 切换模式
    toggleMode() {
        this.benchmarkMode = !this.benchmarkMode;
        if (this.benchmarkMode) {
            // 清除对比状态
            this.comparisonState.left = null;
            this.comparisonState.right = null;
        } else {
            // 清除基准
            this.benchmarkBase = null;
        }
    }

    // 设置基准GPU
    setBenchmarkBase(gpu) {
        this.benchmarkBase = gpu;
    }

    // 添加GPU到对比
    addToComparison(gpu) {
        if (this.benchmarkMode) {
            this.setBenchmarkBase(gpu);
            return;
        }

        // 如果已经在对比中，移除它
        if (this.comparisonState.left?.name === gpu.name) {
            this.comparisonState.left = null;
            return;
        }
        if (this.comparisonState.right?.name === gpu.name) {
            this.comparisonState.right = null;
            return;
        }

        // 添加到对比
        if (!this.comparisonState.left) {
            this.comparisonState.left = gpu;
        } else if (!this.comparisonState.right) {
            this.comparisonState.right = gpu;
        }
    }

    // 清除对比
    clearComparison() {
        this.comparisonState.left = null;
        this.comparisonState.right = null;
    }

    // 获取当前状态
    getState() {
        return {
            currentScoreType: this.currentScoreType,
            currentFilter: this.currentFilter,
            searchTerm: this.searchTerm,
            comparisonState: { ...this.comparisonState },
            benchmarkMode: this.benchmarkMode,
            benchmarkBase: this.benchmarkBase
        };
    }
}

/**
 * UI渲染器
 */
class UIRenderer {
    constructor(state) {
        this.state = state;
        this.elements = this.getElements();
    }

    // 获取DOM元素
    getElements() {
        return {
            gpuList: document.getElementById('gpuList'),
            searchInput: document.getElementById('searchInput'),
            modeToggle: document.getElementById('modeToggle'),
            comparisonSection: document.getElementById('comparisonSection'),
            leftCard: document.getElementById('leftCard'),
            rightCard: document.getElementById('rightCard'),
            vsDivider: document.getElementById('vsDivider'),
            emptyComparison: document.getElementById('emptyComparison'),
            comparisonResult: document.getElementById('comparisonResult'),
            clearComparisonBtn: document.querySelector('.clear-comparison'),
            benchmarkNotice: document.getElementById('benchmarkNotice'),
            benchmarkInfo: document.getElementById('benchmarkInfo'),
            comparisonWrapper: document.querySelector('.comparison-wrapper'),
            scoreButtons: document.querySelectorAll('.score-btn'),
            filterButtons: document.querySelectorAll('.filter-btn')
        };
    }

    // 渲染GPU列表
    renderGPUList() {
        const { currentScoreType, currentFilter, searchTerm, benchmarkMode, benchmarkBase } = this.state.getState();
        
        // 筛选和排序数据
        const filteredData = filterGPUData(GPU_DATA, {
            search: searchTerm,
            filter: currentFilter
        });
        const sortedData = sortGPUData(filteredData, currentScoreType);
        
        // 基准模式下计算百分比
        let displayData = sortedData;
        let benchmarkIndex = -1;
        if (benchmarkMode && benchmarkBase) {
            displayData = calculateBenchmarkPercentages(sortedData, benchmarkBase, currentScoreType);
            // 找到基准显卡在排序后列表中的位置
            benchmarkIndex = displayData.findIndex(gpu => gpu.name === benchmarkBase.name);
        }

        // 获取最大值用于计算柱状图宽度
        const maxScore = getMaxScore(displayData, currentScoreType);

        // 清空列表
        this.elements.gpuList.innerHTML = '';

        // 渲染每个GPU
        displayData.forEach((gpu, index) => {
            const gpuElement = this.createGPUElement(gpu, index, maxScore, benchmarkIndex);
            this.elements.gpuList.appendChild(gpuElement);
        });
    }

    // 创建GPU元素
    createGPUElement(gpu, index, maxScore, benchmarkIndex = -1) {
        const { currentScoreType, comparisonState, benchmarkMode, benchmarkBase } = this.state.getState();
        const brand = gpu.brand;
        const score = gpu[currentScoreType] || 0;
        const percentage = calculateScorePercentage(score, maxScore);

        const container = document.createElement('div');
        container.className = 'gpu-item-container';
        container.setAttribute('data-gpu-name', gpu.name);

        // 检查状态类
        if (!benchmarkMode && ((comparisonState.left?.name === gpu.name) ||
            (comparisonState.right?.name === gpu.name))) {
            container.classList.add('in-comparison');
        }

        if (benchmarkMode && benchmarkBase?.name === gpu.name) {
            container.classList.add('benchmark-base');
        }

        // 构建pill类名
        let pillClass = `gpu-pill ${brand}`;
        if (benchmarkMode && benchmarkBase?.name === gpu.name) {
            pillClass += ' benchmark-base';
        }

        // 构建分数HTML
        let scoreHtml = `<span class="gpu-score-text">${score.toLocaleString()}</span>`;
        
        // 基准模式下添加百分比
        if (benchmarkMode && benchmarkBase && 'benchmarkPercentage' in gpu) {
            const diff = gpu.benchmarkPercentage;
            let percentClass = 'benchmark-percentage';
            let percentText = '';
            
            if (gpu.isBase) {
                percentClass += ' base';
                percentText = '基准 (100%)';
            } else if (index < benchmarkIndex) { // 位置在基准显卡上面（性能更好）
                percentClass += ' positive';
                percentText = `+${diff.toFixed(1)}%`;
            } else { // 位置在基准显卡下面（性能更差）
                percentClass += ' negative';
                percentText = `${diff.toFixed(1)}%`;
            }
            
            scoreHtml += `<span class="${percentClass}">${percentText}</span>`;
        }

        // 为基准显卡添加美化说明
        let baseExplanation = '';
        if (benchmarkMode && benchmarkBase && gpu.isBase) {
            baseExplanation = `
                <div class="benchmark-explanation">
                    <div class="benchmark-note-card">
                        <div class="benchmark-icon">📊</div>
                        <div class="benchmark-text">
                            <div class="benchmark-title">基准显卡</div>
                            <div class="benchmark-desc">
                                其他显卡的百分比均以此为参考<br>
                                <span class="positive-example">高于100%</span>：性能超越基准 |
                                <span class="negative-example">低于100%</span>：达到基准的百分比
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        container.innerHTML = `
            <div class="${pillClass}">
                <span class="gpu-rank">#${index + 1}</span>
                <span class="gpu-name">
                    <span>${gpu.name}</span>
                    ${gpu.mobile ? '<span class="mobile-badge">Mobile</span>' : ''}
                </span>
                ${scoreHtml}
            </div>
            <div class="gpu-bar-container">
                <div class="gpu-bar" style="width: ${percentage}%;"></div>
            </div>
            ${baseExplanation}
        `;

        // 添加点击事件
        const pill = container.querySelector('.gpu-pill');
        pill.addEventListener('click', () => this.handleGPUClick(gpu, pill));

        return container;
    }

    // 处理GPU点击
    handleGPUClick(gpu, element) {
        if (this.state.benchmarkMode) {
            this.state.setBenchmarkBase(gpu);
            this.updateBenchmarkInfo();
            this.renderGPUList();
        } else {
            // 添加飞行动画
            element.classList.add('flying');
            
            setTimeout(() => {
                this.state.addToComparison(gpu);
                this.updateComparisonDisplay();
                element.classList.remove('flying');
            }, APP_CONFIG.animationDuration);
        }
    }

    // 更新对比显示
    updateComparisonDisplay() {
        const { comparisonState } = this.state.getState();
        const { left, right } = comparisonState;

        // 显示或隐藏清除按钮
        if (left || right) {
            this.elements.clearComparisonBtn.style.display = 'block';
            this.elements.emptyComparison.style.display = 'none';
        } else {
            this.elements.clearComparisonBtn.style.display = 'none';
            this.elements.emptyComparison.style.display = 'flex';
            this.elements.comparisonResult.style.display = 'none';
        }

        // 更新左侧卡片
        if (left) {
            this.elements.leftCard.innerHTML = this.createComparisonCard(left);
            this.elements.leftCard.style.display = 'block';
            this.elements.leftCard.classList.add('show');
        } else {
            this.elements.leftCard.style.display = 'none';
            this.elements.leftCard.classList.remove('show');
        }

        // 更新右侧卡片
        if (right) {
            this.elements.rightCard.innerHTML = this.createComparisonCard(right);
            this.elements.rightCard.style.display = 'block';
            this.elements.rightCard.classList.add('show');
        } else {
            this.elements.rightCard.style.display = 'none';
            this.elements.rightCard.classList.remove('show');
        }

        // 显示或隐藏VS
        if (left && right) {
            this.elements.vsDivider.style.display = 'flex';
            this.showComparisonResult(left, right);
        } else {
            this.elements.vsDivider.style.display = 'none';
            this.elements.comparisonResult.style.display = 'none';
        }

        // 更新列表中的状态
        this.renderGPUList();
    }

    // 创建对比卡片HTML
    createComparisonCard(gpu) {
        const formatGPUName = (name) => {
            // 统一的智能换行逻辑：在第一个空格后换行
            const parts = name.split(' ');
            if (parts.length > 1) {
                return parts[0] + '<br>' + parts.slice(1).join(' ');
            }
            return name;
        };
        
        return `
            <div class="comparison-gpu-name">${formatGPUName(gpu.name)}${gpu.mobile ? '<span class="mobile-badge">Mobile</span>' : ''}</div>
            <div class="comparison-scores">
                <div class="comparison-score-item">
                    <div class="comparison-score-label">Time Spy</div>
                    <div class="comparison-score-value">${gpu.timeSpy.toLocaleString()}</div>
                </div>
                <div class="comparison-score-item">
                    <div class="comparison-score-label">Time Spy Ex</div>
                    <div class="comparison-score-value">${gpu.timeSpyEx.toLocaleString()}</div>
                </div>
                <div class="comparison-score-item">
                    <div class="comparison-score-label">Port Royal</div>
                    <div class="comparison-score-value">${gpu.portRoyal.toLocaleString()}</div>
                </div>
                <div class="comparison-score-item">
                    <div class="comparison-score-label">Steel Nomad</div>
                    <div class="comparison-score-value">${gpu.steelNomad.toLocaleString()}</div>
                </div>
            </div>
        `;
    }

    // 显示对比结果
    showComparisonResult(leftGPU, rightGPU) {
        const comparison = compareGPUs(leftGPU, rightGPU);
        let html = '';

        Object.keys(SCORE_TYPES).forEach(scoreType => {
            const result = comparison[scoreType];
            const percentage = result.percentageDiff.toFixed(1);

            html += `
                <div class="comparison-result-item">
                    <div class="comparison-result-label">${getScoreLabel(scoreType)}</div>
                    <div class="comparison-result-details">
                        <span class="comparison-result-winner">${result.winner.name}</span>
                        <span class="comparison-result-percentage">+${percentage}%</span>
                    </div>
                </div>
            `;
        });

        this.elements.comparisonResult.innerHTML = html;
        this.elements.comparisonResult.style.display = 'block';
    }

    // 更新基准信息
    updateBenchmarkInfo() {
        const { benchmarkBase, currentScoreType } = this.state.getState();
        if (benchmarkBase) {
            this.elements.benchmarkInfo.innerHTML = 
                `当前基准：${benchmarkBase.name} - ${getScoreLabel(currentScoreType)}: ${benchmarkBase[currentScoreType].toLocaleString()}`;
        } else {
            this.elements.benchmarkInfo.innerHTML = '请选择一个显卡作为基准';
        }
    }

    // 更新模式显示
    updateModeDisplay() {
        const { benchmarkMode } = this.state.getState();
        
        if (benchmarkMode) {
            this.elements.modeToggle.textContent = '标准模式';
            this.elements.comparisonSection.classList.add('disabled');
            this.elements.benchmarkNotice.style.display = 'block';
            this.elements.comparisonWrapper.style.display = 'none';
            this.updateBenchmarkInfo();
        } else {
            this.elements.modeToggle.textContent = '基准模式';
            this.elements.comparisonSection.classList.remove('disabled');
            this.elements.benchmarkNotice.style.display = 'none';
            this.elements.comparisonWrapper.style.display = 'flex';
        }
    }

    // 更新活动按钮状态
    updateActiveButtons() {
        const { currentScoreType, currentFilter } = this.state.getState();
        
        // 更新分数按钮
        this.elements.scoreButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-score') === currentScoreType);
        });

        // 更新筛选按钮
        this.elements.filterButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-filter') === currentFilter);
        });
    }
}

/**
 * 事件管理器
 */
class EventManager {
    constructor(state, renderer) {
        this.state = state;
        this.renderer = renderer;
        this.searchTimeout = null;
    }

    // 初始化事件监听
    initEventListeners() {
        this.initScoreButtons();
        this.initFilterButtons();
        this.initSearchInput();
        this.initModeToggle();
        this.initClearComparison();
    }

    // 初始化分数按钮事件
    initScoreButtons() {
        this.renderer.elements.scoreButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const scoreType = btn.getAttribute('data-score');
                this.state.setScoreType(scoreType);
                
                if (this.state.benchmarkMode && this.state.benchmarkBase) {
                    this.renderer.updateBenchmarkInfo();
                }
                
                this.renderer.updateActiveButtons();
                this.renderer.renderGPUList();
            });
        });
    }

    // 初始化筛选按钮事件
    initFilterButtons() {
        this.renderer.elements.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                this.state.setFilter(filter);
                this.renderer.updateActiveButtons();
                this.renderer.renderGPUList();
            });
        });
    }

    // 初始化搜索输入事件
    initSearchInput() {
        this.renderer.elements.searchInput.addEventListener('input', (e) => {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                this.state.setSearchTerm(e.target.value);
                this.renderer.renderGPUList();
            }, APP_CONFIG.searchDelay);
        });
    }

    // 初始化模式切换事件
    initModeToggle() {
        this.renderer.elements.modeToggle.addEventListener('click', () => {
            this.state.toggleMode();
            this.renderer.updateModeDisplay();
            this.state.clearComparison();
            this.renderer.updateComparisonDisplay();
            this.renderer.renderGPUList();
        });
    }

    // 初始化清除对比事件
    initClearComparison() {
        this.renderer.elements.clearComparisonBtn.addEventListener('click', () => {
            this.state.clearComparison();
            this.renderer.updateComparisonDisplay();
        });
    }
}

/**
 * 应用初始化和导出
 */
export class GPUBenchmarkApp {
    constructor() {
        this.state = new AppState();
        this.renderer = new UIRenderer(this.state);
        this.eventManager = new EventManager(this.state, this.renderer);
    }

    // 初始化应用
    init() {
        this.eventManager.initEventListeners();
        this.renderer.updateActiveButtons();
        this.renderer.renderGPUList();
        this.renderer.updateComparisonDisplay();
        this.renderer.updateModeDisplay();
    }

    // 导出状态（用于调试）
    getState() {
        return this.state.getState();
    }

    // 手动更新显示
    refresh() {
        this.renderer.renderGPUList();
        this.renderer.updateComparisonDisplay();
    }
}

// 全局清除对比函数（保持向后兼容）
export function clearComparison() {
    if (window.gpuApp) {
        window.gpuApp.state.clearComparison();
        window.gpuApp.renderer.updateComparisonDisplay();
    }
}