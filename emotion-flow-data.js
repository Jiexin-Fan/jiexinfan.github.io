// Emotion Flow Analysis Data Module
// Advanced data structures for visualizing emotional evolution

// Historical periods with precise boundaries
const PERIODS = {
    'early-tang': { name: 'Early Tang (初唐)', start: 618, end: 712, color: '#E8F5E8' },
    'high-tang': { name: 'High Tang (盛唐)', start: 713, end: 766, color: '#D4E9D4' },
    'mid-tang': { name: 'Mid Tang (中唐)', start: 767, end: 835, color: '#C0DDC0' },
    'late-tang': { name: 'Late Tang (晚唐)', start: 836, end: 907, color: '#ACD1AC' },
    'north-song': { name: 'Northern Song (北宋)', start: 960, end: 1127, color: '#98C398' },
    'south-song': { name: 'Southern Song (南宋)', start: 1127, end: 1279, color: '#84B784' }
};

// Refined emotion categories with weights for analysis
const EMOTIONS = {
    'positive': { name: 'Positive', color: '#2ECC71', weight: 1.0 },
    'implicit-positive': { name: 'Implicit Positive', color: '#3498DB', weight: 0.5 },
    'neutral': { name: 'Neutral', color: '#95A5A6', weight: 0.0 },
    'implicit-negative': { name: 'Implicit Negative', color: '#F39C12', weight: -0.5 },
    'negative': { name: 'Negative', color: '#E74C3C', weight: -1.0 }
};

// Geographic regions with cultural significance
const REGIONS = {
    'north-china': {
        name: 'North China (华北)',
        color: '#3498DB',
        centers: [
            { name: "Chang'an", lat: 34.3416, lng: 108.9398, modern: "Xi'an", importance: 1.0 },
            { name: "Kaifeng", lat: 34.7986, lng: 114.3074, modern: "Kaifeng", importance: 0.9 },
            { name: "Luoyang", lat: 34.6197, lng: 112.4540, modern: "Luoyang", importance: 0.8 },
            { name: "Taiyuan", lat: 37.8706, lng: 112.5489, modern: "Taiyuan", importance: 0.6 }
        ]
    },
    'south-china': {
        name: 'South China (华南)',
        color: '#2ECC71',
        centers: [
            { name: "Hangzhou", lat: 30.2741, lng: 120.1551, modern: "Hangzhou", importance: 0.9 },
            { name: "Suzhou", lat: 31.2989, lng: 120.5853, modern: "Suzhou", importance: 0.8 },
            { name: "Guangzhou", lat: 23.1291, lng: 113.2644, modern: "Guangzhou", importance: 0.7 },
            { name: "Fuzhou", lat: 26.0745, lng: 119.2965, modern: "Fuzhou", importance: 0.6 }
        ]
    },
    'central-china': {
        name: 'Central China (华中)',
        color: '#F39C12',
        centers: [
            { name: "Wuhan", lat: 30.5928, lng: 114.3055, modern: "Wuhan", importance: 0.8 },
            { name: "Changsha", lat: 28.2278, lng: 112.9388, modern: "Changsha", importance: 0.7 },
            { name: "Nanjing", lat: 32.0603, lng: 118.7969, modern: "Nanjing", importance: 0.9 },
            { name: "Yangzhou", lat: 32.4085, lng: 119.4410, modern: "Yangzhou", importance: 0.7 }
        ]
    },
    'west-china': {
        name: 'West China (西部)',
        color: '#9B59B6',
        centers: [
            { name: "Chengdu", lat: 30.6600, lng: 104.0633, modern: "Chengdu", importance: 0.8 },
            { name: "Kunming", lat: 25.0389, lng: 102.7183, modern: "Kunming", importance: 0.6 }
        ]
    }
};

// Historical events that influenced emotional patterns
const HISTORICAL_EVENTS = {
    626: { name: "Xuanwu Gate Incident", impact: "political_stability", emotion_shift: 0.1 },
    649: { name: "Death of Emperor Taizong", impact: "succession", emotion_shift: -0.05 },
    690: { name: "Wu Zetian becomes Emperor", impact: "political_upheaval", emotion_shift: -0.1 },
    755: { name: "An Lushan Rebellion begins", impact: "major_crisis", emotion_shift: -0.4 },
    763: { name: "End of An Lushan Rebellion", impact: "recovery", emotion_shift: 0.2 },
    960: { name: "Song Dynasty founded", impact: "new_dynasty", emotion_shift: 0.3 },
    1127: { name: "Jingkang Incident", impact: "capital_loss", emotion_shift: -0.3 },
    1234: { name: "Fall of Jin Dynasty", impact: "external_threat", emotion_shift: -0.2 }
};

