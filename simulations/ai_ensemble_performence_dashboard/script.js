// Real-time data simulation
function updateMetrics() {
    // System efficiency fluctuation
    const efficiency = (Math.random() * 3 + 93).toFixed(1);
    document.getElementById('system-efficiency').textContent = efficiency + '%';
    document.getElementById('overall-performance').textContent = efficiency + '%';
    
    // Update needle angle based on performance
    const needle = document.querySelector('.meter-needle');
    const angle = (parseFloat(efficiency) - 90) * 2 + 45; // Map 90-100% to 45-65 degrees
    needle.style.setProperty('--needle-angle', angle + 'deg');
    
    // Throughput variation
    const throughput = Math.floor(Math.random() * 100) + 1680;
    document.getElementById('throughput').textContent = throughput.toLocaleString();
    
    // Downtime fluctuation
    const downtime = (Math.random() * 0.8 + 1.8).toFixed(1);
    document.getElementById('downtime').textContent = downtime + '%';
    
    // MTTR variation
    const mttr = (Math.random() * 0.8 + 3.0).toFixed(1);
    document.getElementById('mttr').textContent = mttr;
    
    // Quality score
    const quality = (Math.random() * 1.5 + 98.0).toFixed(1);
    document.getElementById('quality-score').textContent = quality + '%';
    
    // AI interventions
    const interventions = Math.floor(Math.random() * 10) + 45;
    document.getElementById('ai-interventions').textContent = interventions;
}

// Update AI technique statuses
function updateAIStatus() {
    const rlStatuses = ['OPTIMIZING', 'LEARNING', 'ADAPTING', 'CONVERGING'];
    const gaStatuses = ['EVOLVING', 'MUTATING', 'SELECTING', 'OPTIMIZING'];
    const psoStatuses = ['CONVERGING', 'EXPLORING', 'SWIRLING', 'OPTIMIZING'];
    
    document.getElementById('rl-technique-status').textContent = 
        rlStatuses[Math.floor(Math.random() * rlStatuses.length)];
    document.getElementById('ga-technique-status').textContent = 
        gaStatuses[Math.floor(Math.random() * gaStatuses.length)];
    document.getElementById('pso-technique-status').textContent = 
        psoStatuses[Math.floor(Math.random() * psoStatuses.length)];
}

// Add new alerts
function addAlert() {
    const alertTypes = ['info', 'success', 'warning'];
    const messages = [
        '🤖 AI Ensemble: Production parameters optimized',
        '✅ Quality threshold maintained at 98.5%+',
        '⚠️ Bottle inventory requires attention in 2 hours',
        '🔧 Predictive maintenance scheduled for next cycle',
        '📈 Production efficiency increased by 1.2%',
        '🎯 Order completion rate: 99.3%'
    ];
    
    const alertPanel = document.getElementById('alert-panel');
    const alert = document.createElement('div');
    alert.className = `alert-item ${alertTypes[Math.floor(Math.random() * alertTypes.length)]}`;
    
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    
    alert.innerHTML = `
        <div class="alert-time">${timeStr}</div>
        <div class="alert-message">${messages[Math.floor(Math.random() * messages.length)]}</div>
    `;
    
    alertPanel.insertBefore(alert, alertPanel.firstChild);
    
    // Remove old alerts to prevent overflow
    if (alertPanel.children.length > 6) {
        alertPanel.removeChild(alertPanel.lastChild);
    }
}

// Add optimization timeline events
function addTimelineEvent() {
    const events = [
        'RL Agent: Flow rate adjusted for optimal throughput',
        'GA: New production schedule generated',
        'PSO: Quality parameters fine-tuned',
        'Ensemble: Coordinated response to bottle shortage',
        'AI System: Preventive maintenance triggered'
    ];
    
    const colors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#f44336'];
    
    const timeline = document.getElementById('optimization-timeline');
    const event = document.createElement('div');
    event.className = 'timeline-item';
    
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    event.innerHTML = `
        <div class="timeline-dot" style="background: ${randomColor};"></div>
        <div class="timeline-content">
            <div class="timeline-time">${timeStr}</div>
            <div class="timeline-action">${randomEvent}</div>
        </div>
    `;
    
    timeline.insertBefore(event, timeline.firstChild);
    
    // Remove old events
    if (timeline.children.length > 8) {
        timeline.removeChild(timeline.lastChild);
    }
}

// Add data stream logs
function addDataStreamLog() {
    const logs = [
        'RL_AGENT: reward={r}, action=optimize_flow, state=learning',
        'GA_OPTIMIZER: generation={g}, fitness={f}, mutation_rate={m}',
        'PSO_SWARM: iteration={i}, gbest={gb}, convergence={c}',
        'ENSEMBLE: coordination_score={cs}, decision_confidence={dc}'
    ];
    
    const dataStream = document.getElementById('data-stream');
    const log = document.createElement('div');
    log.className = 'data-line';
    
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    let randomLog = logs[Math.floor(Math.random() * logs.length)];
    
    // Replace placeholders with random values
    randomLog = randomLog
        .replace('{r}', (Math.random()).toFixed(3))
        .replace('{g}', Math.floor(Math.random() * 100))
        .replace('{f}', (Math.random()).toFixed(3))
        .replace('{m}', (Math.random() * 0.1).toFixed(2))
        .replace('{i}', Math.floor(Math.random() * 500))
        .replace('{gb}', (Math.random()).toFixed(3))
        .replace('{c}', (Math.random()).toFixed(2))
        .replace('{cs}', (Math.random()).toFixed(3))
        .replace('{dc}', (Math.random()).toFixed(3));
    
    log.textContent = `[${timeStr}] ${randomLog}`;
    dataStream.insertBefore(log, dataStream.firstChild);
    
    // Remove old logs
    if (dataStream.children.length > 10) {
        dataStream.removeChild(dataStream.lastChild);
    }
}

// Control functions
function optimizeProduction() {
    addAlert();
    addTimelineEvent();
    setTimeout(() => {
        alert('🚀 Production optimization initiated! AI ensemble is analyzing current parameters and implementing improvements.');
    }, 500);
}

function schedulePreventiveMaintenance() {
    addAlert();
    addTimelineEvent();
    setTimeout(() => {
        alert('🔧 Preventive maintenance scheduled! AI system has identified optimal maintenance windows to minimize production impact.');
    }, 500);
}

function generateReport() {
    setTimeout(() => {
        alert('📊 Performance report generated! \n\n📈 Key Metrics:\n• System Efficiency: 94.7%\n• Downtime Reduction: 65%\n• MTTR Improvement: 78%\n• Quality Score: 98.9%\n\n🤖 AI Ensemble Status: All systems operational and learning');
    }, 500);
}

// Initialize real-time updates
setInterval(updateMetrics, 3000);
setInterval(updateAIStatus, 5000);
setInterval(addAlert, 15000);
setInterval(addTimelineEvent, 12000);
setInterval(addDataStreamLog, 8000);

// Initial updates
updateMetrics();
updateAIStatus();

// Add initial data stream logs
setTimeout(addDataStreamLog, 1000);
setTimeout(addDataStreamLog, 2000);
setTimeout(addDataStreamLog, 3000);