// to fix next-theme fouc bug, that still seems to be unresolved
// although they say it's fixed in the latest version
// https://github.com/pacocoursey/next-themes/issues/343
// https://github.com/pacocoursey/next-themes/issues/323

// there is a script in the body of the document that sets the theme injected by next-themes
// but that doesnt work so we can write our own and inject it ourselves into ssr
// this means we have 2 scripts doing the same thing, so a potential clashing

// ideally should be doing it via Head from next/document
// but since we don't have a _document.tsx
// we can't do that, so we're doing it here the hacky way
// then injecting it in layout.tsx via Head from next/head

// unminified version of the script, minified via
// https://www.digitalocean.com/community/tools/minify
// safe compression preset ^^
/*
(function() {
    try {
      var theme = localStorage.getItem("theme");
      if (theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch (_) {}
})();
*/
export const ThemeScriptHack = () => {
    return (
        <script
            dangerouslySetInnerHTML={{
                __html: `!function(){try{var e=localStorage.getItem("theme");"dark"===e||!e&&window.matchMedia("(prefers-color-scheme: dark)").matches?document.documentElement.classList.add("dark"):document.documentElement.classList.remove("dark")}catch(e){}}();`,
            }}
        />
    )
}

export default ThemeScriptHack
