# 🎧 ASMR Bible Reading

**Experience the Bible through relaxing ASMR narration**

A modern web application that combines the power of God's Word with the therapeutic benefits of ASMR (Autonomous Sensory Meridian Response) to create a unique Bible study experience.

## ✨ Features

- **📖 Complete Bible Coverage**: Access to all 66 books of the Bible
- **🎙️ Multiple Voice Options**: Choose from various ASMR narrators
- **🧘‍♀️ Relaxation Focus**: Designed for meditation and spiritual wellness
- **📱 Responsive Design**: Works perfectly on all devices
- **🔍 Search & Filter**: Easy navigation through Bible books
- **📧 Email Subscription**: Stay updated with new content
- **💬 Interactive Features**: Notes, comments, and progress tracking

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ikramkumdin/asmrts-bible-reading.git
   cd asmrts-bible-reading
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
asmrts-bible/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Home page
│   │   ├── bible/             # Bible study pages
│   │   │   ├── page.tsx       # Bible books listing
│   │   │   └── [book]/        # Individual book pages
│   │   ├── voices/            # ASMR voices selection
│   │   └── about/             # About page
│   ├── components/            # Reusable components
│   │   ├── Header.tsx         # Navigation header
│   │   ├── Footer.tsx         # Site footer
│   │   ├── BibleBookCard.tsx  # Bible book display
│   │   ├── SubscriptionBanner.tsx # Email signup banner
│   │   └── EmailSignup.tsx    # Email subscription form
│   └── globals.css            # Global styles
├── public/                    # Static assets
├── package.json               # Dependencies
└── README.md                  # This file
```

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **UI Components**: Custom components with Tailwind
- **State Management**: React hooks (useState, useEffect)
- **Routing**: Next.js built-in routing

## 📱 Pages & Features

### 🏠 Home Page
- Hero section with mission statement
- Bible books grid (Genesis, Mark, Luke, John)
- Subscription banner
- Email signup form

### 📚 Bible Books
- Complete listing of all Bible books
- Search and filter functionality
- Progress tracking for each book
- Click to navigate to individual book study

### 🎙️ ASMR Voices
- Voice selection (Luna, River, Aria, Heartsease)
- Voice specialties and ratings
- Sample audio previews
- Voice selection guide

### 📖 Individual Book Study
- Chapter-by-chapter navigation
- Audio player with controls
- Progress tracking
- Note-taking functionality
- Comments and community features

### ℹ️ About Page
- Mission statement
- Feature highlights
- Team information
- Call-to-action

## 🎯 Key Components

### BibleBookCard
Displays individual Bible books with:
- Book title and description
- Progress indicators
- Status (completed, in-progress, free)
- Toggle switches for selection
- Action buttons

### Header
- Responsive navigation
- Logo and branding
- Mobile menu
- Subscribe CTA button

### Footer
- Site links and information
- Social media links
- Legal pages
- Newsletter signup

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Environment Variables
Create a `.env.local` file for any environment-specific configurations.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Christian Community**: For inspiration and spiritual guidance
- **ASMR Community**: For audio relaxation techniques
- **Next.js Team**: For the amazing framework
- **Tailwind CSS**: For beautiful, responsive design

## 📞 Contact

- **Project**: [ASMR Bible Reading](https://github.com/ikramkumdin/asmrts-bible-reading)
- **Issues**: [GitHub Issues](https://github.com/ikramkumdin/asmrts-bible-reading/issues)

## 🎉 Mission

Our mission is to make Bible study accessible, enjoyable, and beneficial for your overall well-being. We believe that when you're relaxed and focused, you can better absorb and reflect on God's Word.

---

**Made with ❤️ for the Christian community**
