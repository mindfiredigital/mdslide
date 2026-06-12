import { presentorWindow } from './presentorWindow.js';
export const script = `

<script>

(function () {
  const slides = document.querySelectorAll('.slide');
  const progressBar = document.getElementById('progressBar');
  const hudCounter = document.getElementById('dokCounter');
  const btnPrev = document.getElementById('dokPrev');
  const btnNext = document.getElementById('dokNext');
  const btnFullscreen = document.getElementById('dokFullscreen');
  const btnPresenter = document.getElementById('dokPresenter');

  let current = 0;
  let presenterWindow = null;

  function show(index) {
    slides.forEach(function (s, i) {
      const isCurrent = i === index;
      if (isCurrent) {
        s.classList.add('active');
        s.classList.remove('past');
      } else {
        s.classList.remove('active');
        if (i < index) {
          s.classList.add('past');
        } else {
          s.classList.remove('past');
        }
      }

      // Render time visual scaling calculation
      const content = s.querySelector('.slideContent');
      if (content && isCurrent) {
        content.style.transform = 'none';
        content.style.width = '100%';
        content.style.transformOrigin = 'top left';

        const slideHeight = s.clientHeight;
        const contentHeight = content.scrollHeight;
        const title = s.querySelector('.slideTitle');
        const titleHeight = title ? title.clientHeight : 0;
        const availableHeight = slideHeight - titleHeight - 160;

        if (contentHeight > availableHeight && availableHeight > 0) {
          const scale = availableHeight / contentHeight;
          if (scale >= 0.7) {
            content.style.transform = 'scale(' + scale + ')';
            content.style.width = 100 / scale + '%';
          }
        }
      }
    });

    // Update progress bar width
    if (progressBar && slides.length > 0) {
      const progress = ((index + 1) / slides.length) * 100;
      progressBar.style.width = progress + '%';
    }

    // Update DOK text counter
    if (hudCounter) {
      hudCounter.textContent = index + 1 + ' / ' + slides.length;
    }

    // Update presenter view if open
    updatePresenterContent();
  }

  // Hndler of next slide
  function nextSlide() {
    current = Math.min(current + 1, slides.length - 1);
    show(current);
  }

  // Hndler of previous slide
  function prevSlide() {
    current = Math.max(current - 1, 0);
    show(current);
  }

  // Hndler of the full screen toggle
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(function (err) {
        console.error('Error enabling fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  }

  // Handler of presenter window toggling
  function togglePresenterWindow() {
    if (presenterWindow && !presenterWindow.closed) {
      presenterWindow.close();
      presenterWindow = null;
      return;
    }

    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(function(el) { return el.outerHTML; })
      .join('\\n');

    presenterWindow = window.open('', 'mdslide-presenter-' + Date.now(), 'width=1700,height=800');
    if (!presenterWindow) {
      alert('Pop-up blocked! Please allow pop-ups to open the Presenter View.');
      return;
    }

    presenterWindow.document.write(\`
    ${presentorWindow}
\`);
    presenterWindow.document.close();

    // Call update on open
    updatePresenterContent();
  }

  function updatePresenterContent() {
    if (!presenterWindow || presenterWindow.closed) return;

    const currentSlide = slides[current];
    const nextSlide = slides[current + 1];

    const currentPreview = presenterWindow.document.getElementById('current-preview');
    const nextPreview = presenterWindow.document.getElementById('next-preview');
    const notesContent = presenterWindow.document.getElementById('notes-content');

    if (currentPreview && currentSlide) {
      const clone = currentSlide.cloneNode(true);
      clone.classList.add('active');
      clone.classList.remove('past');
      clone.style.transform = 'none';
      clone.style.opacity = '1';
      currentPreview.innerHTML = '';
      currentPreview.appendChild(clone);
    }

    if (nextPreview) {
      if (nextSlide) {
        const clone = nextSlide.cloneNode(true);
        clone.classList.add('active');
        clone.classList.remove('past');
        clone.style.transform = 'none';
        clone.style.opacity = '1';
        nextPreview.innerHTML = '';
        nextPreview.appendChild(clone);
      } else {
        nextPreview.innerHTML = '<div class="no-next">End of Presentation</div>';
      }
    }

    if (notesContent) {
      const notesElement = currentSlide.querySelector('.notes');
      if (notesElement && notesElement.textContent.trim()) {
        notesContent.innerHTML = notesElement.innerHTML;
      } else {
        notesContent.innerHTML = '<em style="color: #666;">No speaker notes for this slide.</em>';
      }
    }

    if (presenterWindow.scalePreviews) {
      presenterWindow.scalePreviews();
    }
  }

  // Handle messages from presenter window
  window.addEventListener('message', function (e) {
    if (e.data === 'next') {
      nextSlide();
    } else if (e.data === 'prev') {
      prevSlide();
    } else if (e.data === 'togglePresenter') {
      togglePresenterWindow();
    }
  });

  // Navigation of keyBoard
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'f') {
      toggleFullscreen();
    } else if (e.key === 'p' || e.key === 'P') {
      togglePresenterWindow();
    }
  });

  // Floating DOK Display Vislibility on Mouse Move
  if (btnPrev) btnPrev.addEventListener('click', prevSlide);
  if (btnNext) btnNext.addEventListener('click', nextSlide);
  if (btnFullscreen) btnFullscreen.addEventListener('click', toggleFullscreen);
  if (btnPresenter) btnPresenter.addEventListener('click', togglePresenterWindow);

  // Floating DOK Display Visibility on Mouse Move
  let hudTimeout;
  document.body.classList.add('showDok');
  document.addEventListener('mousemove', function () {
    document.body.classList.add('showDok');
    clearTimeout(hudTimeout);
    hudTimeout = setTimeout(function () {
      document.body.classList.remove('showDok');
    }, 2500);
  });

  show(0);
})();

</script>

`;
