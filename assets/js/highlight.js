/* =========================================================================
   Minimal syntax highlighting for <pre><code class="language-*"> blocks.
   No dependencies, no CDN — the site is static by design.

   Strictly additive: this wraps tokens in <span>s and never alters a single
   character of the source. The whitespace in this site's snippets is the
   subject of the writing, not incidental formatting, so `textContent` must
   come out byte-identical to how it went in.

   Degrades cleanly: with JS off the blocks render plain, just uncoloured.
   ========================================================================= */
(function () {
  'use strict';

  var KEYWORDS = /^(?:False|None|True|and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield|match|case)$/;

  var BUILTINS = /^(?:abs|all|any|bin|bool|bytearray|bytes|callable|chr|classmethod|compile|complex|delattr|dict|dir|divmod|enumerate|eval|exec|filter|float|format|frozenset|getattr|hasattr|hash|hex|id|input|int|isinstance|issubclass|iter|len|list|map|max|memoryview|min|next|object|oct|open|ord|pow|print|property|range|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|vars|zip|self|cls|Any|Callable|Dict|Iterable|Iterator|List|Optional|Sequence|Set|Tuple|Union)$/;

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* Scan with sticky regexes in priority order; anything unmatched is emitted
     verbatim so no input can ever be dropped. */
  function scan(src, rules, classify) {
    var out = '';
    var i = 0;

    while (i < src.length) {
      var hit = null;

      for (var r = 0; r < rules.length; r++) {
        rules[r][1].lastIndex = i;
        var m = rules[r][1].exec(src);
        if (m && m.index === i && m[0].length) {
          hit = { kind: rules[r][0], text: m[0] };
          break;
        }
      }

      if (!hit) {                      // unmatched char — pass it straight through
        out += esc(src.charAt(i));
        i += 1;
        continue;
      }

      var cls = classify ? classify(hit.kind, hit.text, src, i) : hit.kind;
      out += cls
        ? '<span class="tok-' + cls + '">' + esc(hit.text) + '</span>'
        : esc(hit.text);
      i += hit.text.length;
    }

    return out;
  }

  var PYTHON_RULES = [
    ['com', /#[^\n]*/y],
    ['str', /[rRbBuUfF]{0,3}(?:"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\[\s\S]|[^"\\\n])*"|'(?:\\[\s\S]|[^'\\\n])*')/y],
    ['num', /(?:0[xX][0-9a-fA-F_]+|0[bB][01_]+|0[oO][0-7_]+|\d[\d_]*\.?[\d_]*(?:[eE][+-]?\d+)?[jJ]?)/y],
    ['dec', /@[A-Za-z_][\w.]*/y],
    ['wrd', /[A-Za-z_]\w*/y],
    ['op',  /[-+*/%=<>!&|^~:,.;]+/y],
    ['pun', /[()[\]{}]/y]
  ];

  function classifyPython(kind, text, src, at) {
    if (kind !== 'wrd') return kind;
    if (KEYWORDS.test(text)) return 'kw';
    if (BUILTINS.test(text)) return 'bi';
    /* a bare name immediately followed by "(" is a call or a definition */
    if (/^\s*\(/.test(src.slice(at + text.length))) return 'fn';
    return null;
  }

  var BIBTEX_RULES = [
    ['kw',  /@[A-Za-z]+/y],
    ['str', /"(?:\\[\s\S]|[^"\\])*"/y],
    ['bi',  /[A-Za-z_][\w-]*(?=[ \t]*=)/y],
    ['num', /\d+/y],
    ['wrd', /[A-Za-z_][\w-]*/y],
    ['op',  /[=,]/y],
    ['pun', /[{}]/y]
  ];

  function classifyBibtex(kind) {
    return kind === 'wrd' ? null : kind;
  }

  var LANGS = {
    python: [PYTHON_RULES, classifyPython],
    bibtex: [BIBTEX_RULES, classifyBibtex]
  };

  function run() {
    var blocks = document.querySelectorAll('pre > code[class*="language-"]');

    Array.prototype.forEach.call(blocks, function (code) {
      var name = (code.className.match(/language-([\w-]+)/) || [])[1];
      var lang = LANGS[name];
      if (!lang) return;

      var before = code.textContent;
      var html = scan(before, lang[0], lang[1]);

      /* Refuse to touch the block if highlighting would change the text.
         Colour is never worth corrupting a code sample. */
      var probe = document.createElement('div');
      probe.innerHTML = html;
      if (probe.textContent !== before) return;

      code.innerHTML = html;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
