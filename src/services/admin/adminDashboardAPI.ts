import { blogAPI } from '@/services/blogAPI'
import { adminProductsAPI } from '@/services/admin/adminProductsAPI'
import type { AdminProduct } from '@/types/adminProduct'
import type { BlogPost } from '@/types/blog'
import type {
  AdminDashboardContentItem,
  AdminDashboardProductActivity,
  AdminDashboardSnapshot,
} from '@/types/adminDashboard'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export const adminDashboardAPI = {
  async getSnapshot(): Promise<AdminDashboardSnapshot> {
    const [posts, productActivity] = await Promise.all([loadBlogPosts(), loadProductActivity()])
    const draftPosts = posts.filter((post) => post.status === 'draft').length
    const recentPosts = [...posts]
      .sort((first, second) => new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime())
      .slice(0, 4)
    const contentActivity: AdminDashboardContentItem[] = [
      ...recentPosts.map((post) => ({
        id: post.id,
        title: post.title,
        type: 'blog' as const,
        status: post.status,
        updatedAt: post.updatedAt,
      })),
      {
        id: 'content-home-hero',
        title: 'Homepage hero',
        type: 'homepage',
        status: 'published',
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
      },
      {
        id: 'content-announcement-1',
        title: 'Spring matching campaign banner',
        type: 'announcement',
        status: 'draft',
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 54).toISOString(),
      },
    ]

    const totalContributed = 642350
    const totalDonors = 18427
    const activeCampaigns = 12
    const pendingActions = 7

    return {
      metrics: [
        {
          id: 'total-contributed',
          label: 'Total Contributed',
          value: currencyFormatter.format(totalContributed),
          helperText: 'All-time donations and purchase-driven contributions',
          trend: { value: '+12.8%', direction: 'up' },
        },
        {
          id: 'total-donors',
          label: 'Donors',
          value: totalDonors.toLocaleString(),
          helperText: 'Registered donors and guest contributors',
          trend: { value: '+438 this month', direction: 'up' },
        },
        {
          id: 'active-campaigns',
          label: 'Active Campaigns',
          value: activeCampaigns.toString(),
          helperText: 'Published campaigns accepting support',
          trend: { value: '3 near goal', direction: 'neutral' },
        },
        {
          id: 'pending-actions',
          label: 'Pending Actions',
          value: pendingActions.toString(),
          helperText: 'Approvals, unread messages, and failed payments',
          trend: { value: 'Needs review', direction: 'down' },
        },
      ],
      recentDonations: [
        {
          id: 'don-1048',
          donorName: 'Maya Thompson',
          email: 'maya@example.com',
          campaign: 'Clean Water Initiative',
          amount: 250,
          currency: 'USD',
          method: 'Card',
          status: 'successful',
          createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
        },
        {
          id: 'don-1047',
          donorName: 'Daniel Cooper',
          email: 'daniel@example.com',
          campaign: 'Education for All',
          amount: 75,
          currency: 'USD',
          method: 'PayPal',
          status: 'successful',
          createdAt: new Date(Date.now() - 1000 * 60 * 54).toISOString(),
        },
        {
          id: 'don-1046',
          donorName: 'Aisha Khan',
          email: 'aisha@example.com',
          campaign: 'Healthcare Access',
          amount: 120,
          currency: 'USD',
          method: 'Crypto',
          status: 'pending',
          createdAt: new Date(Date.now() - 1000 * 60 * 92).toISOString(),
        },
        {
          id: 'don-1045',
          donorName: 'Noah Rivera',
          email: 'noah@example.com',
          campaign: 'Hunger Relief',
          amount: 50,
          currency: 'USD',
          method: 'Card',
          status: 'failed',
          createdAt: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
        },
      ],
      recentMessages: [
        {
          id: 'msg-308',
          name: 'Olivia Grant',
          email: 'olivia@example.com',
          subject: 'Question about monthly donations',
          status: 'unread',
          receivedAt: new Date(Date.now() - 1000 * 60 * 24).toISOString(),
        },
        {
          id: 'msg-307',
          name: 'Impact Partners Co.',
          email: 'partners@example.com',
          subject: 'Partnership proposal',
          status: 'pending',
          receivedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        },
        {
          id: 'msg-306',
          name: 'Liam Brooks',
          email: 'liam@example.com',
          subject: 'Merch order support',
          status: 'resolved',
          receivedAt: new Date(Date.now() - 1000 * 60 * 540).toISOString(),
        },
      ],
      campaigns: [
        {
          id: '1',
          name: 'Clean Water Initiative',
          category: 'Environment',
          raised: 125000,
          goal: 200000,
          status: 'active',
          supporters: 1234,
        },
        {
          id: '2',
          name: 'Education for All',
          category: 'Education',
          raised: 85000,
          goal: 150000,
          status: 'active',
          supporters: 892,
        },
        {
          id: '3',
          name: 'Wildlife Conservation',
          category: 'Environment',
          raised: 95000,
          goal: 120000,
          status: 'active',
          supporters: 1567,
        },
      ],
      contentActivity: contentActivity.slice(0, 5),
      productActivity,
      pendingActions: [
        { id: 'campaign-approvals', label: 'Campaign approvals', count: 2, path: '/admin/approvals' },
        { id: 'unread-messages', label: 'Unread contact messages', count: 3, path: '/admin/messages' },
        { id: 'failed-payments', label: 'Failed payments to review', count: 1, path: '/admin/donations' },
        { id: 'draft-content', label: 'Draft content pending publish', count: draftPosts, path: '/admin/blogs' },
      ],
    }
  },
}

async function loadBlogPosts(): Promise<BlogPost[]> {
  try {
    return await blogAPI.getAdminPosts()
  } catch (error) {
    console.warn('Using dashboard content fallback because blog posts could not be loaded.', error)
    return []
  }
}

async function loadProductActivity(): Promise<AdminDashboardProductActivity[]> {
  try {
    const response = await adminProductsAPI.getProducts()
    return response.products
      .sort((first, second) => second.estimatedContribution - first.estimatedContribution)
      .slice(0, 3)
      .map(mapProductActivity)
  } catch (error) {
    console.warn('Using empty dashboard product activity because products could not be loaded.', error)
    return []
  }
}

function mapProductActivity(product: AdminProduct): AdminDashboardProductActivity {
  return {
    id: product.id,
    name: product.name,
    type: product.type,
    clicks: product.clickCount,
    conversions: product.conversionCount,
    estimatedContribution: product.estimatedContribution,
  }
}
