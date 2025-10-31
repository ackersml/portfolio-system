async function fetchProjects() {
  const res = await fetch('content/projects.json', { cache: 'no-store' });
  return res.json();
}

function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}

function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function createProjectCard(project) {
  const a = document.createElement('a');
  a.href = `project.html?slug=${encodeURIComponent(project.slug)}`;
  a.className = 'card';
  const title = document.createElement('h3');
  title.textContent = project.title;
  const summary = document.createElement('p');
  summary.textContent = project.summary || '';
  const tags = document.createElement('div');
  (project.tags || []).forEach(t => {
    const b = document.createElement('span');
    b.className = 'badge';
    b.textContent = t;
    tags.appendChild(b);
  });
  a.appendChild(tags);
  a.appendChild(title);
  a.appendChild(summary);
  return a;
}

async function renderProjectsPage() {
  const grid = document.querySelector('#projects-grid');
  if (!grid) return;
  const projects = await fetchProjects();
  projects.forEach(p => grid.appendChild(createProjectCard(p)));
}

async function renderProjectPage() {
  const container = document.querySelector('#project-container');
  if (!container) return;
  const slug = getQueryParam('slug');
  const projects = await fetchProjects();
  const project = projects.find(p => p.slug === slug);
  if (!project) {
    container.innerHTML = `<p class="notice">Project not found.</p>`;
    return;
    }
  // Update document title and meta tags for SEO/social
  document.title = `${project.title} — Project`;
  const ensureMeta = (selector, createFn) => {
    let el = document.querySelector(selector);
    if (!el) { el = createFn(); document.head.appendChild(el); }
    return el;
  };
  ensureMeta('meta[name="description"]', () => {
    const m = document.createElement('meta'); m.setAttribute('name','description'); return m;
  }).setAttribute('content', project.summary || 'Project case study.');
  ensureMeta('meta[property="og:title"]', () => {
    const m = document.createElement('meta'); m.setAttribute('property','og:title'); return m;
  }).setAttribute('content', project.title);
  ensureMeta('meta[property="og:description"]', () => {
    const m = document.createElement('meta'); m.setAttribute('property','og:description'); return m;
  }).setAttribute('content', project.summary || 'Project case study.');
  ensureMeta('meta[name="twitter:title"]', () => {
    const m = document.createElement('meta'); m.setAttribute('name','twitter:title'); return m;
  }).setAttribute('content', project.title);
  ensureMeta('meta[name="twitter:description"]', () => {
    const m = document.createElement('meta'); m.setAttribute('name','twitter:description'); return m;
  }).setAttribute('content', project.summary || 'Project case study.');

  const article = document.createElement('article');
  article.className = 'article';
  article.innerHTML = `
    <div class="breadcrumbs"><a href="projects.html">Portfolio</a> / ${project.title}</div>
    <h1>${project.title}</h1>
    <p>${project.summary || ''}</p>
  `;
  const tags = document.createElement('p');
  (project.tags || []).forEach(t => {
    const b = document.createElement('span');
    b.className = 'badge';
    b.textContent = t;
    tags.appendChild(b);
  });
  article.appendChild(tags);

  const pdfLink = (project.links || []).find(l => /pdf/i.test(l.label) || /\.pdf$/i.test(l.url));
  if (pdfLink) {
    const frame = document.createElement('iframe');
    frame.className = 'pdf-embed';
    frame.src = pdfLink.url;
    frame.title = `${project.title} — PDF`;
    article.appendChild(frame);
    const fallback = document.createElement('p');
    fallback.className = 'notice';
    fallback.innerHTML = `If the PDF does not load, <a href="${pdfLink.url}">open it directly</a>.`;
    article.appendChild(fallback);
  }

  container.appendChild(article);
}

function init() {
  setYear();
  const page = document.body.getAttribute('data-page');
  if (page === 'projects') renderProjectsPage();
  if (page === 'project') renderProjectPage();
}

document.addEventListener('DOMContentLoaded', init);
