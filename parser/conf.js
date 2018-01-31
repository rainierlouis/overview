const createEntryFolderPath = (entryPoint) => {
  let entryFolder = entryPoint.split('/');
  entryFolder = entryFolder.slice(0, entryFolder.length - 1);
  return  entryFolder.join('/') + '/';
};
const entryPoint = '/Users/karsten/Documents/CodeWorks/senior/overview/parser/test_data/src/Index.js';
const entryFolder = createEntryFolderPath(entryPoint);

module.exports = {
  entryPoint: entryPoint,
  entryFolder: entryFolder,
}