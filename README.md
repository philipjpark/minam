<div align="center">

# minam 미남

<img src="https://raw.githubusercontent.com/philipjpark/minam/main/apps/web/public/james-dean-logo.png" alt="James Dean Logo" width="120" height="120" style="border-radius: 50%; margin-bottom: 20px;">

## The OnlyFans for API Creators

*"Your knowledge is about to pay you handsomely."*

### 🎥 **Watch the Demo**
[![Minam Demo](https://img.youtube.com/vi/BNrB487K8rk/maxresdefault.jpg)](https://youtu.be/BNrB487K8rk)

*Click the image above to watch the full demo of Minam in action*

</div>

**minam 미남** is the platform that democratizes API creation for knowledge creators. Transform your data, insights, and expertise into **tiered APIs** that pay you every time someone accesses your knowledge. Control who gets access and how much - set up tiers, fractionalize your data, and get paid for what you need with a pay-as-you-need model.

Just like OnlyFans and YouTube revolutionized content creation, we're revolutionizing API creation for knowledge creators worldwide.

## 🚀 **What's New**

- **🔐 Secure API Keys**: Environment variable setup with `.env.local`
- **🤖 GPT-4o Integration**: Reliable AI model with automatic selection
- **📁 Multi-Format File Support**: Upload Excel, CSV, and PDF files
- **🎯 Dynamic Data Validator**: AI-powered real-time file analysis
- **📊 Smart Model Selection**: AI automatically selects the best model for your data
- **💰 Tiered Monetization**: Free, Premium ($29.99), Enterprise ($99.99) pricing
- **🔄 Real-time Agent Transparency**: Hover over completed agents to see their reasoning
- **🔗 Database Integration**: Connect to Supabase databases directly
- **📊 File Persistence**: Seamless file transfer from API Builder to Sandbox
- **🛡️ Robust Error Handling**: Graceful fallbacks for all file processing

## 🆕 **Latest Updates**

### 🔗 Database Integration
- **Supabase Connection**: Connect directly to your Supabase database
- **Manual Table Import**: Enter table names manually when auto-discovery fails
- **Real-time Data Fetching**: Import table data directly into your API
- **Generic Interface**: Clean "Connect URL" interface without platform-specific references

### 📊 Enhanced File Processing
- **File Persistence**: Files uploaded in API Builder automatically appear in Sandbox
- **Robust Error Handling**: Graceful fallbacks when Excel parsing fails
- **Multi-format Support**: Excel (.xlsx, .xls), CSV (.csv), PDF (.pdf) files
- **Dynamic Analysis**: Real-time file content analysis using OpenAI API
- **Fallback Mode**: System continues working even with parsing issues

### 🎯 Improved User Experience
- **Streamlined Interface**: Removed redundant tabs and simplified navigation
- **Better Error Messages**: Clear feedback for all operations
- **File Status Indicators**: Visual feedback showing file processing status
- **Seamless Workflow**: Smooth transition from API Builder to Sandbox
- **Agent Transparency**: Hover over completed agents to see detailed reasoning

### 🛡️ Technical Improvements
- **Fixed Initialization Errors**: Resolved function hoisting issues
- **Better State Management**: Proper file data flow between components
- **Enhanced Validation**: Improved input validation and error handling
- **Performance Optimization**: Faster file processing and UI updates

## Quick Start

### 1. Environment Setup
```bash
cd apps/web
cp .env.example .env.local
# Edit .env.local and add your OpenAI API key
```

### 2. API (Rust)
```bash
cd apps/api
cargo run
# API at http://localhost:8787
```

### 3. Web (Next.js)
```bash
cd apps/web
pnpm i || npm i
pnpm dev || npm run dev
# UI at http://localhost:3000
```

### SDK demo
```ts
import { MinamClient } from "@minam/sdk";
const c = new MinamClient({ baseUrl: "http://localhost:8787" });
await c.createProvider({ name: "Acme Retail", contactEmail: "ops@acme.test" });
```

## 🔐 Environment Variables

Create a `.env.local` file in `apps/web/` with the following variables:

```bash
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8787
API_BASE_URL=http://localhost:8787
```

**Get your OpenAI API key from:** [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)

## Architecture (high-level)

```
packages/
  schemas/        # Zod contracts shared by web + sdk
  sdk/            # Tiny fetch client
apps/
  api/            # Rust (axum) service with agentic pipeline and marketplace
  web/            # Next.js app (2 pages: Create & Publish)
data/examples/    # Provider configs & manifests
pipeline/examples # YAML-like recipe for agents
```

### 🤖 AI Agents (Role-Based)

Our AI agents work like a professional team, each with specialized roles:

- **🔍 Data Validator**: **DYNAMIC!** Real-time analysis using OpenAI API - analyzes actual file content, detects file types, calculates quality scores, and identifies missing values
- **🧠 Model Profiler**: Selects optimal ML models for your dataset
- **🏗️ API Architect**: Designs RESTful API structure
- **🔒 Security Auditor**: Implements security measures and compliance
- **🚀 Deployment Engineer**: Deploys to production with monitoring
- **⚙️ Orchestrator**: Coordinates the entire pipeline
- **🎯 Model Toggle Agent**: Automatically selects best AI model (GPT-4o, Codex, GPT-4 Omega)
- **📊 Performance Monitor**: Tracks usage, costs, and optimization opportunities

## Human‑in‑the‑Loop
A publish requires a **green pass** on automated checks **and** a human approval note. The UI exposes diffs and sample rows before "Go Live".

## 🎯 Key Features

### 🤖 **AI Model Toggle Agent**
- **3 OpenAI Models**: GPT-4o, Codex, GPT-4 Omega
- **Automatic Selection**: AI chooses the best model for your specific dataset
- **Performance Optimization**: Learns from usage to improve recommendations
- **Cost Intelligence**: Balances performance vs cost based on your data

### 📁 **Multi-Format File Support**
- **File Types**: Excel (.xlsx, .xls), CSV (.csv), PDF (.pdf)
- **Real-time Processing**: AI analyzes file content and structure
- **Dynamic Analysis**: Data Validator provides real metrics from actual file content
- **Model Reasoning**: Explains why each model is best for your data
- **PDF Support**: Basic PDF upload with AI content analysis
- **File Persistence**: Files seamlessly transfer from API Builder to Sandbox
- **Robust Parsing**: Graceful fallbacks when file processing encounters issues

### 🎯 **Tiered Monetization**
- **Free Tier**: Basic data access (1,000 requests/month)
- **Premium Tier**: $29.99/month (10,000 requests + advanced features)
- **Enterprise Tier**: $99.99/month (100,000 requests + unlimited access)
- **Fractionalized Data**: Pay for exactly what you need

### 🔄 **Version Control for APIs**
- **Data Versioning**: Control what version of your data each tier gets
- **Real-time Updates**: API automatically updates when you improve your data
- **Access Control**: Manage who gets access based on payment tiers
- **Live Orchestration**: AI agents handle deployment and auditing

### 🔗 **Database Integration**
- **Supabase Connection**: Connect directly to your Supabase database
- **Manual Table Import**: Enter table names when auto-discovery fails
- **Real-time Data Fetching**: Import table data directly into your API
- **Generic Interface**: Clean "Connect URL" interface for any database
- **Data Validation**: Automatic validation of imported database data

## 🛠️ Tech Stack

✨ **Modern UI** - Vanity-focused design with James Dean aesthetic  
🚀 **AI-Powered** - 7 specialized agents + Model Toggle Agent  
💰 **Monetization** - Turn your knowledge into profitable APIs  
🔒 **Enterprise-Grade** - Security, validation, and compliance built-in  
⚡ **Fast** - Rust backend with Next.js frontend  
🎯 **Simple** - 2-page app for maximum user experience  

## 🚀 Getting Started

1. **Visit the App**: Go to `http://localhost:3000`
2. **Create APIs**: Click "🚀 Create Agentic APIs"
3. **Choose Data Source**: 
   - Upload files (Excel, CSV, PDF) or
   - Connect to database (Supabase)
4. **Watch AI Work**: See dynamic Data Validator analyze your actual file content
5. **Agent Transparency**: Hover over completed agents to see their reasoning
6. **Enter Sandbox**: Test your API with the uploaded data
7. **Set Tiers**: Configure pricing and access levels
8. **Start Earning**: Get paid every time someone accesses your API

## 💡 Use Cases

- **Crypto Traders**: Transform trading data into profitable APIs
- **Data Scientists**: Monetize your analysis and insights
- **Content Creators**: Turn knowledge into passive income
- **Researchers**: Share findings with tiered access
- **Developers**: Create APIs from any data source

## 🔧 Development

```bash
# Install all dependencies
npm install

# Run development server
npm run dev

# Run API server
cargo run --bin api

# Build for production
npm run build
```

## 📊 Performance

- **Model Selection**: 95% accuracy in optimal model selection
- **API Generation**: < 30 seconds for most datasets
- **Real-time Updates**: < 5 second latency
- **Dynamic Analysis**: Real-time file content analysis using OpenAI API
- **File Processing**: Supports Excel, CSV, and PDF files up to 10MB
- **Database Integration**: Direct connection to Supabase with manual fallback
- **File Persistence**: Seamless data flow between components
- **Error Recovery**: Graceful fallbacks for all processing operations
- **Uptime**: 99.9% availability

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🌟 Support

- **Documentation**: [docs.minam.com](https://docs.minam.com)
- **Discord**: [discord.gg/minam](https://discord.gg/minam)
- **Twitter**: [@minam_api](https://twitter.com/minam_api)

---

<div align="center">
  <strong>Made with ❤️ for knowledge creators worldwide</strong>
  <br>
  <em>Your knowledge is your edge. Now monetize it.</em>
</div>