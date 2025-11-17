(function () {
  const container = document.querySelector('[data-gallery-root]');
  if (!container) return;

  const DATA_URL = 'data/fun-gallery.json';

  fetch(DATA_URL)
    .then((res) => {
      if (!res.ok) {
        throw new Error('Unable to load gallery data');
      }
      return res.json();
    })
    .then((payload) => {
      const sections = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.sections)
        ? payload.sections
        : [];

      if (!sections.length) {
        renderNotice('No gallery entries yet. Add some to data/fun-gallery.json.');
        return;
      }

      sections.forEach((section) => container.appendChild(renderSection(section)));
    })
    .catch((error) => {
      console.warn(error);
      renderNotice(
        'Unable to load gallery data. If you are viewing this file locally, start a local server or deploy it (fetch requests are blocked when using the file:// protocol).'
      );
    });

  function renderSection(section) {
    const wrapper = document.createElement('section');
    wrapper.className = 'card stack';

    const header = document.createElement('div');
    header.className = 'stack';

    const title = document.createElement('h2');
    title.textContent = section?.title ?? 'Untitled section';
    header.appendChild(title);

    if (section?.description) {
      const desc = document.createElement('p');
      desc.className = 'lead';
      desc.textContent = section.description;
      header.appendChild(desc);
    }

    wrapper.appendChild(header);

    if (!Array.isArray(section?.items) || !section.items.length) {
      const empty = document.createElement('p');
      empty.className = 'notice';
      empty.textContent = 'No photos yet for this section.';
      wrapper.appendChild(empty);
      return wrapper;
    }

    const grid = document.createElement('div');
    grid.className = 'gallery-grid';

    section.items.forEach((item) => grid.appendChild(renderFigure(item)));

    wrapper.appendChild(grid);
    return wrapper;
  }

  function renderFigure(item) {
    const figure = document.createElement('figure');
    figure.className = 'gallery-card';

    if (item?.presentation === 'wide') {
      figure.classList.add('wide');
    }

    const mediaWrapper = item?.href
      ? createAnchor(item.href)
      : document.createElement('div');

    if (!item?.href) {
      mediaWrapper.className = 'gallery-media';
    }

    const img = document.createElement('img');
    img.loading = 'lazy';
    img.decoding = 'async';
    img.src = item?.src ?? '';
    img.alt = item?.alt ?? '';

    mediaWrapper.appendChild(img);
    figure.appendChild(mediaWrapper);

    if (item?.caption) {
      const caption = document.createElement('p');
      caption.textContent = item.caption;
      figure.appendChild(caption);
    }

    return figure;
  }

  function createAnchor(href) {
    const link = document.createElement('a');
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    return link;
  }

  function renderNotice(message) {
    const notice = document.createElement('p');
    notice.className = 'notice';
    notice.textContent = message;
    container.appendChild(notice);
  }
})();
