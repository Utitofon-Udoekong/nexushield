import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
}

export function formatLatency(latency: number) {
  return `${latency}ms`;
}

export function getCountryName(code: string) {
  return new Intl.DisplayNames(["en"], { type: "region" }).of(code) || code;
}

export function getDeviceType(userAgent: string) {
  if (/mobile/i.test(userAgent)) {
    return "Mobile";
  } else if (/tablet/i.test(userAgent)) {
    return "Tablet";
  } else if (/tv/i.test(userAgent)) {
    return "TV";
  } else {
    return "Desktop";
  }
}

export function getOperatingSystem(userAgent: string) {
  if (/windows/i.test(userAgent)) {
    return "Windows";
  } else if (/macintosh/i.test(userAgent)) {
    return "macOS";
  } else if (/linux/i.test(userAgent)) {
    return "Linux";
  } else if (/android/i.test(userAgent)) {
    return "Android";
  } else if (/iphone|ipad|ipod/i.test(userAgent)) {
    return "iOS";
  } else {
    return "Unknown";
  }
}

export function getBrowser(userAgent: string) {
  if (/chrome/i.test(userAgent)) {
    return "Chrome";
  } else if (/firefox/i.test(userAgent)) {
    return "Firefox";
  } else if (/safari/i.test(userAgent)) {
    return "Safari";
  } else if (/edge/i.test(userAgent)) {
    return "Edge";
  } else if (/opera/i.test(userAgent)) {
    return "Opera";
  } else {
    return "Unknown";
  }
}

export function getLocationInfo(ip: string) {
  return fetch(`https://ipinfo.io/${ip}/json`)
    .then((response) => response.json())
    .catch(() => null);
}

export function getCurrentIP() {
  return fetch("https://api.ipify.org?format=json")
    .then((response) => response.json())
    .then((data) => data.ip)
    .catch(() => null);
}

export function getVPNStatus() {
  return fetch("https://api.ipify.org?format=json")
    .then((response) => response.json())
    .then((data) => ({
      ip: data.ip,
      timestamp: new Date().toISOString(),
    }))
    .catch(() => null);
}

export function getConnectionSpeed() {
  return new Promise((resolve) => {
    const startTime = performance.now();
    fetch("https://speed.cloudflare.com/__down?bytes=1000000")
      .then((response) => {
        const endTime = performance.now();
        const duration = (endTime - startTime) / 1000; // Convert to seconds
        const speed = (1000000 / duration) / 125000; // Convert to Mbps
        resolve(speed);
      })
      .catch(() => resolve(0));
  });
}

export function getPacketLoss() {
  return new Promise((resolve) => {
    let lost = 0;
    let total = 0;
    const startTime = Date.now();

    const check = () => {
      if (Date.now() - startTime > 5000) {
        resolve((lost / total) * 100);
        return;
      }

      fetch("https://api.ipify.org?format=json")
        .then(() => {
          total++;
        })
        .catch(() => {
          lost++;
          total++;
        })
        .finally(() => {
          setTimeout(check, 1000);
        });
    };

    check();
  });
} 

export function formatSpeed(speed: number): string {
  if (speed < 1000) {
    return `${speed.toFixed(1)} Mbps`
  }
  return `${(speed / 1000).toFixed(1)} Gbps`
} 