import {
  Code2, Network, GraduationCap, ArrowRight, Star, Quote, Flame, Sparkles,
  Zap, ShieldCheck, Rocket, Target, Menu, X, Mail, Phone, MapPin,
  Globe, Github, Linkedin, Twitter, MessageCircle, Clock, BarChart3,
  Check, ExternalLink, Server, Layers, Database, Terminal, Cpu, Wifi,
  Cable, Cloud, GitBranch, Radio, Sun, Moon, Calendar, User, Tag,
  ChevronDown, Search, ArrowUpRight, BookOpen, Monitor, Smartphone,
  Palette, ShoppingCart, TrendingUp, Users, Award, Briefcase, Mailbox,
} from 'lucide-react';

export const icons = {
  Code2, Network, GraduationCap, ArrowRight, Star, Quote, Flame, Sparkles,
  Zap, ShieldCheck, Rocket, Target, Menu, X, Mail, Phone, MapPin,
  Globe, Github, Linkedin, Twitter, MessageCircle, Clock, BarChart3,
  Check, ExternalLink, Server, Layers, Database, Terminal, Cpu, Wifi,
  Cable, Cloud, GitBranch, Radio, Sun, Moon, Calendar, User, Tag,
  ChevronDown, Search, ArrowUpRight, BookOpen, Monitor, Smartphone,
  Palette, ShoppingCart, TrendingUp, Users, Award, Briefcase, Mailbox,
};

export const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Blog', to: '/blog' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' },
];

export const stats = [
  { value: '50+', label: 'Projects Shipped' },
  { value: '30+', label: 'Happy Clients' },
  { value: '200+', label: 'Students Trained' },
  { value: '5+', label: 'Years Experience' },
];

export const services = [
  {
    icon: 'Code2',
    title: 'Software Development',
    description: 'Full-stack web and mobile applications built with the MERN stack — fast, scalable, and maintainable.',
    points: ['Custom web apps', 'Mobile-first design', 'API development', 'Cloud deployment'],
    href: '/services',
  },
  {
    icon: 'Network',
    title: 'IT & Networking Solutions',
    description: 'Network design, infrastructure setup, and IT support to keep your business connected and secure.',
    points: ['Network architecture', 'Infrastructure setup', 'Security audits', '24/7 monitoring'],
    href: '/services',
  },
  {
    icon: 'GraduationCap',
    title: 'Tech Courses & Training',
    description: 'Hands-on, project-based courses in MERN, networking, and more — taught by engineers who ship.',
    points: ['MERN Bootcamp', 'Networking fundamentals', 'Live projects', 'Career guidance'],
    href: '/services',
  },
  {
    icon: 'Monitor',
    title: 'UI/UX Design',
    description: 'Beautiful, intuitive interfaces designed to convert visitors into customers and keep users engaged.',
    points: ['Wireframing & prototyping', 'Design systems', 'User research', 'Responsive design'],
    href: '/services',
  },
  {
    icon: 'Smartphone',
    title: 'Mobile App Development',
    description: 'Cross-platform mobile apps with React Native — one codebase, iOS and Android, native performance.',
    points: ['React Native apps', 'Push notifications', 'Offline support', 'App store deployment'],
    href: '/services',
  },
  {
    icon: 'Server',
    title: 'DevOps & Cloud',
    description: 'CI/CD pipelines, containerization, and cloud infrastructure to deploy and scale with confidence.',
    points: ['Docker & Kubernetes', 'AWS / Vercel', 'CI/CD pipelines', 'Performance tuning'],
    href: '/services',
  },
];

export const portfolio = [
  {
    name: 'ShopFlow E-Commerce',
    category: 'Web App',
    image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'A full-featured e-commerce platform with cart, payments, and admin dashboard.',
    tags: ['React', 'Node.js', 'Stripe', 'MongoDB'],
    link: '#',
  },
  {
    name: 'MediTrack Health',
    category: 'Mobile App',
    image: 'https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Patient management app with appointment scheduling and prescription tracking.',
    tags: ['React Native', 'Express', 'PostgreSQL'],
    link: '#',
  },
  {
    name: 'EduConnect LMS',
    category: 'Platform',
    image: 'https://images.pexels.com/photos/5212343/pexels-photo-5212343.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Learning management system with live classes, quizzes, and progress tracking.',
    tags: ['Next.js', 'Socket.io', 'MongoDB'],
    link: '#',
  },
  {
    name: 'NetConfig Pro',
    category: 'Networking',
    image: 'https://images.pexels.com/photos/4219540/pexels-photo-4219540.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Network configuration tool for enterprise switches and routers with monitoring.',
    tags: ['Python', 'React', 'SNMP'],
    link: '#',
  },
  {
    name: 'FinSight Dashboard',
    category: 'Web App',
    image: 'https://images.pexels.com/photos/186461/pexels-photo-186461.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Financial analytics dashboard with real-time charts and reporting.',
    tags: ['React', 'D3.js', 'Node.js'],
    link: '#',
  },
  {
    name: 'TaskPilot CRM',
    category: 'SaaS',
    image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Team productivity CRM with task management, automation, and integrations.',
    tags: ['MERN', 'Redis', 'BullMQ'],
    link: '#',
  },
];

