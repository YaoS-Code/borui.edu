import { NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import path from 'path';
import { mkdir } from 'fs/promises';

export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    
    // 确保上传目录存在
    try {
      await stat(uploadsDir);
    } catch (error) {
      // 如果目录不存在，创建它
      await mkdir(uploadsDir, { recursive: true });
    }
    
    // 读取uploads目录中的所有文件
    const files = await readdir(uploadsDir);
    
    // 过滤出图片文件
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );

    // 获取每个文件的详细信息
    const imagesData = await Promise.all(
      imageFiles.map(async (filename) => {
        const filePath = path.join(uploadsDir, filename);
        const fileStats = await stat(filePath);
        
        return {
          filename,
          uploadDate: fileStats.birthtime.toISOString(),
          title: filename.split('-').slice(2).join('-').split('.')[0] // 从文件名提取标题
        };
      })
    );

    // 按上传日期排序（最新的在前）
    imagesData.sort((a, b) => 
      new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    );

    return NextResponse.json({ 
      success: true,
      images: imagesData 
    });

  } catch (error) {
    console.error('Error reading gallery:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to load gallery',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}