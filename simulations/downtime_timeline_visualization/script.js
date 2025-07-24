let eventCounter = 0;
let timelineEvents = [];

// Initial timeline events
const initialEvents = [
    {
        time: "08:00:00",
        type: "operational",
        title: "System Startup",
        description: "All manufacturing units initialized successfully. AI ensemble begins optimization routines.",
        aiResponse: "RL agent learning baseline parameters, GA optimizing initial schedule, PSO calibrating system thresholds."
    },
    {
        time: "08:15:23",
        type: "operational",
        title: "Production Commenced",
        description: "Water bottling production started. Target: 1,680 bottles/hour across 330ml and 500ml variants.",
        aiResponse: "Ensemble AI coordinating optimal flow rates and bottle selection sequences."
    },
    {
        time: "09:42:15",
        type: "warning",
        title: "500ml Bottle Stock Low",
        description: "Inventory alert: 500ml bottle stock below threshold (850 units remaining).",
        aiResponse: "GA algorithm rescheduling production to prioritize 330ml bottles. PSO optimizing resource allocation."
    },
    {
        time: "10:28:47",
        type: "recovery",
        title: "Stock Replenishment",
        description: "New bottle shipment received and processed. Inventory levels restored to optimal.",
        aiResponse: "RL agent learned from stock depletion pattern. Schedule adapted for future prevention."
    }
];

function formatTime() {
    const now = new Date();
    return now.toTimeString().split(' ')[0];
}

function addTimelineEvent(event) {
    const timeline = document.getElementById('timeline');
    
    const eventElement = document.createElement('div');
    eventElement.className = 'timeline-event';
    eventElement.innerHTML = `
        <div class="timeline-marker ${event.type}">
            ${getEventIcon(event.type)}
        </div>
        <div class="event-content ${event.type}">
            <div class="event-time">${event.time}</div>
            <div class="event-title">${event.title}</div>
            <div class="event-description">${event.description}</div>
            <div class="ai-response">
                <div class="ai-response-title">🤖 AI Ensemble Response:</div>
                <div>${event.aiResponse}</div>
            </div>
        </div>
    `;
    
    timeline.appendChild(eventElement);
    timeline.scrollTop = timeline.scrollHeight;
    
    timelineEvents.push(event);
    updateMetrics();
}

function getEventIcon(type) {
    const icons = {
        operational: '✓',
        warning: '⚠',
        critical: '⚡',
        recovery: '🔧'
    };
    return icons[type] || '•';
}

function simulateScenario(type) {
    const scenarios = {
        tank: {
            events: [
                {
                    type: "critical",
                    title: "Water Tank Depletion Critical",
                    description: "Main water tank level dropped below 15%. Production at risk of complete halt.",
                    aiResponse: "CRITICAL: RL agent immediately reducing pump speed by 40%. GA rescheduling orders to extend available water. PSO optimizing minimal flow rates."
                },
                {
                    type: "recovery",
                    title: "Emergency Water Supply Activated",
                    description: "Backup water supply engaged. Tank refilling initiated. Production resumed at 70% capacity.",
                    aiResponse: "Ensemble AI coordinated seamless switch to backup systems. Recovery time: 3.2 minutes (vs 15 min traditional)."
                }
            ]
        },
        equipment: {
            events: [
                {
                    type: "critical",
                    title: "Capping Station Malfunction",
                    description: "Primary capping mechanism failure detected. Quality control system triggered emergency stop.",
                    aiResponse: "RL agent detected anomaly 2.1 seconds before failure. GA immediately rerouting to backup capping unit. Production continuity maintained."
                },
                {
                    type: "recovery",
                    title: "Fault Isolation & Repair",
                    description: "Defective capping unit isolated. Maintenance team dispatched. Backup system handling full load.",
                    aiResponse: "PSO optimized backup unit parameters for maximum efficiency. Maintenance scheduling integrated with production planning."
                }
            ]
        },
        surge: {
            events: [
                {
                    type: "warning",
                    title: "Mixed Order Surge Detected",
                    description: "Sudden spike in mixed orders: 60% increase in 330ml, 40% increase in 500ml bottles simultaneously.",
                    aiResponse: "GA rapidly recalculating optimal production sequence. RL agent adapting bottle switching patterns in real-time."
                },
                {
                    type: "operational",
                    title: "Surge Successfully Managed",
                    description: "Order surge handled without production delays. All orders processed within SLA timeframes.",
                    aiResponse: "Ensemble coordination achieved 23% better performance than single-algorithm approach. System learned new surge patterns."
                }
            ]
        }
    };

    if (scenarios[type]) {
        scenarios[type].events.forEach((event, index) => {
            setTimeout(() => {
                event.time = formatTime();
                addTimelineEvent(event);
                updateAIStatus();
            }, index * 2000);
        });
    }
}

