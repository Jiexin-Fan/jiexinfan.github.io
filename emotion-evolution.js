// Tang-Song Poetry Emotion Evolution Analysis
// Main application logic

class EmotionEvolutionApp {
    constructor() {
        this.map = null;
        this.charts = {};
        this.heatmapLayer = null;
        this.markerGroup = null;
        this.isPlaying = false;
        this.currentView = 'overview';
        this.currentMapMode = 'markers';
        this.playInterval = null;
        
        // Current filters
        this.selectedPeriods = ['early-tang', 'high-tang', 'mid-tang', 'late-tang', 'north-song', 'south-song'];
        this.selectedEmotions = ['positive', 'implicit-positive', 'neutral', 'implicit-negative', 'negative'];
        this.currentPeriodIndex = 0;
        
        this.init();
    }

    async init() {
        try {
            console.log('🚀 Starting initialization...');
            this.showLoadingScreen();
            
            // Check if required data is available
            if (typeof emotionData === 'undefined') {
                throw new Error('emotionData is not defined');
            }
            if (typeof PERIODS === 'undefined') {
                throw new Error('PERIODS is not defined');
            }
            if (typeof EMOTIONS === 'undefined') {
                throw new Error('EMOTIONS is not defined');
            }
            
            console.log('✅ Data check passed');
            
            // Simulate loading time for demonstration
            await this.simulateLoading();
            console.log('✅ Loading simulation completed');
            
            this.initializeMap();
            console.log('✅ Map initialized');
            
            this.initializeCharts();
            console.log('✅ Charts initialized');
            
            this.attachEventListeners();
            console.log('✅ Event listeners attached');
            
            this.updatePeriodDisplay();
            this.updateCurrentStatistics();
            this.updateEmotionDistribution();
            this.updateTrendChart();
            this.updateRegionalChart();
            this.updateOverallTrendChart();
            
            // Wait a bit for map to be fully initialized before adding markers
            setTimeout(() => {
                this.updateMapForPeriod();
                this.updateVisualization();
                console.log('✅ UI updated');
            }, 100);
            
            this.hideLoadingScreen();
            console.log('🎉 Initialization completed successfully!');
            
        } catch (error) {
            console.error('❌ Initialization failed:', error);
            // Hide loading screen even on error
            this.hideLoadingScreen();
            // Show error message
            document.body.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: Arial, sans-serif;">
                    <div style="text-align: center; padding: 2rem; border-radius: 8px; background: #f8f9fa; border: 1px solid #dee2e6;">
                        <h2 style="color: #dc3545; margin-bottom: 1rem;">⚠️ Loading Error</h2>
                        <p style="margin-bottom: 1rem;">Failed to load the application.</p>
                        <p style="font-size: 0.9rem; color: #6c757d;">Error: ${error.message}</p>
                        <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            Reload Page
                        </button>
                    </div>
                </div>
            `;
        }
    }

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        loadingScreen.style.display = 'flex';
    }

    async simulateLoading() {
        return new Promise(resolve => {
            let progress = 0;
            const progressBar = document.getElementById('progressBar');
            
            const interval = setInterval(() => {
                progress += Math.random() * 20;
                progressBar.style.width = Math.min(progress, 100) + '%';
                
                if (progress >= 100) {
                    clearInterval(interval);
                    setTimeout(resolve, 500);
                }
            }, 200);
        });
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        loadingScreen.classList.add('hidden');
    }

    initializeMap() {
        this.map = L.map('map', {
            center: [35.0, 113.0],
            zoom: 5,
            minZoom: 4,
            maxZoom: 12
        });

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            opacity: 0.8
        }).addTo(this.map);

        // Apply classical filter
        const style = document.createElement('style');
        style.textContent = `
            .leaflet-tile {
                filter: sepia(20%) saturate(70%) hue-rotate(15deg) brightness(1.1);
            }
        `;
        document.head.appendChild(style);

        // Initialize marker group
        this.markerGroup = L.layerGroup().addTo(this.map);
        
        // Set bounds to China
        const chinaBounds = [[18, 73], [54, 135]];
        this.map.setMaxBounds(chinaBounds);

        this.updateMapLegend();
    }

    initializeCharts() {
        try {
            console.log('📊 Initializing charts...');
            this.initializePieChart();
            this.initializeTrendChart();
            this.initializeRegionalChart();
            this.initializeOverallTrendChart();
            console.log('✅ Charts initialized');
        } catch (error) {
            console.error('Error initializing charts:', error);
        }
    }

    initializePieChart() {
        const ctx = document.getElementById('emotionPieChart').getContext('2d');
        this.charts.pie = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.values(EMOTIONS).map(e => e.name),
                datasets: [{
                    data: [0, 0, 0, 0, 0],
                    backgroundColor: Object.values(EMOTIONS).map(e => e.color),
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 12,
                            font: { size: 11 }
                        }
                    }
                }
            }
        });
    }

    initializeTrendChart() {
        try {
            const ctx = document.getElementById('trendLineChart').getContext('2d');
            
            this.charts.trend = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: Object.keys(EMOTIONS).map(emotion => ({
                        label: EMOTIONS[emotion].name,
                        data: [],
                        borderColor: EMOTIONS[emotion].color,
                        backgroundColor: EMOTIONS[emotion].color + '20',
                        fill: false,
                        tension: 0.4
                    }))
                },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Percentage (%)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Year (CE)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 12,
                            font: { size: 10 }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Emotional Evolution Timeline'
                    }
                }
            }
        });
        } catch (error) {
            console.error('Error initializing trend chart:', error);
        }
    }

    initializeRegionalChart() {
        const ctx = document.getElementById('regionalBarChart').getContext('2d');
        const regionalData = emotionData.getAggregatedData().regionalEmotions;
        
        const regions = Object.keys(regionalData).slice(0, 8); // Top 8 regions
        const emotionalScores = regions.map(region => 
            regionalData[region].emotionalScore * 100
        );

        this.charts.regional = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: regions,
                datasets: [{
                    label: 'Emotional Score',
                    data: emotionalScores,
                    backgroundColor: emotionalScores.map(score => 
                        score > 0 ? '#2ECC71' : '#E74C3C'
                    ),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Emotional Score'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Regional Emotional Patterns'
                    }
                }
            }
        });
    }

    attachEventListeners() {
        // View selector
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchView(e.target.dataset.view);
            });
        });

        // Period checkboxes
        document.querySelectorAll('.period-option input').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updatePeriodFilters();
                this.updateCurrentStatistics();
                this.updateEmotionDistribution();
                this.updateTrendChart();
                this.updateRegionalChart();
                this.updateOverallTrendChart();
                this.updateMapForPeriod();
                this.updateVisualization();
            });
        });

        // Emotion checkboxes
        document.querySelectorAll('.emotion-option input').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateEmotionFilters();
                this.updateCurrentStatistics();
                this.updateEmotionDistribution();
                this.updateRegionalChart();
                this.updateOverallTrendChart();
                this.updateMapForPeriod();
                this.updateVisualization();
            });
        });

        // Period slider
        document.getElementById('periodSlider').addEventListener('input', (e) => {
            this.currentPeriodIndex = parseInt(e.target.value);
            this.updatePeriodDisplay();
            this.updateCurrentStatistics();
            this.updateEmotionDistribution();
            this.updateTrendChart();
            this.updateRegionalChart();
            this.updateOverallTrendChart();
            this.updateMapForPeriod();
            this.updateVisualization();
        });

        // Map mode selector
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchMapMode(e.target.dataset.mode);
            });
        });

        // Close overlay
        document.getElementById('closeOverlay').addEventListener('click', () => {
            this.hideDataOverlay();
        });

        // Window resize
        window.addEventListener('resize', () => {
            if (this.map) {
                this.map.invalidateSize();
            }
            Object.values(this.charts).forEach(chart => {
                chart.resize();
            });
        });
    }

    updatePeriodFilters() {
        this.selectedPeriods = [];
        document.querySelectorAll('.period-option input:checked').forEach(checkbox => {
            this.selectedPeriods.push(checkbox.value);
        });
    }

    updateEmotionFilters() {
        this.selectedEmotions = [];
        document.querySelectorAll('.emotion-option input:checked').forEach(checkbox => {
            this.selectedEmotions.push(checkbox.value);
        });
    }

    updateVisualization() {
        try {
            console.log('🔄 Updating visualization...');
            // Skip map visualization update since it's handled separately
            // this.updateMapVisualization(); // Removed to prevent clearing markers
            console.log('✅ Visualization updated (map handled separately)');
        } catch (error) {
            console.error('Error updating visualization:', error);
        }
    }

    updateStatistics() {
        const totalPoems = emotionData.getAllPoems().length;
        const filteredPoems = emotionData.getPoemsByFilter(this.selectedPeriods, this.selectedEmotions);
        const mostPrevalent = emotionData.getMostPrevalentEmotion(this.selectedPeriods);
        const trend = this.calculateEmotionalTrend();

        document.getElementById('totalPoems').textContent = totalPoems.toLocaleString();
        document.getElementById('selectedCount').textContent = filteredPoems.length.toLocaleString();
        document.getElementById('mostPrevalent').textContent = 
            `${mostPrevalent.name} (${mostPrevalent.percentage}%)`;
        
        const trendElement = document.getElementById('emotionalTrend');
        trendElement.textContent = trend.direction === 'up' ? '↗ More Positive' : '↘ More Negative';
        trendElement.className = `stat-value trend-${trend.direction}`;
    }

    updatePieChart() {
        const aggregated = emotionData.getAggregatedData();
        let emotionCounts = { positive: 0, 'implicit-positive': 0, neutral: 0, 'implicit-negative': 0, negative: 0 };

        this.selectedPeriods.forEach(period => {
            Object.keys(emotionCounts).forEach(emotion => {
                if (this.selectedEmotions.includes(emotion)) {
                    emotionCounts[emotion] += aggregated.byPeriodEmotion[period][emotion] || 0;
                }
            });
        });

        const total = Object.values(emotionCounts).reduce((sum, count) => sum + count, 0);
        const percentages = Object.values(emotionCounts).map(count => 
            total > 0 ? (count / total) * 100 : 0
        );

        this.charts.pie.data.datasets[0].data = percentages;
        this.charts.pie.update();
    }

    updateMapVisualization() {
        try {
            console.log('🗺️ Updating map visualization...');
            // Simplified map update - just clear existing layers for now
            this.clearMapLayers();
            console.log('✅ Map visualization updated');
        } catch (error) {
            console.error('Error updating map visualization:', error);
        }
    }

    showMarkers() {
        this.clearMapLayers();
        
        const filteredPoems = emotionData.getPoemsByFilter(this.selectedPeriods, this.selectedEmotions);
        const sampledPoems = this.samplePoems(filteredPoems, 500); // Limit for performance

        sampledPoems.forEach(poem => {
            const color = EMOTIONS[poem.emotion].color;
            const marker = L.circleMarker([poem.location.lat, poem.location.lng], {
                color: 'white',
                fillColor: color,
                fillOpacity: 0.7,
                radius: 5,
                weight: 1
            });

            marker.bindTooltip(`
                <strong>${poem.title}</strong><br>
                ${poem.author}<br>
                ${PERIODS[poem.period].name}<br>
                ${EMOTIONS[poem.emotion].name}
            `);

            marker.on('click', () => this.showPoemDetails(poem));
            this.markerGroup.addLayer(marker);
        });
    }

    showHeatmap() {
        this.clearMapLayers();
        
        // Create heatmap data for each emotion
        this.selectedEmotions.forEach(emotion => {
            const heatmapData = emotionData.getHeatmapData(emotion, this.selectedPeriods);
            if (heatmapData.length > 0) {
                const heatLayer = L.heatLayer(heatmapData, {
                    radius: 20,
                    blur: 15,
                    maxZoom: 10,
                    gradient: {
                        0.0: 'transparent',
                        0.5: EMOTIONS[emotion].color + '80',
                        1.0: EMOTIONS[emotion].color
                    }
                });
                this.markerGroup.addLayer(heatLayer);
            }
        });
    }

    showClusters() {
        this.clearMapLayers();
        
        const filteredPoems = emotionData.getPoemsByFilter(this.selectedPeriods, this.selectedEmotions);
        const clusters = this.clusterPoems(filteredPoems);

        clusters.forEach(cluster => {
            const totalPoems = cluster.poems.length;
            const emotionCounts = {};
            
            cluster.poems.forEach(poem => {
                emotionCounts[poem.emotion] = (emotionCounts[poem.emotion] || 0) + 1;
            });

            const dominantEmotion = Object.keys(emotionCounts).reduce((a, b) => 
                emotionCounts[a] > emotionCounts[b] ? a : b
            );

            const marker = L.circleMarker([cluster.lat, cluster.lng], {
                color: 'white',
                fillColor: EMOTIONS[dominantEmotion].color,
                fillOpacity: 0.8,
                radius: Math.min(Math.sqrt(totalPoems) * 3, 30),
                weight: 2
            });

            marker.bindTooltip(`
                <strong>${cluster.location}</strong><br>
                ${totalPoems} poems<br>
                Dominant: ${EMOTIONS[dominantEmotion].name}
            `);

            marker.on('click', () => this.showClusterDetails(cluster));
            this.markerGroup.addLayer(marker);
        });
    }

    clearMapLayers() {
        try {
            console.log('🗑️ Clearing map layers...');
            
            if (this.markerGroup) {
                console.log('🗑️ Clearing marker group...');
                this.markerGroup.clearLayers();
                console.log('✅ Marker group cleared');
            } else {
                console.warn('⚠️ Marker group not found');
            }
            
            if (this.heatmapLayer && this.map) {
                console.log('🗑️ Removing heatmap layer...');
                this.map.removeLayer(this.heatmapLayer);
                this.heatmapLayer = null;
                console.log('✅ Heatmap layer removed');
            }
            
            console.log('✅ Map layers cleared successfully');
        } catch (error) {
            console.error('❌ Error clearing map layers:', error);
        }
    }

    samplePoems(poems, maxCount) {
        if (poems.length <= maxCount) return poems;
        
        const step = Math.floor(poems.length / maxCount);
        return poems.filter((_, index) => index % step === 0);
    }

    clusterPoems(poems) {
        const clusters = {};
        
        poems.forEach(poem => {
            const key = `${Math.round(poem.location.lat * 10) / 10},${Math.round(poem.location.lng * 10) / 10}`;
            if (!clusters[key]) {
                clusters[key] = {
                    lat: poem.location.lat,
                    lng: poem.location.lng,
                    location: poem.location.modern,
                    poems: []
                };
            }
            clusters[key].poems.push(poem);
        });

        return Object.values(clusters);
    }

    switchView(view) {
        this.currentView = view;
        
        // Update button states
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        // Show different visualizations based on view
        switch (view) {
            case 'overview':
                this.showOverviewMode();
                break;
            case 'timeline':
                this.showTimelineMode();
                break;
            case 'heatmap':
                this.showHeatmapMode();
                break;
            case 'comparison':
                this.showComparisonMode();
                break;
        }
    }

    switchMapMode(mode) {
        this.currentMapMode = mode;
        
        // Update button states
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        // Update map based on mode
        if (mode === 'heatmap') {
            this.showHeatmapMode();
        } else if (mode === 'markers') {
            this.showMarkersMode();
        } else if (mode === 'clusters') {
            this.showClustersMode();
        }
        
        this.updateMapLegend();
    }

    updateMapLegend() {
        const legend = document.getElementById('mapLegend');
        
        switch (this.currentMapMode) {
            case 'markers':
                legend.innerHTML = `
                    <h4>Emotions</h4>
                    ${Object.entries(EMOTIONS).map(([key, emotion]) => 
                        `<div style="display: flex; align-items: center; margin: 0.25rem 0;">
                            <div style="width: 12px; height: 12px; background: ${emotion.color}; border-radius: 50%; margin-right: 0.5rem;"></div>
                            <span style="font-size: 0.9rem;">${emotion.name}</span>
                        </div>`
                    ).join('')}
                `;
                break;
            case 'heatmap':
                legend.innerHTML = `
                    <h4>Heat Intensity</h4>
                    <div style="background: linear-gradient(to right, transparent, #E74C3C); height: 10px; margin: 0.5rem 0;"></div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.8rem;">
                        <span>Low</span>
                        <span>High</span>
                    </div>
                `;
                break;
            case 'clusters':
                legend.innerHTML = `
                    <h4>Cluster Size</h4>
                    <div style="display: flex; align-items: center; margin: 0.25rem 0;">
                        <div style="width: 8px; height: 8px; background: #95A5A6; border-radius: 50%; margin-right: 0.5rem;"></div>
                        <span style="font-size: 0.9rem;">1-10 poems</span>
                    </div>
                    <div style="display: flex; align-items: center; margin: 0.25rem 0;">
                        <div style="width: 16px; height: 16px; background: #95A5A6; border-radius: 50%; margin-right: 0.5rem;"></div>
                        <span style="font-size: 0.9rem;">10+ poems</span>
                    </div>
                `;
                break;
        }
    }

    showOverviewMode() {
        // Default overview showing all data
        this.updateVisualization();
    }

    showTimelineMode() {
        // Show timeline mode - manual interaction only
        this.updateCurrentStatistics();
        this.updateEmotionDistribution();
        this.updateTrendChart();
        this.updateRegionalChart();
        this.updateOverallTrendChart();
        this.updateMapForPeriod();
    }

    showHeatmapMode() {
        this.switchMapMode('heatmap');
    }

    showMarkersMode() {
        // Clear existing layers and show markers
        this.clearMapLayers();
        this.updateMapForPeriod(); // This will show both markers and heatmap
    }

    showClustersMode() {
        this.clearMapLayers();
        this.showClusters();
    }

    showComparisonMode() {
        this.showDataOverlay('Period Comparison');
    }

    updatePeriodDisplay() {
        const periods = Object.keys(PERIODS);
        const currentPeriod = periods[this.currentPeriodIndex];
        const periodInfo = PERIODS[currentPeriod];
        
        document.getElementById('currentPeriod').textContent = 
            `${periodInfo.name} (${periodInfo.start}-${periodInfo.end} CE)`;
    }

    updateCurrentStatistics() {
        try {
            const periods = Object.keys(PERIODS);
            const currentPeriod = periods[this.currentPeriodIndex];
            const periodInfo = PERIODS[currentPeriod];
            
            if (!periodInfo) {
                console.warn('Period info not found for:', currentPeriod);
                return;
            }
            
            // Update period name
            const periodNameElement = document.getElementById('currentPeriodName');
            if (periodNameElement) {
                periodNameElement.textContent = periodInfo.name;
            }
            
            // Update time range
            const timeRangeElement = document.getElementById('timeRange');
            if (timeRangeElement) {
                timeRangeElement.textContent = `${periodInfo.start}-${periodInfo.end} CE`;
            }
            
            // Get data for current period only - use simplified approach for now
            const totalPoems = 3127; // Placeholder number
            const totalPoemsElement = document.getElementById('totalPoems');
            if (totalPoemsElement) {
                totalPoemsElement.textContent = totalPoems.toLocaleString();
            }
            
            // Most prevalent emotion - simplified
            const mostPrevalentElement = document.getElementById('mostPrevalent');
            if (mostPrevalentElement) {
                mostPrevalentElement.textContent = 'Positive (42%)';
            }
            
            // Emotional score - simplified
            const scoreElement = document.getElementById('emotionalScore');
            if (scoreElement) {
                scoreElement.textContent = '+0.15';
                scoreElement.className = 'stat-value trend-up';
            }
            
        } catch (error) {
            console.error('Error updating statistics:', error);
        }
    }

    updateSinglePeriodVisualization() {
        const periods = Object.keys(PERIODS);
        const currentPeriod = periods[this.currentPeriodIndex];
        
        // Temporarily override selected periods for visualization
        const originalPeriods = this.selectedPeriods;
        this.selectedPeriods = [currentPeriod];
        
        this.updateVisualization();
        
        // Restore original selection after a delay
        setTimeout(() => {
            this.selectedPeriods = originalPeriods;
        }, 100);
    }



    calculateEmotionalTrend() {
        const trend = emotionData.getEmotionalTrend();
        if (trend.length < 2) return { direction: 'neutral', change: 0 };
        
        const firstScore = trend[0].score;
        const lastScore = trend[trend.length - 1].score;
        const change = lastScore - firstScore;
        
        return {
            direction: change > 0 ? 'up' : 'down',
            change: Math.abs(change)
        };
    }

    showPoemDetails(poem) {
        this.showDataOverlay('Poem Details', `
            <div class="poem-details">
                <h3>${poem.title}</h3>
                <p><strong>Author:</strong> ${poem.author}</p>
                <p><strong>Period:</strong> ${PERIODS[poem.period].name} (${poem.year} CE)</p>
                <p><strong>Location:</strong> ${poem.location.name} (${poem.location.modern})</p>
                <p><strong>Emotion:</strong> ${EMOTIONS[poem.emotion].name}</p>
                <p><strong>Keywords:</strong> ${poem.keywords.join(', ')}</p>
            </div>
        `);
    }

    showClusterDetails(cluster) {
        const emotionCounts = {};
        cluster.poems.forEach(poem => {
            emotionCounts[poem.emotion] = (emotionCounts[poem.emotion] || 0) + 1;
        });

        const content = `
            <div class="cluster-details">
                <h3>${cluster.location}</h3>
                <p><strong>Total Poems:</strong> ${cluster.poems.length}</p>
                <h4>Emotion Distribution:</h4>
                ${Object.entries(emotionCounts).map(([emotion, count]) => 
                    `<div style="margin: 0.5rem 0;">
                        <span style="color: ${EMOTIONS[emotion].color};">■</span>
                        ${EMOTIONS[emotion].name}: ${count} (${Math.round((count / cluster.poems.length) * 100)}%)
                    </div>`
                ).join('')}
            </div>
        `;

        this.showDataOverlay('Cluster Details', content);
    }

    showDataOverlay(title, content = '') {
        const overlay = document.getElementById('dataOverlay');
        const overlayBody = document.getElementById('overlayBody');
        
        overlay.querySelector('h3').textContent = title;
        overlayBody.innerHTML = content;
        overlay.classList.add('active');
    }

    hideDataOverlay() {
        document.getElementById('dataOverlay').classList.remove('active');
    }

    // New methods for updating visualizations based on time period
    updateEmotionDistribution() {
        try {
            if (!this.charts.pie) {
                console.warn('Pie chart not initialized');
                return;
            }

            // Get current period data
            const periods = Object.keys(PERIODS);
            const currentPeriod = periods[this.currentPeriodIndex];
            
            // Sample emotion distribution data for each period
            const emotionDistributions = {
                'early-tang': [45, 23, 20, 10, 2],    // Positive, Implicit+, Neutral, Implicit-, Negative
                'high-tang': [48, 24, 16, 8, 4],
                'mid-tang': [35, 18, 22, 16, 9],
                'late-tang': [28, 15, 25, 22, 10],
                'north-song': [33, 21, 26, 15, 5],
                'south-song': [24, 16, 22, 26, 12]
            };

            const currentData = emotionDistributions[currentPeriod] || [20, 20, 20, 20, 20];
            
            // Update pie chart data
            this.charts.pie.data.datasets[0].data = currentData;
            this.charts.pie.update('active');
            
            console.log(`✅ Updated emotion distribution for ${currentPeriod}`);
        } catch (error) {
            console.error('Error updating emotion distribution:', error);
        }
    }

    updateTrendChart() {
        try {
            if (!this.charts.trend) {
                console.warn('Trend chart not initialized');
                return;
            }

            // Get current period and create timeline around it
            const periods = Object.keys(PERIODS);
            const currentPeriod = periods[this.currentPeriodIndex];
            const periodInfo = PERIODS[currentPeriod];
            
            // Create timeline labels spanning the current period
            const startYear = periodInfo.start;
            const endYear = periodInfo.end;
            const yearStep = Math.max(5, Math.floor((endYear - startYear) / 8)); // Show ~8 data points
            
            const labels = [];
            const datasets = {};
            
            // Initialize datasets for each emotion
            Object.keys(EMOTIONS).forEach(emotion => {
                datasets[emotion] = [];
            });
            
            // Generate sample trend data for the period
            for (let year = startYear; year <= endYear; year += yearStep) {
                labels.push(year);
                
                // Generate realistic trend data based on period characteristics
                const periodTrends = this.generatePeriodTrends(currentPeriod, year, startYear, endYear);
                Object.keys(EMOTIONS).forEach(emotion => {
                    datasets[emotion].push(periodTrends[emotion]);
                });
            }
            
            // Update chart data
            this.charts.trend.data.labels = labels;
            this.charts.trend.data.datasets.forEach((dataset, index) => {
                const emotion = Object.keys(EMOTIONS)[index];
                dataset.data = datasets[emotion];
            });
            
            this.charts.trend.update('active');
            
            console.log(`✅ Updated trend chart for ${currentPeriod} (${startYear}-${endYear})`);
        } catch (error) {
            console.error('Error updating trend chart:', error);
        }
    }

    generatePeriodTrends(period, year, startYear, endYear) {
        // Generate realistic emotion trends based on historical context
        const periodProgress = (year - startYear) / (endYear - startYear); // 0 to 1
        
        const baseTrends = {
            'early-tang': {
                positive: 40 + Math.sin(periodProgress * Math.PI) * 8,
                'implicit-positive': 20 + Math.cos(periodProgress * Math.PI) * 5,
                neutral: 22 - Math.sin(periodProgress * Math.PI * 2) * 3,
                'implicit-negative': 12 - Math.sin(periodProgress * Math.PI) * 4,
                negative: 6 - Math.cos(periodProgress * Math.PI) * 2
            },
            'high-tang': {
                positive: 45 + Math.sin(periodProgress * Math.PI * 1.5) * 6,
                'implicit-positive': 22 + Math.cos(periodProgress * Math.PI) * 4,
                neutral: 18 - Math.sin(periodProgress * Math.PI) * 2,
                'implicit-negative': 10 - Math.sin(periodProgress * Math.PI) * 3,
                negative: 5 - Math.cos(periodProgress * Math.PI * 2) * 1
            },
            'mid-tang': {
                positive: 30 - periodProgress * 8 + Math.sin(periodProgress * Math.PI * 3) * 4,
                'implicit-positive': 18 - periodProgress * 3,
                neutral: 25 + periodProgress * 5,
                'implicit-negative': 18 + periodProgress * 4,
                negative: 9 + periodProgress * 2
            },
            'late-tang': {
                positive: 25 - Math.sin(periodProgress * Math.PI) * 5,
                'implicit-positive': 15 - periodProgress * 2,
                neutral: 28 + Math.cos(periodProgress * Math.PI) * 3,
                'implicit-negative': 22 + periodProgress * 3,
                negative: 10 + periodProgress * 2
            },
            'north-song': {
                positive: 30 + Math.sin(periodProgress * Math.PI * 0.5) * 6,
                'implicit-positive': 20 + Math.cos(periodProgress * Math.PI) * 3,
                neutral: 28 - Math.sin(periodProgress * Math.PI) * 4,
                'implicit-negative': 16 - Math.cos(periodProgress * Math.PI) * 2,
                negative: 6 + Math.sin(periodProgress * Math.PI * 2) * 1
            },
            'south-song': {
                positive: 20 + Math.sin(periodProgress * Math.PI) * 4,
                'implicit-positive': 16 - periodProgress * 2,
                neutral: 24 + Math.cos(periodProgress * Math.PI) * 2,
                'implicit-negative': 28 - Math.sin(periodProgress * Math.PI) * 3,
                negative: 12 + periodProgress * 2
            }
        };
        
        return baseTrends[period] || {
            positive: 25, 'implicit-positive': 20, neutral: 25, 'implicit-negative': 20, negative: 10
        };
    }

    updateMapForPeriod() {
        try {
            console.log('🗺️ Updating map for current period...');
            
            // Check if map and markerGroup exist
            if (!this.map) {
                console.error('❌ Map not initialized!');
                return;
            }
            
            if (!this.markerGroup) {
                console.error('❌ Marker group not initialized!');
                return;
            }
            
            // Clear existing layers
            this.clearMapLayers();
            
            // Get current period
            const periods = Object.keys(PERIODS);
            const currentPeriod = periods[this.currentPeriodIndex];
            const periodInfo = PERIODS[currentPeriod];
            
            console.log(`📍 Current period: ${currentPeriod} (${periodInfo.name})`);
            
            // Different locations for different periods
            const periodLocations = {
                'early-tang': [
                    { name: "Chang'an", lat: 34.3416, lng: 108.9398, emotion: 'positive' },
                    { name: "Luoyang", lat: 34.6197, lng: 112.4540, emotion: 'implicit-positive' },
                    { name: "Taiyuan", lat: 37.8706, lng: 112.5489, emotion: 'positive' },
                    { name: "Yangzhou", lat: 32.3945, lng: 119.4129, emotion: 'neutral' }
                ],
                'high-tang': [
                    { name: "Chang'an", lat: 34.3416, lng: 108.9398, emotion: 'positive' },
                    { name: "Luoyang", lat: 34.6197, lng: 112.4540, emotion: 'positive' },
                    { name: "Yangzhou", lat: 32.3945, lng: 119.4129, emotion: 'implicit-positive' },
                    { name: "Guangzhou", lat: 23.1291, lng: 113.2644, emotion: 'neutral' }
                ],
                'mid-tang': [
                    { name: "Chang'an", lat: 34.3416, lng: 108.9398, emotion: 'neutral' },
                    { name: "Luoyang", lat: 34.6197, lng: 112.4540, emotion: 'implicit-negative' },
                    { name: "Suzhou", lat: 31.2989, lng: 120.5853, emotion: 'positive' },
                    { name: "Chengdu", lat: 30.5728, lng: 104.0668, emotion: 'implicit-positive' }
                ],
                'late-tang': [
                    { name: "Luoyang", lat: 34.6197, lng: 112.4540, emotion: 'negative' },
                    { name: "Suzhou", lat: 31.2989, lng: 120.5853, emotion: 'implicit-negative' },
                    { name: "Hangzhou", lat: 30.2741, lng: 120.1551, emotion: 'neutral' },
                    { name: "Fuzhou", lat: 26.0745, lng: 119.2965, emotion: 'negative' }
                ],
                'north-song': [
                    { name: "Kaifeng", lat: 34.7986, lng: 114.3074, emotion: 'positive' },
                    { name: "Luoyang", lat: 34.6197, lng: 112.4540, emotion: 'implicit-positive' },
                    { name: "Hangzhou", lat: 30.2741, lng: 120.1551, emotion: 'positive' },
                    { name: "Suzhou", lat: 31.2989, lng: 120.5853, emotion: 'implicit-positive' }
                ],
                'south-song': [
                    { name: "Hangzhou", lat: 30.2741, lng: 120.1551, emotion: 'implicit-negative' },
                    { name: "Suzhou", lat: 31.2989, lng: 120.5853, emotion: 'neutral' },
                    { name: "Fuzhou", lat: 26.0745, lng: 119.2965, emotion: 'negative' },
                    { name: "Guangzhou", lat: 23.1291, lng: 113.2644, emotion: 'implicit-negative' }
                ]
            };
            
            const locations = periodLocations[currentPeriod] || periodLocations['early-tang'];
            console.log(`📍 Found ${locations.length} locations for ${currentPeriod}`);
            
            // Generate heatmap data for current period
            const heatmapData = this.generateHeatmapDataForPeriod(currentPeriod, locations);
            console.log(`🔥 Generated ${heatmapData.length} heatmap points for ${currentPeriod}`);
            
            // Add heatmap layer
            if (heatmapData.length > 0) {
                this.heatmapLayer = L.heatLayer(heatmapData, {
                    radius: 25,
                    blur: 20,
                    maxZoom: 12,
                    gradient: {
                        0.0: 'transparent',
                        0.2: '#3498DB20',
                        0.4: '#2ECC7140',
                        0.6: '#F39C1260',
                        0.8: '#E74C3C80',
                        1.0: '#E74C3C'
                    }
                });
                this.heatmapLayer.addTo(this.map);
                console.log('🔥 Heatmap layer added successfully');
            }
            
            // Add markers based on period
            locations.forEach((location, index) => {
                const color = EMOTIONS[location.emotion].color;
                console.log(`📍 Adding marker ${index + 1}: ${location.name} at [${location.lat}, ${location.lng}] with color ${color}`);
                
                const marker = L.circleMarker([location.lat, location.lng], {
                    color: 'white',
                    fillColor: color,
                    fillOpacity: 0.8,
                    radius: 15,
                    weight: 2
                });
                
                marker.bindTooltip(`
                    <strong>${location.name}</strong><br/>
                    Period: ${periodInfo.name}<br/>
                    Emotion: ${EMOTIONS[location.emotion].name}
                `);
                
                marker.addTo(this.markerGroup);
                console.log(`✅ Marker ${location.name} added successfully`);
            });
            
            // Force map refresh
            this.map.invalidateSize();
            
            console.log(`✅ Updated map with ${locations.length} markers and heatmap for ${currentPeriod}`);
            
            // Update map legend
            this.updateMapLegend();
        } catch (error) {
            console.error('❌ Error updating map for period:', error);
        }
    }

    generateHeatmapDataForPeriod(period, locations) {
        const heatmapData = [];
        
        // Emotion intensity mapping for different periods
        const periodIntensities = {
            'early-tang': {
                'positive': 0.8,
                'implicit-positive': 0.6,
                'neutral': 0.4,
                'implicit-negative': 0.3,
                'negative': 0.2
            },
            'high-tang': {
                'positive': 1.0,
                'implicit-positive': 0.7,
                'neutral': 0.3,
                'implicit-negative': 0.2,
                'negative': 0.1
            },
            'mid-tang': {
                'positive': 0.6,
                'implicit-positive': 0.5,
                'neutral': 0.6,
                'implicit-negative': 0.5,
                'negative': 0.4
            },
            'late-tang': {
                'positive': 0.4,
                'implicit-positive': 0.3,
                'neutral': 0.7,
                'implicit-negative': 0.8,
                'negative': 0.9
            },
            'north-song': {
                'positive': 0.7,
                'implicit-positive': 0.6,
                'neutral': 0.5,
                'implicit-negative': 0.4,
                'negative': 0.2
            },
            'south-song': {
                'positive': 0.3,
                'implicit-positive': 0.4,
                'neutral': 0.6,
                'implicit-negative': 0.8,
                'negative': 0.7
            }
        };
        
        const intensities = periodIntensities[period] || periodIntensities['early-tang'];
        
        // Generate heatmap points around each location
        locations.forEach(location => {
            const baseIntensity = intensities[location.emotion];
            
            // Add main point
            heatmapData.push([
                location.lat,
                location.lng,
                baseIntensity
            ]);
            
            // Add surrounding points to create heat spread
            const spreadPoints = 8; // Number of surrounding points
            const spreadRadius = 0.5; // Degrees of spread
            
            for (let i = 0; i < spreadPoints; i++) {
                const angle = (i / spreadPoints) * 2 * Math.PI;
                const distance = spreadRadius * (0.3 + Math.random() * 0.7);
                
                const latOffset = Math.cos(angle) * distance;
                const lngOffset = Math.sin(angle) * distance;
                
                const intensity = baseIntensity * (0.3 + Math.random() * 0.4);
                
                heatmapData.push([
                    location.lat + latOffset,
                    location.lng + lngOffset,
                    intensity
                ]);
            }
            
            // Add some random points in the broader region
            const randomPoints = 5;
            for (let i = 0; i < randomPoints; i++) {
                const latOffset = (Math.random() - 0.5) * 2;
                const lngOffset = (Math.random() - 0.5) * 2;
                const intensity = baseIntensity * (0.1 + Math.random() * 0.3);
                
                heatmapData.push([
                    location.lat + latOffset,
                    location.lng + lngOffset,
                    intensity
                ]);
            }
        });
        
        return heatmapData;
    }

    updateMapLegend() {
        try {
            const legendContainer = document.getElementById('mapLegend');
            if (!legendContainer) return;
            
            const periods = Object.keys(PERIODS);
            const currentPeriod = periods[this.currentPeriodIndex];
            const periodInfo = PERIODS[currentPeriod];
            
            legendContainer.innerHTML = `
                <div style="background: white; padding: 10px; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <h4 style="margin: 0 0 8px 0; font-size: 0.9rem; color: #2C3E50;">Current Period</h4>
                    <div style="font-weight: 600; color: #9B59B6; margin-bottom: 8px;">${periodInfo.name}</div>
                    <div style="font-size: 0.8rem; color: #7F8C8D; margin-bottom: 8px;">${periodInfo.start}-${periodInfo.end} CE</div>
                    
                    <h5 style="margin: 8px 0 4px 0; font-size: 0.8rem; color: #2C3E50;">Heatmap Intensity</h5>
                    <div style="background: linear-gradient(to right, transparent, #3498DB20, #2ECC7140, #F39C1260, #E74C3C80, #E74C3C); height: 8px; border-radius: 4px; margin: 4px 0;"></div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.7rem; color: #7F8C8D;">
                        <span>Low</span>
                        <span>High</span>
                    </div>
                    
                    <h5 style="margin: 12px 0 4px 0; font-size: 0.8rem; color: #2C3E50;">Emotions</h5>
                    ${Object.entries(EMOTIONS).map(([key, emotion]) => `
                        <div style="display: flex; align-items: center; margin: 2px 0; font-size: 0.75rem;">
                            <div style="width: 12px; height: 12px; background: ${emotion.color}; border-radius: 50%; margin-right: 6px;"></div>
                            ${emotion.name}
                        </div>
                    `).join('')}
                    
                    <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #ECF0F1; font-size: 0.7rem; color: #7F8C8D;">
                        <div>🔥 Heatmap shows emotional intensity</div>
                        <div>📍 Markers show specific locations</div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error updating map legend:', error);
        }
    }

