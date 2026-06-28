const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getPresignedUploadUrl } = require('../utils/s3');

router.post('/upload-url', auth, async (req, res) => {
  try {
    const { fileName, fileType } = req.body;
    if (!fileName || !fileType) {
      return res.status(400).json({ error: 'fileName and fileType are required' });
    }

    const presignedUrl = await getPresignedUploadUrl(fileName, fileType);
    res.json({ presignedUrl, fileName });
  } catch (err) {
    console.error('Error generating presigned URL:', err);
    res.status(500).json({ error: 'Failed to generate upload URL' });
  }
});

module.exports = router;
