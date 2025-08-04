// 主应用类
class LiteratureMap {
    constructor() {
        this.map = null;
        this.markers = [];
        this.currentData = [];
        this.currentFilters = {
            dynasty: 'tang',
            emotions: ['joy', 'sadness', 'nostalgia', 'nature', 'love'],
            timeRange: [618, 1279],
            poet: null
        };
        this.isPlaying = false;
        this.playInterval = null;
        
        this.init();
    }
    
    // 初始化应用
    init() {
        this.initMap();
        this.initEventListeners();
        this.loadData();
        this.hideLoading();
    }
    
    // 初始化地图
    initMap() {
        // 创建地图实例，中心设置为中国中心位置
        this.map = L.map('map', {
            center: [35.0, 113.0],
            zoom: 5,
            minZoom: 4,
            maxZoom: 12,
            zoomControl: true
        });
        
        // 添加地图图层 - 使用古风地图样式
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            opacity: 0.8
        }).addTo(this.map);
        
        // 设置地图边界限制（中国范围）
        const chinaBounds = [[18, 73], [54, 135]];
        this.map.setMaxBounds(chinaBounds);
        
        // 添加地图样式控制
        this.addMapStyles();
    }
    
    // 添加地图样式
    addMapStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .leaflet-tile {
                filter: sepia(30%) saturate(80%) hue-rotate(15deg);
            }
        `;
        document.head.appendChild(style);
    }
    
    // 初始化事件监听器
    initEventListeners() {
        // 朝代选择
        document.querySelectorAll('input[name="dynasty"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.currentFilters.dynasty = e.target.value;
                this.updateTimeSlider();
                this.filterAndDisplay();
            });
        });
        
        // 情感筛选
        document.querySelectorAll('.emotion-filters input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateEmotionFilters();
                this.filterAndDisplay();
            });
        });
        
        // 诗人选择
        document.querySelectorAll('.poet-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const poetId = e.currentTarget.dataset.poet;
                this.togglePoetFilter(poetId);
            });
        });
        
        // 搜索功能
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        
        searchBtn.addEventListener('click', () => this.handleSearch());
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });
        
        // 时间轴控制
        const timeSlider = document.getElementById('timeSlider');
        timeSlider.addEventListener('input', (e) => {
            this.updateTimeFilter(parseInt(e.target.value));
        });
        
        // 播放控制
        document.getElementById('playBtn').addEventListener('click', () => this.playTimeline());
        document.getElementById('pauseBtn').addEventListener('click', () => this.pauseTimeline());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetTimeline());
        
        // 详情面板关闭
        document.getElementById('closeDetails').addEventListener('click', () => {
            this.hideDetailsPanel();
        });
    }
    
    // 更新时间轴范围
    updateTimeSlider() {
        const timeSlider = document.getElementById('timeSlider');
        const currentYear = document.getElementById('currentYear');
        
        if (this.currentFilters.dynasty === 'tang') {
            timeSlider.min = 618;
            timeSlider.max = 907;
            timeSlider.value = 618;
            this.currentFilters.timeRange = [618, 907];
        } else if (this.currentFilters.dynasty === 'song') {
            timeSlider.min = 960;
            timeSlider.max = 1279;
            timeSlider.value = 960;
            this.currentFilters.timeRange = [960, 1279];
        } else {
            timeSlider.min = 618;
            timeSlider.max = 1279;
            timeSlider.value = 618;
            this.currentFilters.timeRange = [618, 1279];
        }
        
        currentYear.textContent = timeSlider.value + '年';
    }
    
    // 更新情感筛选
    updateEmotionFilters() {
        const checkedEmotions = [];
        document.querySelectorAll('.emotion-filters input[type="checkbox"]:checked').forEach(checkbox => {
            checkedEmotions.push(checkbox.value);
        });
        this.currentFilters.emotions = checkedEmotions;
    }
    
    // 切换诗人筛选
    togglePoetFilter(poetId) {
        // 移除其他诗人的选中状态
        document.querySelectorAll('.poet-item').forEach(item => {
            item.classList.remove('active');
        });
        
        if (this.currentFilters.poet === poetId) {
            this.currentFilters.poet = null;
        } else {
            this.currentFilters.poet = poetId;
            document.querySelector(`[data-poet="${poetId}"]`).classList.add('active');
        }
        
        this.filterAndDisplay();
    }
    
    // 处理搜索
    handleSearch() {
        const keyword = document.getElementById('searchInput').value.trim();
        if (!keyword) {
            this.filterAndDisplay();
            return;
        }
        
        const searchResults = searchData(keyword);
        this.displayMarkers(searchResults);
        
        if (searchResults.length > 0) {
            // 定位到第一个搜索结果
            const firstResult = searchResults[0];
            this.map.setView([firstResult.location.lat, firstResult.location.lng], 8);
        }
    }
    
    // 更新时间筛选
    updateTimeFilter(year) {
        document.getElementById('currentYear').textContent = year + '年';
        
        // 筛选当前年份前后20年的数据
        const startYear = Math.max(year - 20, this.currentFilters.timeRange[0]);
        const endYear = Math.min(year + 20, this.currentFilters.timeRange[1]);
        
        const timeFilteredData = getDataByYear(startYear, endYear);
        this.displayMarkers(this.applyAllFilters(timeFilteredData));
    }
    
    // 播放时间轴
    playTimeline() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        const timeSlider = document.getElementById('timeSlider');
        const step = 10; // 每次前进10年
        
        this.playInterval = setInterval(() => {
            let currentValue = parseInt(timeSlider.value);
            currentValue += step;
            
            if (currentValue > parseInt(timeSlider.max)) {
                this.pauseTimeline();
                return;
            }
            
            timeSlider.value = currentValue;
            this.updateTimeFilter(currentValue);
        }, 800); // 每800ms更新一次
    }
    
    // 暂停时间轴
    pauseTimeline() {
        this.isPlaying = false;
        if (this.playInterval) {
            clearInterval(this.playInterval);
            this.playInterval = null;
        }
    }
    
    // 重置时间轴
    resetTimeline() {
        this.pauseTimeline();
        const timeSlider = document.getElementById('timeSlider');
        timeSlider.value = timeSlider.min;
        this.updateTimeFilter(parseInt(timeSlider.min));
    }
    
    // 加载和筛选数据
    loadData() {
        this.filterAndDisplay();
    }
    
    // 应用所有筛选条件
    applyAllFilters(data = null) {
        let filteredData = data || getDataByDynasty(this.currentFilters.dynasty);
        
        // 情感筛选
        if (this.currentFilters.emotions.length > 0) {
            filteredData = filteredData.filter(item => 
                this.currentFilters.emotions.includes(item.emotion)
            );
        }
        
        // 诗人筛选
        if (this.currentFilters.poet) {
            filteredData = getDataByPoet(this.currentFilters.poet).filter(item =>
                this.currentFilters.emotions.includes(item.emotion)
            );
        }
        
        return filteredData;
    }
    
    // 筛选并显示数据
    filterAndDisplay() {
        const filteredData = this.applyAllFilters();
        this.currentData = filteredData;
        this.displayMarkers(filteredData);
    }
    
    // 显示地图标记
    displayMarkers(data) {
        // 清除现有标记
        this.clearMarkers();
        
        // 添加新标记
        data.forEach(item => {
            const marker = this.createMarker(item);
            this.markers.push(marker);
        });
    }
    
    // 创建地图标记
    createMarker(item) {
        const color = emotionTypes[item.emotion].color;
        
        // 创建自定义图标
        const customIcon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
        
        // 创建标记
        const marker = L.marker([item.location.lat, item.location.lng], {
            icon: customIcon
        }).addTo(this.map);
        
        // 添加点击事件
        marker.on('click', () => {
            this.showPoemDetails(item);
        });
        
        // 添加悬停效果
        marker.on('mouseover', function() {
            this.getElement().style.transform = 'scale(1.2)';
        });
        
        marker.on('mouseout', function() {
            this.getElement().style.transform = 'scale(1)';
        });
        
        // 添加工具提示
        marker.bindTooltip(`
            <div style="text-align: center; font-family: 'Noto Serif SC', serif;">
                <strong>${item.title}</strong><br>
                ${item.author} · ${item.year}年<br>
                <em>${item.location.name} (${item.location.modern_name})</em>
            </div>
        `, {
            direction: 'top',
            offset: [0, -10]
        });
        
        return marker;
    }
    
    // 清除所有标记
    clearMarkers() {
        this.markers.forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.markers = [];
    }
    
    // 显示诗词详情
    showPoemDetails(item) {
        const detailsPanel = document.getElementById('detailsPanel');
        const detailsContent = document.getElementById('detailsContent');
        
        const emotionInfo = emotionTypes[item.emotion];
        const poetInfo = Object.values(poets).find(p => p.name === item.author);
        
        detailsContent.innerHTML = `
            <div class="poem-card">
                <h3 class="poem-title">${item.title}</h3>
                <div class="poem-author">${item.author} · ${item.dynasty === 'tang' ? '唐代' : '宋代'} · ${item.year}年</div>
                <div class="poem-content">${item.content}</div>
                
                <div class="poem-meta">
                    <span class="meta-tag" style="background-color: ${emotionInfo.color}">
                        ${emotionInfo.name}
                    </span>
                    <span class="meta-tag">${item.location.name}</span>
                    <span class="meta-tag">${item.location.modern_name}</span>
                </div>
            </div>
            
            <div class="analysis-section">
                <h4>情感分析</h4>
                <p><strong>情感特征：</strong>${item.emotion_analysis}</p>
                <p><strong>创作背景：</strong>${item.background}</p>
                <p><strong>关键词：</strong>${item.keywords.join('、')}</p>
            </div>
            
            ${poetInfo ? `
            <div class="poet-section">
                <h4>诗人简介</h4>
                <p><strong>${poetInfo.name}</strong> (${poetInfo.birth_year}-${poetInfo.death_year})</p>
                <p><strong>流派：</strong>${poetInfo.style}</p>
                <p><strong>简介：</strong>${poetInfo.description}</p>
                <p><strong>代表作：</strong>${poetInfo.representative_works.join('、')}</p>
            </div>
            ` : ''}
            
            <div class="location-section">
                <h4>地理信息</h4>
                <p><strong>古地名：</strong>${item.location.name}</p>
                <p><strong>现地名：</strong>${item.location.modern_name}</p>
                <p><strong>坐标：</strong>${item.location.lat.toFixed(4)}, ${item.location.lng.toFixed(4)}</p>
            </div>
        `;
        
        // 显示面板
        detailsPanel.classList.add('active');
        
        // 地图定位到该位置
        this.map.setView([item.location.lat, item.location.lng], 8);
    }
    
    // 隐藏详情面板
    hideDetailsPanel() {
        const detailsPanel = document.getElementById('detailsPanel');
        detailsPanel.classList.remove('active');
    }
    
    // 隐藏加载动画
    hideLoading() {
        setTimeout(() => {
            const loadingOverlay = document.getElementById('loadingOverlay');
            loadingOverlay.classList.add('hidden');
        }, 1500);
    }
}

// 统计分析功能
class LiteratureAnalysis {
    static getEmotionStatistics(data) {
        const emotions = {};
        data.forEach(item => {
            emotions[item.emotion] = (emotions[item.emotion] || 0) + 1;
        });
        return emotions;
    }
    
    static getLocationStatistics(data) {
        const locations = {};
        data.forEach(item => {
            const key = item.location.modern_name;
            locations[key] = (locations[key] || 0) + 1;
        });
        return locations;
    }
    
    static getTimeStatistics(data) {
        const periods = {
            early_tang: 0,   // 618-712
            peak_tang: 0,    // 713-766
            mid_tang: 0,     // 767-835
            late_tang: 0,    // 836-907
            north_song: 0,   // 960-1127
            south_song: 0    // 1127-1279
        };
        
        data.forEach(item => {
            const year = item.year;
            if (year >= 618 && year <= 712) periods.early_tang++;
            else if (year >= 713 && year <= 766) periods.peak_tang++;
            else if (year >= 767 && year <= 835) periods.mid_tang++;
            else if (year >= 836 && year <= 907) periods.late_tang++;
            else if (year >= 960 && year <= 1127) periods.north_song++;
            else if (year >= 1127 && year <= 1279) periods.south_song++;
        });
        
        return periods;
    }
}

// 工具函数
const utils = {
    // 防抖函数
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // 格式化年份显示
    formatYear(year) {
        if (year >= 618 && year <= 907) {
            return `${year}年 (唐代)`;
        } else if (year >= 960 && year <= 1279) {
            return `${year}年 (宋代)`;
        } else {
            return `${year}年`;
        }
    },
    
    // 随机颜色生成
    getRandomColor() {
        const colors = ['#FFD700', '#4682B4', '#8B7355', '#228B22', '#DC143C'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
};

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    // 创建应用实例
    window.literatureMap = new LiteratureMap();
    
    // 添加键盘快捷键
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            window.literatureMap.hideDetailsPanel();
        }
        if (e.key === ' ') {
            e.preventDefault();
            if (window.literatureMap.isPlaying) {
                window.literatureMap.pauseTimeline();
            } else {
                window.literatureMap.playTimeline();
            }
        }
    });
    
    // 添加窗口调整监听
    window.addEventListener('resize', utils.debounce(() => {
        if (window.literatureMap.map) {
            window.literatureMap.map.invalidateSize();
        }
    }, 250));
});

// 导出到全局作用域供调试使用
window.LiteratureAnalysis = LiteratureAnalysis;
window.utils = utils; 