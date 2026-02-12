import { Lead } from '../types';

/**
 * CloudDB Service (Algarve Exclusif - Luxury Edition)
 * Handles:
 * 1. Persistent storage in Google Sheets via SheetDB
 * 2. High-priority lead notifications via EmailJS
 */

// ✅ Your SheetDB API URL (connected to your Google Sheet)
const API_URL = 'https://sheetdb.io/api/v1/pkqvc99faf8zu';

/**
 * EMAILJS CONFIGURATION
 * ⚠️ SECURITY TIP: Move these to a .env file if your GitHub repo is public.
 * In your .env file add:
 *   VITE_EMAILJS_SERVICE_ID=service_pyok4cx
 *   VITE_EMAILJS_TEMPLATE_ID=template_j1wxlr1
 *   VITE_EMAILJS_PUBLIC_KEY=8UDSxB2lSml4PJzI2
 * Then replace the values below with:
 *   import.meta.env.VITE_EMAILJS_SERVICE_ID  etc.
 */
const EMAILJS_SERVICE_ID = 'service_pyok4cx';
const EMAILJS_TEMPLATE_ID = 'template_j1wxlr1';
const EMAILJS_PUBLIC_KEY = '8UDSxB2lSml4PJzI2';

export const cloudDb = {
  /**
   * Fetch all leads from Google Sheet (for Admin Dashboard)
   */
  async getLeads(): Promise<Lead[]> {
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        if (response.status === 404) return [];
        throw new Error(`DB Connection Error: ${response.status}`);
      }

      const data = await response.json();
      const leads = Array.isArray(data) ? data : [];

      // Keep a local backup in case of network issues
      localStorage.setItem('algarve_exclusif_leads', JSON.stringify(leads));
      return leads;

    } catch (error) {
      console.error('Failed to fetch leads from SheetDB:', error);
      // Fall back to locally cached leads if network fails
      const local = localStorage.getItem('algarve_exclusif_leads');
      return local ? JSON.parse(local) : [];
    }
  },

  /**
   * Save a new lead to Google Sheet and trigger email notification
   */
  async saveLead(lead: Lead): Promise<boolean> {
    try {
      // SheetDB expects data wrapped in a "data" array
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [lead] })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('SheetDB Save Error:', errorText);
        return false;
      }

      // Update local cache
      const currentLeads = JSON.parse(
        localStorage.getItem('algarve_exclusif_leads') || '[]'
      );
      localStorage.setItem(
        'algarve_exclusif_leads',
        JSON.stringify([lead, ...currentLeads])
      );

      // Fire email notification in the background (non-blocking)
      this.triggerEmailJSPush(lead);

      return true;

    } catch (error) {
      console.error('Cloud Sync Error:', error);
      return false;
    }
  },

  /**
   * Send instant email notification via EmailJS
   */
  async triggerEmailJSPush(lead: Lead) {
    if (!EMAILJS_PUBLIC_KEY || !EMAILJS_TEMPLATE_ID) {
      console.warn('EmailJS not configured. Notification skipped.');
      return;
    }

    const details = lead.type === 'buyer'
      ? `BUDGET: ${lead.budget}\nAREA: ${lead.area}\nPROPERTY: ${lead.propertyType}\nBEDROOMS: ${lead.bedrooms}\nFEATURES: ${lead.features?.join(', ')}`
      : `LOCATION: ${lead.location}\nEXPECTED: ${lead.expectedPrice}\nCONDITION: ${lead.condition}\nDESC: ${lead.propertyDescription}`;

    const templateParams = {
      from_name: `${lead.firstName} ${lead.lastName}`,
      reply_to: lead.email,
      phone: lead.phone,
      type: lead.type.toUpperCase(),
      details: details,
      timestamp: new Date(lead.timestamp).toLocaleString(),
      to_email: 'vernondo@me.com'
    };

    const payload = {
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: templateParams
    };

    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('EmailJS API Error:', errorText);
      } else {
        console.log('✅ EmailJS: Lead notification sent successfully.');
      }
    } catch (error) {
      console.error('EmailJS Network Failure:', error);
    }
  },

  /**
   * Clear all leads (Admin only)
   * ⚠️ This deletes ALL rows from your Google Sheet. Use with caution!
   */
  async clearLeads(): Promise<boolean> {
    try {
      localStorage.removeItem('algarve_exclusif_leads');

      // SheetDB delete all rows (keeps header row intact)
      const response = await fetch(`${API_URL}/all`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      return response.ok;
    } catch (error) {
      console.error('Clear leads failed:', error);
      return false;
    }
  }
};
