// Emotion Evolution Data for 20,000+ Tang-Song Poems
// This is a demonstration structure - replace with your actual data

// Period definitions
const PERIODS = {
    'early-tang': { name: 'Early Tang (初唐)', start: 618, end: 712, color: '#E8F5E8' },
    'high-tang': { name: 'High Tang (盛唐)', start: 713, end: 766, color: '#D4E9D4' },
    'mid-tang': { name: 'Mid Tang (中唐)', start: 767, end: 835, color: '#C0DDC0' },
    'late-tang': { name: 'Late Tang (晚唐)', start: 836, end: 907, color: '#ACD1AC' },
    'north-song': { name: 'Northern Song (北宋)', start: 960, end: 1127, color: '#98C398' },
    'south-song': { name: 'Southern Song (南宋)', start: 1127, end: 1279, color: '#84B784' }
};

// Emotion definitions
const EMOTIONS = {
    'positive': { name: 'Positive', color: '#2ECC71', weight: 1.0 },
    'implicit-positive': { name: 'Implicit Positive', color: '#7FB3D3', weight: 0.5 },
    'neutral': { name: 'Neutral', color: '#95A5A6', weight: 0.0 },
    'implicit-negative': { name: 'Implicit Negative', color: '#F39C12', weight: -0.5 },
    'negative': { name: 'Negative', color: '#E74C3C', weight: -1.0 }
};

// Major geographic regions
const REGIONS = [
    { name: "Chang'an", lat: 34.3416, lng: 108.9398, modern: "Xi'an" },
    { name: "Luoyang", lat: 34.6197, lng: 112.4540, modern: "Luoyang" },
    { name: "Kaifeng", lat: 34.7986, lng: 114.3074, modern: "Kaifeng" },
    { name: "Hangzhou", lat: 30.2741, lng: 120.1551, modern: "Hangzhou" },
    { name: "Suzhou", lat: 31.2989, lng: 120.5853, modern: "Suzhou" },
    { name: "Yangzhou", lat: 32.4085, lng: 119.4410, modern: "Yangzhou" },
    { name: "Nanjing", lat: 32.0603, lng: 118.7969, modern: "Nanjing" },
    { name: "Chengdu", lat: 30.6600, lng: 104.0633, modern: "Chengdu" },
    { name: "Guangzhou", lat: 23.1291, lng: 113.2644, modern: "Guangzhou" },
    { name: "Jinan", lat: 36.6512, lng: 117.1201, modern: "Jinan" },
    { name: "Taiyuan", lat: 37.8706, lng: 112.5489, modern: "Taiyuan" },
    { name: "Zhengzhou", lat: 34.7466, lng: 113.6253, modern: "Zhengzhou" },
    { name: "Wuhan", lat: 30.5928, lng: 114.3055, modern: "Wuhan" },
    { name: "Changsha", lat: 28.2278, lng: 112.9388, modern: "Changsha" },
    { name: "Fuzhou", lat: 26.0745, lng: 119.2965, modern: "Fuzhou" }
];

// Generate sample data for demonstration
class EmotionDataGenerator {
    constructor() {
        this.data = this.generateSampleData();
        this.aggregatedData = this.aggregateData();
    }

    // Generate 20,000+ sample poems with realistic distributions
    generateSampleData() {
        const poems = [];
        const totalPoems = 20847; // Your actual count
        
        // Historical emotion trends (based on literary research)
        const emotionTrends = {
            'early-tang': { positive: 0.45, 'implicit-positive': 0.20, neutral: 0.20, 'implicit-negative': 0.10, negative: 0.05 },
            'high-tang': { positive: 0.50, 'implicit-positive': 0.22, neutral: 0.15, 'implicit-negative': 0.08, negative: 0.05 },
            'mid-tang': { positive: 0.38, 'implicit-positive': 0.18, neutral: 0.20, 'implicit-negative': 0.15, negative: 0.09 },
            'late-tang': { positive: 0.30, 'implicit-positive': 0.15, neutral: 0.25, 'implicit-negative': 0.20, negative: 0.10 },
            'north-song': { positive: 0.35, 'implicit-positive': 0.20, neutral: 0.25, 'implicit-negative': 0.15, negative: 0.05 },
            'south-song': { positive: 0.25, 'implicit-positive': 0.15, neutral: 0.20, 'implicit-negative': 0.25, negative: 0.15 }
        };

        // Period distributions (based on surviving works)
        const periodDistribution = {
            'early-tang': 0.12,
            'high-tang': 0.28,
            'mid-tang': 0.20,
            'late-tang': 0.15,
            'north-song': 0.15,
            'south-song': 0.10
        };

        let poemId = 1;
        
        Object.keys(periodDistribution).forEach(period => {
            const poemCount = Math.floor(totalPoems * periodDistribution[period]);
            const emotions = emotionTrends[period];
            
            for (let i = 0; i < poemCount; i++) {
                const emotion = this.selectRandomEmotion(emotions);
                const region = REGIONS[Math.floor(Math.random() * REGIONS.length)];
                const year = PERIODS[period].start + Math.floor(Math.random() * (PERIODS[period].end - PERIODS[period].start));
                
                poems.push({
                    id: poemId++,
                    period: period,
                    emotion: emotion,
                    year: year,
                    location: {
                        name: region.name,
                        lat: region.lat + (Math.random() - 0.5) * 0.5, // Add some variation
                        lng: region.lng + (Math.random() - 0.5) * 0.5,
                        modern: region.modern
                    },
                    // Sample metadata
                    title: `Poem ${poemId}`,
                    author: `Poet ${Math.floor(Math.random() * 1000)}`,
                    keywords: this.generateKeywords(emotion)
                });
            }
        });

        return poems;
    }

