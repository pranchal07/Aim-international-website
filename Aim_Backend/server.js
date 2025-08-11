// AIM International Backend Files


## 1. server.js
```javascript
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // In production, replace with your domain
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files if needed
app.use(express.static('public'));

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER || 'aiminternational72021@gmail.com',
      pass: process.env.SMTP_PASS, // Gmail App Password
    },
  });
};

// Company data
const companyData = {
  name: "AIM International",
  tagline: "The Pentelligent Choice",
  owner: "Vipin Pandey",
  ceo: "Tanmay Pandey",
  business_type: "Notebook and stationery manufacturing",
  distribution: "All India distribution",
  contact: {
    phones: [
      { number: "7850837609", person: "Tanmay Pandey", role: "CEO" },
      { number: "9810892670", person: "Vipin Pandey", role: "Owner" }
    ],
    email: "aiminternational72021@gmail.com",
    address: "Arazi no.232 8 block B luv kush Puram Bamba road Kalyanpur Kanpur, Uttar Pradesh",
    office_hours: "Monday - Saturday: 9:00 AM - 6:00 PM"
  }
};

// Products data
const productsData = {
  categories: [
    {
      id: 1,
      name: "Notebooks",
      description: "High-quality notebooks for all your writing needs",
      image: "/images/notebooks-category.jpg",
      products: [
        {
          id: 101,
          name: "Exercise Notebooks",
          description: "Premium quality exercise books for students",
          price: "₹25-45",
          specifications: "80-120 pages, ruled/unruled options",
          features: ["Smooth writing surface", "Durable binding", "Various sizes"]
        },
        {
          id: 102,
          name: "Spiral Notebooks",
          description: "Professional spiral-bound notebooks",
          price: "₹35-65",
          specifications: "100-200 pages, A4/A5 sizes",
          features: ["Wire-o binding", "Perforated pages", "Hard cover options"]
        },
        {
          id: 103,
          name: "Composition Books",
          description: "Classic composition notebooks for writing",
          price: "₹30-50",
          specifications: "96-192 pages, wide/college ruled",
          features: ["Sewn binding", "Marble covers", "Acid-free paper"]
        },
        {
          id: 104,
          name: "Subject Notebooks",
          description: "Multi-subject notebooks with dividers",
          price: "₹45-75",
          specifications: "150-300 pages, multiple sections",
          features: ["Subject dividers", "Index pages", "Pocket folders"]
        },
        {
          id: 105,
          name: "Drawing Books",
          description: "Specialized paper for artistic endeavors",
          price: "₹40-80",
          specifications: "50-100 pages, various paper weights",
          features: ["Bleed-resistant paper", "Smooth texture", "Spiral bound"]
        }
      ]
    },
    {
      id: 2,
      name: "Stationery",
      description: "Complete range of writing instruments and accessories",
      image: "/images/stationery-category.jpg",
      products: [
        {
          id: 201,
          name: "Ball Pens",
          description: "Smooth-writing ball point pens",
          price: "₹5-15",
          specifications: "0.7mm tip, various colors",
          features: ["Quick-dry ink", "Comfortable grip", "Long-lasting"]
        },
        {
          id: 202,
          name: "Pencils",
          description: "High-quality graphite pencils",
          price: "₹3-10",
          specifications: "HB, 2B grades available",
          features: ["Break-resistant lead", "Smooth writing", "Easy sharpening"]
        },
        {
          id: 203,
          name: "Erasers",
          description: "Premium quality erasers",
          price: "₹2-8",
          specifications: "Dust-free, various sizes",
          features: ["Clean erasing", "No paper damage", "Long-lasting"]
        },
        {
          id: 204,
          name: "Rulers",
          description: "Precision measuring tools",
          price: "₹8-25",
          specifications: "15cm, 30cm lengths",
          features: ["Clear markings", "Durable plastic", "Beveled edge"]
        },
        {
          id: 205,
          name: "Markers",
          description: "Vibrant colored markers",
          price: "₹10-30",
          specifications: "Fine/broad tips, washable",
          features: ["Bright colors", "Non-toxic", "Cap-off protection"]
        }
      ]
    },
    {
      id: 3,
      name: "Office Supplies",
      description: "Professional office organization solutions",
      image: "/images/office-supplies-category.jpg",
      products: [
        {
          id: 301,
          name: "Files & Folders",
          description: "Document organization solutions",
          price: "₹15-50",
          specifications: "A4 size, various capacities",
          features: ["Durable construction", "Easy labeling", "Multiple colors"]
        },
        {
          id: 302,
          name: "Clipboards",
          description: "Portable writing surfaces",
          price: "₹25-75",
          specifications: "A4/Legal size, wood/plastic",
          features: ["Strong clip", "Smooth writing surface", "Hanging hole"]
        },
        {
          id: 303,
          name: "Staplers",
          description: "Reliable document fastening",
          price: "₹50-200",
          specifications: "Standard/heavy duty",
          features: ["Jam-free operation", "Adjustable depth", "Staple remover"]
        }
      ]
    },
    {
      id: 4,
      name: "Educational Materials",
      description: "Specialized products for educational institutions",
      image: "/images/educational-category.jpg",
      products: [
        {
          id: 401,
          name: "Workbooks",
          description: "Subject-specific practice books",
          price: "₹40-120",
          specifications: "Grade-wise, curriculum aligned",
          features: ["Practice exercises", "Answer keys", "Progress tracking"]
        },
        {
          id: 402,
          name: "Chart Papers",
          description: "Large format paper for presentations",
          price: "₹20-60",
          specifications: "A1/A0 sizes, various colors",
          features: ["Smooth surface", "Fade-resistant", "Easy writing"]
        },
        {
          id: 403,
          name: "Project Files",
          description: "Professional project presentation folders",
          price: "₹30-80",
          specifications: "A4 size, transparent covers",
          features: ["Multiple pockets", "Spine labels", "Durable material"]
        }
      ]
    }
  ],
  company_info: {
    name: "AIM International",
    tagline: "The Pentelligent Choice",
    specialization: "High-quality notebook and stationery manufacturing",
    distribution: "All India distribution network",
    certifications: ["ISO 9001:2015", "FSC Certified", "BIS Standards"]
  }
};

// FAQ Data
const faqData = [
  {
    id: 1,
    question: "What is your minimum order quantity?",
    answer: "Our minimum order quantity varies by product. For notebooks, it's typically 100 pieces per design. For bulk orders, we offer competitive pricing."
  },
  {
    id: 2,
    question: "Do you offer custom printing and branding?",
    answer: "Yes! We provide custom printing services including logos, covers, and branding for institutions and businesses. Contact us for detailed quotations."
  },
  {
    id: 3,
    question: "What are your delivery timeframes?",
    answer: "Standard orders are delivered within 7-10 business days across India. Custom orders may take 15-20 days depending on specifications."
  },
  {
    id: 4,
    question: "Do you have a catalog of all products?",
    answer: "Yes, we have comprehensive product catalogs available. Please contact our customer care team to receive the latest catalog via email."
  },
  {
    id: 5,
    question: "What payment methods do you accept?",
    answer: "We accept bank transfers, cheques, and for smaller orders, UPI payments. Credit terms are available for established business customers."
  },
  {
    id: 6,
    question: "Do you provide samples before bulk orders?",
    answer: "Yes, we provide samples for quality evaluation. Sample charges may apply and will be adjusted against bulk orders."
  },
  {
    id: 7,
    question: "Are your products environmentally friendly?",
    answer: "We are committed to sustainability. Our products use FSC-certified paper and eco-friendly manufacturing processes wherever possible."
  },
  {
    id: 8,
    question: "Do you offer distribution partnerships?",
    answer: "Yes, we welcome distribution partners across India. Contact our business development team for partnership opportunities."
  }
];

// Validation helper functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile number format
  return phoneRegex.test(phone);
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'AIM International API is running', 
    timestamp: new Date().toISOString() 
  });
});

// Company information
app.get('/api/company', (req, res) => {
  res.json(companyData);
});

// Products API
app.get('/api/products', (req, res) => {
  try {
    const { category } = req.query;
    let responseData = productsData;

    if (category) {
      const filteredCategory = productsData.categories.find(
        cat => cat.name.toLowerCase() === category.toLowerCase()
      );
      if (filteredCategory) {
        responseData = { 
          categories: [filteredCategory], 
          company_info: productsData.company_info 
        };
      } else {
        return res.status(404).json({ error: 'Category not found' });
      }
    }

    res.json(responseData);
  } catch (error) {
    console.error('Products API error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Contact form handler
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message, subject } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields: name, email, and message are required' });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate phone if provided
    if (phone && !validatePhone(phone)) {
      return res.status(400).json({ error: 'Invalid phone number format. Please use 10-digit Indian mobile number' });
    }

    const transporter = createTransporter();

    // Email to company
    const mailOptions = {
      from: process.env.SMTP_USER || 'aiminternational72021@gmail.com',
      to: 'aiminternational72021@gmail.com',
      subject: subject || `Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d63031;">New Contact Form Submission - AIM International</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
            <p><strong>Message:</strong></p>
            <div style="background: white; padding: 15px; border-left: 4px solid #d63031; margin-top: 10px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            This email was sent from the AIM International website contact form.<br/>
            Received on: ${new Date().toLocaleString('en-IN')}
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Auto-reply to customer
    const autoReply = {
      from: process.env.SMTP_USER || 'aiminternational72021@gmail.com',
      to: email,
      subject: 'Thank you for contacting AIM International',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d63031;">Thank you for contacting AIM International</h2>
          <p>Dear ${name},</p>
          <p>Thank you for reaching out to us. We have received your message and will get back to you within 24 hours.</p>
          <p><strong>Your message:</strong></p>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0;">
            ${message.replace(/\n/g, '<br>')}
          </div>
          <p>For urgent inquiries, please contact us directly:</p>
          <ul>
            <li><strong>Tanmay Pandey (CEO):</strong> <a href="tel:7850837609">7850837609</a></li>
            <li><strong>Vipin Pandey (Owner):</strong> <a href="tel:9810892670">9810892670</a></li>
          </ul>
          <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 5px;">
            <p style="margin: 0;"><strong>AIM International</strong><br/>
            <em>The Pentelligent Choice</em><br/>
            Email: aiminternational72021@gmail.com<br/>
            Address: Arazi no.232 8 block B luv kush Puram Bamba road Kalyanpur Kanpur, Uttar Pradesh</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(autoReply);

    res.json({ 
      success: true, 
      message: 'Email sent successfully! We will get back to you soon.' 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      error: 'Failed to send message. Please try again later.' 
    });
  }
});

