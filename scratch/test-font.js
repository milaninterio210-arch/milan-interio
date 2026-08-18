try {
  const fonts = require('next/font/google');
  console.log("Anek fonts:", Object.keys(fonts).filter(name => name.startsWith('Anek')));
} catch (e) {
  console.error(e);
}