    selectRandomEmotion(emotions) {
        const rand = Math.random();
        let cumulative = 0;
        
        for (const [emotion, probability] of Object.entries(emotions)) {
            cumulative += probability;
            if (rand < cumulative) {
                return emotion;
            }
        }
        return 'neutral';
    }

    generateKeywords(emotion) {
        const keywordSets = {
            'positive': ['joy', 'celebration', 'triumph', 'beauty', 'harmony'],
            'implicit-positive': ['hope', 'peace', 'tranquil', 'gentle', 'serene'],
            'neutral': ['nature', 'landscape', 'river', 'mountain', 'season'],
            'implicit-negative': ['longing', 'distant', 'autumn', 'evening', 'solitude'],
            'negative': ['sorrow', 'separation', 'loss', 'war', 'exile']
        };
        
        const keywords = keywordSets[emotion] || keywordSets['neutral'];
        return keywords.slice(0, Math.floor(Math.random() * 3) + 1);
    }

    // Aggregate data for visualization
    aggregateData() {
        const aggregated = {
            byPeriod: {},
            byEmotion: {},
            byRegion: {},
            byPeriodEmotion: {},
            timeline: this.generateTimeline(),
            regionalEmotions: this.generateRegionalEmotions()
        };

        // Initialize structures
        Object.keys(PERIODS).forEach(period => {
            aggregated.byPeriod[period] = 0;
            aggregated.byPeriodEmotion[period] = {};
            Object.keys(EMOTIONS).forEach(emotion => {
                aggregated.byPeriodEmotion[period][emotion] = 0;
            });
        });

        Object.keys(EMOTIONS).forEach(emotion => {
            aggregated.byEmotion[emotion] = 0;
        });

        // Count occurrences
        this.data.forEach(poem => {
            aggregated.byPeriod[poem.period]++;
            aggregated.byEmotion[poem.emotion]++;
            aggregated.byPeriodEmotion[poem.period][poem.emotion]++;
            
            const regionKey = poem.location.modern;
            if (!aggregated.byRegion[regionKey]) {
                aggregated.byRegion[regionKey] = 0;
            }
            aggregated.byRegion[regionKey]++;
        });

        return aggregated;
    }

    generateTimeline() {
        const timeline = [];
        const yearStep = 10;
        
        for (let year = 618; year <= 1279; year += yearStep) {
            const yearData = {
                year: year,
                emotions: { positive: 0, 'implicit-positive': 0, neutral: 0, 'implicit-negative': 0, negative: 0 },
                total: 0
            };

            const poemsInYear = this.data.filter(poem => 
                poem.year >= year && poem.year < year + yearStep
            );

            poemsInYear.forEach(poem => {
                yearData.emotions[poem.emotion]++;
                yearData.total++;
            });

            // Convert to percentages
            if (yearData.total > 0) {
                Object.keys(yearData.emotions).forEach(emotion => {
                    yearData.emotions[emotion] = (yearData.emotions[emotion] / yearData.total) * 100;
                });
            }

            timeline.push(yearData);
        }

        return timeline;
    }

