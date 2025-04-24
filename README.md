# NexusShield - WireGuard VPN Configuration Manager

NexusShield is a modern web application that simplifies the process of generating and managing WireGuard VPN configurations. Built with Next.js and TypeScript, it provides a user-friendly interface for creating VPN configurations, monitoring network performance, and managing connection settings.

## Features

### VPN Configuration Management
- Generate WireGuard configurations for multiple countries
- Customizable lease durations for temporary configurations
- Download configuration files or use QR codes for mobile setup
- Save preferred country and lease duration settings

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

## Usage

1. **Generate VPN Configuration**:
   - Visit the dashboard
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
│   └── dashboard/    # Dashboard pages and features
├── public/           # Static assets
└── styles/          # Global styles and Tailwind config
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Iconify](https://iconify.design/)
