const links = [
  {
    title: "Notion Class Note",
    description: "수업 진도, 예제 코드, 과제 안내를 정리해두는 노션 페이지입니다.",
    category: "수업 노트",
    url: "https://confusion-quarter-558.notion.site/C-3659f39faea3802d987dc039fd3bff57?source=copy_link",
    icon: "NO",
    color: "#1e8a78",
  },
  {
    title: "Google Drive Folder",
    description: "실습 파일, 예제 코드, 참고 자료를 모아두는 구글 드라이브 폴더입니다.",
    category: "자료실",
    url: "https://drive.google.com/drive/folders/1pogEgYC-D8-jG52VyDVRu_DWPSP4ZdT1?usp=sharing",
    icon: "DR",
    color: "#dba94c",
  },
];

const categories = ["전체", ...new Set(links.map((link) => link.category))];
const tabs = document.querySelector("#categoryTabs");
const grid = document.querySelector("#linkGrid");
const linkCount = document.querySelector("#linkCount");
const shareButton = document.querySelector("#shareButton");
const toast = document.querySelector("#toast");

let selectedCategory = "전체";
let toastTimer;

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
}

function renderTabs() {
  tabs.innerHTML = categories
    .map(
      (category) => `
        <button
          class="category-tab"
          type="button"
          role="tab"
          aria-selected="${category === selectedCategory}"
          data-category="${category}"
        >
          ${category}
        </button>
      `,
    )
    .join("");
}

function renderLinks() {
  const visibleLinks =
    selectedCategory === "전체"
      ? links
      : links.filter((link) => link.category === selectedCategory);

  linkCount.textContent = links.length;
  grid.innerHTML = visibleLinks
    .map(
      (link) => `
        <article class="link-card">
          <div class="card-top">
            <span class="category-pill">
              <span class="category-dot" style="background: ${link.color}"></span>
              ${link.category}
            </span>
            <span class="card-icon" aria-hidden="true">${link.icon}</span>
          </div>
          <div>
            <h3>${link.title}</h3>
            <p>${link.description}</p>
          </div>
          <a class="visit-link" href="${link.url}" target="_blank" rel="noreferrer">
            바로가기 <span aria-hidden="true">↗</span>
          </a>
        </article>
      `,
    )
    .join("");
}

tabs.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-category]");

  if (!button) {
    return;
  }

  selectedCategory = button.dataset.category;
  renderTabs();
  renderLinks();
});

shareButton.addEventListener("click", async () => {
  const shareData = {
    title: document.title,
    text: "대동고 C언어 수업 자료 링크와 기본 개념 정리 페이지입니다.",
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      showToast("페이지 링크가 클립보드에 복사되었습니다.");
      return;
    }
  } catch (error) {
    if (error.name === "AbortError") {
      return;
    }
  }

  showToast("주소창의 페이지 링크를 복사해서 공유할 수 있습니다.");
});

renderTabs();
renderLinks();
