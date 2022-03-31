export default async function(path, match) {
  const main = document.querySelector('main');
 
  main.classList.add('is-loading');
  let _path;
  if (path === 'adminPanel') {
    _path = 'dashboard';
  } else {
    _path = path;
  }

  const { default: Page } = await import(/* webpackChunkName: "[request]" */`../pages/${_path}/index.js`);
  
  const page = new Page(match[1]);
  const element = await page.render();

  main.classList.remove('is-loading');

  const contentNode = document.querySelector('#content');

  contentNode.innerHTML = '';
  contentNode.append(element);

  return page;
}