class EmotionFlowDataProcessor {
    constructor() {
        this.rawData = this.generateRealisticData();
        this.flowData = this.processFlowData();
        this.heatmapData = this.processHeatmapData();
        this.correlationData = this.calculateCorrelations();
    }

    // Generate realistic data based on historical patterns
    generateRealisticData() {
        const data = [];
        const totalPoems = 20847;
        let poemId = 1;

        // Emotional patterns based on historical research
        const periodEmotionalProfiles = {
            'early-tang': { positive: 0.42, 'implicit-positive': 0.23, neutral: 0.20, 'implicit-negative': 0.10, negative: 0.05 },
            'high-tang': { positive: 0.48, 'implicit-positive': 0.24, neutral: 0.16, 'implicit-negative': 0.08, negative: 0.04 },
            'mid-tang': { positive: 0.35, 'implicit-positive': 0.18, neutral: 0.22, 'implicit-negative': 0.16, negative: 0.09 },
            'late-tang': { positive: 0.28, 'implicit-positive': 0.15, neutral: 0.25, 'implicit-negative': 0.22, negative: 0.10 },
            'north-song': { positive: 0.33, 'implicit-positive': 0.21, neutral: 0.26, 'implicit-negative': 0.15, negative: 0.05 },
            'south-song': { positive: 0.24, 'implicit-positive': 0.16, neutral: 0.22, 'implicit-negative': 0.26, negative: 0.12 }
        };

        // Regional preferences by period
        const periodRegionalDistribution = {
            'early-tang': { 'north-china': 0.65, 'central-china': 0.20, 'south-china': 0.10, 'west-china': 0.05 },
            'high-tang': { 'north-china': 0.60, 'central-china': 0.22, 'south-china': 0.12, 'west-china': 0.06 },
            'mid-tang': { 'north-china': 0.55, 'central-china': 0.25, 'south-china': 0.15, 'west-china': 0.05 },
            'late-tang': { 'north-china': 0.45, 'central-china': 0.30, 'south-china': 0.20, 'west-china': 0.05 },
            'north-song': { 'north-china': 0.50, 'central-china': 0.25, 'south-china': 0.20, 'west-china': 0.05 },
            'south-song': { 'north-china': 0.30, 'central-china': 0.25, 'south-china': 0.40, 'west-china': 0.05 }
        };

        // Period distribution based on surviving works
        const periodDistribution = {
            'early-tang': 0.15,
            'high-tang': 0.30,
            'mid-tang': 0.20,
            'late-tang': 0.15,
            'north-song': 0.15,
            'south-song': 0.05
        };

        Object.keys(periodDistribution).forEach(period => {
            const poemCount = Math.floor(totalPoems * periodDistribution[period]);
            const emotions = periodEmotionalProfiles[period];
            const regions = periodRegionalDistribution[period];
            
            for (let i = 0; i < poemCount; i++) {
                const emotion = this.selectWeightedRandom(emotions);
                const region = this.selectWeightedRandom(regions);
                const center = this.selectRandomCenter(region);
                const year = this.generateRealisticYear(period);
                
                // Apply historical event influence
                const adjustedEmotion = this.applyHistoricalInfluence(emotion, year);
                
                data.push({
                    id: poemId++,
                    period: period,
                    region: region,
                    emotion: adjustedEmotion,
                    year: year,
                    location: {
                        name: center.name,
                        lat: center.lat + (Math.random() - 0.5) * 0.5,
                        lng: center.lng + (Math.random() - 0.5) * 0.5,
                        modern: center.modern,
                        importance: center.importance
                    },
                    title: `Poem ${poemId}`,
                    author: this.generateAuthorName(),
                    emotionalIntensity: Math.random() * 0.8 + 0.2, // 0.2 to 1.0
                    culturalContext: this.generateCulturalContext(period, region)
                });
            }
        });

        return data;
    }

