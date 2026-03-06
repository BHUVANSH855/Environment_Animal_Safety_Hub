document.addEventListener('DOMContentLoaded', () => {
    // Edge Effect Visualizer
    const deforestationSlider = document.getElementById('deforestationSlider');
    const mapContainer = document.getElementById('mapContainer');
    const metricText = document.getElementById('spilloverRiskMetric');

    function updateVisualizer(value) {
        // Value goes from 0 to 100
        const index = parseInt(value, 10);
        
        // Change body background dynamically - Earthy to Biohazard/Earthy
        // Using var(--theme-forest) and fading to var(--theme-danger) or warning for the page
        // Wait, just shading map container
        
        mapContainer.innerHTML = ''; // clear islands
        
        // 0 = pristine forest (1 big island), 100 = completely fragmented (10+ small islands + red zones)
        
        let numIslands;
        let baseSize;
        if (index < 20) {
            numIslands = 1;
            baseSize = 90;
            metricText.textContent = "Risk: Very Low";
            metricText.style.color = 'white';
        } else if (index < 50) {
            numIslands = 3;
            baseSize = 60;
            metricText.textContent = "Risk: Moderate (Edges Expanding)";
            metricText.style.color = 'var(--theme-warning)';
        } else if (index < 80) {
            numIslands = 6;
            baseSize = 40;
            metricText.textContent = "Risk: High (Severe Fragmentation)";
            metricText.style.color = 'var(--theme-biohazard)';
        } else {
            numIslands = 12;
            baseSize = 20;
            metricText.textContent = "Risk: Critical (Max Contact Zones)";
            metricText.style.color = 'var(--theme-danger)';
        }

        // Generate islands
        for (let i = 0; i < numIslands; i++) {
            const island = document.createElement('div');
            island.className = 'forest-island';
            
            // Randomize slightly based on loop
            const size = baseSize - (Math.random() * (baseSize * 0.2));
            const x = Math.random() * (90 - size);
            const y = Math.random() * (90 - size);
            
            island.style.width = `${size}%`;
            island.style.height = `${size}%`;
            island.style.left = `${x}%`;
            island.style.top = `${y}%`;
            
            mapContainer.appendChild(island);
            
            if (index >= 20) {
                const zone = document.createElement('div');
                zone.className = 'contact-zone';
                zone.style.width = `${size + (index * 0.5)}%`;
                zone.style.height = `${size + (index * 0.5)}%`;
                zone.style.left = `${x - (index * 0.25)}%`;
                zone.style.top = `${y - (index * 0.25)}%`;
                
                // Opacity based on fragmentation
                zone.style.opacity = index / 150; 
                mapContainer.appendChild(zone);
            }
        }
        
        // Change background to dirt color (deforestation)
        const green = 43;
        const red = 43 + (index * 1.5); // towards brown/yellow #8b5a2b / biohazard
        mapContainer.style.backgroundColor = `rgb(${Math.min(red, 139)}, ${green + (index * 0.3)}, ${43-index/3})`;
    }

    if(deforestationSlider) {
        deforestationSlider.addEventListener('input', (e) => {
            updateVisualizer(e.target.value);
        });
        updateVisualizer(0);
    }

    // Pathogen Pathway Diagram interactivity
    const steps = document.querySelectorAll('.pathway-step');
    steps.forEach((step, idx) => {
        step.addEventListener('click', () => {
            // activate clicked and lower, deactivate higher
            steps.forEach((s, i) => {
                if (i <= idx) s.classList.add('active');
                else s.classList.remove('active');
            });
            
            // Text updater placeholder if we want to add dynamic content inside
        });
    });
});
