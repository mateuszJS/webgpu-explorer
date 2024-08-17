import Parser from 'css-simple-parser';
import stripCssComments from 'strip-css-comments';

// Remove this laoder when Safari starts supporting nested tags selector in css
// https://issues.chromium.org/issues/40261706

const elementTag = /^[a-z]/

export default function loader(source) {
  const ast = Parser.parse (stripCssComments(source));
  Parser.traverse ( ast, node => {
    const isNested = !!node.parent.parent && !node.parent.selector.startsWith('@')

    if (isNested) {
      const newSelector = node.selector.split(',')
        .map(s => elementTag.test(s.trim()) ? `& ${s}` : s)
        .join(',')
      node.selector = newSelector
    }
  });

  return Parser.stringify ( ast );
}