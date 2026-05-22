import type { AdminRouteMeta } from '@/types/admin'

export const adminRouteMetadata: AdminRouteMeta[] = [
  {
    path: '/admin',
    title: 'Dashboard',
    description: 'Overview of donations, campaigns, content, products, and admin activity.',
    breadcrumbs: [{ label: 'Admin' }, { label: 'Dashboard' }],
    permission: 'dashboard:read',
  },
  {
    path: '/admin/donations',
    title: 'Donations',
    description: 'Search, filter, review, and export platform contributions.',
    breadcrumbs: [{ label: 'Admin', path: '/admin' }, { label: 'Donations' }],
    permission: 'donations:read',
  },
  {
    path: '/admin/donations/:id',
    title: 'Donation Details',
    description: 'Review transaction details, donor context, and payment status history.',
    breadcrumbs: [
      { label: 'Admin', path: '/admin' },
      { label: 'Donations', path: '/admin/donations' },
      { label: 'Details' },
    ],
    permission: 'donations:read',
  },
  {
    path: '/admin/causes',
    title: 'Causes',
    description: 'Manage campaigns, publishing status, progress, and linked donations.',
    breadcrumbs: [{ label: 'Admin', path: '/admin' }, { label: 'Causes' }],
    permission: 'causes:read',
  },
  {
    path: '/admin/causes/new',
    title: 'Create Cause',
    breadcrumbs: [
      { label: 'Admin', path: '/admin' },
      { label: 'Causes', path: '/admin/causes' },
      { label: 'Create' },
    ],
    permission: 'causes:write',
  },
  {
    path: '/admin/causes/:id',
    title: 'Cause Details',
    breadcrumbs: [
      { label: 'Admin', path: '/admin' },
      { label: 'Causes', path: '/admin/causes' },
      { label: 'Details' },
    ],
    permission: 'causes:read',
  },
  {
    path: '/admin/causes/:id/edit',
    title: 'Edit Cause',
    breadcrumbs: [
      { label: 'Admin', path: '/admin' },
      { label: 'Causes', path: '/admin/causes' },
      { label: 'Edit' },
    ],
    permission: 'causes:write',
  },
  {
    path: '/admin/blogs',
    title: 'Blog Posts',
    description: 'Manage blog posts, drafts, SEO metadata, thumbnails, categories, and tags.',
    breadcrumbs: [{ label: 'Admin', path: '/admin' }, { label: 'Blog' }],
    permission: 'content:read',
  },
  {
    path: '/admin/blogs/new',
    title: 'Create Blog Post',
    breadcrumbs: [
      { label: 'Admin', path: '/admin' },
      { label: 'Blog', path: '/admin/blogs' },
      { label: 'Create' },
    ],
    permission: 'content:write',
  },
  {
    path: '/admin/blogs/edit/:id',
    title: 'Edit Blog Post',
    breadcrumbs: [
      { label: 'Admin', path: '/admin' },
      { label: 'Blog', path: '/admin/blogs' },
      { label: 'Edit' },
    ],
    permission: 'content:write',
  },
  {
    path: '/admin/content',
    title: 'Website Content',
    description: 'Manage homepage sections, banners, impact stories, testimonials, and footer copy.',
    breadcrumbs: [{ label: 'Admin', path: '/admin' }, { label: 'Website Content' }],
    permission: 'content:read',
  },
  {
    path: '/admin/media',
    title: 'Media Library',
    description: 'Manage images and reusable media assets.',
    breadcrumbs: [{ label: 'Admin', path: '/admin' }, { label: 'Media Library' }],
    permission: 'content:read',
  },
  {
    path: '/admin/users',
    title: 'Users & Donors',
    description: 'View donor profiles, giving history, roles, and activity.',
    breadcrumbs: [{ label: 'Admin', path: '/admin' }, { label: 'Users & Donors' }],
    permission: 'users:read',
  },
  {
    path: '/admin/users/:id',
    title: 'Donor Profile',
    breadcrumbs: [
      { label: 'Admin', path: '/admin' },
      { label: 'Users & Donors', path: '/admin/users' },
      { label: 'Profile' },
    ],
    permission: 'users:read',
  },
  {
    path: '/admin/messages',
    title: 'Contact Messages',
    description: 'Review contact submissions, status, assignment, and admin notes.',
    breadcrumbs: [{ label: 'Admin', path: '/admin' }, { label: 'Messages' }],
    permission: 'messages:read',
  },
  {
    path: '/admin/messages/:id',
    title: 'Message Details',
    breadcrumbs: [
      { label: 'Admin', path: '/admin' },
      { label: 'Messages', path: '/admin/messages' },
      { label: 'Details' },
    ],
    permission: 'messages:read',
  },
  {
    path: '/admin/products/affiliate',
    title: 'Affiliate Products',
    description: 'Manage affiliate products, links, click tracking, and conversion metadata.',
    breadcrumbs: [{ label: 'Admin', path: '/admin' }, { label: 'Affiliate Products' }],
    permission: 'products:read',
  },
  {
    path: '/admin/products/merch',
    title: 'Merchandise',
    description: 'Manage merch products, inventory, pricing, and cause allocation.',
    breadcrumbs: [{ label: 'Admin', path: '/admin' }, { label: 'Merchandise' }],
    permission: 'products:read',
  },
  {
    path: '/admin/products/categories',
    title: 'Product Categories',
    description: 'Manage product and merch taxonomy.',
    breadcrumbs: [{ label: 'Admin', path: '/admin' }, { label: 'Product Categories' }],
    permission: 'products:read',
  },
  {
    path: '/admin/products/new',
    title: 'Create Product',
    breadcrumbs: [{ label: 'Admin', path: '/admin' }, { label: 'Create Product' }],
    permission: 'products:write',
  },
  {
    path: '/admin/products/:id/edit',
    title: 'Edit Product',
    breadcrumbs: [{ label: 'Admin', path: '/admin' }, { label: 'Edit Product' }],
    permission: 'products:write',
  },
  {
    path: '/admin/reports',
    title: 'Reports',
    description: 'Analyze donations, campaigns, donors, content, products, and affiliate activity.',
    breadcrumbs: [{ label: 'Admin', path: '/admin' }, { label: 'Reports' }],
    permission: 'reports:read',
  },
  {
    path: '/admin/reports/donations',
    title: 'Donation Reports',
    description: 'Analyze donation trends by period, campaign, status, and payment method.',
    breadcrumbs: [
      { label: 'Admin', path: '/admin' },
      { label: 'Reports', path: '/admin/reports' },
      { label: 'Donations' },
    ],
    permission: 'reports:read',
  },
  {
    path: '/admin/reports/campaigns',
    title: 'Campaign Reports',
    description: 'Compare campaign funding progress, donors, and average donation.',
    breadcrumbs: [
      { label: 'Admin', path: '/admin' },
      { label: 'Reports', path: '/admin/reports' },
      { label: 'Campaigns' },
    ],
    permission: 'reports:read',
  },
  {
    path: '/admin/reports/donors',
    title: 'Donor Reports',
    description: 'Track donor growth, returning donors, and giving averages.',
    breadcrumbs: [
      { label: 'Admin', path: '/admin' },
      { label: 'Reports', path: '/admin/reports' },
      { label: 'Donors' },
    ],
    permission: 'reports:read',
  },
  {
    path: '/admin/reports/content',
    title: 'Content Reports',
    description: 'Review blog and CMS content performance signals.',
    breadcrumbs: [
      { label: 'Admin', path: '/admin' },
      { label: 'Reports', path: '/admin/reports' },
      { label: 'Content' },
    ],
    permission: 'reports:read',
  },
  {
    path: '/admin/reports/products',
    title: 'Product Reports',
    description: 'Analyze affiliate and merch clicks, conversions, and contribution.',
    breadcrumbs: [
      { label: 'Admin', path: '/admin' },
      { label: 'Reports', path: '/admin/reports' },
      { label: 'Products' },
    ],
    permission: 'reports:read',
  },
  {
    path: '/admin/exports',
    title: 'Exports',
    description: 'Prepare and download admin reports.',
    breadcrumbs: [{ label: 'Admin', path: '/admin' }, { label: 'Exports' }],
    permission: 'reports:read',
  },
  {
    path: '/admin/notifications',
    title: 'Notifications',
    description: 'Review admin alerts and notification preferences.',
    breadcrumbs: [{ label: 'Admin', path: '/admin' }, { label: 'Notifications' }],
    permission: 'notifications:read',
  },
  {
    path: '/admin/settings',
    title: 'Settings',
    description: 'Configure website, branding, payment, social, footer, security, and account settings.',
    breadcrumbs: [{ label: 'Admin', path: '/admin' }, { label: 'Settings' }],
    permission: 'settings:read',
  },
  {
    path: '/admin/audit-logs',
    title: 'Audit Logs',
    description: 'Track admin actions and system activity.',
    breadcrumbs: [{ label: 'Admin', path: '/admin' }, { label: 'Audit Logs' }],
    permission: 'audit:read',
  },
  {
    path: '/admin/approvals',
    title: 'Approvals',
    description: 'Review pending campaign, content, and operational actions.',
    breadcrumbs: [{ label: 'Admin', path: '/admin' }, { label: 'Approvals' }],
    permission: 'approvals:read',
  },
  {
    path: '/admin/search',
    title: 'Search',
    description: 'Search donations, campaigns, donors, blog posts, products, messages, and transactions.',
    breadcrumbs: [{ label: 'Admin', path: '/admin' }, { label: 'Search' }],
    permission: 'admin:access',
  },
]

