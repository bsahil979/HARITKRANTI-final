# Image Storage System Documentation

## Overview

The application now uses a dedicated **Image model** to store all images (profile pictures, product images, etc.) in the database. This provides better organization, metadata tracking, and flexibility for image management.

## Architecture

### Image Model (`backend/src/models/Image.js`)

The Image model stores:
- **Image Data**: URL (Cloudinary) or base64 string
- **Storage Type**: `url` (Cloudinary) or `base64` (database)
- **Metadata**: filename, mimeType, size, width, height
- **Image Type**: `profile`, `product`, `farm`, `certificate`, `other`
- **References**: Links to User, Product, etc.
- **Owner**: Who uploaded the image

### Database Schema

```javascript
{
  url: String,                    // Cloudinary URL or base64 string
  storageType: "url" | "base64",  // How image is stored
  filename: String,
  mimeType: String,
  size: Number,
  width: Number,
  height: Number,
  imageType: "profile" | "product" | "farm" | "certificate" | "other",
  uploadedBy: ObjectId (ref: User),
  referencedBy: ObjectId,
  referencedModel: "User" | "Product" | "AdminProduct" | "Inventory",
  cloudinaryId: String,
  cloudinaryUrl: String,
  isActive: Boolean
}
```

## Updated Models

### User Model
- **`profileImage`**: String (backward compatibility - base64 or URL)
- **`profileImageRef`**: ObjectId (new - reference to Image model)

### Product Model
- **`imageUrl`**: String (backward compatibility)
- **`images`**: [String] (backward compatibility - array of URLs/base64)
- **`imageRefs`**: [ObjectId] (new - array of Image references)

## API Endpoints

### Upload Single Image
```
POST /api/images/upload
Content-Type: multipart/form-data
Body: {
  image: File,
  imageType: "profile" | "product" | "farm" | "certificate" | "other",
  referencedBy: ObjectId (optional),
  referencedModel: "User" | "Product" (optional)
}
```

### Upload Multiple Images
```
POST /api/images/upload-multiple
Content-Type: multipart/form-data
Body: {
  images: File[],
  imageType: "profile" | "product" | "farm" | "certificate" | "other",
  referencedBy: ObjectId (optional),
  referencedModel: "User" | "Product" (optional)
}
```

### Get Image by ID
```
GET /api/images/:id
```

### Get User Images
```
GET /api/images/user/:userId?imageType=profile
```

### Get Images by Reference
```
GET /api/images/reference/:model/:id
Example: GET /api/images/reference/Product/507f1f77bcf86cd799439011
```

### Delete Image
```
DELETE /api/images/:id
```

### Update Image Reference
```
PATCH /api/images/:id/reference
Body: {
  referencedBy: ObjectId,
  referencedModel: "User" | "Product"
}
```

## Usage Examples

### 1. Upload Profile Picture

**Frontend:**
```javascript
const formData = new FormData();
formData.append('image', file);
formData.append('imageType', 'profile');
formData.append('referencedBy', userId);
formData.append('referencedModel', 'User');

const response = await fetch('/api/images/upload', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});

const { data: image } = await response.json();

// Update user profile with image reference
await fetch('/api/users/profile', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    profileImageRef: image._id
  })
});
```

**Backend automatically:**
- Uploads to Cloudinary (or stores as base64 if Cloudinary fails)
- Creates Image document
- Returns image with `displayUrl` virtual field

### 2. Upload Product Images

**Frontend:**
```javascript
const formData = new FormData();
files.forEach(file => formData.append('images', file));
formData.append('imageType', 'product');
formData.append('referencedBy', productId);
formData.append('referencedModel', 'Product');

const response = await fetch('/api/images/upload-multiple', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});

const { data: images } = await response.json();

// Update product with image references
const imageIds = images.map(img => img._id);
await fetch(`/api/products/${productId}`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    imageRefs: imageIds
  })
});
```

### 3. Display Images

**When fetching User:**
```javascript
// User model automatically populates profileImageRef
const user = await fetch('/api/users/farmers/123');
// user.profileImageRef.displayUrl contains the image URL
```

**When fetching Product:**
```javascript
// Product model automatically populates imageRefs
const product = await fetch('/api/products/123');
// product.imageRefs[0].displayUrl contains the first image URL
```

## Storage Strategy

### Primary: Cloudinary
- Images are uploaded to Cloudinary
- Cloudinary URL is stored in `url` field
- `storageType` = "url"
- `cloudinaryId` and `cloudinaryUrl` are stored

### Fallback: Base64 in Database
- If Cloudinary upload fails, image is stored as base64
- Base64 string is stored in `url` field
- `storageType` = "base64"
- Used when Cloudinary is unavailable

## Migration Path

### Backward Compatibility
- Old `profileImage` (String) field still works
- Old `images` (String[]) field still works
- New `profileImageRef` and `imageRefs` are optional

### Migration Steps
1. Existing images continue to work via `profileImage` and `images` fields
2. New uploads use Image model and references
3. Gradually migrate existing images to Image model
4. Eventually deprecate old String fields

## Benefits

1. **Centralized Management**: All images in one collection
2. **Metadata Tracking**: Size, dimensions, upload date, etc.
3. **Reference Tracking**: Know which images belong to which entities
4. **Flexible Storage**: Cloudinary or database
5. **Better Queries**: Find all images by user, type, etc.
6. **Soft Deletes**: `isActive` flag for soft deletion
7. **Future Features**: Image optimization, CDN, thumbnails, etc.

## Frontend Integration

### Helper Function to Get Image URL

```javascript
// Get image URL from user or product
function getImageUrl(entity, type = 'profile') {
  if (type === 'profile') {
    // Try new Image reference first
    if (entity.profileImageRef?.displayUrl) {
      return entity.profileImageRef.displayUrl;
    }
    // Fallback to old profileImage field
    if (entity.profileImage) {
      return entity.profileImage.startsWith('data:') 
        ? entity.profileImage 
        : `data:image/jpeg;base64,${entity.profileImage}`;
    }
  } else if (type === 'product') {
    // Try new Image references first
    if (entity.imageRefs && entity.imageRefs.length > 0) {
      return entity.imageRefs[0].displayUrl;
    }
    // Fallback to old images field
    if (entity.images && entity.images.length > 0) {
      return entity.images[0];
    }
    if (entity.imageUrl) {
      return entity.imageUrl;
    }
  }
  return null; // No image found
}
```

## Next Steps

1. Update frontend to use new Image API endpoints
2. Create Redux slice for image management
3. Update all image upload forms to use new endpoints
4. Add image optimization/compression
5. Add thumbnail generation
6. Add image CDN support


