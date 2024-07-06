import { h, Fragment, render } from "preact";
import { fetchArticles } from "../../scripts/meta.js";
import { useEffect } from "preact/hooks";
import { runSvgReplace } from "../../scripts/svg-replace.js";

export async function initHomePage() {
  const articles = await fetchArticles();

  const App = () => {
    useEffect(() => {
      runSvgReplace();
    }, [articles]);

    return (
      <Fragment>
        {articles.map((article, i) => (
          <article key={article.slug}>
            <a href={article.slug}>
              <img src={article.image} alt="" srcset="" />
              <div class="details">
                <h2>{article.title}</h2>
                {/* <time>{article.published_time_pretty}</time> */}
                <p>{article.description}</p>
                <div class="foot">
                  <div>
                    
                  </div>
                  <button>
                    Read<svg src="/assets/icons/arrow.svg" svg-replace></svg>
                  </button>
                </div>
              </div>
            </a>
          </article>
        ))}
      </Fragment>
    );
  };
  render(<App />, document.querySelector("main"));
}
