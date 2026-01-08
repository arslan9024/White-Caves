import express from 'express';
const router = express.Router();

router.get('/owner/summary', async (req, res) => {
  try {
    const summary = {
      totalProperties: 156,
      activeAgents: 52,
      monthlyRevenue: 2450000,
      whatsappLeads: 89,
      uaepassUsers: 34,
      chatbotConversations: 245,
      pendingDeals: 23,
      closedDeals: 178,
      newLeads: 45,
      conversionRate: 34.2
    };

    const recentActivities = [
      { type: 'success', title: 'New Property Listed', description: 'Villa in Palm Jumeirah - AED 15M', timestamp: new Date().toISOString() },
      { type: 'info', title: 'Lead Assigned', description: 'Ahmed assigned to Marina property inquiry', timestamp: new Date(Date.now() - 3600000).toISOString() },
      { type: 'warning', title: 'Contract Expiring', description: 'Tenancy contract #TC-2024-156 expires in 30 days', timestamp: new Date(Date.now() - 7200000).toISOString() },
      { type: 'success', title: 'Deal Closed', description: 'Apartment in Downtown sold for AED 3.2M', timestamp: new Date(Date.now() - 14400000).toISOString() },
      { type: 'info', title: 'WhatsApp Message', description: 'New inquiry from +971 50 XXX XXXX', timestamp: new Date(Date.now() - 21600000).toISOString() },
    ];

    res.json({
      summary,
      recentActivities,
      recentProperties: [],
      agentPerformance: [],
      leads: [],
      contracts: [],
      analytics: {},
      chatbotStats: {
        totalConversations: 2456,
        successfulLeads: 189,
        avgResponseTime: 2.3,
        satisfactionRate: 92,
        activeChats: 12,
        messagesProcessed: 18945
      },
      whatsappStats: {
        totalContacts: 3456,
        activeConversations: 89,
        messagesThisMonth: 12450,
        responseRate: 94,
        avgResponseTime: '8 min',
        leadsGenerated: 234
      },
      uaepassStats: {
        totalUsers: 234,
        verifiedUsers: 198,
        pendingVerification: 36,
        thisMonth: 45,
        conversionRate: 84.6
      }
    });
  } catch (error) {
    console.error('Error fetching owner dashboard:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

router.get('/report/download', async (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=whitecaves-report-${new Date().toISOString().split('T')[0]}.pdf`);
    res.send(Buffer.from('PDF Report Placeholder'));
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

export default router;
