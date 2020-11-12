export function tree(trees, name) {
  // console.log('树格式化的数据', trees, name);
  let isGet = false;
  let retNode = trees;
  // console.log(''tress,name)
  function deepSearch(trees, name) {
    for (var i = 0; i < trees.length; i++) {
      // console.log('树格式化的数据', trees[i])
      trees[i].id = trees[i].id;
      // if ((trees[i].name.indexOf(name) != -1) || trees[i].name == name || isGet) {
      //   isGet || (retNode = trees[i]);
      //   isGet = true;
      //   break;
      // }
      if (trees[i].child_arr && trees[i].child_arr.length > 0) {
        deepSearch(trees[i].child_arr, name);
      } else if (trees[i].child_arr && (trees[i].child_arr == [] || trees[i].child_arr == '')) {
        delete trees[i].child_arr
      }
    }
  }
  deepSearch(trees, name);
  retNode != null ? retNode : null;
  return retNode;
}