function resetTimeline() {
    document.getElementById('timeline').innerHTML = '';
    timelineEvents = [];
    
    // Re-add initial events
    initialEvents.forEach((event, index) => {
        setTimeout(() => addTimelineEvent(event), index * 500);
    });
    
    updateMetrics();
    updateAIStatus();
}

function updateMetrics() {
    const totalEvents = timelineEvents.length;
    const criticalEvents = timelineEvents.filter(e => e.type === 'critical').length;
    
    // Simulate improving metrics with AI
    const uptime = Math.max(95, 99 - (criticalEvents * 0.5)).toFixed(1);
    const downtime = (100 - uptime).toFixed(1);
    const mttr = Math.max(2.1, 8 - (totalEvents * 0.1)).toFixed(1);
    const interventions = totalEvents + Math.floor(Math.random() * 5);
    
    document.getElementById('uptime-metric').textContent = uptime + '%';
    document.getElementById('downtime-metric').textContent = downtime + '%';
    document.getElementById('mttr-metric').textContent = mttr + ' min';
    document.getElementById('interventions-metric').textContent = interventions;
}

function updateAIStatus() {
    const statuses = ['ACTIVE', 'OPTIMIZING', 'LEARNING', 'ADAPTING'];
    const statusClasses = ['status-active', 'status-optimizing', 'status-learning', 'status-learning'];
    
    document.getElementById('rl-status').textContent = statuses[Math.floor(Math.random() * statuses.length)];
    document.getElementById('ga-status').textContent = statuses[Math.floor(Math.random() * statuses.length)];
    document.getElementById('pso-status').textContent = statuses[Math.floor(Math.random() * statuses.length)];
}

function createPerformanceChart() {
    const chartData = [
        { label: 'Tank\nDepletion', aiTime: 3.2, traditionalTime: 15.0 },
        { label: 'Equipment\nFault', aiTime: 2.8, traditionalTime: 12.5 },
        { label: 'Order\nSurge', aiTime: 1.5, traditionalTime: 8.0 },
        { label: 'Quality\nIssue', aiTime: 4.1, traditionalTime: 18.5 },
        { label: 'Supply\nDelay', aiTime: 6.2, traditionalTime: 25.0 }
    ];

    const chartContainer = document.getElementById('chart-container');
    chartContainer.innerHTML = '';

    chartData.forEach(data => {
        const barGroup = document.createElement('div');
        barGroup.style.display = 'flex';
        barGroup.style.flexDirection = 'column';
        barGroup.style.alignItems = 'center';
        barGroup.style.gap = '5px';

        // AI response time bar
        const aiBar = document.createElement('div');
        aiBar.className = 'chart-bar';
        aiBar.style.height = (data.aiTime * 6) + 'px';
        aiBar.innerHTML = `<div class="bar-value">${data.aiTime}min</div>`;
        
        // Traditional response time bar (for comparison, shown in background)
        const traditionalBar = document.createElement('div');
        traditionalBar.style.width = '30px';
        traditionalBar.style.height = (data.traditionalTime * 6) + 'px';
        traditionalBar.style.background = '#666';
        traditionalBar.style.borderRadius = '4px';
        traditionalBar.style.opacity = '0.3';
        traditionalBar.style.position = 'absolute';
        traditionalBar.style.right = '0';

        const barContainer = document.createElement('div');
        barContainer.style.position = 'relative';
        barContainer.style.display = 'flex';
        barContainer.style.alignItems = 'end';
        
        barContainer.appendChild(traditionalBar);
        barContainer.appendChild(aiBar);

        const label = document.createElement('div');
        label.className = 'bar-label';
        label.textContent = data.label.replace('\\n', ' ');

        barGroup.appendChild(barContainer);
        barGroup.appendChild(label);
        chartContainer.appendChild(barGroup);
    });
}

// Initialize
resetTimeline();
createPerformanceChart();

// Update AI status periodically
setInterval(updateAIStatus, 10000);
setInterval(updateMetrics, 15000);