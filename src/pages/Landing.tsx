import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Bell,
  Shield,
  Zap,
  ArrowRight,
  Check,
  LineChart,
  Target,
  DollarSign,
  Newspaper,
  Search,
  Sparkles,
  Activity,
  Wallet,
  ChevronRight,
  Star,
  Users,
  Globe,
  Lock,
  Smartphone,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
    
  const features = [
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description:
        'Track your portfolio performance with comprehensive real-time market data and insights.',
      color: 'from-blue-500 to-cyan-600',
    },
    {
      icon: PieChart,
      title: 'Portfolio Diversification',
      description:
        'Visualize asset allocation across sectors and industries with interactive charts.',
      color: 'from-purple-500 to-pink-600',
    },
    {
      icon: Bell,
      title: 'Smart Alerts',
      description: 'Get notified about important market movements and portfolio changes instantly.',
      color: 'from-orange-500 to-red-600',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your financial data is encrypted and stored securely with bank-level security.',
      color: 'from-green-500 to-emerald-600',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Built for speed with modern technology for seamless portfolio management.',
      color: 'from-yellow-500 to-orange-600',
    },
    {
      icon: Target,
      title: 'Performance Tracking',
      description: 'Monitor gains, losses, and returns with detailed analytics and reports.',
      color: 'from-indigo-500 to-purple-600',
    },
    {
      icon: Newspaper,
      title: 'Market News',
      description:
        'Stay updated with latest market news, AI-powered summaries, and sentiment analysis.',
      color: 'from-teal-500 to-cyan-600',
    },
    {
      icon: Search,
      title: 'Stock Screener',
      description:
        'Filter and discover stocks based on financial metrics, ratios, and performance criteria.',
      color: 'from-rose-500 to-pink-600',
    },
    {
      icon: Sparkles,
      title: 'AI Insights',
      description:
        'Get intelligent recommendations and analysis powered by advanced AI algorithms.',
      color: 'from-violet-500 to-purple-600',
    },
  ];

  const advancedFeatures = [
    {
      icon: Activity,
      title: 'Financial Health Scoring',
      description:
        'Comprehensive health scores based on liquidity, solvency, profitability, and efficiency metrics.',
      details: [
        'Real-time financial health monitoring',
        'Industry-comparative analysis',
        'Risk assessment metrics',
      ],
    },
    {
      icon: TrendingUp,
      title: 'Technical Indicators',
      description:
        'Advanced technical analysis with 20+ indicators including RSI, MACD, Bollinger Bands, and more.',
      details: [
        'Customizable indicator parameters',
        'Multi-timeframe analysis',
        'Pattern recognition alerts',
      ],
    },
    {
      icon: DollarSign,
      title: 'DCF Valuation',
      description:
        'Discounted Cash Flow analysis with intrinsic value calculations and margin of safety.',
      details: [
        'Automated fair value estimation',
        'Growth rate modeling',
        'Undervalued stock identification',
      ],
    },
    {
      icon: Wallet,
      title: 'Dividend Tracking',
      description:
        'Complete dividend history, yield analysis, and payout ratio tracking for income investors.',
      details: [
        'Dividend calendar integration',
        'Yield-on-cost calculations',
        'Dividend growth tracking',
      ],
    },
  ];

  const stats = [
    { value: '10K+', label: 'Active Users', icon: Users },
    { value: '$2B+', label: 'Assets Tracked', icon: DollarSign },
    { value: '50K+', label: 'Portfolios', icon: PieChart },
    { value: '99.9%', label: 'Uptime', icon: Zap },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Individual Investor',
      avatar: 'SJ',
      content:
        'StockMate transformed how I manage my portfolio. The AI insights and real-time analytics are game-changers.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Day Trader',
      avatar: 'MC',
      content:
        'The technical indicators and fast performance make StockMate perfect for active trading. Highly recommended!',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'Long-term Investor',
      avatar: 'ER',
      content:
        'DCF valuation and dividend tracking features help me identify undervalued opportunities. Outstanding platform!',
      rating: 5,
    },
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        'Up to 3 portfolios',
        'Real-time price data',
        'Basic analytics',
        'Market news access',
        'Email support',
      ],
      cta: 'Start Free',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$12',
      period: 'per month',
      description: 'For serious investors',
      features: [
        'Unlimited portfolios',
        'Advanced analytics',
        'AI-powered insights',
        'Technical indicators',
        'DCF valuation tools',
        'Priority support',
        'Export & reporting',
      ],
      cta: 'Start Pro Trial',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      description: 'For institutions and teams',
      features: [
        'Everything in Pro',
        'Multi-user accounts',
        'API access',
        'Custom integrations',
        'Dedicated support',
        'SLA guarantee',
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                StockMate
              </span>
            </div>
            <Button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
            >
              Sign In
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full border border-indigo-200 dark:border-indigo-800">
              <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                Next-generation portfolio management
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
              Invest Smarter,
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Grow Faster
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Professional-grade portfolio tracking and analytics. Monitor your investments, analyze
              performance, and make data-driven decisions—all in one powerful platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                onClick={() => navigate('/login')}
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl text-lg px-8 py-6 h-auto"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-indigo-200 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-lg px-8 py-6 h-auto"
              >
                <LineChart className="w-5 h-5 mr-2" />
                View Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 max-w-4xl mx-auto">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="text-center p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform duration-300"
                  >
                    <Icon className="w-8 h-8 mx-auto mb-3 text-indigo-600 dark:text-indigo-400" />
                    <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white/50 dark:bg-gray-900/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {' '}
                succeed
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful features designed for both beginners and professional investors
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="group border-border/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden relative"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  ></div>
                  <CardContent className="p-6 space-y-4 relative">
                    <div
                      className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="pt-2 flex items-center text-indigo-600 dark:text-indigo-400 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Learn more
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Advanced Features Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Advanced Tools for
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {' '}
                Professional Investors
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Sophisticated analytics and insights that give you the edge in the market
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {advancedFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="border-border/50 hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                >
                  <CardContent className="p-8 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                          {feature.description}
                        </p>
                        <ul className="space-y-2">
                          {feature.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700 dark:text-gray-300">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                Why investors choose
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {' '}
                  StockMate
                </span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Join thousands of investors who trust StockMate to manage and grow their portfolios
                with confidence.
              </p>

              <div className="space-y-4 pt-4">
                {[
                  'Real-time market data and price updates',
                  'Comprehensive performance analytics',
                  'Multi-portfolio management',
                  'Sector and industry analysis',
                  'Transaction history tracking',
                  'Tax reporting and export features',
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl blur-3xl opacity-20"></div>
              <Card className="relative border-border/50 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Portfolio Performance
                    </span>
                    <span className="text-green-600 dark:text-green-400 text-sm font-bold">
                      +24.3%
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            Total Value
                          </div>
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            $142,850
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-600 dark:text-gray-400">Gain</div>
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">
                          +$28,350
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          Holdings
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">24</div>
                      </div>
                      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          Dividends
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          $2,420
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-white/50 dark:bg-gray-900/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {' '}
                thousands of investors
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              See what our users have to say about their experience with StockMate
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border-border/50 hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Simple, transparent
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {' '}
                pricing
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Choose the plan that fits your investment journey. Upgrade or downgrade anytime.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`border-2 transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm ${
                  plan.highlighted
                    ? 'border-indigo-500 shadow-2xl scale-105 relative'
                    : 'border-border/50 hover:shadow-xl hover:scale-102'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-full">
                    Most Popular
                  </div>
                )}
                <CardContent className="p-8 space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{plan.description}</p>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-gray-900 dark:text-white">
                        {plan.price}
                      </span>
                      {plan.period !== 'contact us' && (
                        <span className="text-gray-600 dark:text-gray-400">/{plan.period}</span>
                      )}
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => navigate('/login')}
                    className={`w-full ${
                      plan.highlighted
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg'
                        : 'bg-white dark:bg-gray-700 border-2 border-indigo-200 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Security Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Built with
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {' '}
                security in mind
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: Lock,
                title: 'Bank-level Security',
                description: '256-bit SSL encryption',
              },
              {
                icon: Shield,
                title: 'Data Privacy',
                description: 'GDPR & SOC 2 compliant',
              },
              {
                icon: Globe,
                title: 'Global Infrastructure',
                description: '99.9% uptime guarantee',
              },
              {
                icon: Smartphone,
                title: 'Multi-platform',
                description: 'Web, iOS & Android',
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="text-center p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <Icon className="w-10 h-10 mx-auto mb-3 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 overflow-hidden relative">
            <div className="absolute inset-0 bg-grid-white/10"></div>
            <CardContent className="relative p-12 text-center space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Ready to take control of your investments?
              </h2>
              <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
                Join StockMate today and start building your wealth with confidence. No credit card
                required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button
                  onClick={() => navigate('/login')}
                  size="lg"
                  className="bg-white text-indigo-600 hover:bg-gray-100 shadow-xl text-lg px-8 py-6 h-auto font-semibold"
                >
                  Start Free Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-white/50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                StockMate
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2025 StockMate. Track and analyze your investments with confidence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