    generateRegionalEmotions() {
        const regional = {};
        
        REGIONS.forEach(region => {
            regional[region.modern] = {
                name: region.name,
                modern: region.modern,
                lat: region.lat,
                lng: region.lng,
                emotions: { positive: 0, 'implicit-positive': 0, neutral: 0, 'implicit-negative': 0, negative: 0 },
                total: 0
            };
        });

        this.data.forEach(poem => {
            const regionKey = poem.location.modern;
            if (regional[regionKey]) {
                regional[regionKey].emotions[poem.emotion]++;
                regional[regionKey].total++;
            }
        });

        // Convert to percentages and add emotional score
        Object.values(regional).forEach(region => {
            if (region.total > 0) {
                let emotionalScore = 0;
                Object.keys(region.emotions).forEach(emotion => {
                    const percentage = (region.emotions[emotion] / region.total) * 100;
                    region.emotions[emotion] = percentage;
                    emotionalScore += percentage * EMOTIONS[emotion].weight;
                });
                region.emotionalScore = emotionalScore / 100; // Normalize to -1 to 1
            }
        });

        return regional;
    }

    // Public methods for data access
    getAllPoems() {
        return this.data;
    }

    getPoemsByPeriod(periods) {
        return this.data.filter(poem => periods.includes(poem.period));
    }

    getPoemsByEmotion(emotions) {
        return this.data.filter(poem => emotions.includes(poem.emotion));
    }

    getPoemsByFilter(periods, emotions) {
        return this.data.filter(poem => 
            periods.includes(poem.period) && emotions.includes(poem.emotion)
        );
    }

    getAggregatedData() {
        return this.aggregatedData;
    }

    // Statistical analysis methods
    getEmotionalTrend() {
        const periodOrder = ['early-tang', 'high-tang', 'mid-tang', 'late-tang', 'north-song', 'south-song'];
        const trend = [];
        
        periodOrder.forEach(period => {
            const periodData = this.aggregatedData.byPeriodEmotion[period];
            const total = this.aggregatedData.byPeriod[period];
            
            if (total > 0) {
                let weightedScore = 0;
                Object.keys(periodData).forEach(emotion => {
                    const percentage = periodData[emotion] / total;
                    weightedScore += percentage * EMOTIONS[emotion].weight;
                });
                
                trend.push({
                    period: period,
                    name: PERIODS[period].name,
                    score: weightedScore,
                    total: total
                });
            }
        });
        
        return trend;
    }

    getMostPrevalentEmotion(periods = null) {
        let emotionCounts = { ...this.aggregatedData.byEmotion };
        
        if (periods) {
            emotionCounts = { positive: 0, 'implicit-positive': 0, neutral: 0, 'implicit-negative': 0, negative: 0 };
            periods.forEach(period => {
                Object.keys(emotionCounts).forEach(emotion => {
                    emotionCounts[emotion] += this.aggregatedData.byPeriodEmotion[period][emotion] || 0;
                });
            });
        }
        
        const maxEmotion = Object.keys(emotionCounts).reduce((a, b) => 
            emotionCounts[a] > emotionCounts[b] ? a : b
        );
        
        const total = Object.values(emotionCounts).reduce((sum, count) => sum + count, 0);
        const percentage = total > 0 ? Math.round((emotionCounts[maxEmotion] / total) * 100) : 0;
        
        return {
            emotion: maxEmotion,
            name: EMOTIONS[maxEmotion].name,
            percentage: percentage
        };
    }

    // Generate heatmap data for Leaflet
    getHeatmapData(emotion = null, periods = null) {
        let filteredData = this.data;
        
        if (emotion) {
            filteredData = filteredData.filter(poem => poem.emotion === emotion);
        }
        
        if (periods) {
            filteredData = filteredData.filter(poem => periods.includes(poem.period));
        }
        
        // Group by location and count
        const locationCounts = {};
        filteredData.forEach(poem => {
            const key = `${poem.location.lat.toFixed(2)},${poem.location.lng.toFixed(2)}`;
            if (!locationCounts[key]) {
                locationCounts[key] = {
                    lat: poem.location.lat,
                    lng: poem.location.lng,
                    count: 0
                };
            }
            locationCounts[key].count++;
        });
        
        // Convert to heatmap format [lat, lng, intensity]
        return Object.values(locationCounts).map(location => [
            location.lat,
            location.lng,
            Math.min(location.count / 10, 1) // Normalize intensity
        ]);
    }
}

// Initialize global data instance
const emotionData = new EmotionDataGenerator();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { emotionData, PERIODS, EMOTIONS, REGIONS };
} 