// Newsletter subscription
app.post('/api/newsletter', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // In production, you would save this to a database
    // For now, we'll just send a confirmation email
    const transporter = createTransporter();

    const confirmationEmail = {
      from: process.env.SMTP_USER || 'aiminternational72021@gmail.com',
      to: email,
      subject: 'Welcome to AIM International Newsletter',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d63031;">Welcome to AIM International Newsletter!</h2>
          <p>Thank you for subscribing to our newsletter.</p>
          <p>You'll receive updates about:</p>
          <ul>
            <li>📝 New product launches</li>
            <li>🎯 Special offers and discounts</li>
            <li>📢 Company news and updates</li>
            <li>💡 Industry insights</li>
          </ul>
          <p>Stay tuned for our latest updates!</p>
          <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 5px;">
            <p style="margin: 0;"><strong>AIM International</strong><br/>
            <em>The Pentelligent Choice</em><br/>
            Contact: 7850837609 (Tanmay) | 9810892670 (Vipin)</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(confirmationEmail);

    // Also notify the company about new subscription
    const notificationEmail = {
      from: process.env.SMTP_USER || 'aiminternational72021@gmail.com',
      to: 'aiminternational72021@gmail.com',
      subject: 'New Newsletter Subscription',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h3 style="color: #d63031;">New Newsletter Subscription</h3>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subscribed on:</strong> ${new Date().toLocaleString('en-IN')}</p>
        </div>
      `,
    };

    await transporter.sendMail(notificationEmail);

    res.json({ 
      success: true, 
      message: 'Successfully subscribed to newsletter!' 
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ 
      error: 'Failed to subscribe. Please try again later.' 
    });
  }
});

// Support and FAQ
app.get('/api/support', (req, res) => {
  const supportData = {
    contact_info: companyData.contact,
    faq: faqData,
    support_categories: [
      {
        title: "Order Support",
        description: "Help with placing orders, tracking, and modifications",
        contact_method: "Phone or Email"
      },
      {
        title: "Product Information",
        description: "Detailed specifications, catalogs, and customization options",
        contact_method: "Email or Call"
      },
      {
        title: "Quality Issues",
        description: "Report quality concerns or product defects",
        contact_method: "Direct Phone Call"
      },
      {
        title: "Partnership Inquiries",
        description: "Distribution and business partnership opportunities",
        contact_method: "Email to management"
      }
    ]
  };

  res.json(supportData);
});

// Support ticket submission
app.post('/api/support', async (req, res) => {
  try {
    const { name, email, phone, issue_type, priority, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields: name, email, and message are required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Generate ticket ID
    const ticketId = 'AIM' + Date.now().toString().slice(-6);

    const transporter = createTransporter();

    // Send support ticket to company
    const supportEmail = {
      from: process.env.SMTP_USER || 'aiminternational72021@gmail.com',
      to: 'aiminternational72021@gmail.com',
      subject: `Support Ticket #${ticketId} - ${issue_type || 'General'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d63031;">Support Ticket #${ticketId}</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
            <p><strong>Priority:</strong> ${priority || 'Normal'}</p>
            <p><strong>Issue Type:</strong> ${issue_type || 'General Inquiry'}</p>
            <p><strong>Customer Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Message:</strong></p>
            <div style="background: white; padding: 15px; border-left: 4px solid #d63031; margin-top: 10px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            Ticket generated on ${new Date().toLocaleString('en-IN')}
          </p>
        </div>
      `,
    };

    await transporter.sendMail(supportEmail);

    // Send confirmation to customer
    const confirmationEmail = {
      from: process.env.SMTP_USER || 'aiminternational72021@gmail.com',
      to: email,
      subject: `Support Ticket Confirmation - #${ticketId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d63031;">Support Ticket Received</h2>
          <p>Dear ${name},</p>
          <p>Thank you for contacting AIM International support. Your ticket has been received and assigned ID: <strong>#${ticketId}</strong></p>
          <p><strong>Issue Type:</strong> ${issue_type || 'General Inquiry'}</p>
          <p><strong>Priority:</strong> ${priority || 'Normal'}</p>
          <p>Our support team will respond within 24 hours. For urgent matters, please call:</p>
          <ul>
            <li><strong>Tanmay Pandey (CEO):</strong> <a href="tel:7850837609">7850837609</a></li>
            <li><strong>Vipin Pandey (Owner):</strong> <a href="tel:9810892670">9810892670</a></li>
          </ul>
          <p>Best regards,<br/>AIM International Support Team</p>
        </div>
      `,
    };

    await transporter.sendMail(confirmationEmail);

    res.json({ 
      success: true, 
      ticket_id: ticketId,
      message: 'Support ticket created successfully. We will contact you soon.' 
    });

  } catch (error) {
    console.error('Support function error:', error);
    res.status(500).json({ error: 'Support service temporarily unavailable' });
  }
});

// Catch-all route for handling frontend routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AIM International server running on port ${PORT}`);
  console.log(`📧 Email service configured for: ${process.env.SMTP_USER || 'aiminternational72021@gmail.com'}`);
  console.log(`🌐 API endpoints available at: http://localhost:${PORT}/api/`);
});

