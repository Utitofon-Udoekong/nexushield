import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  try {
    // Get the path to the CRX file in the public directory
    const filePath = join(process.cwd(), 'public', 'extension', 'nexushield-extension.crx')
    
    // Read the file
    const fileBuffer = readFileSync(filePath)
    
    // Create response with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/x-chrome-extension',
        'Content-Disposition': 'attachment; filename="nexushield-extension.crx"'
      }
    })
  } catch (error) {
    console.error('Error serving extension file:', error)
    return new NextResponse('Extension file not found', { status: 404 })
  }
} 