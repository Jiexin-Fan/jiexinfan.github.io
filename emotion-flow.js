// Emotion Flow Visualization Application
// Advanced D3.js-based visualization for literary sentiment analysis

class EmotionFlowApp {
    constructor() {
        this.currentView = 'flow';
        this.selectedRegions = ['north-china', 'south-china', 'central-china', 'west-china'];
        this.animationSpeed = 1000;
        this.timeGranularity = 'decade';
        this.isAnimating = false;
        this.animationFrame = 0;
        this.currentTimePosition = 0;
        
        // Visualization containers
        this.flowChart = null;
        this.heatmapChart = null;
        this.historicalMap = null;
        this.trendChart = null;
        this.correlationMatrix = null;
        
        this.init();
    }

    async init() {
        this.showLoadingScreen();
        
        // Simulate data processing time
        await this.simulateDataLoading();
        
        this.initializeVisualizationContainers();
        this.setupEventListeners();
        this.initializeDefaultView();
        this.updateLegend();
        this.updateStatistics();
        
        this.hideLoadingScreen();
    }

    async simulateDataLoading() {
        return new Promise(resolve => {
            setTimeout(resolve, 2000);
        });
    }

    showLoadingScreen() {
        document.getElementById('loadingScreen').style.display = 'flex';
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        loadingScreen.classList.add('hidden');
    }

    initializeVisualizationContainers() {
        // Set up SVG dimensions
        const containerWidth = document.querySelector('.visualization-area').clientWidth - 80;
        const containerHeight = 600;
        
        // Initialize flow chart
        this.flowChart = d3.select('#flowChart')
            .attr('width', containerWidth)
            .attr('height', containerHeight);
            
        // Initialize heatmap chart
        this.heatmapChart = d3.select('#heatmapChart')
            .attr('width', containerWidth)
            .attr('height', 500);
            
        // Initialize correlation matrix
        this.correlationMatrix = d3.select('#correlationMatrix')
            .attr('width', containerWidth)
            .attr('height', 250);
            
        // Initialize historical map
        this.initializeHistoricalMap();
        
        // Initialize trend chart
        this.initializeTrendChart();
    }

