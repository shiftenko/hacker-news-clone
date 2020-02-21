import iosSafariFontWeightFix from './ios-safari-font-weight-fix';
import './inject-svg-sprite';

// to make styles consistent before external styles loaded, which anyway takes
// some time
document.addEventListener('DOMContentLoaded', () => {
  iosSafariFontWeightFix();
});
