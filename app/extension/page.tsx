"use client"

import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Icon } from "@iconify/react"
import { Navbar } from "@/app/components/navbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { useState } from "react"

export default function ExtensionPage() {
  const [selectedOs, setSelectedOs] = useState('windows')

  const handleDownload = (type: 'windows' | 'linux') => {
    const urls = {
      windows: '/api/extension/download/windows',
      linux: '/api/extension/download/linux'
    }
    window.location.href = urls[type]
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 py-16 text-center space-y-8 bg-gradient-to-b from-background to-muted">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            NexusShield VPN{" "}
            <span className="text-primary">Browser Extension</span>
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
            Quick access to WireGuard VPN configurations right from your browser.
            Generate, manage, and connect with just a few clicks.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="space-x-2" onClick={() => handleDownload('windows')}>
            <Icon icon="mdi:microsoft-windows" className="h-5 w-5" />
            <span>Download for Windows</span>
          </Button>
          <Button size="lg" variant="outline" className="space-x-2" onClick={() => handleDownload('linux')}>
            <Icon icon="mdi:linux" className="h-5 w-5" />
            <span>Download for Linux</span>
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Extension Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Icon icon="mdi:flash" className="h-8 w-8 text-primary" />
                <CardTitle>Quick Access</CardTitle>
                <CardDescription>
                  Generate VPN configurations directly from your browser toolbar without visiting the website.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon="mdi:qrcode" className="h-8 w-8 text-primary" />
                <CardTitle>QR Code Support</CardTitle>
                <CardDescription>
                  Instantly generate QR codes for easy configuration import on mobile devices.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon="mdi:clock-outline" className="h-8 w-8 text-primary" />
                <CardTitle>Configuration Management</CardTitle>
                <CardDescription>
                  Save and manage multiple configurations with expiration tracking and notifications.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon="mdi:earth" className="h-8 w-8 text-primary" />
                <CardTitle>Multiple Locations</CardTitle>
                <CardDescription>
                  Choose from various server locations and customize lease durations for your needs.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon="mdi:bell-outline" className="h-8 w-8 text-primary" />
                <CardTitle>Expiry Notifications</CardTitle>
                <CardDescription>
                  Get notified before your configurations expire to maintain uninterrupted access.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon="mdi:theme-light-dark" className="h-8 w-8 text-primary" />
                <CardTitle>Dark Mode Support</CardTitle>
                <CardDescription>
                  Automatically matches your browser's theme preference for comfortable viewing.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Installation Guide */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Installation Guide</h2>
          
          <Tabs defaultValue="windows" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="windows" onClick={() => setSelectedOs('windows')}>
                <Icon icon="mdi:microsoft-windows" className="mr-2 h-5 w-5" />
                Windows
              </TabsTrigger>
              <TabsTrigger value="linux" onClick={() => setSelectedOs('linux')}>
                <Icon icon="mdi:linux" className="mr-2 h-5 w-5" />
                Linux
              </TabsTrigger>
              <TabsTrigger value="mac" disabled>
                <Icon icon="mdi:apple" className="mr-2 h-5 w-5" />
                macOS (Coming Soon)
              </TabsTrigger>
            </TabsList>
            
            <Card className="border-0 shadow-none bg-transparent">
              <CardContent className="prose dark:prose-invert max-w-none pt-4">
                <TabsContent value="windows">
                  <div className="space-y-8">
                    <div className="relative">
                      <div className="absolute left-8 top-[50px] bottom-0 w-px bg-border/50 -z-10" />
                      {[
                        {
                          title: "Download and Extract Files",
                          icon: "mdi:folder-zip",
                          steps: [
                            'Download the zip file containing the Nexus Extension installation files',
                            'Navigate to your Downloads folder (or wherever you saved the file)',
                            'Right-click the zip file and select "Extract All..." or use your preferred extraction tool',
                            'Open the extracted folder to find nexus.crx and nexus_config.exe'
                          ]
                        },
                        {
                          title: "Install Nexus Configuration",
                          icon: "mdi:cog",
                          steps: [
                            'In the extracted folder, right-click on nexus_config.exe and select "Run as administrator"',
                            'If a User Account Control prompt appears, click "Yes" to allow the program to make changes',
                            'Read the Terms and Conditions presented, then click "Yes" to continue',
                            'Wait for the configuration to complete. You\'ll see a success message when finished'
                          ],
                          note: {
                            title: "Optional Verification",
                            sections: [
                              {
                                title: "Using Registry Editor",
                                steps: [
                                  'Press Win+R, type regedit and press Enter',
                                  'Navigate to HKEY_LOCAL_MACHINE\\SOFTWARE\\Policies\\Google\\Chrome\\ExtensionInstallAllowlist',
                                  'You should see your Nexus Extension ID listed'
                                ]
                              },
                              {
                                title: "Using Browser Policy Page",
                                content: [
                                  'For Chrome: Enter chrome://policy/ in the address bar',
                                  'For Brave: Enter brave://policy/ in the address bar',
                                  'For Edge: Enter edge://policy/ in the address bar',
                                  'Look for "ExtensionInstallAllowlist" and confirm your extension ID is listed'
                                ]
                              }
                            ]
                          }
                        },
                        {
                          title: "Restart Your Browser",
                          icon: "mdi:refresh",
                          steps: [
                            'Close and reopen your browser completely to apply the new settings'
                          ]
                        },
                        {
                          title: "Install the Nexus Extension",
                          icon: "mdi:extension",
                          steps: [
                            {
                              text: 'Open your browser\'s extension management page:',
                              list: [
                                'Chrome: chrome://extensions/',
                                'Brave: brave://extensions/',
                                'Edge: edge://extensions/'
                              ]
                            },
                            'Enable Developer mode by toggling the switch in the top-right corner',
                            'Refresh the page',
                            'Locate the nexus.crx file you extracted earlier',
                            'Drag and drop the file directly into the extensions page',
                            'Click "Add Extension" when prompted'
                          ]
                        },
                        {
                          title: "Pin and Use the Extension",
                          icon: "mdi:pin",
                          steps: [
                            'Click the puzzle piece icon in your browser toolbar',
                            'Find the Nexus Extension and click the pin icon to keep it visible',
                            'The extension icon will now appear on your toolbar for easy access'
                          ]
                        }
                      ].map((section, index) => (
                        <div key={index} className="mb-8 last:mb-0">
                          <div className="flex items-start gap-4">
                            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary shrink-0">
                              <Icon icon={section.icon} className="w-8 h-8" />
                            </div>
                            <div className="space-y-2">
                              <h3 className="text-xl font-semibold flex items-center gap-2">
                                Step {index + 1}: {section.title}
                              </h3>
                              <ol className="space-y-3 text-muted-foreground">
                                {section.steps.map((step, stepIndex) => (
                                  <li key={stepIndex} className="flex items-start gap-2">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium shrink-0">
                                      {stepIndex + 1}
                                    </span>
                                    <div className="pt-0.5 space-y-2">
                                      {typeof step === 'string' ? (
                                        step
                                      ) : (
                                        <>
                                          <p>{step.text}</p>
                                          {step.list && (
                                            <ul className="ml-4 space-y-1 text-sm">
                                              {step.list.map((item, i) => (
                                                <li key={i} className="list-disc">{item}</li>
                                              ))}
                                            </ul>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  </li>
                                ))}
                              </ol>
                              {section.note && (
                                <div className="mt-4 p-4 bg-muted rounded-lg">
                                  <h4 className="font-medium mb-3">{section.note.title}</h4>
                                  <div className="space-y-4">
                                    {section.note.sections.map((noteSection, i) => (
                                      <div key={i}>
                                        <h5 className="font-medium text-sm mb-2">{noteSection.title}</h5>
                                        <ul className="space-y-1 text-sm text-muted-foreground">
                                          {(noteSection.steps || noteSection.content).map((item, j) => (
                                            <li key={j} className="flex items-start gap-2">
                                              <Icon icon="mdi:chevron-right" className="w-4 h-4 shrink-0 mt-0.5" />
                                              {item}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Card className="bg-muted/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Icon icon="mdi:help-circle" className="w-5 h-5 text-primary" />
                          Need Help?
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          If you encounter any issues during installation, please contact our support team.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="linux">
                  <div className="space-y-8">
                    <div className="relative">
                      <div className="absolute left-8 top-[50px] bottom-0 w-px bg-border/50 -z-10" />
                      {[
                        {
                          title: "Download the Extension",
                          icon: "mdi:download",
                          steps: [
                            'Click the "Download for Linux" button above to download the extension package',
                            'The file will be downloaded as nexushield-extension-linux.zip',
                            {
                              text: 'Extract the archive using the terminal:',
                              code: 'unzip nexushield-extension-linux.zip',
                              note: 'Or use your system\'s archive manager to extract the files'
                            },
                            'You should see the nexushield-extension.crx file in the extracted folder'
                          ]
                        },
                        {
                          title: "Enable Developer Mode",
                          icon: "mdi:developer-board",
                          steps: [
                            'Open Chrome/Chromium browser',
                            'Click the three dots menu (⋮) in the top-right corner',
                            'Go to "Extensions" (or type chrome://extensions in the address bar)',
                            'Toggle on "Developer mode" in the top-right corner'
                          ]
                        },
                        {
                          title: "Install the Extension",
                          icon: "mdi:extension",
                          steps: [
                            'Drag and drop the nexushield-extension.crx file into the browser\'s extensions window',
                            'Click "Add Extension" when prompted to confirm',
                            'The NexusShield VPN extension should now appear in your extensions list'
                          ]
                        },
                        {
                          title: "Pin the Extension",
                          icon: "mdi:pin",
                          steps: [
                            'Click the puzzle piece icon (Extensions) in the Chrome toolbar',
                            'Find "NexusShield VPN" in the list',
                            'Click the pin icon to keep it visible in your toolbar'
                          ]
                        }
                      ].map((section, index) => (
                        <div key={index} className="mb-8 last:mb-0">
                          <div className="flex items-start gap-4">
                            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary shrink-0">
                              <Icon icon={section.icon} className="w-8 h-8" />
                            </div>
                            <div className="space-y-2">
                              <h3 className="text-xl font-semibold flex items-center gap-2">
                                Step {index + 1}: {section.title}
                              </h3>
                              <ol className="space-y-3 text-muted-foreground">
                                {section.steps.map((step, stepIndex) => (
                                  <li key={stepIndex} className="flex items-start gap-2">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium shrink-0">
                                      {stepIndex + 1}
                                    </span>
                                    <div className="pt-0.5 space-y-2">
                                      {typeof step === 'string' ? (
                                        step
                                      ) : (
                                        <>
                                          <p>{step.text}</p>
                                          {step.note && (
                                            <p className="text-sm text-muted-foreground/80">{step.note}</p>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Card className="bg-muted/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Icon icon="mdi:alert-circle" className="w-5 h-5 text-yellow-500" />
                          Troubleshooting
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3 text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <Icon icon="mdi:chevron-right" className="w-5 h-5 shrink-0 mt-0.5" />
                            If you see a "Manifest version 2 is deprecated" warning, you can safely ignore it
                          </li>
                          <li className="flex items-start gap-2">
                            <Icon icon="mdi:chevron-right" className="w-5 h-5 shrink-0 mt-0.5" />
                            If the extension doesn't appear after installation, try refreshing the extensions page
                          </li>
                          <li className="flex items-start gap-2">
                            <Icon icon="mdi:chevron-right" className="w-5 h-5 shrink-0 mt-0.5" />
                            Make sure Developer Mode is enabled before dragging the .crx file
                          </li>
                          <li className="flex items-start gap-2">
                            <Icon icon="mdi:chevron-right" className="w-5 h-5 shrink-0 mt-0.5" />
                            If you get an error, try closing and reopening your browser
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="mac">
                  <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Icon icon="mdi:apple" className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-2xl font-semibold">macOS Support Coming Soon</h3>
                    <p className="text-muted-foreground max-w-md">
                      We're working hard to bring NexusShield VPN to macOS. Stay tuned for updates!
                    </p>
                    <Button variant="outline" className="mt-4">
                      <Icon icon="mdi:bell-outline" className="w-4 h-4 mr-2" />
                      Get notified when available
                    </Button>
                  </div>
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Which browsers are supported?</CardTitle>
                <CardDescription>
                  The extension works with Chrome, Brave, and other Chromium-based browsers on both Windows and Linux.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Do I need an account to use the extension?</CardTitle>
                <CardDescription>
                  No account is required. Simply install the extension and start generating VPN configurations immediately.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>How secure is the extension?</CardTitle>
                <CardDescription>
                  The extension uses the same secure API as our web interface and doesn't store any sensitive data. All configurations are encrypted and stored locally.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Why manual installation?</CardTitle>
                <CardDescription>
                  Currently, we provide manual installation while our extension is under review for the Chrome Web Store. This allows you to start using the extension immediately.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 border-t mt-auto">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground">
            © 2024 NexusShield. All rights reserved.
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Button variant="link" size="sm" className="text-muted-foreground hover:text-primary">
              Privacy Policy
            </Button>
            <Button variant="link" size="sm" className="text-muted-foreground hover:text-primary">
              Terms of Use
            </Button>
            <Button variant="link" size="sm" className="text-muted-foreground hover:text-primary">
              Support
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
} 