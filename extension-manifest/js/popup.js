document.addEventListener('DOMContentLoaded', () => {

    const countrySelect = document.getElementById('country-select');
    const leaseTimeInput = document.getElementById('lease-time');
    const getConfigButton = document.getElementById('get-config');
    const configDisplay = document.getElementById('config-display');
    const configText = document.getElementById('config-text');
    const expiryTime = document.getElementById('expiry-time');
    const downloadConfigButton = document.getElementById('download-config');
    const copyConfigButton = document.getElementById('copy-config');
    const saveConfigButton = document.getElementById('save-config');
    const savedConfigsSection = document.getElementById('saved-configs');
    const savedConfigsList = document.getElementById('saved-configs-list');
    const qrCodeCanvas = document.getElementById('qr-code');

    const VALIDATOR_IP = '185.189.44.166'; // Example validator IP
    const API_BASE = `http://${VALIDATOR_IP}:3000/api/config`;
    const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    let currentConfig = null;
    let currentExpiry = null;

    // Load available countries
    async function loadCountries() {
        try {
            // Check cache first
            const cache = await chrome.storage.local.get(['countriesCache']);
            const { countries, timestamp } = cache.countriesCache || {};
            const now = Date.now();

            // If cache exists and is not expired, use cached data
            if (countries && timestamp && (now - timestamp) < CACHE_DURATION) {
                updateCountrySelect(countries);
                return;
            }

            // Fetch fresh data if cache is missing or expired
            const response = await fetch(`${API_BASE}/countries`);
            const freshCountries = await response.json();
            
            // Update cache
            await chrome.storage.local.set({
                countriesCache: {
                    countries: freshCountries,
                    timestamp: now
                }
            });

            updateCountrySelect(freshCountries);
        } catch (error) {
            console.error('Failed to load countries:', error);
            
            // If fetch fails, try to use cached data regardless of age
            const cache = await chrome.storage.local.get(['countriesCache']);
            const { countries } = cache.countriesCache || {};
            
            if (countries) {
                console.log('Using cached countries data due to fetch error');
                updateCountrySelect(countries);
            }
        }
    }

    // Update country select dropdown
    function updateCountrySelect(countries) {
        countrySelect.innerHTML = `
            <option value="any">Any Location</option>
            ${countries.map(country => 
                `<option value="${country}">${country}</option>`
            ).join('')}
        `;
    }

    // Format time remaining
    function formatTimeRemaining(expiryTime) {
        const now = Date.now();
        const timeLeft = expiryTime - now;
        
        if (timeLeft <= 0) {
            return 'Expired';
        }
        
        const hours = Math.floor(timeLeft / (3600000));
        const minutes = Math.floor((timeLeft % 3600000) / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        
        if (hours > 0) {
            return `${hours}h ${minutes}m ${seconds}s`;
        }
        return `${minutes}m ${seconds}s`;
    }

    // Update current config expiry time
    function updateExpiryTime() {
        if (!currentExpiry) return;
        expiryTime.textContent = formatTimeRemaining(currentExpiry);
    }

    // Update saved configs expiry times
    function updateSavedConfigsExpiry() {
        const expiryElements = document.querySelectorAll('.saved-config-item .expiry');
        expiryElements.forEach(element => {
            const configId = element.closest('.saved-config-item').dataset.configId;
            const expiryTime = parseInt(element.dataset.expiryTime);
            if (!isNaN(expiryTime)) {
                element.textContent = 'Expires in: ' + formatTimeRemaining(expiryTime);
                
                // If just expired, reload saved configs to update UI
                if (expiryTime <= Date.now()) {
                    loadSavedConfigs();
                }
            }
        });
    }

    // Start expiry timers
    function startExpiryTimers() {
        // Clear existing intervals
        if (window.expiryInterval) {
            clearInterval(window.expiryInterval);
        }
        
        // Update both current and saved configs every second
        window.expiryInterval = setInterval(() => {
            updateExpiryTime();
            updateSavedConfigsExpiry();
        }, 1000);
    }

    // Generate QR code for configuration
    async function generateQRCode(config) {
        try {
            var qrcode = new QRCode(qrCodeCanvas, {
                text: config,
                width: 200,
                height: 200,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            });
            console.log(qrcode);
        } catch (error) {
            console.error('Error generating QR code:', error);
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
            currentExpiry = Date.now() + (leaseMinutes * 60 * 1000);
            
            configText.textContent = currentConfig;
            configDisplay.style.display = 'block';
            
            // Generate QR code with the new configuration
            await generateQRCode(currentConfig);
            
            // Start countdown timers
            startExpiryTimers();
        } catch (error) {
            console.error('Error getting VPN config:', error);
            alert('Failed to get VPN configuration. Please try again.');
        } finally {
            getConfigButton.disabled = false;
        }
    }

    // Save current configuration
    async function saveConfig() {
        if (!currentConfig || !currentExpiry) return;
        
        const config = {
            id: Date.now().toString(),
            config: currentConfig,
            location: countrySelect.value,
            expiresAt: currentExpiry,
            createdAt: Date.now()
        };
        
        // Save to storage
        const result = await chrome.storage.local.get(['savedConfigs']);
        const savedConfigs = result.savedConfigs || [];
        savedConfigs.push(config);
        await chrome.storage.local.set({ savedConfigs });
        
        // Set alarm for expiry
        chrome.alarms.create(`config-expiry-${config.id}`, {
            when: currentExpiry
        });
        
        // Update display
        loadSavedConfigs();
    }

    // Load saved configurations
    async function loadSavedConfigs() {
        const result = await chrome.storage.local.get(['savedConfigs']);
        const configs = result.savedConfigs || [];
        
        if (configs.length > 0) {
            savedConfigsSection.style.display = 'block';
            savedConfigsList.innerHTML = configs
                .sort((a, b) => b.createdAt - a.createdAt)
                .map(config => {
                    const isExpired = config.expiresAt <= Date.now();
                    return `
                        <div class="saved-config-item" data-config-id="${config.id}">
                            <div class="location">${config.location}</div>
                            <div class="expiry" data-expiry-time="${config.expiresAt}">
                                ${isExpired ? 'Expired' : 'Loading...'}
                            </div>
                            <div class="actions">
                                ${!isExpired ? `
                                    <button class="action-button copy-saved">Copy</button>
                                    <button class="action-button download-saved">Download</button>
                                ` : ''}
                                <button class="action-button delete delete-saved">Delete</button>
                            </div>
                        </div>
                    `;
                })
                .join('');
            
            // Start countdown timers
            startExpiryTimers();
        } else {
            savedConfigsSection.style.display = 'none';
        }
    }

    // Handle saved config actions using event delegation
    savedConfigsList.addEventListener('click', async (e) => {
        const configItem = e.target.closest('.saved-config-item');
        if (!configItem) return;

        const configId = configItem.dataset.configId;
        const result = await chrome.storage.local.get(['savedConfigs']);
        const config = result.savedConfigs.find(c => c.id === configId);
        
        if (!config) return;

        if (e.target.classList.contains('copy-saved')) {
            try {
                await navigator.clipboard.writeText(config.config);
                alert('Configuration copied to clipboard!');
            } catch (error) {
                console.error('Failed to copy config:', error);
                alert('Failed to copy configuration. Please try again.');
            }
        } else if (e.target.classList.contains('download-saved')) {
            const blob = new Blob([config.config], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `wireguard-${config.location}.conf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else if (e.target.classList.contains('delete-saved')) {
            const updatedConfigs = result.savedConfigs.filter(c => c.id !== configId);
            await chrome.storage.local.set({ savedConfigs: updatedConfigs });
            chrome.alarms.clear(`config-expiry-${configId}`);
            loadSavedConfigs();
        }
    });

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
    saveConfigButton.addEventListener('click', saveConfig);

    // Cleanup interval when popup closes
    window.addEventListener('unload', () => {
        if (window.expiryInterval) {
            clearInterval(window.expiryInterval);
        }
    });

    // Initialize
    loadCountries();
    loadSavedConfigs();
}); 