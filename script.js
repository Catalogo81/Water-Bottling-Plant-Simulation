// Water Bottling Plant Simulation
// This application simulates a water bottling plant with automated vs AI decision making

// Constants
const TANK_CAPACITY = 1000; // Liters
const REFILL_THRESHOLD = 50; // Percentage
const REFILL_RATE = 10; // Liters per second
const BOTTLE_500ML = 0.5; // Liters
const BOTTLE_300ML = 0.3; // Liters
const MAX_FLOW_RATE = 0.5; // Liters per second

// Initial state
let state = {
  tankLevel: TANK_CAPACITY,
  bottlesFilled500ml: 0,
  bottlesFilled300ml: 0,
  currentMode: "auto", // "auto" or "ai"
  orders: [], // Will contain orders with bottle type, quantity, and delivery date
  currentOrderIndex: 0,
  currentTime: 0, // Simulation time in seconds
  flowRate: MAX_FLOW_RATE,
  running: false,
  logs: [],
  exceptions: 0, // Track exceptions where AI overrode default behavior
};

// Order class
class Order {
  constructor(bottles500ml, bottles300ml, deliveryDate) {
    this.bottles500ml = bottles500ml;
    this.bottles300ml = bottles300ml;
    this.deliveryDate = deliveryDate;
    this.completed = false;
    this.bottles500mlFilled = 0;
    this.bottles300mlFilled = 0;
  }

  get isComplete() {
    return this.bottles500mlFilled >= this.bottles500ml && 
            this.bottles300mlFilled >= this.bottles300ml;
  }

  get remainingWaterNeeded() {
    return (this.bottles500ml - this.bottles500mlFilled) * BOTTLE_500ML + 
            (this.bottles300ml - this.bottles300mlFilled) * BOTTLE_300ML;
  }
}

// Initialize sample orders
function initializeOrders() {
  state.orders = [
    new Order(20, 15, "Monday"),
    new Order(100, 20, "Tuesday"),
    new Order(200, 180, "Friday")
  ];
  state.currentOrderIndex = 0;
  updateOrderDisplay();
}

// Automated system logic
function automatedSystem() {
  // Check if we've completed all orders
  if (state.currentOrderIndex >= state.orders.length) {
    logMessage("AUTO: All orders are already completed.");
    stopSimulation();
    return;
  }

  // Check if tank needs refilling
  const tankPercentage = (state.tankLevel / TANK_CAPACITY) * 100;
  if (tankPercentage <= REFILL_THRESHOLD) {
    logMessage(`AUTO: Tank level (${tankPercentage.toFixed(1)}%) below threshold of ${REFILL_THRESHOLD}%. Stopping production to refill.`);
    refillTank();
    return;
  }

  // Continue with current order if not completed
  const currentOrder = state.orders[state.currentOrderIndex];
  
  logMessage(`AUTO: Processing order for ${currentOrder.deliveryDate}. Progress: 500ml (${currentOrder.bottles500mlFilled}/${currentOrder.bottles500ml}), 300ml (${currentOrder.bottles300mlFilled}/${currentOrder.bottles300ml})`);
  
  if (!currentOrder.isComplete) {
    // Decide which bottle to fill next
    if (currentOrder.bottles500mlFilled < currentOrder.bottles500ml) {
      fillBottle("500ml");
    } else if (currentOrder.bottles300mlFilled < currentOrder.bottles300ml) {
      fillBottle("300ml");
    }
  } else {
    // Move to next order
    logMessage(`AUTO: Order for ${currentOrder.deliveryDate} completed.`);
    state.currentOrderIndex++;
    if (state.currentOrderIndex < state.orders.length) {
      const nextOrder = state.orders[state.currentOrderIndex];
      logMessage(`AUTO: Moving to next order for ${nextOrder.deliveryDate}.`);
      updateOrderDisplay();
    } else {
      logMessage("AUTO: All orders completed!");
      stopSimulation();
    }
  }
}