    selectWeightedRandom(weights) {
        const rand = Math.random();
        let cumulative = 0;
        
        for (const [item, weight] of Object.entries(weights)) {
            cumulative += weight;
            if (rand < cumulative) {
                return item;
            }
        }
        return Object.keys(weights)[0];
    }

    selectRandomCenter(region) {
        const centers = REGIONS[region].centers;
        const weights = {};
        centers.forEach(center => {
            weights[center.name] = center.importance;
        });
        
        const selectedName = this.selectWeightedRandom(weights);
        return centers.find(c => c.name === selectedName);
    }

    generateRealisticYear(period) {
        const periodInfo = PERIODS[period];
        const duration = periodInfo.end - periodInfo.start;
        
        // Bias towards middle of period for more poems
        const bias = 0.3;
        const random = Math.random();
        const biasedRandom = random < bias ? 
            0.2 + Math.random() * 0.6 : // Middle 60% of period
            Math.random(); // Full range
            
        return Math.floor(periodInfo.start + duration * biasedRandom);
    }

    applyHistoricalInfluence(emotion, year) {
        let emotionShift = 0;
        
        // Check for nearby historical events
        Object.keys(HISTORICAL_EVENTS).forEach(eventYear => {
            const yearDiff = Math.abs(year - parseInt(eventYear));
            if (yearDiff <= 5) { // Within 5 years of event
                const influence = HISTORICAL_EVENTS[eventYear].emotion_shift;
                const proximity = 1 - (yearDiff / 5); // Closer = stronger influence
                emotionShift += influence * proximity;
            }
        });

        // Apply emotion shift logic
        if (emotionShift > 0.1 && ['negative', 'implicit-negative'].includes(emotion)) {
            return Math.random() < 0.3 ? 'neutral' : emotion;
        } else if (emotionShift < -0.1 && ['positive', 'implicit-positive'].includes(emotion)) {
            return Math.random() < 0.3 ? 'neutral' : emotion;
        }
        
        return emotion;
    }

    generateAuthorName() {
        const surnames = ['李', '杜', '王', '陈', '张', '刘', '黄', '赵', '周', '吴'];
        const givenNames = ['白', '甫', '维', '昌龄', '之涣', '贺', '商隐', '牧', '湾', '参'];
        return surnames[Math.floor(Math.random() * surnames.length)] + 
               givenNames[Math.floor(Math.random() * givenNames.length)];
    }

    generateCulturalContext(period, region) {
        const contexts = {
            'early-tang': ['court_poetry', 'frontier_expansion', 'cultural_synthesis'],
            'high-tang': ['golden_age', 'cosmopolitan_culture', 'artistic_flourishing'],
            'mid-tang': ['social_reform', 'buddhist_influence', 'literary_innovation'],
            'late-tang': ['political_decline', 'romantic_escapism', 'nostalgic_reflection'],
            'north-song': ['scholarly_culture', 'economic_prosperity', 'neo_confucianism'],
            'south-song': ['cultural_refinement', 'landscape_appreciation', 'introspection']
        };
        
        return contexts[period][Math.floor(Math.random() * contexts[period].length)];
    }

