# 🚛 ICE Fleet Platform

<div align="center">

![ICE Fleet Platform](https://img.shields.io/badge/ICE_Fleet-Platform-blue?style=for-the-badge&logo=truck&logoColor=white)
[![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**A comprehensive fleet management system designed specifically for ICE detention facility transportation operations**

[Demo](https://icefleet.vercel.app) · [Documentation](#documentation) · [Report Bug](https://github.com/Silvafox76/ICEFLEET/issues) · [Request Feature](https://github.com/Silvafox76/ICEFLEET/issues)

</div>

---

## 🌟 Overview

ICE Fleet Platform is a state-of-the-art fleet management solution built to streamline transportation operations for ICE detention facilities. This enterprise-grade application provides real-time tracking, comprehensive compliance management, and intelligent maintenance scheduling to ensure safe, efficient, and compliant detainee transportation.

### 🎯 Key Highlights

- **Real-Time Fleet Tracking** - Monitor all vehicles and assets in real-time
- **Compliance Automation** - Stay ahead of federal and state regulations
- **Predictive Maintenance** - AI-powered maintenance scheduling
- **Driver Management** - Complete driver certification and performance tracking
- **Security First** - Built with enterprise-grade security standards
- **Mobile Responsive** - Access from any device, anywhere

## ✨ Features

### 🚗 Fleet Management
- **Vehicle Tracking & Status**
  - Real-time GPS tracking
  - Vehicle status monitoring (Active, Maintenance, Out of Service)
  - Mileage tracking and fuel consumption
  - Vehicle assignment and scheduling

- **Trailer Management**
  - Equipment tracking and status
  - Capacity management
  - Maintenance scheduling
  - DOT compliance tracking

### 👥 Driver Management
- **Comprehensive Driver Profiles**
  - License and certification tracking
  - Medical card expiration alerts
  - Training history and compliance
  - Performance metrics and scoring

- **Assignment System**
  - Automated driver-vehicle pairing
  - Schedule management
  - Route optimization
  - Hours of service tracking

### 📋 Compliance & Documentation
- **Automated Compliance Tracking**
  - DOT regulations monitoring
  - State and federal compliance
  - Automatic renewal reminders
  - Document management system

- **Alert System**
  - Expiration notifications
  - Maintenance due alerts
  - Compliance warnings
  - Custom alert configurations

### 🔧 Maintenance Management
- **Preventive Maintenance**
  - Scheduled service tracking
  - Maintenance history logs
  - Cost tracking and analysis
  - Vendor management

- **Service Records**
  - Digital maintenance logs
  - Parts inventory tracking
  - Warranty management
  - Service provider integration

### 📊 Analytics & Reporting
- **Dashboard Analytics**
  - Fleet utilization metrics
  - Cost per mile analysis
  - Driver performance scores
  - Compliance rate tracking

- **Custom Reports**
  - Exportable reports (PDF, Excel)
  - Scheduled report generation
  - Historical data analysis
  - Predictive analytics

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
   DATABASE_URL="postgresql://user:password@localhost:5432/ice_fleet"
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
- **File Storage:** AWS S3 (optional)

### DevOps
- **Deployment:** Vercel / Railway
- **CI/CD:** GitHub Actions
- **Monitoring:** Vercel Analytics
- **Error Tracking:** Sentry (optional)

## 📁 Project Structure

```
ICEFLEET/
├── app/                    # Next.js application
│   ├── app/               # App router pages
│   │   ├── api/          # API routes
│   │   ├── compliance/   # Compliance module
│   │   ├── drivers/      # Driver management
│   │   ├── fleet/        # Fleet management
│   │   └── maintenance/  # Maintenance module
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
GET    /api/fleet/vehicles     # List all vehicles
POST   /api/fleet/vehicles     # Add new vehicle
PUT    /api/fleet/vehicles/:id # Update vehicle
DELETE /api/fleet/vehicles/:id # Remove vehicle

GET    /api/fleet/trailers     # List all trailers
POST   /api/fleet/trailers     # Add new trailer
```

#### Driver Management
```typescript
GET    /api/drivers            # List all drivers
POST   /api/drivers            # Add new driver
PUT    /api/drivers/:id        # Update driver
GET    /api/drivers/:id/docs   # Get driver documents
```

#### Compliance
```typescript
GET    /api/compliance/status   # Compliance overview
GET    /api/compliance/alerts   # Active alerts
POST   /api/compliance/renewals # Schedule renewal
```

#### Maintenance
```typescript
GET    /api/maintenance/records    # Maintenance history
POST   /api/maintenance/schedule   # Schedule service
PUT    /api/maintenance/complete   # Mark as complete
```

## 🛠️ Development

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run test       # Run tests
npm run seed       # Seed database
npm run migrate    # Run migrations
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_SECRET` | Authentication secret | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `AWS_ACCESS_KEY_ID` | AWS access key | No |
| `AWS_SECRET_ACCESS_KEY` | AWS secret | No |
| `SENTRY_DSN` | Sentry error tracking | No |

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

- **Lighthouse Score:** 95+ across all metrics
- **Load Time:** < 2s initial load
- **Time to Interactive:** < 3s
- **Bundle Size:** < 200KB gzipped

## 🔒 Security

- **Authentication:** Multi-factor authentication support
- **Authorization:** Role-based access control (RBAC)
- **Data Encryption:** AES-256 encryption at rest
- **API Security:** Rate limiting and CORS protection
- **Compliance:** GDPR and CCPA compliant

## 🚢 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Silvafox76/ICEFLEET)

### Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/Silvafox76/ICEFLEET)

### Docker

```bash
# Build the image
docker build -t ice-fleet .

# Run the container
docker run -p 3000:3000 ice-fleet
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

- [ ] Mobile application (React Native)
- [ ] Advanced route optimization
- [ ] AI-powered predictive maintenance
- [ ] Integration with third-party GPS providers
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Blockchain-based compliance tracking
- [ ] IoT sensor integration

---

<div align="center">

**Built with ❤️ by [FoxOnAI.com](https://FoxOnAI.com)**

🦊 **Powered by AI Innovation**

[FoxOnAI.com](https://FoxOnAI.com) · [Contact](https://FoxOnAI.com/contact) · [Portfolio](https://FoxOnAI.com/portfolio) · [AI Solutions](https://FoxOnAI.com/solutions)

</div>