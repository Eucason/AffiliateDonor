# 📝 Blog Feature Documentation

## 🌟 Overview

The Blog Feature adds a complete content management system to AffiliateDonations, allowing administrators to create, edit, publish, and manage blog posts. This feature enables the organization to share impact stories, updates, and educational content with website visitors.

## 🎯 Features

### ✅ Public Blog
- **/blog** - Public blog listing page showing all published posts
- **/blog/:slug** - Individual blog post page with full content
- Responsive design that matches AffiliateDonations branding
- SEO-optimized with meta titles and descriptions
- Markdown and HTML content support
- Featured images, categories, tags, and author information

### ✅ Admin Panel
- **/admin** - Admin dashboard with blog statistics
- **/admin/blogs** - Blog post management list
- **/admin/blogs/new** - Create new blog post
- **/admin/blogs/edit/:id** - Edit existing blog post
- Route protection with authentication
- Search, filter, and sorting capabilities
- Draft and published status management
- Delete confirmation with safety checks

### ✅ Technical Implementation
- Backend API with Go + Gin
- Frontend React components with TypeScript
- Database persistence with PostgreSQL/Supabase
- Authentication middleware for admin routes
- API-driven data fetching
- Form validation and error handling

## 📁 File Structure

### Frontend Files
```
src/
├── components/
│   ├── atoms/
│   │   └── StatusBadge.tsx          # Status indicator component
│   ├── organisms/
│   │   ├── AdminLayout.tsx          # Admin layout with sidebar
│   │   ├── AdminBlogTable.tsx       # Blog post management table
│   │   └── BlogForm.tsx             # Blog post creation/editing form
│   └── utils/
│       └── ProtectedRoute.tsx       # Route protection component
├── pages/
│   ├── Blog/
│   │   ├── BlogPage.tsx             # Public blog listing page
│   │   └── BlogDetailsPage.tsx      # Individual blog post page
│   └── Admin/
│       ├── AdminDashboardPage.tsx   # Admin dashboard
│       ├── AdminBlogsPage.tsx       # Blog post management
│       ├── AdminBlogCreatePage.tsx  # Create new post
│       └── AdminBlogEditPage.tsx    # Edit existing post
├── services/
│   └── blogAPI.ts                   # Blog API service
└── types/
    └── blog.ts                      # Blog TypeScript types
```

### Backend Files
```
backend/
├── handlers/
│   └── blogs.go                     # Blog handlers (CRUD operations)
├── middleware/
│   └── auth.go                      # Authentication middleware
├── migrations/
│   └── 002_create_blog_posts_table.sql  # Database migration
├── models/
│   └── models.go                    # BlogPost model
└── routes/
    └── routes.go                    # Blog route definitions
```

## 🔧 API Endpoints

### Public Endpoints
| Method | Endpoint          | Description                          |
|--------|-------------------|--------------------------------------|
| GET    | /api/blogs        | Get all published blog posts         |
| GET    | /api/blogs/:slug  | Get a single published blog post     |

### Admin Endpoints (Protected)
| Method | Endpoint               | Description                          |
|--------|------------------------|--------------------------------------|
| GET    | /api/admin/blogs       | Get all blog posts (including drafts)|
| GET    | /api/admin/blogs/:id   | Get a single blog post by ID         |
| POST   | /api/admin/blogs       | Create a new blog post               |
| PUT    | /api/admin/blogs/:id   | Update an existing blog post         |
| DELETE | /api/admin/blogs/:id   | Delete a blog post                   |

## 📝 Database Schema

```sql
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    content_format TEXT DEFAULT 'markdown' CHECK (content_format IN ('markdown', 'html')),
    featured_image_url TEXT,
    category TEXT,
    tags TEXT[] DEFAULT '{}',
    author_name TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('draft', 'published')),
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
```

## 🛠️ Setup Instructions

### 1. Database Setup

Run the migration to create the blog_posts table:

```bash
# If using Supabase migrations
psql -h your-supabase-url -U postgres -d postgres -f backend/migrations/002_create_blog_posts_table.sql

# Or apply manually through Supabase SQL editor
```

### 2. Environment Variables

Add these to your `.env` files:

**Frontend (.env)**
```env
# Admin authentication (optional for development)
VITE_ADMIN_AUTH_TOKEN=your_admin_token_for_development
```

**Backend (.env)**
```env
# Admin authentication
ADMIN_AUTH_TOKEN=your_secure_admin_token
```

### 3. Install Dependencies

```bash
# Install react-markdown for Markdown support
npm install react-markdown
```

