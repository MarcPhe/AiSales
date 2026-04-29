/**
 * Mockup Responses Generator
 * Provides realistic fallback responses when OpenAI API fails
 */

// Mockup response templates based on keywords
const responseTemplates = {
  pricing: [
    "Great question! Our pricing depends on your specific needs. We offer flexible plans starting at $29/month for small businesses, with options to scale up. Would you like to hear about a custom quote?",
    "We have tiered pricing to fit any budget. Basic plans start at $29/month, and we can create a custom package for enterprise needs. What features are most important for your business?",
    "Our pricing is flexible and scalable. We typically charge between $29-299/month depending on usage and features. Let me know more about your requirements and I can give you an exact quote!"
  ],
  
  features: [
    "We provide AI-powered chat automation, lead capture, customer insights, and analytics. Our system integrates seamlessly with your website and works 24/7 to engage visitors. What specific features are you most interested in?",
    "Key features include: automated responses, lead qualification, conversation analytics, custom branding, and multi-channel support. Is there a particular feature you'd like to know more about?",
    "Our platform offers intelligent chatbot responses, automatic lead detection, detailed conversation analytics, and easy website integration. Which of these would benefit your business the most?"
  ],
  
  demo: [
    "I'd love to show you a demo! We typically schedule 15-20 minute demonstrations. What works best for you - would you prefer a demo this week or next?",
    "Absolutely! Our demo shows how the chatbot works on your website and how it captures leads. Are you available for a quick 20-minute session today or tomorrow?",
    "Great! I can arrange a personalized demo at your convenience. We can walk through setup, show live examples, and answer all your questions. When would you be available?"
  ],
  
  contact: [
    "You can reach our support team at support@company.com or call us at 1-800-COMPANY. We're available Monday-Friday, 9am-6pm EST. What's the best way to contact you?",
    "Feel free to reach out! Email support@company.com, call 1-800-COMPANY, or I can have our team contact you directly. What works best for you?",
    "Our support team is here to help! You can email support@company.com, call 1-800-COMPANY, or provide your contact info and we'll reach out to you."
  ],
  
  integration: [
    "We support WordPress, Shopify, WooCommerce, and custom websites. The integration is typically completed in under 2 hours. What platform does your website run on?",
    "Integration is simple! We support most platforms including WordPress, Shopify, and custom sites. Our support team can handle the setup for you. What platform are you using?",
    "We integrate with Shopify, WordPress, WooCommerce, and any custom website. The process is straightforward and usually takes less than 2 hours. What's your website platform?"
  ],
  
  implementation: [
    "Implementation typically takes 1-2 weeks from setup to full deployment. This includes configuration, training, and testing. We have a dedicated onboarding team to guide you through each step.",
    "Most clients are up and running within 1-2 weeks. Our team handles the technical setup while you focus on your business. Would you like to discuss a timeline?",
    "We can have you live in 1-2 weeks! The process includes site analysis, chatbot training, testing, and deployment. Our support team is with you every step of the way."
  ],
  
  testimonials: [
    "We're proud to serve 500+ businesses who see an average 40% increase in lead capture. Clients report saving 20+ hours per week on customer inquiries. Many say it's been a game-changer for their sales process!",
    "Our customers love the results! Average feedback includes '30% more leads in the first month' and 'saves us so much time on customer support.' Would you like to hear from one of our clients?",
    "We have great testimonials from happy clients across various industries. Many report increased conversions, faster response times, and better customer satisfaction. Would you like to connect with a reference?"
  ],
  
  timetovalue: [
    "Most of our clients see results within the first week - increased website engagement and lead capture. Full optimization typically happens within 30 days. Would you like specific metrics we track?",
    "You'll see your first leads within days of going live. Most clients report 20-40% improvement in conversion rates within 30 days. Ready to get started?",
    "We see immediate results - leads coming in from day one. Most clients see significant improvements in their sales pipeline within the first month. Want to get started?"
  ],
  
  default: [
    "Thanks for reaching out! That's a great question. Could you tell me a bit more about what you're looking for? Are you interested in our AI sales assistant or something specific like pricing or a demo?",
    "Thanks for the question! To better assist you, could you share what brought you here today? Are you interested in learning more about our platform or have a specific question in mind?",
    "I appreciate your interest! To point you in the right direction, what would be most helpful for you right now - learning about features, pricing, scheduling a demo, or something else?"
  ]
};

/**
 * Analyzes user message and generates appropriate mockup response
 * @param {string} userMessage - The user's message
 * @returns {string} - A contextual mockup response
 */
export function generateMockupResponse(userMessage) {
  const lowerMessage = userMessage.toLowerCase();
  
  // Check for keyword matches
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
    return getRandomResponse(responseTemplates.pricing);
  }
  
  if (lowerMessage.includes('feature') || lowerMessage.includes('what can') || lowerMessage.includes('capabilities')) {
    return getRandomResponse(responseTemplates.features);
  }
  
  if (lowerMessage.includes('demo') || lowerMessage.includes('see it in action') || lowerMessage.includes('show me')) {
    return getRandomResponse(responseTemplates.demo);
  }
  
  if (lowerMessage.includes('contact') || lowerMessage.includes('support') || lowerMessage.includes('reach you')) {
    return getRandomResponse(responseTemplates.contact);
  }
  
  if (lowerMessage.includes('integrate') || lowerMessage.includes('wordpress') || lowerMessage.includes('shopify') || lowerMessage.includes('website')) {
    return getRandomResponse(responseTemplates.integration);
  }
  
  if (lowerMessage.includes('implement') || lowerMessage.includes('setup') || lowerMessage.includes('how long') || lowerMessage.includes('timeline')) {
    return getRandomResponse(responseTemplates.implementation);
  }
  
  if (lowerMessage.includes('testimonial') || lowerMessage.includes('review') || lowerMessage.includes('success') || lowerMessage.includes('customer')) {
    return getRandomResponse(responseTemplates.testimonials);
  }
  
  if (lowerMessage.includes('value') || lowerMessage.includes('results') || lowerMessage.includes('benefit') || lowerMessage.includes('roi')) {
    return getRandomResponse(responseTemplates.timetovalue);
  }
  
  // Default response for unmatched queries
  return getRandomResponse(responseTemplates.default);
}

/**
 * Returns a random response from an array
 * @param {string[]} responses - Array of response options
 * @returns {string} - A randomly selected response
 */
function getRandomResponse(responses) {
  return responses[Math.floor(Math.random() * responses.length)];
}

/**
 * Generates a response and includes metadata
 * @param {string} userMessage - The user's message
 * @returns {object} - Object with response and metadata
 */
export function generateMockupResponseWithMetadata(userMessage) {
  const response = generateMockupResponse(userMessage);
  
  return {
    content: response,
    isFallback: true,
    source: 'mockup',
    timestamp: new Date().toISOString()
  };
}