export const courses = [
  {
    icon: 'Code2',
    title: 'MERN Stack Bootcamp',
    description: 'Master MongoDB, Express, React, and Node.js by building real projects.',
    level: 'Beginner to Advanced',
    levelKey: 'beginner',
    duration: '12 weeks',
    topics: ['React', 'Node.js', 'MongoDB', 'REST APIs', 'Auth', 'Deployment'],
  },
  {
    icon: 'Network',
    title: 'Networking Fundamentals',
    description: 'Learn computer networking, routing, switching, and network security.',
    level: 'Beginner',
    levelKey: 'beginner',
    duration: '8 weeks',
    topics: ['TCP/IP', 'Routing', 'Switching', 'Firewalls', 'VPN', 'Security'],
  },
  {
    icon: 'Smartphone',
    title: 'React Native Mobile Dev',
    description: 'Build cross-platform mobile apps with React Native and Expo.',
    level: 'Intermediate',
    levelKey: 'intermediate',
    duration: '10 weeks',
    topics: ['React Native', 'Expo', 'Navigation', 'APIs', 'Push', 'Deploy'],
  },
  {
    icon: 'Server',
    title: 'DevOps & Cloud',
    description: 'Master Docker, Kubernetes, CI/CD, and cloud deployment.',
    level: 'Advanced',
    levelKey: 'advanced',
    duration: '6 weeks',
    topics: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Monitoring', 'Terraform'],
  },
  {
    icon: 'Palette',
    title: 'UI/UX Design',
    description: 'Design beautiful, user-friendly interfaces with Figma and design systems.',
    level: 'Beginner',
    levelKey: 'beginner',
    duration: '6 weeks',
    topics: ['Figma', 'Wireframing', 'Prototyping', 'Design Systems', 'User Research'],
  },
  {
    icon: 'ShieldCheck',
    title: 'Cybersecurity Essentials',
    description: 'Learn ethical hacking, penetration testing, and security best practices.',
    level: 'Intermediate',
    levelKey: 'intermediate',
    duration: '8 weeks',
    topics: ['Ethical Hacking', 'Pen Testing', 'OWASP', 'Network Security', 'Tools'],
  },
];

export const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'CEO, TechStart Inc.',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
    quote: 'Codraze delivered our platform in half the time we expected. The code quality is outstanding and their team is incredibly responsive.',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'CTO, FinSight',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200',
    quote: 'The dashboard Codraze built transformed how we do analytics. Fast, reliable, and beautiful. Highly recommend.',
    rating: 5,
  },
  {
    name: 'Aisha Patel',
    role: 'Founder, EduConnect',
    image: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=200',
    quote: 'Our LMS was built from scratch in 3 months. The attention to detail and user experience is simply world-class.',
    rating: 5,
  },
  {
    name: 'David Kim',
    role: 'Student, MERN Bootcamp',
    image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200',
    quote: 'I went from zero coding experience to landing a full-stack developer job. The hands-on projects made all the difference.',
    rating: 5,
  },
];

export const pricing = [
  {
    name: 'Starter',
    description: 'Perfect for small businesses and first projects.',
    price: '$1,499',
    period: 'project',
    features: [
      'Landing page or simple app',
      'Up to 5 pages/screens',
      'Responsive design',
      'Basic SEO setup',
      '2 weeks delivery',
      '30 days support',
    ],
    cta: 'Get Started',
    featured: false,
  },
  {
    name: 'Growth',
    description: 'For growing businesses that need more power.',
    price: '$4,999',
    period: 'project',
    features: [
      'Full-stack web or mobile app',
      'Up to 20 pages/screens',
      'API development',
      'Database design',
      'Authentication system',
      'Cloud deployment',
      '60 days support',
    ],
    cta: 'Get Started',
    featured: true,
  },
  {
    name: 'Enterprise',
    description: 'Custom solutions for complex requirements.',
    price: 'Custom',
    period: 'quote',
    features: [
      'Custom software platform',
      'Unlimited pages/screens',
      'Microservices architecture',
      'DevOps & CI/CD setup',
      'Dedicated team',
      'Priority support',
      '90 days support',
    ],
    cta: 'Contact Sales',
    featured: false,
  },
];

