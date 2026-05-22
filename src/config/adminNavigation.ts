import type { AdminNavigationGroup } from '@/types/admin'

export const adminNavigationGroups: AdminNavigationGroup[] = [
  {
    label: 'Overview',
    items: [
      {
        label: 'Dashboard',
        path: '/admin',
        icon: 'LayoutDashboard',
        description: 'Platform activity and quick actions',
        permission: 'dashboard:read',
      },
    ],
  },
  {
    label: 'Fundraising',
    items: [
      {
        label: 'Donations',
        path: '/admin/donations',
        icon: 'HeartHandshake',
        description: 'Contributions, payments, refunds, and exports',
        permission: 'donations:read',
      },
      {
        label: 'Causes',
        path: '/admin/causes',
        icon: 'Target',
        description: 'Campaign publishing, progress, and linked donations',
        permission: 'causes:read',
      },
    ],
  },
  {
    label: 'Content',
    items: [
      {
        label: 'Blog',
        path: '/admin/blogs',
        icon: 'FileText',
        description: 'Posts, drafts, SEO, tags, and categories',
        permission: 'content:read',
        children: [
          {
            label: 'All Posts',
            path: '/admin/blogs',
            icon: 'FileText',
            permission: 'content:read',
          },
          {
            label: 'Create Post',
            path: '/admin/blogs/new',
            icon: 'PlusCircle',
            permission: 'content:write',
          },
        ],
      },
      {
        label: 'Website Content',
        path: '/admin/content',
        icon: 'PanelsTopLeft',
        description: 'Homepage, banners, stories, testimonials, and footer',
        permission: 'content:read',
      },
      {
        label: 'Media Library',
        path: '/admin/media',
        icon: 'Images',
        description: 'Images and reusable media assets',
        permission: 'content:read',
      },
    ],
  },
  {
    label: 'Community',
    items: [
      {
        label: 'Users & Donors',
        path: '/admin/users',
        icon: 'Users',
        description: 'Donor profiles, activity, and roles',
        permission: 'users:read',
      },
      {
        label: 'Messages',
        path: '/admin/messages',
        icon: 'Mail',
        description: 'Contact form submissions and admin notes',
        permission: 'messages:read',
      },
    ],
  },
  {
    label: 'Commerce',
    items: [
      {
        label: 'Affiliate Products',
        path: '/admin/products/affiliate',
        icon: 'ExternalLink',
        description: 'Affiliate links, clicks, and conversions',
        permission: 'products:read',
      },
      {
        label: 'Merchandise',
        path: '/admin/products/merch',
        icon: 'ShoppingBag',
        description: 'Merch products, inventory, and cause allocation',
        permission: 'products:read',
      },
      {
        label: 'Categories',
        path: '/admin/products/categories',
        icon: 'Tags',
        description: 'Product and merch category management',
        permission: 'products:read',
      },
    ],
  },
  {
    label: 'Insights',
    items: [
      {
        label: 'Reports',
        path: '/admin/reports',
        icon: 'BarChart3',
        description: 'Donation, campaign, donor, content, and product analytics',
        permission: 'reports:read',
        children: [
          {
            label: 'Overview',
            path: '/admin/reports',
            icon: 'BarChart3',
            permission: 'reports:read',
          },
          {
            label: 'Donations',
            path: '/admin/reports/donations',
            icon: 'HeartHandshake',
            permission: 'reports:read',
          },
          {
            label: 'Campaigns',
            path: '/admin/reports/campaigns',
            icon: 'Target',
            permission: 'reports:read',
          },
          {
            label: 'Donors',
            path: '/admin/reports/donors',
            icon: 'Users',
            permission: 'reports:read',
          },
          {
            label: 'Content',
            path: '/admin/reports/content',
            icon: 'FileText',
            permission: 'reports:read',
          },
          {
            label: 'Products',
            path: '/admin/reports/products',
            icon: 'ShoppingBag',
            permission: 'reports:read',
          },
        ],
      },
      {
        label: 'Exports',
        path: '/admin/exports',
        icon: 'Download',
        description: 'Downloadable admin reports',
        permission: 'reports:read',
      },
    ],
  },
  {
    label: 'System',
    items: [
      {
        label: 'Approvals',
        path: '/admin/approvals',
        icon: 'ClipboardCheck',
        description: 'Campaign, content, and admin review queue',
        permission: 'approvals:read',
      },
      {
        label: 'Notifications',
        path: '/admin/notifications',
        icon: 'Bell',
        description: 'Admin alerts and notification preferences',
        permission: 'notifications:read',
      },
      {
        label: 'Settings',
        path: '/admin/settings',
        icon: 'Settings',
        description: 'Website, payment, branding, social, and security settings',
        permission: 'settings:read',
      },
      {
        label: 'Audit Logs',
        path: '/admin/audit-logs',
        icon: 'History',
        description: 'Admin actions and activity history',
        permission: 'audit:read',
      },
    ],
  },
]