    initializeRegionalChart() {
        try {
            const ctx = document.getElementById('regionalBarChart').getContext('2d');
            
            this.charts.regional = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Emotional Score',
                        data: [],
                        backgroundColor: [
                            '#3498DB', '#2ECC71', '#F39C12', '#9B59B6', 
                            '#E74C3C', '#1ABC9C', '#34495E', '#F1C40F'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                            text: 'Regional Emotional Patterns'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            min: -50,
                            max: 50,
                            title: {
                                display: true,
                                text: 'Emotional Score'
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error initializing regional chart:', error);
        }
    }

    updateRegionalChart() {
        try {
            if (!this.charts.regional) {
                console.warn('Regional chart not initialized');
                return;
            }

            // Get current period
            const periods = Object.keys(PERIODS);
            const currentPeriod = periods[this.currentPeriodIndex];
            
            // Sample regional data for each period
            const regionalData = {
                'early-tang': {
                    labels: ["Chang'an", "Luoyang", "Taiyuan", "Yangzhou"],
                    scores: [35, 25, 15, 20]
                },
                'high-tang': {
                    labels: ["Chang'an", "Luoyang", "Yangzhou", "Guangzhou"],
                    scores: [42, 38, 28, 22]
                },
                'mid-tang': {
                    labels: ["Chang'an", "Luoyang", "Suzhou", "Chengdu"],
                    scores: [20, 15, 25, 18]
                },
                'late-tang': {
                    labels: ["Luoyang", "Suzhou", "Hangzhou", "Fuzhou"],
                    scores: [10, 18, 12, 8]
                },
                'north-song': {
                    labels: ["Kaifeng", "Luoyang", "Hangzhou", "Suzhou"],
                    scores: [25, 20, 30, 28]
                },
                'south-song': {
                    labels: ["Hangzhou", "Suzhou", "Fuzhou", "Guangzhou"],
                    scores: [15, 18, 10, 12]
                }
            };

            const currentData = regionalData[currentPeriod] || {
                labels: ["Region 1", "Region 2", "Region 3"],
                scores: [10, 15, 8]
            };
            
            // Update chart data
            this.charts.regional.data.labels = currentData.labels;
            this.charts.regional.data.datasets[0].data = currentData.scores;
            this.charts.regional.update('active');
            
            console.log(`✅ Updated regional chart for ${currentPeriod}`);
        } catch (error) {
            console.error('Error updating regional chart:', error);
        }
    }

    initializeOverallTrendChart() {
        try {
            const ctx = document.getElementById('overallTrendChart').getContext('2d');
            
            // Create timeline spanning all periods
            const allYears = [];
            const allPeriods = Object.keys(PERIODS);
            
            allPeriods.forEach(period => {
                const periodInfo = PERIODS[period];
                const yearStep = Math.max(10, Math.floor((periodInfo.end - periodInfo.start) / 5));
                for (let year = periodInfo.start; year <= periodInfo.end; year += yearStep) {
                    allYears.push(year);
                }
            });
            
            this.charts.overall = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: allYears,
                    datasets: Object.keys(EMOTIONS).map(emotion => ({
                        label: EMOTIONS[emotion].name,
                        data: allYears.map(year => this.getOverallEmotionValue(emotion, year)),
                        borderColor: EMOTIONS[emotion].color,
                        backgroundColor: EMOTIONS[emotion].color + '20',
                        fill: false,
                        tension: 0.3,
                        borderWidth: 2
                    }))
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                boxWidth: 12,
                                font: { size: 11 }
                            }
                        },
                        title: {
                            display: true,
                            text: '661 Years of Emotional Evolution (618-1279 CE)',
                            font: { size: 14, weight: 'bold' }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            title: {
                                display: true,
                                text: 'Percentage (%)'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Year (CE)'
                            },
                            ticks: {
                                maxTicksLimit: 15
                            }
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error initializing overall trend chart:', error);
        }
    }

    getOverallEmotionValue(emotion, year) {
        // Find which period this year belongs to
        const period = this.getPeriodForYear(year);
        if (!period) return 20; // Default value
        
        const periodProgress = this.getYearProgressInPeriod(year, period);
        const baseTrends = this.generatePeriodTrends(period, year, PERIODS[period].start, PERIODS[period].end);
        
        return baseTrends[emotion] || 20;
    }

    getPeriodForYear(year) {
        const periods = Object.keys(PERIODS);
        for (const period of periods) {
            const periodInfo = PERIODS[period];
            if (year >= periodInfo.start && year <= periodInfo.end) {
                return period;
            }
        }
        return null;
    }

    getYearProgressInPeriod(year, period) {
        const periodInfo = PERIODS[period];
        return (year - periodInfo.start) / (periodInfo.end - periodInfo.start);
    }

    updateOverallTrendChart() {
        try {
            if (!this.charts.overall) {
                console.warn('Overall trend chart not initialized');
                return;
            }

            // Highlight current period in the overall chart
            const periods = Object.keys(PERIODS);
            const currentPeriod = periods[this.currentPeriodIndex];
            const periodInfo = PERIODS[currentPeriod];
            
            // Update chart to highlight current period
            this.charts.overall.data.datasets.forEach((dataset, index) => {
                const emotion = Object.keys(EMOTIONS)[index];
                dataset.data = this.charts.overall.data.labels.map(year => {
                    const value = this.getOverallEmotionValue(emotion, year);
                    // Highlight current period with thicker line
                    if (year >= periodInfo.start && year <= periodInfo.end) {
                        dataset.borderWidth = 3;
                    } else {
                        dataset.borderWidth = 1;
                    }
                    return value;
                });
            });
            
            this.charts.overall.update('active');
            
            console.log(`✅ Updated overall trend chart highlighting ${currentPeriod}`);
        } catch (error) {
            console.error('Error updating overall trend chart:', error);
        }
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.emotionApp = new EmotionEvolutionApp();
});

// Export for debugging
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmotionEvolutionApp;
} 