/* ==========================================================================
   Battery Alert Marketing Website Interactive Script
   Logic: Navigation, Simulator, SVG Chart Rendering, Tooltips, Scroll-reveal
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. Mobile Menu & Navigation Header Scroll
       ========================================== */
    const header = document.querySelector('.header');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Add scroll class to header for styling
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });

    // Toggle menu state on mobile button click
    mobileMenuBtn.addEventListener('click', () => {
        const isExpanded = navMenu.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (isExpanded) {
            icon.className = 'fa-solid fa-xmark';
        } else {
            icon.className = 'fa-solid fa-bars';
        }
    });

    // Close menu when navigation link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuBtn.querySelector('i').className = 'fa-solid fa-bars';
        });
    });


    /* ==========================================
       2. Scroll Reveal Animations (IntersectionObserver)
       ========================================== */
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));


    /* ==========================================
       3. Interactive Threshold Simulator Logic
       ========================================== */
    // Input Sliders
    const sliderBattery = document.getElementById('slider-battery');
    const sliderLow = document.getElementById('slider-low');
    const sliderHigh = document.getElementById('slider-high');

    // UI Value Indicators
    const valBattery = document.getElementById('val-battery');
    const valLow = document.getElementById('val-low');
    const valHigh = document.getElementById('val-high');

    // Mock Phone Elements
    const mockBatteryFill = document.getElementById('mock-battery-fill');
    const mockPercentageText = document.getElementById('mock-percentage-text');
    const mockHealth = document.getElementById('mock-health');
    const mockTemp = document.getElementById('mock-temp');
    const mockStatus = document.getElementById('mock-status');
    const liveAlertBanner = document.getElementById('live-alert-banner');
    const alertTitleText = document.getElementById('alert-title-text');
    const alertDescText = document.getElementById('alert-desc-text');
    const simulatorMessage = document.getElementById('simulator-message');
    const statusBatteryIcon = document.getElementById('status-battery-icon');

    function updateSimulation() {
        const level = parseInt(sliderBattery.value);
        const lowLimit = parseInt(sliderLow.value);
        const highLimit = parseInt(sliderHigh.value);

        // Update slider display labels
        valBattery.textContent = `${level}%`;
        valLow.textContent = `${lowLimit}%`;
        valHigh.textContent = `${highLimit}%`;

        // Update phone screen dashboard values
        mockPercentageText.textContent = `${level}%`;
        
        // Dynamic simulated temp (higher charge generates slightly more thermal dissipation)
        const computedTemp = Math.round(27 + (level * 0.08));
        mockTemp.textContent = `${computedTemp}°C`;

        // Adjust vertical battery fill height
        mockBatteryFill.style.height = `${level}%`;

        // Update status icon in top status bar
        if (level > 80) {
            statusBatteryIcon.className = 'fa-solid fa-battery-full';
        } else if (level > 40) {
            statusBatteryIcon.className = 'fa-solid fa-battery-three-quarters';
        } else if (level > 20) {
            statusBatteryIcon.className = 'fa-solid fa-battery-quarter';
        } else {
            statusBatteryIcon.className = 'fa-solid fa-battery-empty';
        }

        // Alarm checking logic
        if (level <= lowLimit) {
            // Low Limit alarm triggered
            mockBatteryFill.style.background = 'linear-gradient(to top, var(--color-red), #fb7185)';
            
            mockHealth.textContent = 'Critical';
            mockHealth.className = 'stat-val text-danger';
            mockStatus.textContent = 'Discharging';
            
            liveAlertBanner.className = 'alert-banner danger';
            liveAlertBanner.querySelector('.alert-icon i').className = 'fa-solid fa-triangle-exclamation';
            alertTitleText.textContent = 'Low Threshold Alarm!';
            alertDescText.textContent = `Battery is at ${level}%. Connect to power immediately.`;

            simulatorMessage.className = 'simulator-message alert-low';
            simulatorMessage.innerHTML = `<i class="fa-solid fa-bell"></i> Alarm Triggered - Critical discharge boundary breached!`;
        } 
        else if (level >= highLimit) {
            // High Limit alarm triggered
            mockBatteryFill.style.background = 'linear-gradient(to top, var(--color-yellow), #fcd34d)';
            
            mockHealth.textContent = 'Warm';
            mockHealth.className = 'stat-val text-danger';
            mockStatus.textContent = level === 100 ? 'Charged' : 'Charging';

            liveAlertBanner.className = 'alert-banner warning';
            liveAlertBanner.querySelector('.alert-icon i').className = 'fa-solid fa-plug';
            alertTitleText.textContent = 'High Threshold Alarm!';
            alertDescText.textContent = `Battery is at ${level}%. Disconnect the charger.`;

            simulatorMessage.className = 'simulator-message alert-high';
            simulatorMessage.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Alarm Triggered - Charging threshold limit hit!`;
        } 
        else {
            // Safe range
            mockBatteryFill.style.background = 'linear-gradient(to top, var(--color-green), #34d399)';
            
            mockHealth.textContent = 'Excellent';
            mockHealth.className = 'stat-val text-success';
            mockStatus.textContent = 'Monitoring';

            liveAlertBanner.className = 'alert-banner normal';
            liveAlertBanner.querySelector('.alert-icon i').className = 'fa-solid fa-circle-check';
            alertTitleText.textContent = 'Battery level normal';
            alertDescText.textContent = 'Maintaining recommended healthy battery charge range.';

            simulatorMessage.className = 'simulator-message normal';
            simulatorMessage.innerHTML = `<i class="fa-solid fa-circle-check"></i> System Stable - Charging level in safe range.`;
        }
    }

    // Attach simulation event listeners
    sliderBattery.addEventListener('input', updateSimulation);
    sliderLow.addEventListener('input', updateSimulation);
    sliderHigh.addEventListener('input', updateSimulation);
    
    // Initialize simulation details
    updateSimulation();


    /* ==========================================
       4. SVG Chart Plotting & Hover Tooltips
       ========================================== */
    const chartTimeframe = document.getElementById('chart-timeframe');
    const chartLabelsContainer = document.getElementById('chart-labels');
    
    // Selection buttons
    const btnDay = document.getElementById('btn-chart-day');
    const btnWeek = document.getElementById('btn-chart-week');
    const btnMonth = document.getElementById('btn-chart-month');
    const toggleButtons = [btnDay, btnWeek, btnMonth];

    // Data points structures
    // Points are scaled out of 8 uniform X steps: x coordinates = [40, 102.8, 165.7, 228.5, 291.4, 354.2, 417.1, 480]
    // Y battery scales: y = 210 (0%) to 30 (100%)
    // Y temp scales: y = 210 (20C) to 30 (50C)
    const datasets = {
        day: {
            title: 'Daily View',
            labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
            battery: [30, 48, 72, 80, 68, 52, 28, 45], // percentage
            temp: [26, 29, 34, 36, 32, 29, 27, 30] // celsius
        },
        week: {
            title: 'Weekly View',
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            // Needs 7 elements, let's map coordinates for 7 elements (X steps adjusted slightly in renderer)
            battery: [60, 45, 80, 75, 40, 55, 70],
            temp: [28, 27, 35, 33, 28, 30, 32]
        },
        month: {
            title: 'Monthly Trend',
            labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'],
            // Needs 4 elements
            battery: [80, 65, 78, 55],
            temp: [32, 30, 33, 29]
        }
    };

    let activePeriod = 'day';

    function getCoords(index, total, val, type) {
        // X maps from 40 to 480
        const startX = 40;
        const endX = 480;
        const width = endX - startX;
        const x = startX + (index / (total - 1)) * width;

        // Y maps from 210 (min value) to 30 (max value)
        const startY = 210;
        const endY = 30;
        const height = startY - endY;
        
        let y = 0;
        if (type === 'battery') {
            // battery: 0 to 100%
            y = startY - (val / 100) * height;
        } else {
            // temp: 20°C to 50°C
            const minTemp = 20;
            const maxTemp = 50;
            const percent = (val - minTemp) / (maxTemp - minTemp);
            y = startY - percent * height;
        }
        return { x, y };
    }

    function renderChart(period) {
        activePeriod = period;
        const data = datasets[period];
        
        // Update timeframe text
        chartTimeframe.textContent = data.title;

        // Update labels on bottom axis
        chartLabelsContainer.innerHTML = '';
        data.labels.forEach(label => {
            const span = document.createElement('span');
            span.textContent = label;
            chartLabelsContainer.appendChild(span);
        });

        // Compute SVG paths strings
        let batteryPathStr = '';
        let tempPathStr = '';
        const len = data.battery.length;

        for (let i = 0; i < len; i++) {
            const batCoords = getCoords(i, len, data.battery[i], 'battery');
            const tempCoords = getCoords(i, len, data.temp[i], 'temp');

            if (i === 0) {
                batteryPathStr += `M ${batCoords.x} ${batCoords.y}`;
                tempPathStr += `M ${tempCoords.x} ${tempCoords.y}`;
            } else {
                batteryPathStr += ` L ${batCoords.x} ${batCoords.y}`;
                tempPathStr += ` L ${tempCoords.x} ${tempCoords.y}`;
            }
        }

        // Apply path details to lines
        document.getElementById('chart-path-battery').setAttribute('d', batteryPathStr);
        document.getElementById('chart-path-temp').setAttribute('d', tempPathStr);

        // Apply battery shading fill (close path down to bottom line y=210)
        const firstBat = getCoords(0, len, data.battery[0], 'battery');
        const lastBat = getCoords(len - 1, len, data.battery[len - 1], 'battery');
        const fillPathStr = `${batteryPathStr} L ${lastBat.x} 210 L ${firstBat.x} 210 Z`;
        document.getElementById('chart-fill-battery').setAttribute('d', fillPathStr);
    }

    // Toggle logic for chart buttons
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active style from all
            toggleButtons.forEach(b => b.classList.remove('active'));
            // Add active style to target
            e.currentTarget.classList.add('active');
            // Render specific timeframe
            renderChart(e.currentTarget.dataset.period);
        });
    });

    // Render initial daily chart data
    renderChart('day');


    /* ==========================================
       5. Interactive Hover Tooltips on Chart
       ========================================== */
    const chartWrapper = document.querySelector('.chart-wrapper');
    const svgElement = document.getElementById('analytics-chart');
    const chartTooltip = document.getElementById('chart-tooltip');
    const tooltipDot = document.getElementById('chart-tooltip-dot');
    
    const tooltipTime = document.getElementById('tooltip-time');
    const tooltipBatteryVal = document.getElementById('tooltip-battery');
    const tooltipTempVal = document.getElementById('tooltip-temp');

    chartWrapper.addEventListener('mousemove', (e) => {
        const data = datasets[activePeriod];
        const len = data.battery.length;
        
        // Find click coordinate offset relative to the SVG container
        const rect = svgElement.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        
        // Compute SVG coordinate scales
        const scaleX = rect.width / 500;
        const scaleY = rect.height / 240;

        // Convert mouse X to SVG coordinate space
        const svgX = mouseX / scaleX;

        // Clamp index search to the bounds of the actual data path (from x=40 to x=480)
        const activeX = Math.max(40, Math.min(svgX, 480));
        
        // Determine nearest data point index
        let index = Math.round(((activeX - 40) / 440) * (len - 1));
        index = Math.max(0, Math.min(index, len - 1));

        // Get coordinates of the battery data point
        const coords = getCoords(index, len, data.battery[index], 'battery');
        const tempVal = data.temp[index];
        const batteryVal = data.battery[index];
        const label = data.labels[index];

        const screenX = coords.x * scaleX;
        const screenY = coords.y * scaleY;

        // Position tooltip highlight dot
        tooltipDot.style.display = 'block';
        tooltipDot.setAttribute('cx', coords.x);
        tooltipDot.setAttribute('cy', coords.y);

        // Populate details & position tooltip card
        tooltipTime.textContent = activePeriod === 'day' ? `Time: ${label}` : `${label}`;
        tooltipBatteryVal.textContent = `${batteryVal}%`;
        tooltipTempVal.textContent = `${tempVal}°C`;

        chartTooltip.style.opacity = '1';
        chartTooltip.style.left = `${screenX}px`;
        chartTooltip.style.top = `${screenY}px`;
    });

    chartWrapper.addEventListener('mouseleave', () => {
        // Hide tooltip widgets
        chartTooltip.style.opacity = '0';
        tooltipDot.style.display = 'none';
    });

    /* ==========================================
       6. GIF Animation Restart Logic
       ========================================== */
    const appGif = document.querySelector('.app-gif');
    if (appGif) {
        const restartGif = (img) => {
            const currentSrc = img.src;
            img.src = '';
            // Using a tiny timeout to ensure the DOM updates and restarts the gif
            setTimeout(() => {
                img.src = currentSrc;
            }, 50);
        };

        // Restart GIF when it scrolls into view
        const gifObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    restartGif(entry.target);
                }
            });
        }, { threshold: 0.15 });
        gifObserver.observe(appGif);

        // Also allow manual restart on click
        appGif.addEventListener('click', () => {
            restartGif(appGif);
        });
        
        // Add pointer cursor to show it is interactive
        appGif.style.cursor = 'pointer';
    }

});
