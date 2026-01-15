# Product Specification

## Overview

A single-page public portfolio website for a software engineer, featuring smooth parallax scrolling, modern aesthetics, and a secure admin dashboard for content management.

---

## Public Portfolio

### Page Structure

Single-page application with vertically stacked sections and smooth scroll navigation. Each section occupies at least the viewport height with parallax background effects creating depth and visual interest.

### Sections

#### 1. Home (Hero)
- Full-viewport hero with name, title, and tagline
- Animated text or subtle motion effects
- Call-to-action button scrolling to Contact
- Social links (GitHub, LinkedIn, Email)

**Microcopy examples:**
- Tagline: "I turn coffee into code and bugs into features."
- CTA: "Let's build something"

#### 2. About
- Professional headshot/avatar
- Brief bio (2-3 paragraphs)
- Personal touch: interests, what drives you
- Download resume button

**Microcopy examples:**
- Section intro: "The person behind the commits"
- Resume button: "Get the PDF version"

#### 3. Experience
- Timeline or card-based layout
- Each entry: Company, Role, Duration, Description, Technologies
- Reverse chronological order (most recent first)
- Visual indicators for employment type (full-time, contract, etc.)

**Microcopy examples:**
- Section intro: "Where I've shipped code"
- Empty state: "Plot twist: I've actually worked places"

#### 4. Projects
- Grid or masonry layout with project cards
- Each card: Title, Description, Tech Stack, Links (Live, GitHub)
- Featured/pinned projects appear first
- Hover effects revealing additional details
- Filter by technology (optional enhancement)

**Microcopy examples:**
- Section intro: "Things I've built (that didn't break... much)"
- GitHub link: "View the spaghetti"
- Live link: "See it in action"

#### 5. Skills
- Categorized skill display (Languages, Frameworks, Tools, etc.)
- Visual representation (icons, progress bars, or tags)
- No arbitrary percentage ratings—just honest groupings

**Microcopy examples:**
- Section intro: "My toolkit"
- Categories: "Languages I speak (to machines)"

#### 6. Education
- Degree, Institution, Graduation Year
- Relevant coursework or achievements (optional)
- Clean, minimal presentation

**Microcopy examples:**
- Section intro: "The formal training"

#### 7. Certifications
- Certification name, Issuing organization, Date
- Verification links where available
- Badge/logo display

**Microcopy examples:**
- Section intro: "Proof I can pass tests"

#### 8. Contact
- Contact form (Name, Email, Message)
- Direct email link as fallback
- Social links repeated for convenience
- Brief encouragement to reach out

**Microcopy examples:**
- Section intro: "Say hello"
- Form CTA: "Send it"
- Placeholder text: "What's on your mind?"
- Success message: "Message received! I'll get back to you faster than a CI pipeline."
- Error message: "Something went wrong. Try the old-fashioned way: email."

---

## Navigation

### Fixed Top Navigation
- Sticky header that remains visible on scroll
- Logo/name on left, section links on right
- **Active section highlighting**: Current section link is visually distinct
- Smooth scroll to section on click
- Mobile: Hamburger menu with slide-out drawer
- Subtle background blur/opacity change on scroll

### Scroll Behavior
- Native smooth scrolling (`scroll-behavior: smooth`)
- Intersection Observer API for active section detection
- URL hash updates as user scrolls (optional)
- Scroll progress indicator (optional enhancement)

---

## Admin System

### Authentication
- Dedicated `/admin/login` route
- Email/password authentication
- JWT token stored in memory (not localStorage for security)
- Auto-logout on token expiration
- "Remember me" option for extended session

### Admin Dashboard (`/admin`)

#### Layout
- Sidebar navigation with section links
- Main content area with forms
- Header with logout and preview link

#### Content Management

Each section has a dedicated management view:

| Section | Editable Fields | Special Features |
|---------|-----------------|------------------|
| Home | Name, Title, Tagline, CTA Text, Social Links | Live preview |
| About | Bio, Avatar URL, Resume URL | Markdown support |
| Experience | Company, Role, Duration, Description, Tech | Drag-and-drop reorder, Publish toggle |
| Projects | Title, Description, Tech, Links, Image | Drag-and-drop reorder, Publish toggle, Featured flag |
| Skills | Category, Skill names | Add/remove categories |
| Education | Degree, Institution, Year, Details | Add/remove entries |
| Certifications | Name, Issuer, Date, Link, Badge URL | Add/remove entries |
| Contact | Email, Social Links, Form recipient | Toggle form on/off |

#### Drag-and-Drop Reordering
- Available for Experience and Projects sections
- Visual drag handles on each item
- Drop zone highlighting during drag
- Immediate persistence on drop
- Undo capability (optional)

