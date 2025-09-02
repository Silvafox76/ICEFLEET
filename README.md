# ❄️ ICE FLEET - Fleet Management Platform

<div align="center">

![ICE FLEET](https://img.shields.io/badge/ICE_FLEET-Fleet_Management-blue?style=for-the-badge&logo=truck&logoColor=white)
![ICEHUB Ecosystem](https://img.shields.io/badge/ICEHUB-Ecosystem-red?style=for-the-badge&logo=snowflake&logoColor=white)
[![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**🚛 Fleet Management Module of the ICEHUB Ecosystem**

**Part of the comprehensive Ice Mitigation Services technology stack serving Whitby, Ontario and the Greater Toronto Area**

[ICEHUB Overview](#icehub-ecosystem) · [ICE FLEET Features](#features) · [Integration](#integration) · [Documentation](#documentation)

</div>

---

## 🎯 ICEHUB Ecosystem

ICE FLEET is a core component of the **ICEHUB** ecosystem - a comprehensive enterprise solution for restoration and mitigation services companies. The ICEHUB platform consists of three integrated modules:

### 📦 ICEHUB Modules

| Module | Purpose | Status |
|--------|---------|--------|
| **ICE FLEET** | Fleet & Vehicle Management | ✅ Active (This Repository) |
| **ICE CRM** | Customer Relationship & Job Management | 🔗 Integrated |
| **ICE CERT** | Compliance & Certification Tracking | 🔗 Integrated |

## 🌟 ICE FLEET Overview

ICE FLEET is the dedicated fleet management module within the ICEHUB ecosystem, specifically designed to handle all vehicle, equipment, and driver management operations for Ice Mitigation Services. This module seamlessly integrates with ICE CRM for job dispatch and ICE CERT for compliance tracking.

### 🎯 Core Responsibilities

- **Vehicle Fleet Management** - Track and manage all service vehicles
- **Driver Operations** - Driver assignments, schedules, and performance
- **Equipment Tracking** - Monitor restoration equipment across vehicles
- **Maintenance Scheduling** - Preventive and reactive maintenance
- **Route Optimization** - Efficient dispatch and routing
- **Fuel Management** - Consumption tracking and cost analysis
- **GPS Tracking** - Real-time vehicle location monitoring

## ✨ Features

### 🚚 Vehicle Management
- **Fleet Inventory**
  - Service vehicles, trucks, and trailers
  - Vehicle status monitoring (Active, Maintenance, Out of Service)
  - Registration and insurance tracking
  - Vehicle assignment to drivers

- **Real-Time Tracking**
  - GPS location monitoring
  - Route history and playback
  - Geofencing and alerts
  - Speed and idle monitoring

### 👤 Driver Management
- **Driver Profiles**
  - License status and expiry tracking
  - Driver scoring and performance metrics
  - Hours of service tracking
  - Vehicle assignment history

- **Schedule Management**
  - Shift scheduling
  - On-call rotations
  - Availability tracking
  - Integration with ICE CRM for job dispatch

### 🔧 Maintenance Management
- **Preventive Maintenance**
  - Service interval tracking
  - Automated maintenance reminders
  - Service history logs
  - Cost tracking per vehicle

- **Equipment Tracking**
  - Restoration equipment inventory per vehicle
  - Equipment maintenance schedules
  - Calibration tracking (integrates with ICE CERT)
  - Equipment utilization reports

### 📊 Fleet Analytics
- **Performance Metrics**
  - Fleet utilization rates
  - Fuel efficiency analysis
  - Maintenance cost tracking
  - Driver performance scoring

- **Reporting Dashboard**
  - Real-time fleet status
  - Vehicle availability
  - Maintenance due alerts
  - Compliance status (from ICE CERT)

## 🔗 Integration Points

### ICE CRM Integration
```typescript
// Job dispatch integration
GET  /api/integration/crm/jobs         # Receive job assignments
POST /api/integration/crm/dispatch     # Send vehicle dispatch status
PUT  /api/integration/crm/arrival      # Update arrival times
```

### ICE CERT Integration
```typescript
// Compliance synchronization
GET  /api/integration/cert/driver/{id}  # Get driver certifications
GET  /api/integration/cert/vehicle/{id} # Get vehicle compliance status
POST /api/integration/cert/alert        # Send compliance alerts
```

## 🏗️ Technical Architecture

### ICE FLEET Stack
- **Frontend:** Next.js 14 with TypeScript
- **UI Components:** Shadcn/ui + Tailwind CSS
- **Database:** PostgreSQL (shared ICEHUB database)
- **API:** RESTful API with Next.js API Routes
- **Real-Time:** WebSocket for GPS tracking
- **Maps:** Mapbox for vehicle tracking

### Database Schema
```sql
-- ICE FLEET specific tables
vehicles
drivers
maintenance_records
equipment
fuel_logs
gps_tracking
routes

-- Shared ICEHUB tables (read-only)
jobs (from ICE CRM)
certifications (from ICE CERT)
employees (from ICE CRM)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- ICEHUB database access
- API keys for ICE CRM and ICE CERT

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

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with ICEHUB credentials:
   ```env
   # ICEHUB Database
   DATABASE_URL="postgresql://user:pass@localhost:5432/icehub"
   
   # ICE FLEET Configuration
   NEXT_PUBLIC_APP_NAME="ICE FLEET"
   NEXTAUTH_URL="http://localhost:3000"
   
   # ICEHUB Integration
   ICE_CRM_API_URL="http://localhost:3001/api"
   ICE_CRM_API_KEY="your-crm-api-key"
   ICE_CERT_API_URL="http://localhost:3002/api"
   ICE_CERT_API_KEY="your-cert-api-key"
   
   # Third-party Services
   MAPBOX_API_KEY="your-mapbox-key"
   ```

4. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   ICE FLEET will be available at [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
ICEFLEET/
├── app/
│   ├── app/
│   │   ├── api/
│   │   │   ├── fleet/          # Vehicle management
│   │   │   ├── drivers/        # Driver management
│   │   │   ├── maintenance/    # Maintenance tracking
│   │   │   └── integration/    # ICEHUB integrations
│   │   ├── fleet/             # Fleet management UI
│   │   ├── drivers/           # Driver management UI
│   │   ├── maintenance/       # Maintenance UI
│   │   └── dashboard/         # Fleet dashboard
│   ├── components/
│   │   ├── fleet/             # Fleet-specific components
│   │   ├── maps/              # GPS tracking components
│   │   └── ui/                # Shared UI components
│   └── lib/
│       ├── icehub/            # ICEHUB integration utilities
│       └── fleet/             # Fleet-specific utilities
```

## 🔌 API Documentation

### Fleet Management Endpoints
```typescript
// Vehicle Management
GET    /api/fleet/vehicles          # List all vehicles
POST   /api/fleet/vehicles          # Add new vehicle
PUT    /api/fleet/vehicles/:id      # Update vehicle
DELETE /api/fleet/vehicles/:id      # Remove vehicle
GET    /api/fleet/vehicles/:id/gps  # Get GPS location

// Driver Management
GET    /api/drivers                 # List all drivers
POST   /api/drivers                 # Add new driver
PUT    /api/drivers/:id             # Update driver
GET    /api/drivers/:id/vehicles    # Get assigned vehicles
POST   /api/drivers/:id/assign      # Assign vehicle

// Maintenance
GET    /api/maintenance/schedule    # Maintenance schedule
POST   /api/maintenance/record      # Log maintenance
GET    /api/maintenance/alerts      # Due maintenance
PUT    /api/maintenance/:id/complete # Complete maintenance
```

## 🔒 Security & Compliance

- **Authentication:** Shared ICEHUB SSO
- **Authorization:** Role-based access control
- **Data Isolation:** Fleet data segregated by module
- **Audit Logging:** All fleet operations logged
- **Canadian Compliance:** PIPEDA, provincial regulations

## 📈 Performance Metrics

- **GPS Update Rate:** Real-time (1-5 second intervals)
- **Dashboard Load:** < 2 seconds
- **API Response:** < 200ms average
- **Concurrent Tracking:** 100+ vehicles

## 🛠️ Development

### Available Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run test       # Run tests
npm run lint       # ESLint check
npm run migrate    # Run database migrations
```

### ICEHUB Integration Testing
```bash
npm run test:integration   # Test ICE CRM integration
npm run test:cert         # Test ICE CERT integration
npm run test:e2e          # Full ICEHUB flow testing
```

## 🚢 Deployment

ICE FLEET is designed to be deployed alongside other ICEHUB modules:

### Docker Compose (Recommended)
```yaml
version: '3.8'
services:
  ice-fleet:
    image: icehub/ice-fleet:latest
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - ICE_CRM_API_URL=http://ice-crm:3001
      - ICE_CERT_API_URL=http://ice-cert:3002
    depends_on:
      - postgres
      - ice-crm
      - ice-cert
```

## 🗺️ Roadmap

### ICE FLEET Enhancements
- [ ] Mobile app for drivers (iOS/Android)
- [ ] Advanced route optimization with AI
- [ ] Predictive maintenance analytics
- [ ] Fuel card integration
- [ ] Electronic logging device (ELD) integration

### ICEHUB Integration
- [ ] Unified notification system
- [ ] Cross-module reporting dashboard
- [ ] Shared document management
- [ ] Centralized settings management

## 🤝 Contributing

ICE FLEET follows the ICEHUB contribution guidelines. Please ensure:
1. Changes maintain compatibility with ICE CRM and ICE CERT
2. API contracts are not broken
3. Database migrations are backwards compatible
4. Tests include integration scenarios

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Developed by [FoxOnAI.com](https://FoxOnAI.com) - AI-Powered Solutions
- Part of the ICEHUB ecosystem for Ice Mitigation Services
- Built with Next.js, TypeScript, and PostgreSQL

## 📞 Support

- **Technical Support:** [FoxOnAI.com](https://FoxOnAI.com)
- **ICEHUB Documentation:** [docs.icehub.ca](https://docs.icehub.ca)
- **GitHub Issues:** [github.com/Silvafox76/ICEFLEET](https://github.com/Silvafox76/ICEFLEET/issues)

## 📍 Service Information

**Ice Mitigation Services**  
Whitby, Ontario, Canada  
Serving the Greater Toronto Area

**Modules:**
- ICE FLEET (This Repository) - Fleet Management
- ICE CRM - Customer & Job Management
- ICE CERT - Compliance & Certification

---

<div align="center">

**Built with ❤️ by [FoxOnAI.com](https://FoxOnAI.com)**

🦊 **Part of the ICEHUB Ecosystem** ❄️

**Integrated Fleet Management for Restoration Services**

[FoxOnAI.com](https://FoxOnAI.com) · [ICEHUB Documentation](https://docs.icehub.ca) · [Support](https://FoxOnAI.com/contact)

</div>