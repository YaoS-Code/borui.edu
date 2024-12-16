import { NextResponse } from 'next/server';
import { readdir, stat, mkdir } from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    // 确保路径正确
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    
    // 确保目录存在
    try {
      await stat(uploadsDir);
    } catch {
      await mkdir(uploadsDir, { recursive: true });
    }
    
    // 读取文件列表
    const files = await readdir(uploadsDir);
    
    // 过滤图片文件
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );

    // 获取文件信息
    const imagesData = await Promise.all(
      imageFiles.map(async (filename) => {
        const filePath = path.join(uploadsDir, filename);
        const fileStats = await stat(filePath);
        
        return {
          filename,
          uploadDate: fileStats.birthtime.toISOString(),
          title: filename.split('-').slice(2).join('-').split('.')[0]
        };
      })
    );

    return NextResponse.json({
      success: true,
      images: imagesData
    });

  } catch (error) {
    console.error('Gallery API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to load gallery' 
      },
      { status: 500 }
    );
  }
} 