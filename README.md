# NexusShield - WireGuard VPN Configuration Manager

NexusShield is a modern web application that simplifies the process of generating and managing WireGuard VPN configurations. Built with Next.js and TypeScript, it provides a user-friendly interface for creating VPN configurations, monitoring network performance, and managing connection settings. The included browser extension offers quick access to VPN configurations directly from your browser toolbar.

## Features

### VPN Configuration Management
- Generate WireGuard configurations for multiple countries
- Customizable lease durations for temporary configurations
- Download configuration files or use QR codes for mobile setup
- Save preferred country and lease duration settings

### Browser Extension
- Quick access to VPN configurations from your browser toolbar
- Available for Windows and Linux (macOS coming soon)
- Features:
  - Generate configurations with one click
  - Save configurations with expiry tracking
  - Dark mode support
  - Multiple server locations
  - QR code generation for mobile devices

### Network Monitoring
- Real-time speed testing capabilities
  - Download and upload speed measurements
  - Ping latency testing
  - Packet loss detection
- Connection quality monitoring
- Detailed network metrics

### Device Information
- Comprehensive device detection
- Operating system identification
- Browser information
- Current IP address and location details
- Network status monitoring

## Technology Stack

- **Frontend Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **Language**: TypeScript
- **State Management**: React Hooks and Local Storage
- **Network Testing**: Custom implementation using browser APIs
- **Browser Extension**: Chrome/Chromium Extension APIs
- **Icons**: Iconify

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/nexushield.git
   cd nexushield
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Extension Installation

### Windows
1. Download the Windows installation package
2. Run the configuration installer (requires administrator privileges)
3. Enable Developer mode in Chrome/Chromium
4. Install the extension through drag-and-drop
5. Pin the extension to your toolbar

### Linux
1. Download the Linux installation package
2. Enable Developer mode in Chrome/Chromium
3. Install the extension through drag-and-drop
4. Pin the extension to your toolbar

For detailed installation instructions, visit the extension page in the application.

## Usage

1. **Generate VPN Configuration**:
   - Visit the dashboard or use the browser extension
   - Select your preferred country
   - Set the lease duration
   - Generate and download the configuration

2. **Monitor Network Performance**:
   - Use the built-in speed test tool
   - View real-time network metrics
   - Track connection quality

3. **Manage Settings**:
   - Set default country preferences
   - Configure default lease durations
   - View device and network information

## Project Structure

```
nexushield/
├── app/
│   ├── components/    # Reusable UI components
│   ├── lib/          # Utility functions and helpers
│   ├── hooks/        # Custom React hooks
│   ├── extension/    # Extension installation page
│   └── dashboard/    # Dashboard pages and features
├── extension/        # Browser extension source
│   ├── popup/       # Extension UI
│   ├── background/  # Background scripts
│   └── icons/       # Extension icons
├── public/          # Static assets
└── styles/         # Global styles and Tailwind config
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Iconify](https://iconify.design/)
