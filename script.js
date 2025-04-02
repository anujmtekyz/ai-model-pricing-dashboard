// AI Model data
const modelData = [
    { name: 'OpenAI: o1-pro', provider: 'OpenAI', inputCost: 150, outputCost: 600, context: 200000 },
    { name: 'OpenAI: GPT-4o-mini Search Preview', provider: 'OpenAI', inputCost: 0.15, outputCost: 0.6, context: 128000 },
    { name: 'Google: Gemma 3 27B', provider: 'Google', inputCost: 0.1, outputCost: 0.2, context: 131072 },
    { name: 'OpenAI: GPT-4.5 (Preview)', provider: 'OpenAI', inputCost: 75, outputCost: 150, context: 128000 },
    { name: 'Anthropic: Claude 3.7 Sonnet', provider: 'Anthropic', inputCost: 3, outputCost: 15, context: 200000 },
    { name: 'Google: Gemini Flash 2.0', provider: 'Google', inputCost: 0.1, outputCost: 0.4, context: 1000000 },
    { name: 'MiniMax: MiniMax-01', provider: 'MiniMax', inputCost: 0.2, outputCost: 1.1, context: 1000192 },
    { name: 'Amazon: Nova Pro 1.0', provider: 'Amazon', inputCost: 0.8, outputCost: 3.2, context: 300000 },
    { name: 'Mistral: Pixtral Large 2411', provider: 'Mistral', inputCost: 2, outputCost: 6, context: 131072 },
    { name: 'Anthropic: Claude 3.5 Haiku', provider: 'Anthropic', inputCost: 0.8, outputCost: 4, context: 200000 },
    { name: 'Anthropic: Claude 3 Opus', provider: 'Anthropic', inputCost: 15, outputCost: 75, context: 200000 },
    { name: 'Google: Gemini Pro 1.5', provider: 'Google', inputCost: 1.25, outputCost: 5, context: 2000000 }
];

// Store chart instances
let charts = {
    costComparison: null,
    contextWindow: null,
    providerDistribution: null,
    costEfficiency: null
};

// Initialize charts when the page loads
document.addEventListener('DOMContentLoaded', function() {
    createAllCharts(modelData);
    initializeFilters();
});

function createAllCharts(data) {
    createCostComparisonChart(data);
    createContextWindowChart(data);
    createProviderDistributionChart(data);
    createCostEfficiencyChart(data);
}

function createCostComparisonChart(data) {
    const ctx = document.getElementById('costComparisonChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (charts.costComparison) {
        charts.costComparison.destroy();
    }
    
    charts.costComparison = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(model => model.name),
            datasets: [
                {
                    label: 'Input Cost ($/1M tokens)',
                    data: data.map(model => model.inputCost),
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                },
                {
                    label: 'Output Cost ($/1M tokens)',
                    data: data.map(model => model.outputCost),
                    backgroundColor: 'rgba(255, 99, 132, 0.7)',
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    type: 'logarithmic'
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });
}

function createContextWindowChart(data) {
    const ctx = document.getElementById('contextWindowChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (charts.contextWindow) {
        charts.contextWindow.destroy();
    }
    
    charts.contextWindow = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(model => model.name),
            datasets: [{
                label: 'Context Window Size (tokens)',
                data: data.map(model => model.context),
                backgroundColor: 'rgba(75, 192, 192, 0.7)'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createProviderDistributionChart(data) {
    const providerCounts = {};
    data.forEach(model => {
        providerCounts[model.provider] = (providerCounts[model.provider] || 0) + 1;
    });

    const ctx = document.getElementById('providerDistributionChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (charts.providerDistribution) {
        charts.providerDistribution.destroy();
    }
    
    charts.providerDistribution = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(providerCounts),
            datasets: [{
                data: Object.values(providerCounts),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

function createCostEfficiencyChart(data) {
    const costEfficiency = data.map(model => ({
        name: model.name,
        ratio: model.outputCost / model.inputCost
    }));

    const ctx = document.getElementById('costEfficiencyChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (charts.costEfficiency) {
        charts.costEfficiency.destroy();
    }
    
    charts.costEfficiency = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: costEfficiency.map(item => item.name),
            datasets: [{
                label: 'Output/Input Cost Ratio',
                data: costEfficiency.map(item => item.ratio),
                backgroundColor: 'rgba(153, 102, 255, 0.7)'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function initializeFilters() {
    const providers = [...new Set(modelData.map(model => model.provider))];
    const providerFilter = document.getElementById('providerFilter');
    
    providers.forEach(provider => {
        const option = document.createElement('option');
        option.value = provider;
        option.textContent = provider;
        providerFilter.appendChild(option);
    });

    // Add event listeners for filters
    providerFilter.addEventListener('change', updateCharts);
    document.getElementById('costRangeFilter').addEventListener('change', updateCharts);
}

function updateCharts() {
    const selectedProvider = document.getElementById('providerFilter').value;
    const selectedCostRange = document.getElementById('costRangeFilter').value;

    let filteredData = [...modelData];  // Create a copy of the original data

    // Filter by provider
    if (selectedProvider !== 'all') {
        filteredData = filteredData.filter(model => model.provider === selectedProvider);
    }

    // Filter by cost range
    if (selectedCostRange !== 'all') {
        filteredData = filteredData.filter(model => {
            const avgCost = (model.inputCost + model.outputCost) / 2;
            switch (selectedCostRange) {
                case 'low':
                    return avgCost < 1;
                case 'medium':
                    return avgCost >= 1 && avgCost <= 10;
                case 'high':
                    return avgCost > 10;
                default:
                    return true;
            }
        });
    }

    // Update all charts with filtered data
    createAllCharts(filteredData);
} 