// AI system logic with reinforcement learning concepts
function aiSystem() {
  // Check if we've completed all orders
  if (state.currentOrderIndex >= state.orders.length) {
    logMessage("AI: All orders are already completed.");
    stopSimulation();
    return;
  }

  const currentOrder = state.orders[state.currentOrderIndex];
  const tankPercentage = (state.tankLevel / TANK_CAPACITY) * 100;
  
  // The key difference: AI will check if there's enough water to complete the current bottle
  // even if below the threshold
  if (tankPercentage <= REFILL_THRESHOLD) {
    // Calculate if we have enough water to fill at least one more bottle
    const remainingWaterNeeded = getNextBottleSize();
    
    if (remainingWaterNeeded > 0 && state.tankLevel >= remainingWaterNeeded) {
      // Make exception - continue filling
      logMessage(`AI: Making exception - continuing production despite low tank level (${tankPercentage.toFixed(1)}%).`);
      logMessage(`AI: Tank has ${state.tankLevel.toFixed(1)}L which is enough for next bottle (${remainingWaterNeeded}L).`);
      state.exceptions++;
      
      // Adjust flow rate for efficiency
      state.flowRate = Math.min(MAX_FLOW_RATE, Math.max(0.1, remainingWaterNeeded / 2));
      logMessage(`AI: Optimized flow rate to ${state.flowRate.toFixed(2)}L/s`);
      
      // Continue with current order
      if (currentOrder.bottles500mlFilled < currentOrder.bottles500ml) {
        fillBottle("500ml");
      } else if (currentOrder.bottles300mlFilled < currentOrder.bottles300ml) {
        fillBottle("300ml");
      }
    } else {
      // Need to refill
      logMessage(`AI: Tank level at ${tankPercentage.toFixed(1)}% with insufficient water for next bottle.`);
      refillTank();
    }
  } else {
    // Normal production with optimized flow rate
    // AI dynamically adjusts flow rate based on remaining order
    const totalRemainingWater = currentOrder.remainingWaterNeeded;
    const optimalFlowRate = calculateOptimalFlowRate(totalRemainingWater);
    
    if (state.flowRate !== optimalFlowRate) {
      state.flowRate = optimalFlowRate;
      logMessage(`AI: Adjusted flow rate to ${state.flowRate.toFixed(2)}L/s based on order requirements.`);
    }
    
    // Continue with current order
    if (currentOrder.bottles500mlFilled < currentOrder.bottles500ml) {
      fillBottle("500ml");
    } else if (currentOrder.bottles300mlFilled < currentOrder.bottles300ml) {
      fillBottle("300ml");
    } else {
      // Move to next order
      logMessage(`AI: Order for ${currentOrder.deliveryDate} completed.`);
      state.currentOrderIndex++;
      if (state.currentOrderIndex < state.orders.length) {
        updateOrderDisplay();
      } else {
        logMessage("AI: All orders completed!");
        stopSimulation();
      }
    }
  }
}

// Helper function to calculate optimal flow rate based on RL principles
function calculateOptimalFlowRate(remainingWater) {
  // Simple policy: 
  // - Higher flow rate for larger orders
  // - Lower flow rate when tank is getting low
  const tankRatio = state.tankLevel / TANK_CAPACITY;
  const baseRate = Math.min(MAX_FLOW_RATE, Math.max(0.1, remainingWater / 50));
  return baseRate * (0.5 + 0.5 * tankRatio); // Scale by tank level
}

// Fills a bottle and updates state
function fillBottle(bottleType) {
  if (state.currentOrderIndex >= state.orders.length) return;
  
  const currentOrder = state.orders[state.currentOrderIndex];
  const waterNeeded = bottleType === "500ml" ? BOTTLE_500ML : BOTTLE_300ML;
  
  // Check if there's enough water
  if (state.tankLevel < waterNeeded) {
    logMessage(`Not enough water to fill ${bottleType} bottle. Need to refill tank.`);
    refillTank();
    return;
  }
  
  // Fill bottle
  state.tankLevel -= waterNeeded;
  
  if (bottleType === "500ml") {
    currentOrder.bottles500mlFilled++;
    state.bottlesFilled500ml++;
    logMessage(`Filled a 500ml bottle. (${currentOrder.bottles500mlFilled}/${currentOrder.bottles500ml})`);
  } else {
    currentOrder.bottles300mlFilled++;
    state.bottlesFilled300ml++;
    logMessage(`Filled a 300ml bottle. (${currentOrder.bottles300mlFilled}/${currentOrder.bottles300ml})`);
  }
  
  updateDisplay();
  
  // Update progress bars
  const progress500ml = currentOrder.bottles500mlFilled / currentOrder.bottles500ml * 100;
  const progress300ml = currentOrder.bottles300mlFilled / currentOrder.bottles300ml * 100;
  
  const progressBar500ml = document.getElementById('progress-bar-500ml');
  const progressBar300ml = document.getElementById('progress-bar-300ml');
  
  if (progressBar500ml) progressBar500ml.style.width = `${progress500ml}%`;
  if (progressBar300ml) progressBar300ml.style.width = `${progress300ml}%`;
}

