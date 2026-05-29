import axios from 'axios';
import { json } from 'express';

export const getLeads = async (req, res) => {
    try {
        // The User provided Webhook URL
        const zohoUrl = 'https://www.zohoapis.in/crm/v7/functions/get_indiamart_leads/actions/execute?auth_type=apikey&zapikey=1003.9db76103b9a615274a8629cf0c22f3ab.2346f0b10017b84af839672aa7d34dc4';

        // Attempting to fetch
        const response = await axios.get(zohoUrl);

        // Log for visibility
        // console.log("Zoho Response:", response.data);

        // Check if Zoho returned their specific error object even with 200/202 status
        if (response.data.code === 'INVALID_DATA' || response.data.code === 'NOT_ACTIVE') {
            throw new Error(`Zoho API Error: ${response.data.code}`);
        }
        // Success!
        let leadsData = [];
        if (response.data.details && response.data.details.output) {
            let rawOutput = response.data.details.output;
            if (typeof rawOutput !== 'string') rawOutput = JSON.stringify(json); // Safety
            rawOutput = rawOutput.trim();

            try {
                // Try parsing directly first
                leadsData = JSON.parse(rawOutput);
            } catch (e1) {
                console.warn("Direct parse failed. Using Smart Scanner...");

                let candidate = null;
                let balance = 0;
                let inString = false;
                let escape = false;
                let foundStart = false;
                let startIdx = 0;

                // Simple JSON Tokenizer logic
                for (let i = 0; i < rawOutput.length; i++) {
                    const char = rawOutput[i];

                    if (!foundStart) {
                        if (char === '{' || char === '[') {
                            foundStart = true;
                            startIdx = i;
                            balance = 1;
                        }
                        continue;
                    }

                    if (inString) {
                        if (escape) {
                            escape = false;
                        } else if (char === '\\') {
                            escape = true;
                        } else if (char === '"') {
                            inString = false;
                        }
                    } else {
                        if (char === '"') {
                            inString = true;
                        } else if (char === '{' || char === '[') {
                            balance++;
                        } else if (char === '}' || char === ']') {
                            balance--;
                            if (balance === 0) {
                                candidate = rawOutput.substring(startIdx, i + 1);
                                break;
                            }
                        }
                    }
                }

                if (candidate) {
                    try {
                        const parsed = JSON.parse(candidate);
                        // Normalize
                        let rawLeads = [];
                        if (Array.isArray(parsed)) rawLeads = parsed;
                        else if (parsed.leads) rawLeads = parsed.leads;
                        else if (parsed.data) rawLeads = parsed.data;
                        else rawLeads = [parsed]; // Single object -> Array

                        // Map to Frontend Schema
                        leadsData = rawLeads.map(lead => ({
                            id: lead.id,
                            name: lead.Full_Name || `${lead.First_Name || ''} ${lead.Last_Name || ''}`.trim() || 'Unknown',
                            company: lead.Company || 'N/A',
                            email: lead.Email || 'N/A',
                            product: lead.Lead_Source || 'N/A',
                            status: lead.Lead_Status || 'New',
                            date: lead.Created_Time ? lead.Created_Time.split('T')[0] : new Date().toISOString().split('T')[0],
                            ...lead
                        }));
                    } catch (e3) {
                        console.error("Smart Scanner extracted invalid JSON:", e3.message);
                        leadsData = [];
                    }
                } else {
                    console.error("Smart Scanner failed to find boundary");
                    leadsData = [];
                }
            }
        } else {
            console.warn("Zoho function executed successfully but returned no output (details.output is empty/missing).");
            if (Array.isArray(response.data)) leadsData = response.data;
            else leadsData = [];
        }

        // Wrap in object to match Frontend expectation (response.data.data)
        res.json({ data: leadsData });
    } catch (error) {
        console.warn("Zoho API Failed. Details:", error.message);

        // Return Mock Data so User can see the UI
        const mockLeads = [
            { id: 1, name: "Amit Kumar", company: "IndiaMart Trader", email: "amit.k@example.com", product: "Industrial Steel", status: "New", date: "2024-10-25" },
            { id: 2, name: "Priya Singh", company: "Tech Solutions", email: "priya.s@example.com", product: "Solar Panels", status: "Contacted", date: "2024-10-24" },
            { id: 3, name: "Rajesh Gupta", company: "Gupta Exports", email: "rajesh@example.com", product: "Textile Machinery", status: "Qualified", date: "2024-10-23" },
            { id: 4, name: "Sneha Reddi", company: "Reddi Constructions", email: "sneha@example.com", product: "Cement Mixers", status: "New", date: "2024-10-25" },
            { id: 5, name: "Vikram Malhotra", company: "VM Auto", email: "vikram@example.com", product: "Spare Parts", status: "Closed", date: "2024-10-20" },
        ];
        res.json({
            source: "mock_fallback",
            message: "Real API failed. Showing Mock Data.",
            data: mockLeads
        });
    }
};