## 🚀 Usage

### Creating a Blog Post
1. Navigate to `/admin/blogs/new`
2. Fill in the required fields (title, content, author name)
3. Choose status (draft or published)
4. Click "Create Post" or "Save as Draft"

### Publishing a Post
1. Edit the post
2. Change status to "Published"
3. Click "Update Post"
4. The post will now appear on the public `/blog` page

### Managing Posts
1. Navigate to `/admin/blogs`
2. Use search and filters to find posts
3. Click edit icon to modify a post
4. Click delete icon to remove a post (with confirmation)

## 🎨 Design Patterns

### Status Badge
The `StatusBadge` component provides visual indication of post status:
- **Draft**: Gray badge
- **Published**: Green badge

### Blog Form
The `BlogForm` component includes:
- Title field with auto-generated slug
- Content editor with Markdown/HTML support
- Featured image URL with preview
- Category and tag management
- SEO fields (title and description)
- Status selection (draft/published)

### Admin Layout
The `AdminLayout` component provides:
- Responsive sidebar navigation
- Mobile-friendly hamburger menu
- Consistent header with page titles
- Logout functionality
- Quick access to public site

## 🔒 Security

### Frontend Protection
- Admin routes are protected with `ProtectedRoute` component
- Uses existing `AuthContext` for authentication
- Redirects unauthenticated users to home page

### Backend Protection
- Admin endpoints use `SimpleAdminAuthMiddleware`
- Validates `X-Admin-Token` header
- Can be configured with `ADMIN_AUTH_TOKEN` environment variable
- Falls back to open access in development (when no token is set)

## 🧪 Testing

### Frontend Tests
1. Test public blog page at `/blog`
2. Test individual post pages at `/blog/:slug`
3. Test admin dashboard at `/admin`
4. Test blog management at `/admin/blogs`
5. Test post creation at `/admin/blogs/new`
6. Test post editing at `/admin/blogs/edit/:id`

### Backend Tests
1. Test public blog endpoints
2. Test admin blog endpoints with authentication
3. Test validation and error handling
4. Test database persistence

## 📊 Blog Post Type

```typescript
export type BlogStatus = "draft" | "published";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  contentFormat: "html" | "markdown";
  featuredImageUrl?: string | null;
  category?: string | null;
  tags: string[];
  authorName: string;
  status: BlogStatus;
  seoTitle?: string | null;
  seoDescription?: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
}
```

## 🔄 Slug Generation

The `blogAPI.generateSlug()` method converts titles to URL-friendly slugs:
- Converts to lowercase
- Replaces spaces with hyphens
- Removes special characters
- Example: "How Affiliate Donations Help" → "how-affiliate-donations-help"

## 📅 Publishing Rules

- **Draft posts**: Only visible in admin panel
- **Published posts**: Visible on public `/blog` page
- **publishedAt**: Set when post status changes from draft to published
- **updatedAt**: Updated whenever post is modified

## 🎯 Best Practices

1. **SEO Optimization**: Always fill in SEO title and description
2. **Content Quality**: Use the preview feature to check formatting
3. **Image Optimization**: Use properly sized images for featured images
4. **Tag Management**: Use relevant tags for better discoverability
5. **Category Organization**: Use consistent categories for better navigation
6. **Regular Updates**: Keep content fresh with regular posts

## 🚧 Known Limitations

1. **Image Upload**: Currently only supports image URLs (no direct upload)
2. **Rich Text Editor**: Basic textarea with Markdown support (no WYSIWYG)
3. **Collaboration**: No built-in multi-user editing or version control
4. **Scheduling**: No built-in scheduling for future publishing
5. **Media Library**: No centralized media management

## 🔮 Future Enhancements

1. **Image Upload**: Direct image upload to Supabase Storage
2. **Rich Text Editor**: Integration with a WYSIWYG editor like TipTap or Slate
3. **Categories & Tags**: Management interface for predefined categories/tags
4. **Post Scheduling**: Schedule posts for future publishing
5. **Media Library**: Centralized media management
6. **Collaboration**: Multi-user editing and version history
7. **Newsletter Integration**: Automatic email notifications for new posts
8. **Comments**: User comments and moderation
9. **Analytics**: Post view analytics and engagement metrics
10. **Featured Posts**: Highlight important posts on homepage

## 📞 Support

For questions about the blog feature, please contact:
- GitHub Issues: [https://github.com/affiliatedonor/affiliatedonor/issues](https://github.com/affiliatedonor/affiliatedonor/issues)
- Email: support@affiliatedonor.com