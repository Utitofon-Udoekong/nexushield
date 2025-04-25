import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'public', 'extension', 'nexushield-extension-windows.zip')
    const fileBuffer = readFileSync(filePath)
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="nexushield-extension-windows.zip"'
      }
    })
  } catch (error) {
    console.error('Error serving Windows extension file:', error)
    return new NextResponse('Extension file not found', { status: 404 })
  }
} 