// Refills the tank
function refillTank() {
  logMessage(`Refilling tank. Current level: ${state.tankLevel.toFixed(1)}L`);
  
  // Simulate time to refill
  const timeToRefill = (TANK_CAPACITY - state.tankLevel) / REFILL_RATE;
  state.currentTime += timeToRefill;
  state.tankLevel = TANK_CAPACITY;
  
  logMessage(`Tank refilled to capacity (${TANK_CAPACITY}L) in ${timeToRefill.toFixed(1)} seconds.`);
  updateDisplay();
}

// Helper function to get the size of the next bottle to be filled
function getNextBottleSize() {
  if (state.currentOrderIndex >= state.orders.length) return 0;
  
  const currentOrder = state.orders[state.currentOrderIndex];
  
  if (currentOrder.bottles500mlFilled < currentOrder.bottles500ml) {
    return BOTTLE_500ML;
  } else if (currentOrder.bottles300mlFilled < currentOrder.bottles300ml) {
    return BOTTLE_300ML;
  }
  
  return 0; // No more bottles to fill in this order
}

// Main simulation loop
function runSimulation() {
  if (!state.running) return;
  
  // Decision making based on mode
  switch(state.currentMode) {
    case "auto":
      automatedSystem();
      break;
    case "ai":
      aiSystem();
      break;
  }
  
  // Update time
  state.currentTime += 1;
  updateDisplay();
  
  // Continue simulation
  setTimeout(runSimulation, 500); // Run every 0.5 seconds for visualization
}

// Start the simulation
function startSimulation() {
  if (state.running) return;
  
  state.running = true;
  logMessage(`Started simulation in ${state.currentMode.toUpperCase()} mode.`);
  runSimulation();
}

// Stop the simulation
function stopSimulation() {
  state.running = false;
  logMessage("Simulation stopped.");
}

// Reset the simulation
function resetSimulation() {
  state = {
    tankLevel: TANK_CAPACITY,
    bottlesFilled500ml: 0,
    bottlesFilled300ml: 0,
    currentMode: state.currentMode,
    orders: [],
    currentOrderIndex: 0,
    currentTime: 0,
    flowRate: MAX_FLOW_RATE,
    running: false,
    logs: [],
    exceptions: 0,
  };
  
  initializeOrders();
  updateDisplay();
  logMessage("Simulation reset.");
  
  // Reset progress bars
  const progressBar500ml = document.getElementById('progress-bar-500ml');
  const progressBar300ml = document.getElementById('progress-bar-300ml');
  
  if (progressBar500ml) progressBar500ml.style.width = "0%";
  if (progressBar300ml) progressBar300ml.style.width = "0%";
}

// Change mode
function changeMode(mode) {
  state.currentMode = mode;
  logMessage(`Switched to ${mode.toUpperCase()} mode.`);
  
  // Update the mode indicator text and style
  const currentModeEl = document.getElementById('current-mode');
  if (currentModeEl) {
    currentModeEl.textContent = mode.charAt(0).toUpperCase() + mode.slice(1);
    
    // Set the background color based on mode
    if (mode === 'auto') {
      currentModeEl.style.backgroundColor = 'var(--auto-color)';
    } else if (mode === 'ai') {
      currentModeEl.style.backgroundColor = 'var(--ai-color)';
    }
  }
  
  // Update active class on mode buttons
  const autoModeBtn = document.getElementById('auto-mode');
  const aiModeBtn = document.getElementById('ai-mode');
  
  if (autoModeBtn) autoModeBtn.classList.remove('active');
  if (aiModeBtn) aiModeBtn.classList.remove('active');
  
  // Add active class to selected mode button
  if (mode === 'auto' && autoModeBtn) {
    autoModeBtn.classList.add('active');
  } else if (mode === 'ai' && aiModeBtn) {
    aiModeBtn.classList.add('active');
  }
}

// Log a message
function logMessage(message) {
  const timeStamp = state.currentTime.toFixed(1);
  const logEntry = `[${timeStamp}s] ${message}`;
  state.logs.unshift(logEntry);
  
  // Keep log size manageable
  if (state.logs.length > 50) {
    state.logs.pop();
  }
  
  updateLogDisplay();
}

