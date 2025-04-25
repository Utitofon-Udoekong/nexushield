// Handle config expiration alarms
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name.startsWith('config-expiry-')) {
        const configId = alarm.name.replace('config-expiry-', '');
        chrome.storage.local.get(['savedConfigs'], (result) => {
            const configs = result.savedConfigs || [];
            const config = configs.find(c => c.id === configId);
            
            if (config) {
                chrome.notifications.create({
                    type: 'basic',
                    iconUrl: 'icons/icon48.png',
                    title: 'VPN Configuration Expired',
                    message: `Your VPN configuration for ${config.location} has expired.`
                });

                // Remove expired config
                const updatedConfigs = configs.filter(c => c.id !== configId);
                chrome.storage.local.set({ savedConfigs: updatedConfigs });
            }
        });
    }
}); 