# ❄️ Ice Mitigation Services Fleet Platform

<div align="center">

![Ice Mitigation Services](https://img.shields.io/badge/Ice_Mitigation-Services-red?style=for-the-badge&logo=snowflake&logoColor=white)
[![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**🍁 Canadian Fleet Management System for Restoration & Emergency Services | Serving the Greater Toronto Area from Whitby, Ontario**

[Demo](https://icemitigation.ca) · [Documentation](#documentation) · [Report Bug](https://github.com/Silvafox76/ICEFLEET/issues) · [Request Feature](https://github.com/Silvafox76/ICEFLEET/issues)

</div>

---

## 🌟 Overview

Ice Mitigation Services Fleet Platform is a made-in-Canada management solution designed specifically for Canadian restoration, cleaning, and emergency response companies. Based in Whitby, Ontario, and serving the Greater Toronto Area (GTA), this enterprise-grade application streamlines fleet operations, job scheduling, equipment tracking, and team coordination to deliver rapid response and quality service across Southern Ontario for water damage, fire damage, mold remediation, winter storm damage, and other restoration needs.

### 🎯 Key Highlights

- **Emergency Response Dispatch** - 24/7 rapid response across the GTA and Durham Region
- **Fleet & Equipment Tracking** - Monitor all vehicles, equipment, and supplies in real-time
- **Job Management System** - Complete project lifecycle from dispatch to billing
- **Team Coordination** - Crew scheduling and certification tracking
- **Client Portal** - Real-time updates and documentation for customers
- **Canadian Compliance** - IICRC, Health Canada, WSIB, and provincial regulatory compliance

## ✨ Features

### 🚚 Fleet & Equipment Management
- **Service Vehicle Tracking**
  - Real-time GPS tracking for all response vehicles
  - Equipment inventory per vehicle
  - Maintenance scheduling and logs
  - Fuel consumption and route optimization

- **Equipment Management**
  - Dehumidifiers, air movers, and air scrubbers tracking
  - Equipment availability and deployment status
  - Calibration and certification schedules
  - Rental equipment coordination

### 🏠 Job & Project Management
- **Emergency Dispatch System**
  - 24/7 call center integration
  - Automated crew dispatch based on location
  - Priority-based job queuing
  - Real-time job status updates

- **Restoration Projects**
  - Water damage mitigation tracking
  - Fire and smoke damage restoration
  - Mold remediation projects
  - Winter ice dam and freeze damage
  - Biohazard cleanup coordination
  - Contents restoration and pack-out services
  - Commercial and residential services

### 👷 Crew Management
- **Technician Profiles**
  - IICRC certification tracking
  - Training history and specializations
  - Availability scheduling
  - Performance metrics and reviews

- **Team Dispatch**
  - Skill-based crew assignment
  - On-call rotation management
  - Time and attendance tracking
  - Overtime and emergency pay calculation

### 📋 Compliance & Documentation
- **Canadian Industry Certifications**
  - IICRC certification management
  - Health Canada compliance
  - WSIB (Workplace Safety and Insurance Board) requirements
  - Ontario Ministry of Labour standards
  - Provincial licensing and permits

- **Job Documentation**
  - Photo and video documentation
  - Moisture readings and mapping
  - Psychrometric calculations
  - Insurance claim documentation
  - Customer authorization forms

### 💼 Client Management
- **Customer Portal**
  - Real-time job progress updates
  - Document and photo access
  - Digital signature collection
  - Communication history in English and French
  - Insurance claim assistance (all major Canadian insurers)

- **Billing & Invoicing**
  - Xactimate integration
  - Canadian insurance company billing
  - Direct customer billing with HST/GST
  - Interac e-Transfer and payment processing
  - Collections management

### 📊 Analytics & Reporting
- **Business Intelligence**
  - Revenue by service type
  - Response time metrics
  - Customer satisfaction scores
  - Equipment utilization rates
  - Technician productivity

- **Custom Reports**
  - Job completion reports
  - Insurance documentation
  - Compliance reports
  - Financial statements
  - Equipment ROI analysis

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0 or higher
- PostgreSQL 14.0 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Silvafox76/ICEFLEET.git
   cd ICEFLEET
   ```

2. **Install dependencies**
   ```bash
   cd app
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/ice_mitigation"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Initialize the database**
   ```bash
   npx prisma generate
   npx prisma db push
   npm run seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Tech Stack

### Frontend
- **Framework:** [Next.js 14](https://nextjs.org/) with App Router
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn/ui](https://ui.shadcn.com/)
- **State Management:** React Context API
- **Forms:** React Hook Form with Zod validation

### Backend
- **API:** Next.js API Routes
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** NextAuth.js
- **File Storage:** AWS S3 for documentation
- **SMS/Email:** Twilio/SendGrid integration

### DevOps
- **Deployment:** Vercel / Railway
- **CI/CD:** GitHub Actions
- **Monitoring:** Vercel Analytics
- **Error Tracking:** Sentry

## 📁 Project Structure

```
ICEFLEET/
├── app/                    # Next.js application
│   ├── app/               # App router pages
│   │   ├── api/          # API routes
│   │   ├── dispatch/     # Emergency dispatch (GTA coverage)
│   │   ├── jobs/         # Job management
│   │   ├── fleet/        # Fleet tracking
│   │   ├── crew/         # Crew management
│   │   └── clients/      # Client portal (bilingual)
│   ├── components/        # React components
│   │   ├── ui/           # UI components
│   │   └── features/     # Feature components
│   ├── lib/              # Utility functions
│   ├── prisma/           # Database schema
│   └── public/           # Static assets
├── docs/                  # Documentation
├── scripts/              # Utility scripts
└── tests/                # Test suites
```

## 🔌 API Documentation

### Core Endpoints

#### Fleet Management
```typescript
GET    /api/fleet/vehicles     # List all service vehicles
POST   /api/fleet/vehicles     # Add new vehicle
PUT    /api/fleet/vehicles/:id # Update vehicle status
GET    /api/fleet/equipment    # List all equipment

GET    /api/fleet/tracking     # Real-time GPS tracking
POST   /api/fleet/dispatch     # Dispatch vehicle to job
```

#### Job Management
```typescript
GET    /api/jobs               # List all jobs
POST   /api/jobs               # Create new job
PUT    /api/jobs/:id           # Update job status
GET    /api/jobs/:id/photos    # Get job documentation

POST   /api/dispatch/emergency # Emergency dispatch
GET    /api/dispatch/queue     # View dispatch queue
```

#### Crew Management
```typescript
GET    /api/crew               # List all technicians
POST   /api/crew               # Add new technician
GET    /api/crew/:id/certs     # Get certifications
POST   /api/crew/schedule      # Schedule crew

GET    /api/crew/oncall        # On-call rotation
POST   /api/crew/dispatch      # Dispatch crew to job
```

#### Client Portal
```typescript
GET    /api/clients/:id/jobs   # Client's job history
GET    /api/clients/:id/docs   # Job documentation
POST   /api/clients/signature  # Collect e-signature
GET    /api/clients/billing    # Billing information
```

## 🛠️ Development

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run test       # Run tests
npm run seed       # Seed database with sample data
npm run migrate    # Run database migrations
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_SECRET` | Authentication secret | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `AWS_ACCESS_KEY_ID` | AWS access key for S3 | Yes |
| `AWS_SECRET_ACCESS_KEY` | AWS secret | Yes |
| `TWILIO_ACCOUNT_SID` | Twilio for SMS (Canadian numbers) | No |
| `SENDGRID_API_KEY` | SendGrid for email | No |
| `XACTIMATE_API_KEY` | Xactimate integration | No |
| `CANADA_POST_API_KEY` | Address validation | No |
| `INTERAC_MERCHANT_ID` | Payment processing | No |

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm run test:coverage
```

## 📈 Performance

- **Response Time:** < 30 minutes within GTA/Durham Region
- **Load Time:** < 2s initial load
- **Mobile Optimized:** Full functionality on mobile devices
- **Offline Mode:** Critical features work offline
- **Coverage Area:** 100km radius from Whitby, ON

## 🔒 Security

- **Authentication:** Multi-factor authentication
- **Authorization:** Role-based access control
- **Data Encryption:** AES-256 encryption
- **PIPEDA Compliant:** Canadian privacy regulations
- **PCI DSS Compliant:** For payment processing
- **Provincial Privacy Laws:** Ontario PHIPA compliance

## 🚢 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Silvafox76/ICEFLEET)

### Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/Silvafox76/ICEFLEET)

### Docker

```bash
# Build the image
docker build -t ice-mitigation .

# Run the container
docker run -p 3000:3000 ice-mitigation
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Developed by [FoxOnAI.com](https://FoxOnAI.com) - AI-Powered Solutions
- Built with [Next.js](https://nextjs.org/)
- UI components from [Shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Database powered by [PostgreSQL](https://www.postgresql.org/)

## 📞 Support

For support, contact [FoxOnAI.com](https://FoxOnAI.com) or open an issue on [GitHub](https://github.com/Silvafox76/ICEFLEET/issues).

## 🗺️ Roadmap

- [ ] Mobile app for field technicians (iOS/Android)
- [ ] AI-powered damage assessment
- [ ] Drone integration for roof and ice dam inspections
- [ ] Thermal imaging integration
- [ ] Augmented reality for moisture mapping
- [ ] Automated Canadian insurance claim processing
- [ ] Winter storm response optimization
- [ ] French language support (full bilingual)
- [ ] Integration with Canadian weather services
- [ ] Customer mobile app with push notifications
- [ ] Voice-activated dispatch system (English/French)

## 📍 Service Areas

**Primary Service Area:** Whitby, Oshawa, Ajax, Pickering, Brooklin, Port Perry

**Extended Coverage:** Toronto, Scarborough, North York, Markham, Richmond Hill, Vaughan, Mississauga, Brampton

**Emergency Response:** Available 24/7/365 throughout Durham Region and the GTA

---

<div align="center">

**Built with ❤️ by [FoxOnAI.com](https://FoxOnAI.com)**

🦊 **Proudly Canadian AI Innovation** 🍁

**Serving Ontario businesses with cutting-edge technology solutions**

[FoxOnAI.com](https://FoxOnAI.com) · [Contact](https://FoxOnAI.com/contact) · [Portfolio](https://FoxOnAI.com/portfolio) · [AI Solutions](https://FoxOnAI.com/solutions)

</div>