    // Process data for flow visualization (Sankey/Alluvial)
    processFlowData() {
        const flowNodes = [];
        const flowLinks = [];
        
        // Create nodes for each period-region-emotion combination
        const nodeMap = new Map();
        let nodeId = 0;
        
        // Period nodes (left side)
        Object.keys(PERIODS).forEach(period => {
            const periodCount = this.rawData.filter(d => d.period === period).length;
            flowNodes.push({
                id: nodeId,
                name: PERIODS[period].name,
                category: 'period',
                value: periodCount,
                color: PERIODS[period].color,
                x: 0
            });
            nodeMap.set(`period-${period}`, nodeId++);
        });
        
        // Region nodes (middle)
        Object.keys(REGIONS).forEach(region => {
            const regionCount = this.rawData.filter(d => d.region === region).length;
            flowNodes.push({
                id: nodeId,
                name: REGIONS[region].name,
                category: 'region',
                value: regionCount,
                color: REGIONS[region].color,
                x: 1
            });
            nodeMap.set(`region-${region}`, nodeId++);
        });
        
        // Emotion nodes (right side)
        Object.keys(EMOTIONS).forEach(emotion => {
            const emotionCount = this.rawData.filter(d => d.emotion === emotion).length;
            flowNodes.push({
                id: nodeId,
                name: EMOTIONS[emotion].name,
                category: 'emotion',
                value: emotionCount,
                color: EMOTIONS[emotion].color,
                x: 2
            });
            nodeMap.set(`emotion-${emotion}`, nodeId++);
        });
        
        // Create links between periods and regions
        const periodRegionCounts = {};
        this.rawData.forEach(d => {
            const key = `${d.period}-${d.region}`;
            periodRegionCounts[key] = (periodRegionCounts[key] || 0) + 1;
        });
        
        Object.entries(periodRegionCounts).forEach(([key, count]) => {
            const [period, region] = key.split('-');
            flowLinks.push({
                source: nodeMap.get(`period-${period}`),
                target: nodeMap.get(`region-${region}`),
                value: count,
                color: PERIODS[period].color
            });
        });
        
        // Create links between regions and emotions
        const regionEmotionCounts = {};
        this.rawData.forEach(d => {
            const key = `${d.region}-${d.emotion}`;
            regionEmotionCounts[key] = (regionEmotionCounts[key] || 0) + 1;
        });
        
        Object.entries(regionEmotionCounts).forEach(([key, count]) => {
            const [region, emotion] = key.split('-');
            flowLinks.push({
                source: nodeMap.get(`region-${region}`),
                target: nodeMap.get(`emotion-${emotion}`),
                value: count,
                color: REGIONS[region].color
            });
        });
        
        return { nodes: flowNodes, links: flowLinks };
    }

