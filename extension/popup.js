document.addEventListener('DOMContentLoaded', () => {
    const countrySelect = document.getElementById('country-select');
    const leaseTimeInput = document.getElementById('lease-time');
    const getConfigButton = document.getElementById('get-config');
    const configDisplay = document.getElementById('config-display');
    const configText = document.getElementById('config-text');
    const downloadConfigButton = document.getElementById('download-config');
    const copyConfigButton = document.getElementById('copy-config');

    const VALIDATOR_IP = '185.189.44.166'; // Example validator IP
    const API_BASE = `http://${VALIDATOR_IP}:3000/api/config`;

    let currentConfig = null;

    // Load available countries
    async function loadCountries() {
        try {
            const response = await fetch(`${API_BASE}/countries`);
            const countries = await response.json();
            
            countrySelect.innerHTML = `
                <option value="any">Any Location</option>
                ${countries.map(country => 
                    `<option value="${country}">${country}</option>`
                ).join('')}
            `;
        } catch (error) {
            console.error('Failed to load countries:', error);
        }
    }

    // Get VPN configuration
    async function getVPNConfig() {
        const country = countrySelect.value;
        const leaseMinutes = leaseTimeInput.value;

        if (!country || !leaseMinutes) {
            alert('Please select a location and lease duration');
            return;
        }

        getConfigButton.disabled = true;
        
        try {
            const response = await fetch(
                `${API_BASE}/new?format=text&geo=${country}&lease_minutes=${leaseMinutes}`
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch configuration');
            }

            currentConfig = await response.text();
            configText.textContent = currentConfig;
            configDisplay.style.display = 'block';
        } catch (error) {
            console.error('Error getting VPN config:', error);
            alert('Failed to get VPN configuration. Please try again.');
        } finally {
            getConfigButton.disabled = false;
        }
    }

    // Download configuration file
    function downloadConfig() {
        if (!currentConfig) return;
        
        const blob = new Blob([currentConfig], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'wireguard.conf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Copy configuration to clipboard
    async function copyConfig() {
        if (!currentConfig) return;
        
        try {
            await navigator.clipboard.writeText(currentConfig);
            alert('Configuration copied to clipboard!');
        } catch (error) {
            console.error('Failed to copy config:', error);
            alert('Failed to copy configuration. Please try again.');
        }
    }

    // Event listeners
    getConfigButton.addEventListener('click', getVPNConfig);
    downloadConfigButton.addEventListener('click', downloadConfig);
    copyConfigButton.addEventListener('click', copyConfig);

    // Initialize
    loadCountries();
}); 