import { performance } from 'perf_hooks';

/**
 * Performs a download speed test using multiple sample sizes
 * @returns Promise<number> Speed in Mbps
 */
export async function getServerDownloadSpeed(): Promise<number> {
  const sizes = [100000, 1000000, 10000000]; // 100KB, 1MB, 10MB
  const results: number[] = [];
  
  for (const bytes of sizes) {
    try {
      const start = performance.now();
      await fetch(`https://speed.cloudflare.com/__down?bytes=${bytes}`);
      const duration = performance.now() - start;
      
      // Convert to Mbps: (bytes * 8 bits/byte) / (duration in ms * 1000 ms/s)
      const speed = (bytes * 8) / (duration * 1000);
      results.push(speed);
    } catch (error) {
      console.error(`Error testing download speed with ${bytes} bytes:`, error);
    }
  }
  
  if (results.length === 0) return 0;
  
  // Return median speed for more stable results
  results.sort((a, b) => a - b);
  return Math.round(results[Math.floor(results.length / 2)]);
}

/**
 * Performs an upload speed test
 * @returns Promise<number> Speed in Mbps
 */
export async function getServerUploadSpeed(): Promise<number> {
  try {
    const data = new Uint8Array(1000000); // 1MB of data
    const start = performance.now();
    await fetch('https://speed.cloudflare.com/__up', {
      method: 'POST',
      body: data
    });
    const duration = performance.now() - start;
    return Math.round((data.length * 8) / (duration * 1000));
  } catch (error) {
    console.error('Error testing upload speed:', error);
    return 0;
  }
}

/**
 * Calculates packet loss by sending multiple requests
 * @returns Promise<number> Packet loss percentage
 */
export async function getServerPacketLoss(): Promise<number> {
  const totalTests = 10;
  let successfulTests = 0;
  
  for (let i = 0; i < totalTests; i++) {
    try {
      const start = performance.now();
      await fetch('https://speed.cloudflare.com/__down?bytes=1000');
      const duration = performance.now() - start;
      
      // Consider response successful if received within 1000ms
      if (duration < 1000) {
        successfulTests++;
      }
    } catch (error) {
      // Failed request counts towards packet loss
      console.error('Error in packet loss test:', error);
    }
  }
  
  const packetLoss = ((totalTests - successfulTests) / totalTests) * 100;
  return Math.round(packetLoss * 10) / 10; // Round to 1 decimal place
} 