// Update display
function updateDisplay() {
  const tankPercentage = (state.tankLevel / TANK_CAPACITY) * 100;
  
  // Check if elements exist before updating them
  const tankLevelEl = document.getElementById('tank-level');
  if (tankLevelEl) tankLevelEl.textContent = state.tankLevel.toFixed(1);
  
  const tankPercentageEl = document.getElementById('tank-percentage');
  if (tankPercentageEl) tankPercentageEl.textContent = tankPercentage.toFixed(1);
  
  const bottles500mlEl = document.getElementById('bottles-500ml');
  if (bottles500mlEl) bottles500mlEl.textContent = state.bottlesFilled500ml;
  
  const bottles300mlEl = document.getElementById('bottles-300ml');
  if (bottles300mlEl) bottles300mlEl.textContent = state.bottlesFilled300ml;
  
  const simulationTimeEl = document.getElementById('simulation-time');
  if (simulationTimeEl) simulationTimeEl.textContent = state.currentTime.toFixed(1);
  
  const flowRateEl = document.getElementById('flow-rate');
  if (flowRateEl) flowRateEl.textContent = state.flowRate.toFixed(2);
  
  const exceptionsEl = document.getElementById('exceptions');
  if (exceptionsEl) exceptionsEl.textContent = state.exceptions;
  
  // Update tank visualization
  const tankFillEl = document.getElementById('tank-fill');
  if (tankFillEl) {
    tankFillEl.style.height = `${tankPercentage}%`;
    
    // Highlight refill threshold
    if (tankPercentage <= REFILL_THRESHOLD) {
      tankFillEl.classList.add('low-level');
    } else {
      tankFillEl.classList.remove('low-level');
    }
  }
  
  updateOrderDisplay();
  updateProgressBars();
}

// Update order display
function updateOrderDisplay() {
  // Check if elements exist before updating them
  const orderDayEl = document.getElementById('order-day');
  const order500mlEl = document.getElementById('order-500ml');
  const order300mlEl = document.getElementById('order-300ml');
  const filled500mlEl = document.getElementById('filled-500ml');
  const filled300mlEl = document.getElementById('filled-300ml');
  const currentOrderEl = document.getElementById('current-order');
  
  if (state.currentOrderIndex >= state.orders.length) {
    if (currentOrderEl) currentOrderEl.innerHTML = "<p>All orders completed</p>";
    return;
  }
  
  const order = state.orders[state.currentOrderIndex];
  
  if (orderDayEl) orderDayEl.textContent = order.deliveryDate;
  if (order500mlEl) order500mlEl.textContent = order.bottles500ml;
  if (order300mlEl) order300mlEl.textContent = order.bottles300ml;
  if (filled500mlEl) filled500mlEl.textContent = order.bottles500mlFilled;
  if (filled300mlEl) filled300mlEl.textContent = order.bottles300mlFilled;
}

// Update progress bars
function updateProgressBars() {
  if (state.currentOrderIndex >= state.orders.length) return;
  
  const currentOrder = state.orders[state.currentOrderIndex];
  const progress500ml = currentOrder.bottles500mlFilled / currentOrder.bottles500ml * 100;
  const progress300ml = currentOrder.bottles300mlFilled / currentOrder.bottles300ml * 100;
  
  const progressBar500ml = document.getElementById('progress-bar-500ml');
  const progressBar300ml = document.getElementById('progress-bar-300ml');
  
  if (progressBar500ml) progressBar500ml.style.width = `${progress500ml}%`;
  if (progressBar300ml) progressBar300ml.style.width = `${progress300ml}%`;
}

// Update log display
function updateLogDisplay() {
  const logContainer = document.getElementById('log-container');
  if (!logContainer) return;
  
  logContainer.innerHTML = '';
  
  state.logs.forEach(log => {
    const logElement = document.createElement('div');
    logElement.classList.add('log-entry');
    
    // Color code logs based on decision maker
    if (log.includes('AUTO:')) {
      logElement.classList.add('auto-log');
    } else if (log.includes('AI:')) {
      logElement.classList.add('ai-log');
    }
    
    logElement.textContent = log;
    logContainer.appendChild(logElement);
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  initializeOrders();
  updateDisplay();
  
  // Event listeners for buttons
  const startBtn = document.getElementById('start-btn');
  if (startBtn) startBtn.addEventListener('click', startSimulation);
  
  const stopBtn = document.getElementById('stop-btn');
  if (stopBtn) stopBtn.addEventListener('click', stopSimulation);
  
  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) resetBtn.addEventListener('click', resetSimulation);
  
  const autoModeBtn = document.getElementById('auto-mode');
  if (autoModeBtn) autoModeBtn.addEventListener('click', () => changeMode('auto'));
  
  const aiModeBtn = document.getElementById('ai-mode');
  if (aiModeBtn) aiModeBtn.addEventListener('click', () => changeMode('ai'));
  
  // New event listeners
  const updateOrderBtn = document.getElementById('update-order-btn');
  if (updateOrderBtn) updateOrderBtn.addEventListener('click', updateOrderQuantities);
  
  const forceLowLevelBtn = document.getElementById('force-low-level');
  if (forceLowLevelBtn) forceLowLevelBtn.addEventListener('click', forceLowTankLevel);
  
  const showDecisionLogBtn = document.getElementById('show-decision-log');
  if (showDecisionLogBtn) showDecisionLogBtn.addEventListener('click', showDecisionLog);
  
  // Initialize display
  updateDisplay();
});

