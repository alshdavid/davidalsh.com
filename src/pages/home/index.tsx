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
            {/* <a href={article.slug}> */}
              <button 
                aria-label={article.title}
                class="image" 
                onClick={() => window.location.assign(article.slug)}>
                <img src={article.image} alt="" srcset="" />
              </button>
              <div class="details">
                <button 
                  aria-label={article.title}
                  class="button"
                  onClick={() => window.location.assign(article.slug)}>
                  <span>Read more</span>
                  <svg src="/assets/icons/arrow.svg" svg-replace></svg>
                </button>
                <a href={article.slug}><h2>{article.title}</h2></a>
                <p>{article.description.trim()}</p>
                <div class="tags">
                  {article.tag.map(tag => <div>{tag}</div>)}
                </div>
                <div class="published-date">
                  <span>Published:</span>
                  <time datetime={article.published_time}>{article.published_time_pretty}</time>
                </div>
              </div>
            {/* </a> */}
          </article>
        ))}
      </Fragment>
    );
  };
  render(<App />, document.querySelector("main"));
}
