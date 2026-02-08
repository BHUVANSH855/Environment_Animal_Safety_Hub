// Demo data for preview
const demoSpecies = [
  { name: 'Eastern Bluebird', type: 'Bird', location: 'Central Park', date: '2026-02-07', notes: 'Seen near the pond.' },
  { name: 'Red Fox', type: 'Mammal', location: 'Riverside Trail', date: '2026-02-06', notes: 'Quickly crossed the path.' },
  { name: 'Milkweed', type: 'Plant', location: 'Meadow Field', date: '2026-02-05', notes: 'Flowering.' },
  { name: 'Painted Turtle', type: 'Reptile', location: 'Lake Edge', date: '2026-02-04', notes: 'Basking on a log.' }
];
const eduContent = `
  <strong>Why Biodiversity Matters:</strong><br>
  Biodiversity supports healthy ecosystems, clean air and water, and resilience to climate change.<br><br>
  <strong>How You Can Help:</strong>
  <ul>
    <li>Plant native species in your yard or community.</li>
    <li>Report wildlife sightings to help scientists track populations.</li>
    <li>Reduce pesticide and chemical use.</li>
    <li>Participate in local conservation events.</li>
  </ul>
`;

document.addEventListener('DOMContentLoaded', () => {
  // Map setup
  const map = L.map('map').setView([40.7831, -73.9712], 12); // Default: Central Park, NY
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Add demo markers
  demoSpecies.forEach(s => {
    L.marker([40.78 + Math.random() * 0.04, -73.97 + Math.random() * 0.04])
      .addTo(map)
      .bindPopup(`<strong>${s.name}</strong><br>${s.type}<br>${s.location}<br>${s.date}<br>${s.notes}`);
  });

  // Species list
  const speciesList = document.getElementById('species-list');
  function renderSpeciesList(list) {
    speciesList.innerHTML = '';
    list.forEach(s => {
      const div = document.createElement('div');
      div.className = 'species-card';
      div.innerHTML = `<strong>${s.name}</strong> <span>(${s.type})</span><br><small>${s.location} • ${s.date}</small><br><span>${s.notes}</span>`;
      speciesList.appendChild(div);
    });
  }
  renderSpeciesList(demoSpecies);

  // Educational content
  document.getElementById('edu-content').innerHTML = eduContent;

  // Search/filter
  document.getElementById('species-search').addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase();
    if (!q) {
      renderSpeciesList(demoSpecies);
      return;
    }
    const filtered = demoSpecies.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.type.toLowerCase().includes(q) ||
      s.location.toLowerCase().includes(q)
    );
    renderSpeciesList(filtered);
  });

  // Modal logic
  const modal = document.getElementById('report-modal');
  const openBtn = document.getElementById('report-btn');
  const closeBtn = document.querySelector('.close');
  openBtn.onclick = () => { modal.style.display = 'flex'; };
  closeBtn.onclick = () => { modal.style.display = 'none'; };
  window.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };

  // Report form (demo only)
  document.getElementById('report-form').onsubmit = e => {
    e.preventDefault();
    alert('Thank you for reporting your sighting! (Demo only)');
    modal.style.display = 'none';
  };
});