document.addEventListener('DOMContentLoaded', function() {
  const hideExplanationBtn = document.getElementById('hide-explanation');
  const explanationPanel = document.querySelector('.explanation-panel');
  
  if (hideExplanationBtn && explanationPanel) {
      hideExplanationBtn.addEventListener('click', function() {
          if (explanationPanel.style.display === 'none') {
              explanationPanel.style.display = 'block';
              this.textContent = 'Hide Explanation';
          } else {
              explanationPanel.style.display = 'none';
              this.textContent = 'Show Explanation';
          }
      });
  }
});

// Update current order quantities
function updateOrderQuantities() {
  if (state.currentOrderIndex >= state.orders.length) return;
  
  const bottles500ml = parseInt(document.getElementById('bottles-500ml-input').value) || 0;
  const bottles300ml = parseInt(document.getElementById('bottles-300ml-input').value) || 0;
  
  if (bottles500ml <= 0 && bottles300ml <= 0) {
    logMessage("Please enter valid bottle quantities greater than zero.");
    return;
  }
  
  const currentOrder = state.orders[state.currentOrderIndex];
  
  // Update the order with new quantities
  const additionalWater = bottles500ml * BOTTLE_500ML + bottles300ml * BOTTLE_300ML;
  
  currentOrder.bottles500ml += bottles500ml;
  currentOrder.bottles300ml += bottles300ml;
  
  logMessage(`Order updated: Added ${bottles500ml} 500ml bottles and ${bottles300ml} 300ml bottles.`);
  logMessage(`Additional water required: ${additionalWater.toFixed(1)}L`);
  
  // Reset input fields
  document.getElementById('bottles-500ml-input').value = 0;
  document.getElementById('bottles-300ml-input').value = 0;
  
  updateOrderDisplay();
  updateProgressBars();
}

// Function to force the tank to a low level
function forceLowTankLevel() {
  const newLevel = TANK_CAPACITY * (REFILL_THRESHOLD / 100 + 0.02); // Just above threshold
  state.tankLevel = newLevel;
  
  const tankPercentage = (newLevel / TANK_CAPACITY) * 100;
  logMessage(`DEBUG: Tank level forcibly set to ${newLevel.toFixed(1)}L (${tankPercentage.toFixed(1)}%)`);
  logMessage(`DEBUG: This is slightly above the ${REFILL_THRESHOLD}% threshold to test decision making.`);
  
  updateDisplay();
}

// Function to show a detailed decision log
function showDecisionLog() {
  const currentOrder = state.currentOrderIndex < state.orders.length ? 
                        state.orders[state.currentOrderIndex] : null;
  
  if (!currentOrder) {
    logMessage("DEBUG: No active order to analyze.");
    return;
  }
  
  const tankPercentage = (state.tankLevel / TANK_CAPACITY) * 100;
  const nextBottleSize = getNextBottleSize();
  
  logMessage("DEBUG: Current system state analysis");
  logMessage(`DEBUG: Tank level: ${state.tankLevel.toFixed(1)}L (${tankPercentage.toFixed(1)}%)`);
  logMessage(`DEBUG: Threshold: ${REFILL_THRESHOLD}%`);
  logMessage(`DEBUG: Next bottle needs ${nextBottleSize.toFixed(1)}L`);
  
  if (tankPercentage <= REFILL_THRESHOLD) {
    if (nextBottleSize > 0 && nextBottleSize <= state.tankLevel) {
      logMessage("DEBUG: AI would fill at least one more bottle");
    } else {
      logMessage("DEBUG: AI would refill now");
    }
    
    logMessage("DEBUG: AUTO would refill now without exceptions");
  } else {
    logMessage("DEBUG: All systems would continue normal operation (above threshold)");
  }
}