module.exports = app;
```

## 2. package.json
```json
{
  "name": "aim-international-backend",
  "version": "1.0.0",
  "description": "Express.js backend server for AIM International stationery business website",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "build": "echo 'No build step required'",
    "test": "echo 'No test specified' && exit 0"
  },
  "keywords": [
    "express",
    "nodejs",
    "stationery",
    "notebooks",
    "manufacturing",
    "business-website",
    "api",
    "email",
    "contact-form"
  ],
  "author": {
    "name": "AIM International",
    "email": "aiminternational72021@gmail.com"
  },
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "nodemailer": "^6.9.7",
    "cors": "^2.8.5",
    "body-parser": "^1.20.2",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  },
  "engines": {
    "node": ">=14.0.0",
    "npm": ">=6.0.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/aim-international/backend.git"
  },
  "bugs": {
    "url": "https://github.com/aim-international/backend/issues",
    "email": "aiminternational72021@gmail.com"
  },
  "homepage": "https://aim-international.com"
}
```

## Environment Variables (.env)
Create a `.env` file in your project root:
```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Email Configuration (Gmail)
SMTP_USER=aiminternational72021@gmail.com
SMTP_PASS=your_gmail_app_password_here

# CORS Origins (comma-separated)
ALLOWED_ORIGINS=http://localhost:3000,https://your-domain.com
```

## API Endpoints Available

### GET Endpoints:
- `GET /api/health` - Server health check
- `GET /api/company` - Company information
- `GET /api/products` - Product catalog (with optional ?category filter)
- `GET /api/support` - Support info and FAQ

### POST Endpoints:
- `POST /api/contact` - Contact form submission
- `POST /api/newsletter` - Newsletter subscription
- `POST /api/support` - Support ticket creation

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Create Environment File:**
   ```bash
   cp .env.example .env
   # Edit .env with your Gmail App Password
   ```

3. **Development Mode:**
   ```bash
   npm run dev
   ```

4. **Production Mode:**
   ```bash
   npm start
   ```

## Deployment Options

### Option 1: Heroku
```bash
git add .
git commit -m "AIM International backend"
heroku create aim-international-api
heroku config:set SMTP_USER=aiminternational72021@gmail.com
heroku config:set SMTP_PASS=your_gmail_app_password
git push heroku main
```

### Option 2: Railway
```bash
railway login
railway new
railway add
railway up
```

### Option 3: Render
1. Connect GitHub repo
2. Set environment variables in dashboard
3. Deploy automatically

Your Express.js backend is ready for production!