// Insights Page JavaScript
// Handles data aggregation and visualization for the analytics dashboard

class DeliveryInsights {
  constructor() {
    this.deliveries = this.loadDeliveries();
    this.initializeEventListeners();
    this.updateInsights();
  }

  loadDeliveries() {
    // Load deliveries from localStorage (populated by main.js via saveReceipt)
    const stored = localStorage.getItem('deliveryBills');
    return stored ? JSON.parse(stored) : [];
  }

  initializeEventListeners() {
    const refreshBtn = document.getElementById('refreshInsights');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => this.updateInsights());
    }

    // Also listen for storage changes from other pages
    window.addEventListener('storage', () => {
      this.deliveries = this.loadDeliveries();
      this.updateInsights();
    });
  }

  updateInsights() {
    this.updateKeyMetrics();
    this.updateRevenueMetrics();
    this.updateStatusChart();
    this.updateTopDestinations();
    this.updateTopAgents();
    this.updateRecentDeliveries();
    this.updateTimestamp();
  }

  updateKeyMetrics() {
    const total = this.deliveries.length;
    const completed = this.deliveries.filter(d => d.status === 'completed').length;
    const delivering = this.deliveries.filter(d => d.status === 'delivering').length;
    const scheduled = this.deliveries.filter(d => d.status === 'scheduled').length;
    const unsafe = this.deliveries.filter(d => d.status === 'unsafe').length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    this.setElementText('totalDeliveries', total);
    this.setElementText('completedDeliveries', completed);
    this.setElementText('completionRate', completionRate);
    this.setElementText('inProgressDeliveries', delivering);
    this.setElementText('scheduledDeliveries', scheduled);
    this.setElementText('unsafeDeliveries', unsafe);
  }

  updateRevenueMetrics() {
    const totalRiderFees = this.deliveries.reduce((sum, d) => sum + (parseFloat(d.riderFee) || 0), 0);
    const totalServiceFees = this.deliveries.reduce((sum, d) => sum + (parseFloat(d.serviceFee) || 0), 0);
    const totalRevenue = totalRiderFees + totalServiceFees;

    this.setElementText('totalRiderFees', totalRiderFees.toFixed(2));
    this.setElementText('totalServiceFees', totalServiceFees.toFixed(2));
    this.setElementText('totalRevenue', totalRevenue.toFixed(2));
  }

  updateStatusChart() {
    const total = this.deliveries.length;
    const completed = this.deliveries.filter(d => d.status === 'completed').length;
    const delivering = this.deliveries.filter(d => d.status === 'delivering').length;
    const scheduled = this.deliveries.filter(d => d.status === 'scheduled').length;
    const unsafe = this.deliveries.filter(d => d.status === 'unsafe').length;

    const getPercentage = (count) => total > 0 ? (count / total) * 100 : 0;

    this.updateBar('barCompleted', getPercentage(completed), 'valueCompleted', completed);
    this.updateBar('barDelivering', getPercentage(delivering), 'valueDelivering', delivering);
    this.updateBar('barScheduled', getPercentage(scheduled), 'valueScheduled', scheduled);
    this.updateBar('barUnsafe', getPercentage(unsafe), 'valueUnsafe', unsafe);
  }

  updateBar(barId, percentage, valueId, count) {
    const bar = document.getElementById(barId);
    const valueEl = document.getElementById(valueId);

    if (bar) bar.style.width = percentage + '%';
    if (valueEl) valueEl.textContent = count;
  }

  updateTopDestinations() {
    const container = document.getElementById('topDestinations');
    if (!container) return;

    const destinationMap = {};
    this.deliveries.forEach(d => {
      const dest = d.destination || 'Unknown';
      destinationMap[dest] = (destinationMap[dest] || 0) + 1;
    });

    const sorted = Object.entries(destinationMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    if (sorted.length === 0) {
      container.innerHTML = '<div class="empty-state">No destinations yet</div>';
      return;
    }

    container.innerHTML = sorted
      .map(
        ([dest, count]) => `
        <div class="destination-item">
          <span class="dest-name">${this.escapeHtml(dest)}</span>
          <span class="dest-count">${count} delivery(ies)</span>
        </div>
      `
      )
      .join('');
  }

  updateTopAgents() {
    const container = document.getElementById('topAgents');
    if (!container) return;

    const agentMap = {};
    this.deliveries.forEach(d => {
      const agent = d.agentName || 'Unknown Agent';
      if (!agentMap[agent]) {
        agentMap[agent] = {
          deliveries: 0,
          completed: 0,
          number: d.agentNumber || 'N/A',
        };
      }
      agentMap[agent].deliveries++;
      if (d.status === 'completed') agentMap[agent].completed++;
    });

    const sorted = Object.entries(agentMap)
      .map(([name, data]) => ({
        name,
        ...data,
        score: data.deliveries > 0 ? Math.round((data.completed / data.deliveries) * 100) : 0,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    if (sorted.length === 0) {
      container.innerHTML = '<div class="empty-state">No agents yet</div>';
      return;
    }

    container.innerHTML = sorted
      .map(
        (agent) => `
        <div class="agent-item">
          <div class="agent-info-display">
            <div class="agent-avatar">${agent.name.charAt(0).toUpperCase()}</div>
            <div class="agent-details">
              <div class="agent-name">${this.escapeHtml(agent.name)}</div>
              <div class="agent-stat">${agent.completed}/${agent.deliveries} completed</div>
            </div>
          </div>
          <div class="agent-score">${agent.score}%</div>
        </div>
      `
      )
      .join('');
  }

  updateRecentDeliveries() {
    const container = document.getElementById('recentDeliveries');
    if (!container) return;

    const recent = this.deliveries
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    if (recent.length === 0) {
      container.innerHTML = '<div class="empty-state">No deliveries recorded</div>';
      return;
    }

    container.innerHTML = recent
      .map((d) => {
        const status = d.status || 'scheduled';
        const statusEmoji = {
          completed: '✓',
          delivering: '→',
          scheduled: '⏱',
          unsafe: '⚠',
        }[status] || '•';

        return `
        <div class="recent-delivery-item">
          <div class="delivery-status-badge ${status}">${statusEmoji}</div>
          <div class="delivery-info">
            <div class="delivery-to">To: ${this.escapeHtml(d.receiverName || 'Unknown')}</div>
            <div class="delivery-meta">${this.escapeHtml(d.description || 'N/A')} • ${this.escapeHtml(d.destination || 'Unknown')}</div>
          </div>
          <div class="delivery-amount">₹${(parseFloat(d.riderFee) || 0).toFixed(2)}</div>
        </div>
      `;
      })
      .join('');
  }

  updateTimestamp() {
    const el = document.getElementById('lastUpdated');
    if (el) {
      const now = new Date();
      el.textContent = now.toLocaleTimeString();
    }
  }

  setElementText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize insights when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new DeliveryInsights();
});

// Menu toggle from main.js
const menuBtn = document.getElementById('menuBtn');
const parentContainer = document.getElementById('parentContainer');

if (menuBtn && parentContainer) {
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    parentContainer.classList.toggle('menu');
  });
}
