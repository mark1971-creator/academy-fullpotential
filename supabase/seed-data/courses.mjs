// Shared course definitions for seed_course_meta.mjs
//
// Each entry: { course, moduleTitles }
// - course: row for public.courses (snake_case keys)
// - moduleTitles: [sort_order, title][]
//
// Catalog order: HPCC → IDG → Wholeness → Employee Experience → Team Coach

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const HPCC_TESTIMONIALS = JSON.parse(
  readFileSync(join(__dirname, "hpcc-testimonials.json"), "utf8"),
);
const COURSE_INTRO_VIDEOS = JSON.parse(
  readFileSync(join(__dirname, "course-intro-videos.json"), "utf8"),
);

/** @typedef {{ name: string, role?: string, quote: string, rating?: number, initials?: string, date?: string }} Testimonial */

/** @type {Array<{ course: Record<string, unknown>, moduleTitles: Array<[number, string]> }>} */
export const SEED_COURSES = [
  {
    course: {
      slug: "human-potential-coach-certification",
      image_url: "/Images/courses/human-potential-coach-certification.webp",
      hero_video_url: COURSE_INTRO_VIDEOS["human-potential-coach-certification"] ?? null,
      title: "Certification - Human Potential Development Coach Training",
      tagline:
        "Equip yourself to unlock human potential in leaders, teams, and organizations.",
      description:
        "Welcome and thank you for enrolling for this certification training. If you work with leaders, teams & organizations you will probably agree that much of our Human Potential remains dormant or unexpressed in the work environment. This program equips you to debrief assessments, build business cases for human potential development, and guide transformational client work.",
      price: 995.0,
      is_published: true,
      duration_label: "24 hours",
      level: "Expert",
      rating: 5.0,
      rating_count: 10,
      enrolled_count: 86,
      what_you_will_learn: [
        "Debrief the Human Potential assessment with your clients",
        "Clearly demonstrate how a greater focus on HUMAN POTENTIAL REALIZATION drives key business metrics such as: employee engagement, trustworthiness & innovation",
        "Offer very concrete tools and methodologies that bring more objectivity to the subjective nature of human beings",
        "Make a robust business case for HUMAN POTENTIAL DEVELOPMENT and expand your effectiveness in OD work",
        "Inspire your clients to bring more focus and attention on the HUMAN DIMENSION in their organizations",
        "Gain insights that will allow you to access even more of your human potential and grow into your next stage of personal development in life",
      ],
      who_this_is_for: [
        "Coaches and consultants working with leaders, teams, and organizations",
        "HR and organizational development professionals seeking human-centric interventions",
        "Leaders committed to bringing the human dimension into their work",
        "Practitioners ready to debrief Human Potential assessments with clients",
      ],
      testimonials: HPCC_TESTIMONIALS,
      tags: [
        "Coaching",
        "Conscious Culture",
        "Human Potential",
        "Leadership development",
        "Organizational development",
        "Personal development",
      ],
    },
    moduleTitles: [
      [1, "Module 1: Authentic introductions"],
      [2, "Module 2: Context for Human Potential interventions"],
      [3, "Module 3: The Human Potential Iceberg"],
      [4, "Module 4: Using the 6 OPM's to build bridges into the client's reality"],
      [5, "Module 5: Understanding the Human Potential House"],
      [6, "Module 6: Using the 4 States and 23 Dimensions to uncover deeper insight into the client's reality"],
      [7, "Module 7: The 8 Being Attitudes"],
      [8, "Module 8: Consciousness Maturity Index"],
      [9, "Module 9: Additional findings"],
      [10, "Module 10: Debriefing clients on their full report"],
      [11, "Module 11: Closing, next steps & certification"],
    ],
  },

  {
    course: {
      slug: "idg-coach-certification",
      image_url: "/Images/courses/idg-coach-certification.webp",
      hero_video_url: COURSE_INTRO_VIDEOS["idg-coach-certification"] ?? null,
      title: "6-Week IDG Coach Certification Training",
      tagline: "If you can measure it, you can manage it.",
      description:
        "This certification training equips you with a powerful IDG Measurement Tool and associated coaching modalities to bring objectivity and action-ability to Inner Development work — especially in organizational contexts. Support leaders on their inner journey and quantify impact toward the 17 SDGs.",
      price: 995.0,
      is_published: true,
      duration_label: "6 weeks",
      level: "Certification",
      rating: 5.0,
      rating_count: 9,
      enrolled_count: 36,
      what_you_will_learn: [
        "Administer the IDG Measurement Tool and help clients interpret results",
        "Create highly customized development plans based on assessment data",
        "Demonstrate how Inner Development drives business metrics and SDGs",
        "Add powerful techniques for creating psychologically safe environments",
        "Join a global community of IDG coaches for ongoing growth",
      ],
      who_this_is_for: [
        "Change agents and sustainability champions in organizations",
        "Coaches and consultants seeking measurable inner development methods",
        "Leaders who want to bring rigor to inner development work",
        "Anyone wanting to demonstrate the business and SDG impact of inner development",
      ],
      testimonials: [],
      tags: [
        "IDG",
        "Inner Development",
        "SDGs",
        "Coaching",
        "Certification",
      ],
    },
    moduleTitles: [
      [1, "Week 1: Foundations of Inner Development Goals"],
      [2, "Week 2: Mastering the IDG Measurement Tool – Administration"],
      [3, "Week 3: Interpreting Results and Creating Development Plans"],
      [4, "Week 4: Coaching Techniques and Psychologically Safe Environments"],
      [5, "Week 5: Organizational Application and SDG Impact Measurement"],
      [6, "Week 6: Integration, Certification and Community Practice"],
    ],
  },

  {
    course: {
      slug: "from-fragmentation-to-wholeness",
      image_url: "/Images/courses/from-fragmentation-to-wholeness.webp",
      hero_video_url: null,
      title: "From Fragmentation to Wholeness – Consciousness Development Masterclass",
      tagline: "The edge isn't more tools or skills. It's more you!",
      description:
        "Grow your consciousness into a mature identity — from overload and fragmentation to coherent, whole-self coaching and leadership.",
      price: 0,
      is_published: true,
      duration_label: "6 weeks",
      level: "Masterclass",
      rating: 5.0,
      rating_count: 6,
      enrolled_count: 24,
      what_you_will_learn: [
        "Understand developmental stages and states of consciousness",
        "Build a sharper developmental diagnostic",
        "Embody mature identity that holds paradox and complexity",
        "Cross-map Kegan, Cook-Greuter, Torbert and Pancha Kosha models",
        "Work from deeper being for clearer knowing and acting",
      ],
      who_this_is_for: [
        "Experienced transformational coaches",
        "Leadership development professionals",
        "Facilitators of complexity and systems change",
        "Practitioners with meditation or contemplative practices",
      ],
      testimonials: [],
      tags: [
        "Consciousness development",
        "Masterclass",
        "Coaching",
        "Leadership",
        "Contemplative practice",
      ],
    },
    moduleTitles: [
      [1, "Week 1: From Fragmentation to Wholeness — Opening the Journey"],
      [2, "Week 2: Developmental Stages and States of Consciousness"],
      [3, "Week 3: Building a Developmental Diagnostic"],
      [4, "Week 4: Embodying Mature Identity — Holding Paradox and Complexity"],
      [5, "Week 5: Cross-Mapping Developmental Models"],
      [6, "Week 6: Working from Being — Integration and Practice"],
    ],
  },

  {
    course: {
      slug: "breakthroughs-employee-experience",
      image_url: "/Images/courses/breakthroughs-employee-experience.webp",
      hero_video_url: COURSE_INTRO_VIDEOS["breakthroughs-employee-experience"] ?? null,
      title: "Creating Breakthroughs in Employee Experience",
      tagline:
        "Transform employee engagement by focusing on human potential realization and workplace actualization.",
      description:
        "Help employees discover pathways to self-actualization through their work and take greater responsibility for their experience with the organization.",
      price: 0,
      is_published: true,
      duration_label: "16 hours",
      level: "Advanced",
      rating: 4.9,
      rating_count: 12,
      enrolled_count: 58,
      what_you_will_learn: [
        "Design modern, meaningful employee experiences",
        "Drive breakthroughs in engagement and innovation",
        "Implement human potential development in organizations",
        "Create cultures of self-actualization",
        "Measure and improve key EX metrics",
      ],
      who_this_is_for: [
        "HR leaders",
        "People & Culture professionals",
        "Managers and team leaders",
        "Internal coaches and facilitators",
        "Change agents focused on employee experience",
      ],
      testimonials: [],
      tags: [
        "Employee experience",
        "Human Potential",
        "Engagement",
        "People & Culture",
        "Organizational development",
      ],
    },
    moduleTitles: [
      [1, "Module 1: The Case for Human Potential in Employee Experience"],
      [2, "Module 2: Mapping the Employee Experience Journey"],
      [3, "Module 3: Self-Actualization Through Work"],
      [4, "Module 4: Designing Breakthrough EX Interventions"],
      [5, "Module 5: Building Cultures of Engagement and Innovation"],
      [6, "Module 6: Human Potential Development in Organizations"],
      [7, "Module 7: Measuring and Improving EX Metrics"],
      [8, "Module 8: Implementation and Sustaining Change"],
    ],
  },

  {
    course: {
      slug: "human-potential-team-coach-certification",
      image_url: "/Images/courses/human-potential-team-coach-certification.webp",
      hero_video_url: COURSE_INTRO_VIDEOS["human-potential-team-coach-certification"] ?? null,
      title: "Human Potential Team Coach Certification Training",
      tagline:
        "Become a Certified Human Potential Team Coach and unlock team potential using our proven assessment tools and methodologies.",
      description:
        "This training equips coaches and facilitators to support teams in unleashing their full human potential in service of a common goal.",
      price: 0,
      is_published: true,
      duration_label: "20 hours",
      level: "Expert",
      rating: 5.0,
      rating_count: 8,
      enrolled_count: 42,
      what_you_will_learn: [
        "Master Human Potential assessment tools for teams",
        "Facilitate transformational team conversations",
        "Anchor the 5 essential team measures",
        "Combine powerful facilitation techniques with human potential data",
        "Drive breakthroughs in team collaboration and performance",
      ],
      who_this_is_for: [
        "Team coaches",
        "Internal facilitators and change agents",
        "Leaders working with teams",
        "OD professionals",
        "Anyone facilitating group transformation",
      ],
      testimonials: [],
      tags: [
        "Team coaching",
        "Human Potential",
        "Facilitation",
        "Organizational development",
        "Group transformation",
      ],
    },
    moduleTitles: [
      [1, "Module 1: Introduction to Team Human Potential"],
      [2, "Module 2: The Human Potential Team Assessment Framework"],
      [3, "Module 3: The 5 Essential Team Measures"],
      [4, "Module 4: Assessment Debriefing for Teams"],
      [5, "Module 5: Transformational Team Facilitation"],
      [6, "Module 6: Integrating Data with Facilitation Techniques"],
      [7, "Module 7: Driving Breakthroughs in Team Performance"],
      [8, "Module 8: Certification, Practice & Next Steps"],
    ],
  },
];
