const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/media/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|svg|webp|mp4|avi|mov|wmv|flv|pdf|doc|docx|txt|rtf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Desteklenmeyen dosya formatı!'));
    }
  }
});

// Ensure upload directory exists
const ensureUploadDir = async () => {
  try {
    await fs.mkdir('uploads/media', { recursive: true });
  } catch (error) {
    console.error('Upload directory creation error:', error);
  }
};

// In-memory storage for demo (in real app, use database)
let mediaFiles = [];

// GET all media files
router.get('/', async (req, res) => {
  try {
    res.json(mediaFiles);
  } catch (error) {
    console.error('Media get error:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// POST upload multiple files
router.post('/upload', upload.array('files', 10), async (req, res) => {
  try {
    await ensureUploadDir();

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Dosya gerekli' });
    }

    const uploadedFiles = req.files.map(file => ({
      _id: Date.now() + Math.random(),
      filename: file.originalname,
      url: `/uploads/media/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype,
      uploadedAt: new Date()
    }));

    // Add to in-memory storage
    mediaFiles.push(...uploadedFiles);

    res.json({ 
      message: `${uploadedFiles.length} dosya başarıyla yüklendi`,
      files: uploadedFiles 
    });
  } catch (error) {
    console.error('Media upload error:', error);
    res.status(500).json({ error: 'Dosya yükleme hatası' });
  }
});

// DELETE media file
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find file in storage
    const fileIndex = mediaFiles.findIndex(file => file._id == id);
    if (fileIndex === -1) {
      return res.status(404).json({ error: 'Dosya bulunamadı' });
    }

    const file = mediaFiles[fileIndex];
    
    // Delete physical file
    try {
      await fs.unlink(`uploads/media/${path.basename(file.url)}`);
    } catch (error) {
      console.error('File deletion error:', error);
    }

    // Remove from storage
    mediaFiles.splice(fileIndex, 1);

    res.json({ message: 'Dosya başarıyla silindi' });
  } catch (error) {
    console.error('Media delete error:', error);
    res.status(500).json({ error: 'Dosya silme hatası' });
  }
});

// GET media file info
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const file = mediaFiles.find(f => f._id == id);
    if (!file) {
      return res.status(404).json({ error: 'Dosya bulunamadı' });
    }

    res.json(file);
  } catch (error) {
    console.error('Media get error:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

module.exports = router;