export function resolveAdminRouteMeta(pathname: string): AdminRouteMeta {
  const exactMatch = adminRouteMetadata.find((route) => route.path === pathname)
  if (exactMatch) {
    return exactMatch
  }

  const dynamicMatch = adminRouteMetadata.find((route) => matchRoutePath(route.path, pathname))
  if (dynamicMatch) {
    return dynamicMatch
  }

  return {
    path: pathname,
    title: titleFromPath(pathname),
    breadcrumbs: buildFallbackBreadcrumbs(pathname),
    permission: 'admin:access',
  }
}

function matchRoutePath(routePath: string, pathname: string) {
  const routeParts = routePath.split('/').filter(Boolean)
  const pathParts = pathname.split('/').filter(Boolean)

  if (routeParts.length !== pathParts.length) {
    return false
  }

  return routeParts.every((part, index) => part.startsWith(':') || part === pathParts[index])
}

function titleFromPath(pathname: string) {
  const segments = pathname.split('/').filter(Boolean)
  const lastSegment = segments[segments.length - 1]
  if (!lastSegment || lastSegment === 'admin') {
    return 'Admin Panel'
  }

  return lastSegment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function buildFallbackBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs = segments.map((segment, index) => {
    const path = `/${segments.slice(0, index + 1).join('/')}`

    return {
      label: segment.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()),
      path: index < segments.length - 1 ? path : undefined,
    }
  })

  return breadcrumbs.length ? breadcrumbs : [{ label: 'Admin' }]
}
