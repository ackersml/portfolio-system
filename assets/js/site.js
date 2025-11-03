async function fetchProjects() {
  try {
    const res = await fetch('content/projects.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load projects.json');
    return await res.json();
  } catch (err) {
    console.error('Projects load error:', err);
    return [];
  }
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
  if (!Array.isArray(projects) || projects.length === 0) {
    const msg = document.createElement('p');
    msg.className = 'notice';
    msg.textContent = 'No projects found. Please refresh the page.';
    grid.parentElement.appendChild(msg);
    return;
  }
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
  // Append early so content shows even if later steps fail
  container.appendChild(article);
  // Rich body content (HTML string)
  if (project.body) {
    const body = document.createElement('div');
    body.innerHTML = project.body;
    article.appendChild(body);
  }

  // Mermaid architecture diagram (inline string or external .mmd file)
  const renderMermaid = (text) => {
    const pre = document.createElement('pre');
    pre.className = 'mermaid';
    pre.textContent = text;
    article.appendChild(pre);
    if (window.mermaid) {
      try {
        if (window.mermaid.run) {
          window.mermaid.run({ nodes: [pre] });
        } else if (window.mermaid.init) {
          window.mermaid.init(undefined, pre);
        }
      } catch (e) {
        const msg = document.createElement('p');
        msg.className = 'notice';
        msg.textContent = 'Diagram unavailable.';
        article.appendChild(msg);
      }
    }
  };
  if (project.diagram) {
    renderMermaid(project.diagram);
  } else if (project.diagramPath) {
    try {
      const resp = await fetch(project.diagramPath, { cache: 'no-store' });
      if (resp.ok) {
        const txt = await resp.text();
        renderMermaid(txt);
      } else {
        const msg = document.createElement('p');
        msg.className = 'notice';
        msg.textContent = 'Diagram unavailable.';
        article.appendChild(msg);
      }
    } catch (e) {
      const msg = document.createElement('p');
      msg.className = 'notice';
      msg.textContent = 'Diagram unavailable.';
      article.appendChild(msg);
    }
  }
}

function init() {
  setYear();
  const page = document.body.getAttribute('data-page');
  if (page === 'projects') renderProjectsPage();
  if (page === 'project') renderProjectPage();
}

document.addEventListener('DOMContentLoaded', init);
