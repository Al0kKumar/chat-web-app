import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary.config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export const uploadProfilePic = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id; // user injected by JWT middleware

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const bufferToStream = (buffer: Buffer) => {
      const { Readable } = require('stream');
      const stream = new Readable();
      stream.push(buffer);
      stream.push(null);
      return stream;
    };

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'chat-app/profile-pics',
        public_id: `user_${userId}`,
        overwrite: true,
        resource_type: 'image',
      },
      async (err, result) => {
        if (err || !result) {
          console.error("Cloudinary Upload Failed:", err);
          return res.status(500).json({ message: 'Upload failed' });
        }

        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: {
            profilePic: result.secure_url,
            profilePicPublicId: result.public_id,
          },
        });

        return res.status(200).json({
          message: 'Profile picture uploaded successfully',
          profilePicUrl: result.secure_url,
          user: updatedUser,
        });
      }
    );

    bufferToStream(req.file.buffer).pipe(uploadStream);
  } catch (err: any) {
    console.error('Upload Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};



export const removeProfilePic = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    // Fetch user to get their current Cloudinary public_id
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { profilePicPublicId: true },
    });

    if (!user || !user.profilePicPublicId) {
      return res.status(400).json({ message: 'No profile picture to remove.' });
    }

    // Remove image from Cloudinary
    await cloudinary.uploader.destroy(user.profilePicPublicId);

    // Remove from DB
    await prisma.user.update({
      where: { id: userId },
      data: {
        profilePic: null,
        profilePicPublicId: null,
      },
    });

    return res.status(200).json({ message: 'Profile picture removed successfully.' });
  } catch (error: any) {
    console.error('❌ Error removing profile picture:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

