# 🍽️ AI-Powered Nutrition Tracker  

This is the **frontend** for my AI-powered calorie tracking system, built with (and hosted on) **Lovable** for a clean and interactive design. The system allows seamless food logging via **voice input** or **barcode scanning**, using AI to extract calorie and macronutrient data, which is stored in **Supabase** and displayed in a **real-time dashboard**.  

### **real-time dashboard:** ![image](/public/Dashboard-CalorieTracker.jpg)

## 🚀 How It Works  
1️⃣ **Tell Siri what you ate** (e.g., “I had 100g of yogurt”).  
2️⃣ The **Perplexity API** calculates the **calories & macros**.  
3️⃣ Data is stored in **Supabase** via an automated **n8n workflow**.  
4️⃣ The **Lovable frontend** displays real-time progress and insights.  
5️⃣ For branded products like frozen fries, **scan the barcode** instead!  

---

## 🔗 Quick Access  

### **iOS Shortcuts**  
- **Log Food via Voice:** [Here](https://www.icloud.com/shortcuts/2c59a2ddff1848eda5414e1b6993f007) 
- **Log Food via Barcode:** [Here](https://www.icloud.com/shortcuts/de1f9eb675704dc8a124a14def278991) 

### **n8n Workflow**  
- **Automation Workflow:** ![image](/public/N8N%20Flow.jpg)

The **n8n workflow** automates the entire process, making calorie tracking effortless. It consists of **two separate paths**, each triggered by a different **iOS shortcut**:

1. **Speech / Text Input Path**: This workflow is triggered when you **tell Siri what you ate**. It sends the input to **Perplexity API**, which returns the calories and macronutrient breakdown. The response is then processed and stored in **Supabase**.

2. **Barcode Scanning Path**: When scanning a barcode on your Iphone, the label is read and processed via the **Open Food Facts API**, the workflow retrieves the nutritional data for the exact product scanned. The extracted information is processed and saved in **Supabase**.

Both paths merge into a final **Supabase storage step**, ensuring all meal logs are available in the **interactive dashboard**. The final response is sent back via a webhook, providing immediate feedback if needed.

---

## 🧪 Tech Stack  
- **Perplexity API** → AI-powered calorie & macro calculations.  
- **n8n** → No-code workflow automation.  
- **Supabase** → Database to store all logged meals.  
- **Lovable** → Frontend for real-time calorie tracking.  
---