    // Process data for heatmap visualization
    processHeatmapData() {
        const heatmapMatrix = [];
        const timeStep = 10; // 10-year intervals
        const startYear = 618;
        const endYear = 1279;
        
        const regionKeys = Object.keys(REGIONS);
        
        for (let year = startYear; year <= endYear; year += timeStep) {
            regionKeys.forEach((region, regionIndex) => {
                const periodData = this.rawData.filter(d => 
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
                        yearIndex: Math.floor((year - startYear) / timeStep),
                        region: region,
                        regionIndex: regionIndex,
                        regionName: REGIONS[region].name,
                        emotionalScore: emotionalScore,
                        intensity: Math.abs(emotionalScore), // For color mapping
                        count: periodData.length,
                        dominantEmotion: this.getDominantEmotion(periodData)
                    });
                }
            });
        }
        
        return heatmapMatrix;
    }

    getDominantEmotion(data) {
        const emotionCounts = {};
        data.forEach(d => {
            emotionCounts[d.emotion] = (emotionCounts[d.emotion] || 0) + 1;
        });
        
        return Object.entries(emotionCounts).reduce((a, b) => 
            emotionCounts[a[0]] > emotionCounts[b[0]] ? a : b
        )[0];
    }

    // Calculate correlations between regions
    calculateCorrelations() {
        const regionKeys = Object.keys(REGIONS);
        const correlationMatrix = [];
        
        regionKeys.forEach((region1, i) => {
            regionKeys.forEach((region2, j) => {
                const correlation = this.calculateRegionalCorrelation(region1, region2);
                correlationMatrix.push({
                    region1: region1,
                    region2: region2,
                    region1Index: i,
                    region2Index: j,
                    correlation: correlation,
                    significance: Math.abs(correlation)
                });
            });
        });
        
        return correlationMatrix;
    }

    calculateRegionalCorrelation(region1, region2) {
        if (region1 === region2) return 1.0;
        
        // Get emotional profiles for each region
        const data1 = this.rawData.filter(d => d.region === region1);
        const data2 = this.rawData.filter(d => d.region === region2);
        
        if (data1.length === 0 || data2.length === 0) return 0;
        
        // Calculate emotional scores by time period
        const periods = Object.keys(PERIODS);
        const scores1 = [];
        const scores2 = [];
        
        periods.forEach(period => {
            const periodData1 = data1.filter(d => d.period === period);
            const periodData2 = data2.filter(d => d.period === period);
            
            const score1 = periodData1.length > 0 ? 
                periodData1.reduce((sum, d) => sum + EMOTIONS[d.emotion].weight, 0) / periodData1.length : 0;
            const score2 = periodData2.length > 0 ? 
                periodData2.reduce((sum, d) => sum + EMOTIONS[d.emotion].weight, 0) / periodData2.length : 0;
                
            scores1.push(score1);
            scores2.push(score2);
        });
        
        // Calculate Pearson correlation
        return this.pearsonCorrelation(scores1, scores2);
    }

    pearsonCorrelation(x, y) {
        const n = x.length;
        if (n !== y.length || n === 0) return 0;
        
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
        const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
        const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
        
        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
        
        return denominator === 0 ? 0 : numerator / denominator;
    }

    // Get temporal trends
    getTemporalTrends() {
        const periodOrder = ['early-tang', 'high-tang', 'mid-tang', 'late-tang', 'north-song', 'south-song'];
        const trends = [];
        
        periodOrder.forEach(period => {
            const periodData = this.rawData.filter(d => d.period === period);
            
            if (periodData.length > 0) {
                // Calculate emotional statistics
                const emotionCounts = {};
                let totalEmotionalScore = 0;
                
                periodData.forEach(d => {
                    emotionCounts[d.emotion] = (emotionCounts[d.emotion] || 0) + 1;
                    totalEmotionalScore += EMOTIONS[d.emotion].weight * d.emotionalIntensity;
                });
                
                const avgEmotionalScore = totalEmotionalScore / periodData.length;
                const dominantEmotion = this.getDominantEmotion(periodData);
                
                trends.push({
                    period: period,
                    name: PERIODS[period].name,
                    count: periodData.length,
                    avgEmotionalScore: avgEmotionalScore,
                    dominantEmotion: dominantEmotion,
                    emotionDistribution: emotionCounts,
                    timespan: `${PERIODS[period].start}-${PERIODS[period].end}`
                });
            }
        });
        
        return trends;
    }

    // Get regional patterns
    getRegionalPatterns() {
        const patterns = [];
        
        Object.keys(REGIONS).forEach(region => {
            const regionData = this.rawData.filter(d => d.region === region);
            
            if (regionData.length > 0) {
                let totalEmotionalScore = 0;
                const emotionCounts = {};
                const periodCounts = {};
                
                regionData.forEach(d => {
                    totalEmotionalScore += EMOTIONS[d.emotion].weight * d.emotionalIntensity;
                    emotionCounts[d.emotion] = (emotionCounts[d.emotion] || 0) + 1;
                    periodCounts[d.period] = (periodCounts[d.period] || 0) + 1;
                });
                
                patterns.push({
                    region: region,
                    name: REGIONS[region].name,
                    count: regionData.length,
                    avgEmotionalScore: totalEmotionalScore / regionData.length,
                    dominantEmotion: this.getDominantEmotion(regionData),
                    emotionDistribution: emotionCounts,
                    periodDistribution: periodCounts,
                    culturalCharacteristics: this.analyzeCulturalPatterns(regionData)
                });
            }
        });
        
        return patterns;
    }

    analyzeCulturalPatterns(data) {
        const contexts = {};
        data.forEach(d => {
            contexts[d.culturalContext] = (contexts[d.culturalContext] || 0) + 1;
        });
        
        return Object.entries(contexts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([context, count]) => ({ context, count }));
    }

    // Public API methods
    getAllData() {
        return this.rawData;
    }

    getFlowData() {
        return this.flowData;
    }

    getHeatmapData() {
        return this.heatmapData;
    }

    getCorrelationData() {
        return this.correlationData;
    }

    getTemporalTrendsData() {
        return this.getTemporalTrends();
    }

    getRegionalPatternsData() {
        return this.getRegionalPatterns();
    }

    // Filter methods for interactive analysis
    filterByPeriods(periods) {
        return this.rawData.filter(d => periods.includes(d.period));
    }

    filterByRegions(regions) {
        return this.rawData.filter(d => regions.includes(d.region));
    }

    filterByEmotions(emotions) {
        return this.rawData.filter(d => emotions.includes(d.emotion));
    }

    filterByTimeRange(startYear, endYear) {
        return this.rawData.filter(d => d.year >= startYear && d.year <= endYear);
    }
}

// Initialize global data processor
const emotionFlowData = new EmotionFlowDataProcessor();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        emotionFlowData, 
        PERIODS, 
        EMOTIONS, 
        REGIONS, 
        HISTORICAL_EVENTS 
    };
} 