    setupEventListeners() {
        // View switcher
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchView(e.target.dataset.view);
            });
        });

        // Animation controls
        document.getElementById('playAnimation').addEventListener('click', () => {
            this.startAnimation();
        });
        
        document.getElementById('pauseAnimation').addEventListener('click', () => {
            this.pauseAnimation();
        });
        
        document.getElementById('resetAnimation').addEventListener('click', () => {
            this.resetAnimation();
        });

        // Control inputs
        document.getElementById('animationSpeed').addEventListener('change', (e) => {
            this.animationSpeed = parseInt(e.target.value);
        });
        
        document.getElementById('timeGranularity').addEventListener('change', (e) => {
            this.timeGranularity = e.target.value;
            this.updateAllData();
            this.updateCurrentView();
        });

        // Region checkboxes
        document.querySelectorAll('.region-option input').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateRegionFilters();
                this.updateAllData();
                this.updateCurrentView();
            });
        });

        // Timeline scrubber
        document.getElementById('timelineScrubber').addEventListener('input', (e) => {
            this.currentTimePosition = parseInt(e.target.value);
            this.updateTimelineDisplay();
            this.updateCurrentView();
        });

        // Historical map period selector
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchHistoricalMapPeriod(e.target.dataset.period);
            });
        });
    }

    switchView(view) {
        this.currentView = view;
        
        // Update button states
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        // Hide all views
        document.querySelectorAll('.view-container').forEach(container => {
            container.classList.add('hidden');
        });

        // Show selected view
        document.getElementById(`${view}View`).classList.remove('hidden');
        
        this.updateCurrentView();
    }

    updateCurrentView() {
        // Update all data based on current time position
        this.updateAllData();
        
        switch (this.currentView) {
            case 'flow':
                this.renderFlowChart();
                break;
            case 'heatmap':
                this.renderHeatmapChart();
                break;
            case 'historical-map':
                this.renderHistoricalMap();
                break;
            case 'trends':
                this.renderTrendAnalysis();
                break;
        }
    }

    initializeDefaultView() {
        this.updateAllData(); // Initialize all data displays
        this.renderFlowChart();
    }

    // Flow Chart (Sankey/Alluvial Diagram)
    renderFlowChart() {
        const filteredData = this.getFilteredData();
        const flowData = this.generateFlowDataFromFiltered(filteredData);
        const width = parseInt(this.flowChart.attr('width'));
        const height = parseInt(this.flowChart.attr('height'));
        
        // Clear previous chart
        this.flowChart.selectAll('*').remove();
        
        // Set up Sankey layout
        const sankey = d3.sankey()
            .nodeWidth(15)
            .nodePadding(10)
            .extent([[1, 1], [width - 1, height - 6]]);
            
        const { nodes, links } = sankey({
            nodes: flowData.nodes.map(d => Object.assign({}, d)),
            links: flowData.links.map(d => Object.assign({}, d))
        });

        // Create groups
        const linkGroup = this.flowChart.append('g').attr('class', 'links');
        const nodeGroup = this.flowChart.append('g').attr('class', 'nodes');

        // Draw links
        linkGroup.selectAll('path')
            .data(links)
            .enter()
            .append('path')
            .attr('class', 'flow-path')
            .attr('d', d3.sankeyLinkHorizontal())
            .attr('stroke', d => d.color)
            .attr('stroke-width', d => Math.max(1, d.width))
            .style('mix-blend-mode', 'multiply')
            .on('mouseover', function(event, d) {
                d3.select(this).attr('stroke-opacity', 1);
                // Show tooltip
                const tooltip = d3.select('body').append('div')
                    .attr('class', 'tooltip')
                    .style('opacity', 0);
                    
                tooltip.transition().duration(200).style('opacity', .9);
                tooltip.html(`
                    <strong>${d.source.name} → ${d.target.name}</strong><br/>
                    Poems: ${d.value.toLocaleString()}
                `)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', function() {
                d3.select(this).attr('stroke-opacity', 0.7);
                d3.selectAll('.tooltip').remove();
            });

        // Draw nodes
        const node = nodeGroup.selectAll('rect')
            .data(nodes)
            .enter()
            .append('g')
            .attr('class', 'flow-node');

        node.append('rect')
            .attr('x', d => d.x0)
            .attr('y', d => d.y0)
            .attr('height', d => d.y1 - d.y0)
            .attr('width', d => d.x1 - d.x0)
            .attr('fill', d => d.color)
            .attr('stroke', '#fff')
            .attr('stroke-width', 1);

        // Add labels
        node.append('text')
            .attr('class', 'flow-label')
            .attr('x', d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
            .attr('y', d => (d.y1 + d.y0) / 2)
            .attr('dy', '0.35em')
            .attr('text-anchor', d => d.x0 < width / 2 ? 'start' : 'end')
            .text(d => d.name)
            .style('font-size', '12px')
            .style('font-weight', '500');

        // Add animation
        this.flowChart.selectAll('.flow-path')
            .style('stroke-dasharray', '5,5')
            .style('stroke-dashoffset', 0)
            .transition()
            .duration(2000)
            .style('stroke-dashoffset', -10);
    }

    // Heatmap Chart (Temporal-Spatial Matrix)
    renderHeatmapChart() {
        const filteredData = this.getFilteredData();
        const heatmapData = this.generateHeatmapDataFromFiltered(filteredData);
        const width = parseInt(this.heatmapChart.attr('width'));
        const height = parseInt(this.heatmapChart.attr('height'));
        
        // Clear previous chart
        this.heatmapChart.selectAll('*').remove();
        
        // Set up dimensions
        const margin = { top: 50, right: 100, bottom: 100, left: 120 };
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;
        
        // Get unique years and regions
        const years = [...new Set(heatmapData.map(d => d.year))].sort((a, b) => a - b);
        const regions = Object.keys(REGIONS);
        
        // Set up scales
        const xScale = d3.scaleBand()
            .domain(years)
            .range([0, chartWidth])
            .padding(0.1);
            
        const yScale = d3.scaleBand()
            .domain(regions.map(r => REGIONS[r].name))
            .range([0, chartHeight])
            .padding(0.1);
            
        const colorScale = d3.scaleSequential(d3.interpolateRdYlBu)
            .domain([-1, 1]); // Emotional score range
            
        // Create main group
        const g = this.heatmapChart.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
            
        // Add cells
        g.selectAll('.heatmap-cell')
            .data(heatmapData)
            .enter()
            .append('rect')
            .attr('class', 'heatmap-cell')
            .attr('x', d => xScale(d.year))
            .attr('y', d => yScale(d.regionName))
            .attr('width', xScale.bandwidth())
            .attr('height', yScale.bandwidth())
            .attr('fill', d => colorScale(d.emotionalScore))
            .attr('stroke', '#fff')
            .attr('stroke-width', 1)
            .on('mouseover', function(event, d) {
                d3.select(this).attr('stroke-width', 3);
                
                const tooltip = d3.select('body').append('div')
                    .attr('class', 'tooltip')
                    .style('opacity', 0);
                    
                tooltip.transition().duration(200).style('opacity', .9);
                tooltip.html(`
                    <strong>${d.regionName}</strong><br/>
                    Year: ${d.year}-${d.year + 9}<br/>
                    Emotional Score: ${d.emotionalScore.toFixed(3)}<br/>
                    Poems: ${d.count}<br/>
                    Dominant: ${EMOTIONS[d.dominantEmotion].name}
                `)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', function() {
                d3.select(this).attr('stroke-width', 1);
                d3.selectAll('.tooltip').remove();
            });
            
        // Add axes
        g.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${chartHeight})`)
            .call(d3.axisBottom(xScale))
            .selectAll('text')
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em')
            .attr('transform', 'rotate(-45)');
            
        g.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(yScale));
            
        // Add axis labels
        g.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - margin.left)
            .attr('x', 0 - (chartHeight / 2))
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .style('font-size', '14px')
            .style('font-weight', 'bold')
            .text('Geographic Regions');
            
        g.append('text')
            .attr('transform', `translate(${chartWidth / 2}, ${chartHeight + margin.bottom - 10})`)
            .style('text-anchor', 'middle')
            .style('font-size', '14px')
            .style('font-weight', 'bold')
            .text('Time Periods');
            
        // Add color legend
        const legendWidth = 200;
        const legendHeight = 20;
        
        const legendScale = d3.scaleLinear()
            .domain([-1, 1])
            .range([0, legendWidth]);
            
        const legendAxis = d3.axisBottom(legendScale)
            .ticks(5)
            .tickFormat(d => d > 0 ? `+${d}` : d);
            
        const legend = this.heatmapChart.append('g')
            .attr('transform', `translate(${width - legendWidth - 50}, 20)`);
            
        const gradient = this.heatmapChart.append('defs')
            .append('linearGradient')
            .attr('id', 'emotional-gradient')
            .attr('x1', '0%')
            .attr('x2', '100%')
            .attr('y1', '0%')
            .attr('y2', '0%');
            
        gradient.selectAll('stop')
            .data(d3.range(-1, 1.1, 0.1))
            .enter()
            .append('stop')
            .attr('offset', d => `${((d + 1) / 2) * 100}%`)
            .attr('stop-color', d => colorScale(d));
            
        legend.append('rect')
            .attr('width', legendWidth)
            .attr('height', legendHeight)
            .style('fill', 'url(#emotional-gradient)');
            
        legend.append('g')
            .attr('transform', `translate(0, ${legendHeight})`)
            .call(legendAxis);
            
        legend.append('text')
            .attr('x', legendWidth / 2)
            .attr('y', -5)
            .style('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .text('Emotional Score');
    }

    // Historical Map with Period Changes
    initializeHistoricalMap() {
        this.historicalMap = L.map('historicalMap', {
            center: [35.0, 113.0],
            zoom: 5,
            minZoom: 4,
            maxZoom: 10
        });

        // Add base tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            opacity: 0.7
        }).addTo(this.historicalMap);

        // Apply historical styling
        const style = document.createElement('style');
        style.textContent = `
            #historicalMap .leaflet-tile {
                filter: sepia(40%) saturate(60%) hue-rotate(15deg) brightness(1.2);
            }
        `;
        document.head.appendChild(style);
    }

    renderHistoricalMap() {
        if (!this.historicalMap) return;
        
        // Clear existing layers
        this.historicalMap.eachLayer(layer => {
            if (layer instanceof L.LayerGroup) {
                this.historicalMap.removeLayer(layer);
            }
        });

        // Get current period data
        const activePeriodBtn = document.querySelector('.period-btn.active');
        const period = activePeriodBtn ? activePeriodBtn.dataset.period : 'tang';
        
        const periodData = this.getHistoricalPeriodData(period);
        
        // Add emotional overlay
        this.addEmotionalOverlay(periodData);
        
        // Add territorial boundaries (simplified)
        this.addTerritorialBoundaries(period);
    }

    getHistoricalPeriodData(period) {
        const filteredData = this.getFilteredData();
        
        if (period === 'tang') {
            return filteredData.filter(d => ['early-tang', 'high-tang', 'mid-tang', 'late-tang'].includes(d.period));
        } else {
            return filteredData.filter(d => ['north-song', 'south-song'].includes(d.period));
        }
    }

    addEmotionalOverlay(data) {
        // Group data by region
        const regionGroups = {};
        data.forEach(poem => {
            const region = poem.region;
            if (!regionGroups[region]) {
                regionGroups[region] = [];
            }
            regionGroups[region].push(poem);
        });

        // Create overlay for each region
        Object.entries(regionGroups).forEach(([region, poems]) => {
            const avgEmotion = this.calculateAverageEmotion(poems);
            const centers = REGIONS[region].centers;
            
            centers.forEach(center => {
                const circle = L.circle([center.lat, center.lng], {
                    color: this.getEmotionColor(avgEmotion),
                    fillColor: this.getEmotionColor(avgEmotion),
                    fillOpacity: 0.4,
                    radius: center.importance * 50000 // Scale by importance
                });
                
                circle.bindTooltip(`
                    <strong>${center.name} (${center.modern})</strong><br/>
                    Poems: ${poems.length}<br/>
                    Average Emotion: ${avgEmotion.toFixed(2)}<br/>
                    Cultural Importance: ${(center.importance * 100).toFixed(0)}%
                `);
                
                circle.addTo(this.historicalMap);
            });
        });
    }

    addTerritorialBoundaries(period) {
        // Simplified territorial boundaries
        const boundaries = this.getTerritorialBoundaries(period);
        
        boundaries.forEach(boundary => {
            const polygon = L.polygon(boundary.coordinates, {
                color: boundary.color,
                weight: 2,
                opacity: 0.6,
                fillOpacity: 0.1
            });
            
            polygon.bindTooltip(boundary.name);
            polygon.addTo(this.historicalMap);
        });
    }

    getTerritorialBoundaries(period) {
        // Simplified boundaries for demonstration
        if (period === 'tang') {
            return [
                {
                    name: 'Tang Empire Core',
                    color: '#8B4513',
                    coordinates: [
                        [40, 105], [40, 120], [30, 120], [30, 105]
                    ]
                }
            ];
        } else {
            return [
                {
                    name: 'Song Territory',
                    color: '#228B22',
                    coordinates: [
                        [35, 108], [35, 122], [25, 122], [25, 108]
                    ]
                }
            ];
        }
    }

    switchHistoricalMapPeriod(period) {
        // Update button states
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.period === period);
        });
        
        this.renderHistoricalMap();
    }

    // Trend Analysis
    initializeTrendChart() {
        const ctx = document.getElementById('multiTrendChart').getContext('2d');
        
        this.trendChart = new Chart(ctx, {
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
                    }
                },
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: 'Emotional Evolution in Current Time Window'
                    }
                }
            }
        });
    }

    updateTrendChart() {
        if (!this.trendChart) return;
        
        const filteredData = this.getFilteredData();
        const timeRange = this.getCurrentTimeRange();
        const timeStep = this.timeGranularity === 'year' ? 2 : 
                        this.timeGranularity === 'decade' ? 5 : 10;
        
        const labels = [];
        const emotionData = {};
        Object.keys(EMOTIONS).forEach(emotion => {
            emotionData[emotion] = [];
        });
        
        // Generate data points across the time range
        for (let year = timeRange.start; year <= timeRange.end; year += timeStep) {
            const yearData = filteredData.filter(d => d.year >= year && d.year < year + timeStep);
            labels.push(`${year}-${year + timeStep - 1}`);
            
            if (yearData.length > 0) {
                const emotionCounts = {};
                Object.keys(EMOTIONS).forEach(emotion => {
                    emotionCounts[emotion] = 0;
                });
                
                yearData.forEach(poem => {
                    emotionCounts[poem.emotion]++;
                });
                
                Object.keys(EMOTIONS).forEach(emotion => {
                    const percentage = (emotionCounts[emotion] / yearData.length) * 100;
                    emotionData[emotion].push(percentage);
                });
            } else {
                Object.keys(EMOTIONS).forEach(emotion => {
                    emotionData[emotion].push(0);
                });
            }
        }
        
        // Update chart data
        this.trendChart.data.labels = labels;
        this.trendChart.data.datasets.forEach((dataset, index) => {
            const emotion = Object.keys(EMOTIONS)[index];
            dataset.data = emotionData[emotion];
        });
        
        this.trendChart.update();
    }

    renderTrendAnalysis() {
        this.updateTrendChart();
        this.renderCorrelationMatrix();
    }

    renderCorrelationMatrix() {
        const correlationData = emotionFlowData.getCorrelationData();
        const width = parseInt(this.correlationMatrix.attr('width'));
        const height = parseInt(this.correlationMatrix.attr('height'));
        
        // Clear previous chart
        this.correlationMatrix.selectAll('*').remove();
        
        const margin = { top: 20, right: 20, bottom: 60, left: 100 };
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;
        
        const regions = Object.keys(REGIONS);
        const regionNames = regions.map(r => REGIONS[r].name);
        
        const scale = d3.scaleBand()
            .domain(regionNames)
            .range([0, Math.min(chartWidth, chartHeight)])
            .padding(0.1);
            
        const colorScale = d3.scaleSequential(d3.interpolateRdYlBu)
            .domain([-1, 1]);
            
        const g = this.correlationMatrix.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
            
        // Add cells
        g.selectAll('.correlation-cell')
            .data(correlationData)
            .enter()
            .append('rect')
            .attr('class', 'correlation-cell')
            .attr('x', d => scale(REGIONS[d.region1].name))
            .attr('y', d => scale(REGIONS[d.region2].name))
            .attr('width', scale.bandwidth())
            .attr('height', scale.bandwidth())
            .attr('fill', d => colorScale(d.correlation))
            .attr('stroke', '#fff')
            .attr('stroke-width', 1)
            .on('mouseover', function(event, d) {
                const tooltip = d3.select('body').append('div')
                    .attr('class', 'tooltip')
                    .style('opacity', 0);
                    
                tooltip.transition().duration(200).style('opacity', .9);
                tooltip.html(`
                    <strong>${REGIONS[d.region1].name} ↔ ${REGIONS[d.region2].name}</strong><br/>
                    Correlation: ${d.correlation.toFixed(3)}
                `)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', function() {
                d3.selectAll('.tooltip').remove();
            });
            
        // Add correlation values
        g.selectAll('.correlation-text')
            .data(correlationData)
            .enter()
            .append('text')
            .attr('class', 'correlation-text')
            .attr('x', d => scale(REGIONS[d.region1].name) + scale.bandwidth() / 2)
            .attr('y', d => scale(REGIONS[d.region2].name) + scale.bandwidth() / 2)
            .attr('dy', '0.35em')
            .attr('text-anchor', 'middle')
            .style('font-size', '10px')
            .style('font-weight', 'bold')
            .style('fill', d => Math.abs(d.correlation) > 0.5 ? '#fff' : '#000')
            .text(d => d.correlation.toFixed(2));
            
        // Add axes
        g.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${Math.min(chartWidth, chartHeight)})`)
            .call(d3.axisBottom(scale))
            .selectAll('text')
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em')
            .attr('transform', 'rotate(-45)');
            
        g.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(scale));
    }

    // Animation Functions
    startAnimation() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.animateTimeline();
    }

    pauseAnimation() {
        this.isAnimating = false;
    }

    resetAnimation() {
        this.isAnimating = false;
        this.currentTimePosition = 0;
        this.animationFrame = 0;
        document.getElementById('timelineScrubber').value = 0;
        this.updateTimelineDisplay();
        this.updateCurrentView();
    }

    animateTimeline() {
        if (!this.isAnimating) return;
        
        this.currentTimePosition += 2; // Move 2% forward each frame
        
        if (this.currentTimePosition >= 100) {
            this.pauseAnimation();
            return;
        }
        
        document.getElementById('timelineScrubber').value = this.currentTimePosition;
        this.updateTimelineDisplay();
        this.updateCurrentView();
        
        setTimeout(() => {
            this.animateTimeline();
        }, this.animationSpeed);
    }

    updateTimelineDisplay() {
        const totalYears = 1279 - 618;
        const currentYear = 618 + Math.floor((this.currentTimePosition / 100) * totalYears);
        const period = this.getCurrentPeriod(currentYear);
        
        document.getElementById('timelineLabel').textContent = 
            `${currentYear} CE - ${PERIODS[period]?.name || 'Unknown Period'}`;
    }

    getCurrentPeriod(year) {
        for (const [period, info] of Object.entries(PERIODS)) {
            if (year >= info.start && year <= info.end) {
                return period;
            }
        }
        return 'unknown';
    }

    // Enhanced Data Update Functions
    updateAllData() {
        this.updateStatistics();
        this.updateRegionalAnalysis();
        this.updatePeriodDetail();
        this.updateFlowInsights();
        this.updateTrendChart();
    }

    getCurrentTimeRange() {
        const totalYears = 1279 - 618;
        const currentYear = 618 + Math.floor((this.currentTimePosition / 100) * totalYears);
        
        // Define time window based on granularity
        let timeWindow = 50; // Default: 50 years
        if (this.timeGranularity === 'decade') timeWindow = 20;
        if (this.timeGranularity === 'year') timeWindow = 5;
        
        return {
            start: Math.max(618, currentYear - timeWindow/2),
            end: Math.min(1279, currentYear + timeWindow/2),
            current: currentYear
        };
    }

    getFilteredData() {
        const timeRange = this.getCurrentTimeRange();
        const allData = emotionFlowData.getAllData();
        
        return allData.filter(poem => {
            const inTimeRange = poem.year >= timeRange.start && poem.year <= timeRange.end;
            const inSelectedRegions = this.selectedRegions.includes(poem.region);
            return inTimeRange && inSelectedRegions;
        });
    }

    updateRegionalAnalysis() {
        const filteredData = this.getFilteredData();
        const regionalAnalysisContainer = document.querySelector('.regional-analysis');
        
        if (!regionalAnalysisContainer) return;
        
        // Group data by region
        const regionGroups = {};
        filteredData.forEach(poem => {
            if (!regionGroups[poem.region]) {
                regionGroups[poem.region] = [];
            }
            regionGroups[poem.region].push(poem);
        });
        
        // Update regional analysis cards
        const regionCards = Object.entries(regionGroups).map(([region, poems]) => {
            const avgScore = this.calculateAverageEmotion(poems);
            const dominantEmotion = this.getDominantEmotion(poems);
            const scoreClass = avgScore > 0.1 ? 'positive' : avgScore < -0.1 ? 'negative' : 'neutral';
            
            return `
                <div class="region-card">
                    <h5>${REGIONS[region].name}</h5>
                    <div class="region-emotion-score ${scoreClass}">${avgScore > 0 ? '+' : ''}${avgScore.toFixed(2)}</div>
                    <p>Poems: ${poems.length} | Dominant: ${EMOTIONS[dominantEmotion].name}</p>
                </div>
            `;
        }).join('');
        
        regionalAnalysisContainer.innerHTML = regionCards;
    }

    updatePeriodDetail() {
        const timeRange = this.getCurrentTimeRange();
        const currentPeriod = this.getCurrentPeriod(timeRange.current);
        const filteredData = this.getFilteredData();
        const periodDetailContainer = document.getElementById('periodDetail');
        
        if (!periodDetailContainer || filteredData.length === 0) return;
        
        // Calculate emotion distribution
        const emotionCounts = {};
        Object.keys(EMOTIONS).forEach(emotion => {
            emotionCounts[emotion] = 0;
        });
        
        filteredData.forEach(poem => {
            emotionCounts[poem.emotion]++;
        });
        
        const total = filteredData.length;
        const periodInfo = PERIODS[currentPeriod];
        
        // Generate emotion bars
        const emotionBars = Object.entries(emotionCounts).map(([emotion, count]) => {
            const percentage = (count / total * 100).toFixed(1);
            return `
                <div class="emotion-bar">
                    <span>${EMOTIONS[emotion].name}</span>
                    <div class="bar">
                        <div class="fill ${emotion}" style="width: ${percentage}%"></div>
                    </div>
                    <span>${percentage}%</span>
                </div>
            `;
        }).join('');
        
        // Historical context based on time range
        const contextText = this.getHistoricalContext(timeRange.current, currentPeriod);
        
        periodDetailContainer.innerHTML = `
            <h4>${periodInfo?.name || 'Unknown Period'} (${timeRange.start}-${timeRange.end} CE)</h4>
            <div class="emotional-profile">
                ${emotionBars}
            </div>
            <div class="period-insights">
                <p><strong>Time Window:</strong> ${timeRange.end - timeRange.start} years around ${timeRange.current} CE</p>
                <p><strong>Total Poems:</strong> ${total}</p>
                <p><strong>Historical Context:</strong> ${contextText}</p>
            </div>
        `;
    }

    updateFlowInsights() {
        const filteredData = this.getFilteredData();
        const timeRange = this.getCurrentTimeRange();
        const flowInsightsContainer = document.getElementById('flowInsights');
        
        if (!flowInsightsContainer || filteredData.length === 0) return;
        
        // Calculate insights
        const avgEmotion = this.calculateAverageEmotion(filteredData);
        const dominantRegion = this.getDominantRegion(filteredData);
        const emotionTrend = this.calculateEmotionTrend(timeRange);
        
        const insights = [
            {
                icon: '📊',
                title: 'Current Emotional State',
                description: `Average emotional score: ${avgEmotion > 0 ? '+' : ''}${avgEmotion.toFixed(2)} (${this.getEmotionDescription(avgEmotion)})`
            },
            {
                icon: '🗺️',
                title: 'Geographic Focus',
                description: `Most active region: ${REGIONS[dominantRegion].name} with ${filteredData.filter(p => p.region === dominantRegion).length} poems`
            },
            {
                icon: '⏰',
                title: 'Temporal Analysis',
                description: `Analyzing ${timeRange.end - timeRange.start}-year window around ${timeRange.current} CE`
            },
            {
                icon: '📈',
                title: 'Trend Direction',
                description: emotionTrend
            }
        ];
        
        flowInsightsContainer.innerHTML = insights.map(insight => `
            <div class="insight-item">
                <span class="insight-icon">${insight.icon}</span>
                <div>
                    <strong>${insight.title}:</strong>
                    <p>${insight.description}</p>
                </div>
            </div>
        `).join('');
    }

    getHistoricalContext(year, period) {
        const contexts = {
            'early-tang': {
                618: 'Tang Dynasty founding under Emperor Gaozu',
                626: 'Xuanwu Gate Incident - power consolidation',
                649: 'Death of Emperor Taizong, golden age beginning',
                690: 'Wu Zetian becomes first female emperor',
                700: 'Cultural and territorial expansion peak'
            },
            'high-tang': {
                713: 'Emperor Xuanzong begins reign - cultural flourishing',
                735: 'Poetry and arts reach unprecedented heights',
                750: 'Cosmopolitan Tang empire at territorial peak',
                755: 'An Lushan Rebellion begins - major crisis'
            },
            'mid-tang': {
                763: 'End of An Lushan Rebellion - recovery period',
                780: 'Literary innovation and social reform',
                800: 'Buddhist influence on poetry increases',
                820: 'Economic recovery and cultural renaissance'
            },
            'late-tang': {
                840: 'Political decline and romantic escapism',
                860: 'Nostalgic reflection in literature',
                880: 'Huang Chao Rebellion - social upheaval',
                900: 'Dynasty weakening, regionalism rising'
            },
            'north-song': {
                960: 'Song Dynasty founded - new cultural paradigm',
                1000: 'Economic prosperity and scholarly culture',
                1040: 'Neo-Confucian philosophical development',
                1100: 'Artistic refinement and technological advancement'
            },
            'south-song': {
                1127: 'Jingkang Incident - capital loss to Jin',
                1150: 'Cultural center shifts south',
                1200: 'Landscape appreciation and introspection',
                1250: 'Literary sophistication under Mongol pressure'
            }
        };
        
        const periodContexts = contexts[period] || {};
        const nearestYear = Object.keys(periodContexts)
            .map(y => parseInt(y))
            .reduce((closest, y) => 
                Math.abs(y - year) < Math.abs(closest - year) ? y : closest
            );
        
        return periodContexts[nearestYear] || `${period} period - cultural and literary development`;
    }

    getDominantRegion(data) {
        const regionCounts = {};
        data.forEach(poem => {
            regionCounts[poem.region] = (regionCounts[poem.region] || 0) + 1;
        });
        
        return Object.entries(regionCounts).reduce((a, b) => 
            regionCounts[a[0]] > regionCounts[b[0]] ? a : b
        )[0];
    }

    getDominantEmotion(data) {
        const emotionCounts = {};
        data.forEach(poem => {
            emotionCounts[poem.emotion] = (emotionCounts[poem.emotion] || 0) + 1;
        });
        
        return Object.entries(emotionCounts).reduce((a, b) => 
            emotionCounts[a[0]] > emotionCounts[b[0]] ? a : b
        )[0];
    }

    calculateEmotionTrend(timeRange) {
        const earlyData = emotionFlowData.filterByTimeRange(timeRange.start, timeRange.current);
        const lateData = emotionFlowData.filterByTimeRange(timeRange.current, timeRange.end);
        
        const earlyAvg = this.calculateAverageEmotion(earlyData);
        const lateAvg = this.calculateAverageEmotion(lateData);
        const trend = lateAvg - earlyAvg;
        
        if (Math.abs(trend) < 0.05) {
            return 'Emotional patterns remain stable during this period';
        } else if (trend > 0) {
            return `Emotional tone becoming more positive (+${trend.toFixed(2)})`;
        } else {
            return `Emotional tone becoming more negative (${trend.toFixed(2)})`;
        }
    }

    getEmotionDescription(score) {
        if (score > 0.3) return 'highly positive';
        if (score > 0.1) return 'moderately positive';
        if (score > -0.1) return 'neutral';
        if (score > -0.3) return 'moderately negative';
        return 'highly negative';
    }

    generateFlowDataFromFiltered(data) {
        const flowNodes = [];
        const flowLinks = [];
        const nodeMap = new Map();
        let nodeId = 0;
        
        // Count occurrences for filtered data
        const periodCounts = {};
        const regionCounts = {};
        const emotionCounts = {};
        const periodRegionCounts = {};
        const regionEmotionCounts = {};
        
        data.forEach(poem => {
            // Period counts
            periodCounts[poem.period] = (periodCounts[poem.period] || 0) + 1;
            
            // Region counts
            regionCounts[poem.region] = (regionCounts[poem.region] || 0) + 1;
            
            // Emotion counts
            emotionCounts[poem.emotion] = (emotionCounts[poem.emotion] || 0) + 1;
            
            // Period-Region links
            const prKey = `${poem.period}-${poem.region}`;
            periodRegionCounts[prKey] = (periodRegionCounts[prKey] || 0) + 1;
            
            // Region-Emotion links
            const reKey = `${poem.region}-${poem.emotion}`;
            regionEmotionCounts[reKey] = (regionEmotionCounts[reKey] || 0) + 1;
        });
        
        // Create period nodes (left side)
        Object.entries(periodCounts).forEach(([period, count]) => {
            flowNodes.push({
                id: nodeId,
                name: PERIODS[period].name,
                category: 'period',
                value: count,
                color: PERIODS[period].color,
                x: 0
            });
            nodeMap.set(`period-${period}`, nodeId++);
        });
        
        // Create region nodes (middle)
        Object.entries(regionCounts).forEach(([region, count]) => {
            flowNodes.push({
                id: nodeId,
                name: REGIONS[region].name,
                category: 'region',
                value: count,
                color: REGIONS[region].color,
                x: 1
            });
            nodeMap.set(`region-${region}`, nodeId++);
        });
        
        // Create emotion nodes (right side)
        Object.entries(emotionCounts).forEach(([emotion, count]) => {
            flowNodes.push({
                id: nodeId,
                name: EMOTIONS[emotion].name,
                category: 'emotion',
                value: count,
                color: EMOTIONS[emotion].color,
                x: 2
            });
            nodeMap.set(`emotion-${emotion}`, nodeId++);
        });
        
        // Create period-region links
        Object.entries(periodRegionCounts).forEach(([key, count]) => {
            const [period, region] = key.split('-');
            const sourceId = nodeMap.get(`period-${period}`);
            const targetId = nodeMap.get(`region-${region}`);
            
            if (sourceId !== undefined && targetId !== undefined) {
                flowLinks.push({
                    source: sourceId,
                    target: targetId,
                    value: count,
                    color: PERIODS[period].color
                });
            }
        });
        
        // Create region-emotion links
        Object.entries(regionEmotionCounts).forEach(([key, count]) => {
            const [region, emotion] = key.split('-');
            const sourceId = nodeMap.get(`region-${region}`);
            const targetId = nodeMap.get(`emotion-${emotion}`);
            
            if (sourceId !== undefined && targetId !== undefined) {
                flowLinks.push({
                    source: sourceId,
                    target: targetId,
                    value: count,
                    color: REGIONS[region].color
                });
            }
        });
        
        return { nodes: flowNodes, links: flowLinks };
    }

    generateHeatmapDataFromFiltered(data) {
        const heatmapMatrix = [];
        const timeRange = this.getCurrentTimeRange();
        const timeStep = this.timeGranularity === 'year' ? 2 : 
                        this.timeGranularity === 'decade' ? 5 : 10;
        
        const regionKeys = Object.keys(REGIONS);
        
        for (let year = timeRange.start; year <= timeRange.end; year += timeStep) {
            regionKeys.forEach((region, regionIndex) => {
                const periodData = data.filter(d => 
                    d.year >= year && d.year < year + timeStep && d.region === region
                );
                
                if (periodData.length > 0) {
                    // Calculate weighted emotional score
                    let emotionalScore = 0;
                    periodData.forEach(d => {
                        emotionalScore += EMOTIONS[d.emotion].weight * d.emotionalIntensity;
                    });
                    emotionalScore /= periodData.length;
                    
                    heatmapMatrix.push({
                        year: year,
                        yearIndex: Math.floor((year - timeRange.start) / timeStep),
                        region: region,
                        regionIndex: regionIndex,
                        regionName: REGIONS[region].name,
                        emotionalScore: emotionalScore,
                        intensity: Math.abs(emotionalScore),
                        count: periodData.length,
                        dominantEmotion: this.getDominantEmotion(periodData)
                    });
                }
            });
        }
        
        return heatmapMatrix;
    }

    // Utility Functions
    updateRegionFilters() {
        this.selectedRegions = [];
        document.querySelectorAll('.region-option input:checked').forEach(checkbox => {
            this.selectedRegions.push(checkbox.value);
        });
    }

    updateLegend() {
        const legendContainer = document.getElementById('emotionLegend');
        legendContainer.innerHTML = Object.entries(EMOTIONS).map(([key, emotion]) => `
            <div class="legend-item">
                <div class="legend-color" style="background-color: ${emotion.color};"></div>
                <span>${emotion.name}</span>
            </div>
        `).join('');
    }

    updateStatistics() {
        const filteredData = this.getFilteredData();
        const timeRange = this.getCurrentTimeRange();
        const currentPeriod = this.getCurrentPeriod(timeRange.current);
        
        // Calculate current statistics from filtered data
        const totalPoems = filteredData.length;
        const dominantEmotion = totalPoems > 0 ? this.getDominantEmotion(filteredData) : 'neutral';
        const avgEmotionalScore = totalPoems > 0 ? this.calculateAverageEmotion(filteredData) : 0;
        
        // Update display elements
        document.getElementById('currentPeriod').textContent = 
            PERIODS[currentPeriod]?.name || 'Unknown Period';
        
        document.getElementById('dominantEmotion').textContent = 
            EMOTIONS[dominantEmotion]?.name || 'Unknown';
            
        document.getElementById('emotionalShift').textContent = 
            (avgEmotionalScore > 0 ? '+' : '') + avgEmotionalScore.toFixed(2);
            
        // Update total poems count in timeline label
        const timelineLabel = document.getElementById('timelineLabel');
        if (timelineLabel) {
            timelineLabel.textContent = 
                `${timeRange.current} CE - ${PERIODS[currentPeriod]?.name || 'Unknown'} (${totalPoems} poems)`;
        }
    }

    calculateAverageEmotion(poems) {
        if (poems.length === 0) return 0;
        
        const sum = poems.reduce((total, poem) => {
            return total + EMOTIONS[poem.emotion].weight * poem.emotionalIntensity;
        }, 0);
        
        return sum / poems.length;
    }

    getEmotionColor(score) {
        if (score > 0.3) return EMOTIONS.positive.color;
        if (score > 0.1) return EMOTIONS['implicit-positive'].color;
        if (score > -0.1) return EMOTIONS.neutral.color;
        if (score > -0.3) return EMOTIONS['implicit-negative'].color;
        return EMOTIONS.negative.color;
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add D3 Sankey plugin
    if (typeof d3.sankey === 'undefined') {
        console.log('Loading D3 Sankey plugin...');
        // Simple Sankey implementation for flow charts
        d3.sankey = function() {
            let nodeWidth = 24;
            let nodePadding = 8;
            let extent = [[0, 0], [1, 1]];
            
            function sankey(graph) {
                computeNodeValues(graph);
                computeNodeDepths(graph);
                computeNodeHeights(graph);
                computeLinkDepths(graph);
                return graph;
            }
            
            function computeNodeValues({nodes, links}) {
                for (const node of nodes) {
                    node.value = Math.max(
                        d3.sum(links, l => l.source === node ? l.value : 0),
                        d3.sum(links, l => l.target === node ? l.value : 0)
                    );
                }
            }
            
            function computeNodeDepths({nodes}) {
                const x0 = extent[0][0];
                const x1 = extent[1][0];
                const kx = (x1 - x0 - nodeWidth) / 2;
                
                for (const node of nodes) {
                    node.x0 = x0 + node.x * kx;
                    node.x1 = node.x0 + nodeWidth;
                }
            }
            
            function computeNodeHeights({nodes}) {
                const y0 = extent[0][1];
                const y1 = extent[1][1];
                const ky = d3.min(nodes, d => (y1 - y0 - nodePadding) / d.value);
                
                for (const node of nodes) {
                    node.y1 = node.y0 + node.value * ky;
                }
            }
            
            function computeLinkDepths({links}) {
                for (const link of links) {
                    link.width = link.value * 2;
                }
            }
            
            sankey.nodeWidth = function(x) {
                return arguments.length ? (nodeWidth = +x, sankey) : nodeWidth;
            };
            
            sankey.nodePadding = function(x) {
                return arguments.length ? (nodePadding = +x, sankey) : nodePadding;
            };
            
            sankey.extent = function(x) {
                return arguments.length ? (extent = x, sankey) : extent;
            };
            
            return sankey;
        };
        
        d3.sankeyLinkHorizontal = function() {
            return function(d) {
                const x0 = d.source.x1;
                const x1 = d.target.x0;
                const xi = d3.interpolateNumber(x0, x1);
                const x2 = xi(0.5);
                const x3 = xi(0.5);
                const y0 = d.source.y0 + d.sy + d.width / 2;
                const y1 = d.target.y0 + d.ty + d.width / 2;
                return `M${x0},${y0}C${x2},${y0} ${x3},${y1} ${x1},${y1}`;
            };
        };
    }
    
    window.emotionFlowApp = new EmotionFlowApp();
});

// Add tooltip styles
const tooltipStyle = document.createElement('style');
tooltipStyle.textContent = `
    .tooltip {
        position: absolute;
        text-align: center;
        padding: 8px;
        font-size: 12px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        border-radius: 4px;
        pointer-events: none;
        z-index: 1000;
        max-width: 200px;
    }
`;
document.head.appendChild(tooltipStyle); 