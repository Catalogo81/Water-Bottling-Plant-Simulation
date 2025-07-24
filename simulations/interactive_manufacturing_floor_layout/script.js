// Simulate real-time data updates
function updateMetrics() {
    // Water level fluctuation
    const waterLevel = Math.floor(Math.random() * 10) + 80;
    document.getElementById('water-level').textContent = waterLevel + '%';
    
    // Flow rate variation
    const flowRate = Math.floor(Math.random() * 50) + 225;
    document.getElementById('flow-rate').textContent = flowRate + ' L/min';
    
    // Temperature variation
    const temp = Math.floor(Math.random() * 4) + 16;
    document.getElementById('water-temp').textContent = temp + '°C';
    
    // Bottle stock changes
    const bottle330 = Math.floor(Math.random() * 200) + 1150;
    const bottle500 = Math.floor(Math.random() * 100) + 850;
    document.getElementById('bottle-330').textContent = bottle330.toLocaleString();
    document.getElementById('bottle-500').textContent = bottle500.toLocaleString();
    
    // Output rate
    const outputRate = Math.floor(Math.random() * 200) + 1580;
    document.getElementById('output-rate').textContent = outputRate.toLocaleString() + ' bottles/hr';
    
    // Performance metrics
    const uptime = (Math.random() * 5 + 95).toFixed(1);
    const efficiency = (Math.random() * 8 + 90).toFixed(1);
    const downtime = (100 - uptime).toFixed(1);
    const orders = Math.floor(Math.random() * 50) + 1200;
    
    document.getElementById('uptime').textContent = uptime + '%';
    document.getElementById('efficiency').textContent = efficiency + '%';
    document.getElementById('downtime').textContent = downtime + '%';
    document.getElementById('orders-completed').textContent = orders.toLocaleString();
    document.getElementById('throughput').textContent = outputRate.toLocaleString();
}

// AI status updates
function updateAIStatus() {
    const rlStatuses = [
        'Learning optimal pump sequences',
        'Adjusting flow rates dynamically',
        'Optimizing bottle switching patterns',
        'Adapting to production variations'
    ];
    
    const gaStatuses = [
        'Optimizing mixed order sequences',
        'Rescheduling for efficiency',
        'Balancing production loads',
        'Planning resource allocation'
    ];
    
    const psoStatuses = [
        'Calibrating system parameters',
        'Fine-tuning performance metrics',
        'Optimizing energy consumption',
        'Adjusting quality thresholds'
    ];
    
    document.getElementById('rl-status').textContent = rlStatuses[Math.floor(Math.random() * rlStatuses.length)];
    document.getElementById('ga-status').textContent = gaStatuses[Math.floor(Math.random() * gaStatuses.length)];
    document.getElementById('pso-status').textContent = psoStatuses[Math.floor(Math.random() * psoStatuses.length)];
}

// Control functions
function startProduction() {
    alert('🚀 Production started! AI ensemble is now actively optimizing operations.');
    document.querySelectorAll('.unit').forEach(unit => {
        unit.className = 'unit operational';
    });
}

function stopProduction() {
    alert('🛑 Emergency stop activated! All systems halted for safety.');
    document.querySelectorAll('.unit').forEach(unit => {
        unit.className = 'unit error';
    });
}

function scheduleMaintenace() {
    alert('🔧 Maintenance scheduled. AI will optimize timing to minimize downtime.');
}

function changeMode(mode) {
    alert(`Mode changed to: ${mode.toUpperCase()}`);
}

// Downtime simulation
function simulateDowntime(type) {
    let message = '';
    let affectedUnit = '';
    
    switch(type) {
        case 'tank':
            message = '⚠️ Tank Depletion Scenario: AI ensemble switching to adaptive flow control. RL agent reducing pump speed, GA rescheduling orders.';
            affectedUnit = 'unit1';
            break;
        case 'equipment':
            message = '🔧 Equipment Fault Scenario: Capping station malfunction detected. Ensemble AI rerouting production and scheduling maintenance.';
            affectedUnit = 'unit3';
            break;
        case 'surge':
            message = '📈 Order Surge Scenario: Mixed 330ml/500ml demand spike. GA optimizing schedules while RL handles real-time switching.';
            affectedUnit = 'unit2';
            break;
    }
    
    alert(message);
    
    if(affectedUnit) {
        document.getElementById(affectedUnit).className = 'unit error';
        setTimeout(() => {
            document.getElementById(affectedUnit).className = 'unit operational';
            alert('✅ AI Ensemble successfully resolved the issue! System restored to optimal operation.');
        }, 3000);
    }
}

function resetSimulation() {
    document.querySelectorAll('.unit').forEach(unit => {
        unit.className = 'unit operational';
    });
    document.getElementById('unit2').className = 'unit warning'; // Keep bottle storage warning
    alert('🔄 System reset complete. All units operational.');
}

// Start real-time updates
setInterval(updateMetrics, 3000);
setInterval(updateAIStatus, 5000);

// Initial update
updateMetrics();
updateAIStatus();
