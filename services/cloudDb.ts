
import { Lead } from '../types';

/**
 * CloudDB Service (Algarve Exclusif - Luxury Edition)
 * Handles:
 * 1. Persistent storage in KVDB (for Admin Dashboard)
 * 2. High-priority lead notifications via EmailJS
 */
const SECURE_TOKEN = 'V_Boshoff_789432'; 
const API_URL = `https://kvdb.io/ANscE7Z3u4zF1P8W9e7e7e/AE_Leads_${SECURE_TOKEN}`;

/** 
 * EMAILJS CONFIGURATION
 * Note: EmailJS IDs are typically all lowercase.
 */
const EMAILJS_SERVICE_ID = 'service_pyok4cx'; 
const EMAILJS_TEMPLATE_ID = 'template_j1wxlr1'; // Changed to lowercase 'template_'
const EMAILJS_PUBLIC_KEY = '8UDSxB2lSml4PJzI2';

export const cloudDb = {
  /**
   * Fetch leads for the private admin area
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
      
      localStorage.setItem('algarve_exclusif_leads', JSON.stringify(leads));
      return leads;
    } catch (error) {
      const local = localStorage.getItem('algarve_exclusif_leads');
      return local ? JSON.parse(local) : [];
    }
  },

  /**
   * Save lead and trigger notifications
   */
  async saveLead(lead: Lead): Promise<boolean> {
    try {
      const currentLeads = await this.getLeads();
      const updatedLeads = [lead, ...currentLeads];
      
      localStorage.setItem('algarve_exclusif_leads', JSON.stringify(updatedLeads));

      // Push to central database (KVDB)
      const dbResponse = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedLeads)
      });

      // Send Instant Notification via EmailJS
      // We don't await this to avoid blocking the UI, but it runs in background
      this.triggerEmailJSPush(lead);

      return dbResponse.ok;
    } catch (error) {
      console.error('Cloud Sync Error:', error);
      return false;
    }
  },

  /**
   * Directly interface with EmailJS REST API
   */
  async triggerEmailJSPush(lead: Lead) {
    if (!EMAILJS_PUBLIC_KEY || !EMAILJS_TEMPLATE_ID || EMAILJS_PUBLIC_KEY.includes('YOUR_')) {
      console.warn('EmailJS IDs not fully configured. Notification skipped.');
      return;
    }

    // Format specific requirements for the template message
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
        // If "Template ID not found" persists, verify the ID in EmailJS Dashboard > Email Templates
      } else {
        console.log('EmailJS: Lead details successfully dispatched to Vernondo.');
      }
    } catch (error) {
      console.error('EmailJS Network Failure:', error);
    }
  },

  /**
   * Reset database (Admin only)
   */
  async clearLeads(): Promise<boolean> {
    try {
      localStorage.removeItem('algarve_exclusif_leads');
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([])
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
};