#### Publish Visibility Toggle
- Each Experience and Project entry has a publish/unpublish toggle
- Unpublished items visible in admin with "Draft" indicator
- Unpublished items hidden from public portfolio
- Bulk publish/unpublish actions (optional)

#### Form Behavior
- Auto-save drafts (optional)
- Validation with inline error messages
- Success/error toast notifications
- Confirmation dialogs for destructive actions

---

## Microcopy Guidelines

### Tone
- **Witty but professional**: Clever wordplay, not memes
- **Self-aware**: Acknowledge the absurdity of tech without being cynical
- **Warm**: Approachable, not arrogant
- **Concise**: One-liners, not paragraphs

### Do's
- Subtle developer humor (commits, bugs, deploys)
- Self-deprecating where appropriate
- Clever CTAs that still communicate action
- Easter eggs for those who look closely

### Don'ts
- Overused phrases ("passionate", "ninja", "rockstar")
- Cringe internet humor or outdated memes
- Anything that requires explanation
- Humor that undermines credibility

### Examples Bank
- Loading state: "Fetching awesomeness..."
- 404: "This page took a sick day."
- Empty projects: "Nothing here yet. The commits are coming."
- Footer: "Handcrafted with ☕ and mass amounts of Googling"

---

## Performance Requirements

### Metrics Targets
| Metric | Target |
|--------|--------|
| Largest Contentful Paint (LCP) | < 2.5s |
| First Input Delay (FID) | < 100ms |
| Cumulative Layout Shift (CLS) | < 0.1 |
| Time to Interactive (TTI) | < 3.5s |
| Total Bundle Size (gzipped) | < 200KB |

### Implementation
- Lazy load images and off-screen content
- Optimize and compress all images (WebP with fallbacks)
- Code splitting for admin routes
- Preload critical fonts
- Minimize third-party scripts
- HTTP/2 or HTTP/3 where available
- CDN for static assets

---

## Accessibility Requirements

### WCAG 2.1 AA Compliance
- **Keyboard Navigation**: All interactive elements focusable and operable
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Focus Indicators**: Visible focus states on all interactive elements
- **Skip Links**: "Skip to content" link for keyboard users
- **Alt Text**: Descriptive alt text for all meaningful images
- **Form Labels**: All form inputs have associated labels
- **Error Identification**: Form errors clearly identified and described

### Testing
- Automated testing with axe-core
- Manual testing with screen readers (NVDA, VoiceOver)
- Keyboard-only navigation testing

---

## Responsiveness Requirements

### Breakpoints
| Name | Width | Target Devices |
|------|-------|----------------|
| Mobile | < 640px | Phones |
| Tablet | 640px - 1024px | Tablets, small laptops |
| Desktop | 1024px - 1440px | Laptops, monitors |
| Large | > 1440px | Large monitors |

### Mobile-First Approach
- Design for mobile, enhance for larger screens
- Touch-friendly tap targets (min 44x44px)
- No horizontal scrolling
- Readable text without zooming (min 16px base)
- Optimized images per breakpoint

### Component Behavior
| Component | Mobile | Desktop |
|-----------|--------|---------|
| Navigation | Hamburger menu | Horizontal links |
| Project Grid | Single column | 2-3 columns |
| Experience | Stacked cards | Timeline layout |
| Skills | Compact tags | Expanded categories |

---

## SEO Requirements

### Technical SEO
- Semantic HTML5 structure (`<header>`, `<main>`, `<section>`, `<footer>`)
- Single `<h1>` tag (name in hero)
- Logical heading hierarchy (h1 → h2 → h3)
- Meta tags: title, description, viewport
- Open Graph tags for social sharing
- Twitter Card meta tags
- Canonical URL
- Robots.txt allowing public pages
- XML sitemap (optional for single page)

### Content SEO
- Descriptive page title: "FirstName LastName | Software Engineer"
- Meta description: Compelling 150-160 character summary
- Alt text on all images
- Internal anchor links for sections
- Fast load times (ranking factor)

### Structured Data
- Person schema for portfolio owner
- Organization schema for work experience (optional)
- BreadcrumbList for navigation (optional)

### Social Preview
```html
<meta property="og:title" content="FirstName LastName | Software Engineer">
<meta property="og:description" content="Portfolio description...">
<meta property="og:image" content="https://example.com/og-image.jpg">
<meta property="og:url" content="https://example.com">
<meta name="twitter:card" content="summary_large_image">
```

---

## Future Enhancements (Out of Scope)

- Blog/articles section
- Dark/light theme toggle
- Multi-language support
- Analytics dashboard in admin
- Contact form submissions list in admin
- Project case study pages
- Testimonials section