export const blogPosts = [
  {
    title: 'Why MERN Stack is Perfect for Startups in 2025',
    excerpt: 'Explore why the MERN stack continues to dominate startup development with its flexibility, speed, and ecosystem.',
    image: 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: 'Codraze Team',
    date: 'Jan 15, 2025',
    category: 'Development',
    readTime: '5 min read',
  },
  {
    title: 'A Beginner\'s Guide to Network Security',
    excerpt: 'Learn the fundamentals of network security, from firewalls to encryption, and how to protect your business.',
    image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: 'Codraze Team',
    date: 'Jan 10, 2025',
    category: 'Networking',
    readTime: '7 min read',
  },
  {
    title: '5 UI/UX Trends That Will Define 2025',
    excerpt: 'From glassmorphism to micro-interactions, here are the design trends every developer should know this year.',
    image: 'https://images.pexels.com/photos/196645/pexels-photo-196645.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: 'Codraze Team',
    date: 'Jan 5, 2025',
    category: 'Design',
    readTime: '4 min read',
  },
  {
    title: 'How We Built a Real-Time LMS with Socket.io',
    excerpt: 'A deep dive into the architecture and tech choices behind EduConnect\'s live classroom feature.',
    image: 'https://images.pexels.com/photos/414837/pexels-photo-414837.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: 'Codraze Team',
    date: 'Dec 28, 2024',
    category: 'Engineering',
    readTime: '8 min read',
  },
  {
    title: 'Docker for Developers: A Practical Guide',
    excerpt: 'Stop struggling with "it works on my machine." Learn Docker from a developer\'s perspective with real examples.',
    image: 'https://images.pexels.com/photos/911754/pexels-photo-911754.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: 'Codraze Team',
    date: 'Dec 20, 2024',
    category: 'DevOps',
    readTime: '6 min read',
  },
  {
    title: 'From Student to Developer: A Success Story',
    excerpt: 'How one of our bootcamp graduates landed a full-stack role at a top company within 3 months of finishing.',
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: 'Codraze Team',
    date: 'Dec 15, 2024',
    category: 'Career',
    readTime: '5 min read',
  },
];

export const faqs = [
  {
    question: 'What services does Codraze offer?',
    answer: 'We offer three core services: software development (web and mobile apps with the MERN stack), IT and networking solutions (infrastructure, security, monitoring), and tech courses (hands-on, project-based training in development, networking, design, and DevOps).',
  },
  {
    question: 'How long does a typical project take?',
    answer: 'Project timelines vary based on complexity. A landing page takes 1-2 weeks, a full-stack web app takes 4-8 weeks, and enterprise platforms can take 3+ months. We provide a detailed timeline during our initial consultation.',
  },
  {
    question: 'Do you provide ongoing maintenance and support?',
    answer: 'Yes. Every project includes a support period (30-90 days depending on the package). After that, we offer flexible maintenance plans including bug fixes, updates, feature additions, and performance monitoring.',
  },
  {
    question: 'What is your tech stack?',
    answer: 'Our primary stack is MERN (MongoDB, Express.js, React, Node.js). We also work with React Native for mobile, PostgreSQL, Redis, Docker, Kubernetes, and AWS. We choose the best tool for each project\'s needs.',
  },
  {
    question: 'How do the courses work?',
    answer: 'Our courses are project-based and taught by working engineers. You\'ll build real applications, not just watch videos. Courses include live sessions, hands-on projects, code reviews, and career guidance. Most run 6-12 weeks.',
  },
  {
    question: 'Do you offer custom pricing?',
    answer: 'Absolutely. While we have standard packages, most of our projects are custom-quoted based on specific requirements. Contact us with your project details and we\'ll provide a tailored proposal within 24 hours.',
  },
  {
    question: 'Can you work with our existing codebase?',
    answer: 'Yes. We frequently join existing projects to add features, fix bugs, refactor code, or improve performance. We\'ll audit your codebase and provide a clear plan before starting any work.',
  },
  {
    question: 'What happens after we launch?',
    answer: 'We don\'t just build and disappear. After launch, we provide a support period, help with monitoring and analytics, and can continue with a maintenance retainer. We\'re invested in your long-term success.',
  },
];

export const contactInfo = [
  { icon: 'Mail', label: 'Email', value: 'hello@codraze.com', href: 'mailto:hello@codraze.com' },
  { icon: 'Phone', label: 'Phone', value: '+1 (555) 012-3456', href: 'tel:+15550123456' },
  { icon: 'MapPin', label: 'Location', value: 'Remote · Worldwide', href: '#' },
];

export const socials = [
  { icon: 'Github', label: 'GitHub', href: '#' },
  { icon: 'Linkedin', label: 'LinkedIn', href: '#' },
  { icon: 'Twitter', label: 'Twitter', href: '#' },
  { icon: 'Globe', label: 'Website', href: '#' },
];

export const footerLinks = [
  {
    title: 'Company',
    links: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Software Development', href: '/services' },
      { label: 'Networking Solutions', href: '/services' },
      { label: 'Tech Courses', href: '/services' },
      { label: 'UI/UX Design', href: '/services' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Portfolio', href: '/portfolio' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Blog', href: '/blog' },
    ],
  },
];
