import { list, put } from '@vercel/blob';

/*
  These are the same defaults the site shipped with. If no one has
  ever saved anything through /admin.html yet (no content.json blob
  exists), GET returns this so the site still has real copy on it.
  Once you save from the admin page once, the saved version takes
  over permanently.
*/
const DEFAULTS = {
  brandName: "Desya Design Studio",
  brandSub: "Interior Architecture",
  brandMark: "D",
  accent: "#c7a66b",

  heroKicker: "Desya Design Studio · Bengaluru",
  heroTitle: "Spaces with {accent}, designed for living.",
  heroTitleAccent: "soul",
  heroDescription: "Bespoke residential and commercial interiors created with considered materials, timeless detailing and a distinctly modern point of view.",
  heroImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=90",
  heroProjectCategory: "Featured Interior",
  heroProjectTitle: "A study in material, light & proportion.",

  stat1: "01",
  statLabel1: "Design-led",
  stat2: "02",
  statLabel2: "Turnkey",
  stat3: "03",
  statLabel3: "Bengaluru",

  servicesTitle: "Designed.|Detailed.|Delivered.",
  servicesDescription: "From the first sketch to the final styling, our approach brings design, execution and craftsmanship together under one roof.",

  residentialTitle: "Residential Turnkey",
  residentialDescription: "Personal homes designed around how you live, combining architecture, interiors, furniture, lighting and finishing details into one cohesive experience.",
  residentialTags: "Apartments, Villas, Penthouses, Renovations",

  commercialTitle: "Commercial Turnkey",
  commercialDescription: "Thoughtful workspaces and hospitality environments designed to strengthen your brand, improve experience and perform beautifully every day.",
  commercialTags: "Offices, Retail, Hospitality, Studios",

  projectTitle1: "The Indiranagar Penthouse",
  projectCategory1: "Residential · Indiranagar",
  projectImage1: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1500&q=90",

  projectTitle2: "Whitefield Villa",
  projectCategory2: "Residential · Whitefield",
  projectImage2: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=90",

  projectTitle3: "More Stories",
  projectCategory3: "Studio · Bengaluru",
  projectImage3: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=90",

  aboutTitle: "Interiors with {accent}",
  aboutTitleAccent: "intention.",
  aboutDescription: "Desya Design Studio creates thoughtful interiors that balance function, atmosphere and timeless aesthetics. Every project is shaped around the people who inhabit it.",
  aboutCard: "A design studio focused on meaningful spaces, refined material palettes and details that age beautifully.",

  pointTitle1: "Concept to completion",
  pointText1: "A cohesive design journey from planning to final styling.",
  pointTitle2: "Material intelligence",
  pointText2: "Textures, finishes and details selected with purpose.",
  pointTitle3: "Personal expression",
  pointText3: "Spaces that feel specific to the client, not generic.",
  pointTitle4: "Turnkey execution",
  pointText4: "Design and execution coordinated for a smoother experience.",

  contactTitle: "Let's create something {accent}",
  contactTitleAccent: "remarkable.",
  contactDescription: "Tell us a little about your project. We'll get in touch to understand your space, aspirations and requirements.",

  phone: "+91 79818 63571",
  email: "desysstudio@gmail.com",
  instagram: "desyastudio",
  address: "Bengaluru, Karnataka, India",

  qrImage: ""
};

const CONTENT_PATHNAME = 'content.json';

async function readContent() {

  try {

    const { blobs } = await list({ prefix: CONTENT_PATHNAME, limit: 1 });

    if (blobs && blobs.length > 0) {
      const response = await fetch(blobs[0].url, { cache: 'no-store' });
      if (response.ok) {
        const saved = await response.json();
        return Object.assign({}, DEFAULTS, saved);
      }
    }

  } catch (error) {
    // Fall through to defaults if Blob isn't set up yet or the read fails.
  }

  return DEFAULTS;

}

export default async function handler(req, res) {

  if (req.method === 'GET') {
    const content = await readContent();
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(content);
    return;
  }

  if (req.method === 'POST') {

    const password = req.headers['x-admin-password'];

    if (!process.env.ADMIN_PASSWORD) {
      res.status(500).json({ error: 'Admin password is not configured on the server yet.' });
      return;
    }

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {

      const payload = Object.assign({}, DEFAULTS, req.body);

      await put(CONTENT_PATHNAME, JSON.stringify(payload), {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: false,
        allowOverwrite: true
      });

      res.status(200).json({ ok: true });

    } catch (error) {
      res.status(500).json({ error: 'Could not save content: ' + error.message });
    }

    return;
  }

  res.status(405).json({ error: 'Method not allowed' });

}
