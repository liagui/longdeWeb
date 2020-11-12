import request, {
  Method
} from "./request"

/**
 * @api schoolSet 
 */

/**
 * 网校设置
 */
export function setConfig(data) {
  return request({
    url: "/school/setConfig",
    method: Method.POST,
    data
  });
}

/**
 * 获取网校设置
 */
export function getConfig(data) {
  return request({
    url: "/school/getConfig",
    method: Method.POST,
    data
  });
}

/**
 * 获取网校SEO设置
 */
export function getSEOConfig(data) {
  return request({
    url: "/school/getSEOConfig",
    method: Method.POST,
    data
  });
}

/**
 * 网校SEO设置
 */
export function setPageSEOConfig(data) {
  return request({
    url: "/school/setPageSEOConfig",
    method: Method.POST,
    data
  });
}

/**
 * 网校SEO开关
 */
export function setSEOOpen(data) {
  return request({
    url: "/school/setSEOOpen",
    method: Method.POST,
    data
  });
}


/**
 * 自定义页面-列表
 */
export function customPageList(data) {
  return request({
    url: "/pageset/getList",
    method: Method.POST,
    data
  });
}

/**
 * 自定义页面-详情
 */
export function customPageDetail(data) {
  return request({
    url: "/pageset/details",
    method: Method.POST,
    data
  });
}

/**
 * 自定义页面-添加
 */
export function customPageAdd(data) {
  return request({
    url: "/pageset/addInfo",
    method: Method.POST,
    data
  });
}

/**
 * 自定义页面-编辑
 */
export function customPageEdit(data) {
  return request({
    url: "/pageset/editInfo",
    method: Method.POST,
    data
  });
}

/**
 * 自定义页面-删除
 */
export function customPageDel(data) {
  return request({
    url: "/pageset/delInfo",
    method: Method.POST,
    data
  });
}

/**
 * 自定义页面-状态
 */
export function customPageStatus(data) {
  return request({
    url: "/pageset/openInfo",
    method: Method.POST,
    data
  });
}



/**
 * 课程学科
 */
export function getSubject(data) {
  return request({
    url: "/subject",
    method: Method.POST,
    data
  });
}

/**
 * 课程列表
 */
export function getCourseList(data) {
  return request({
    url: "/course/courseListByIndexSet",
    method: Method.POST,
    data
  });
}

/**
 * 新闻信息
 */
export function getArticleList(data) {
  return request({
    url: "/article/getListByIndexSet",
    method: Method.POST,
    data
  });
}

/**
 * 教师列表
 */
export function getTeacherList(data) {
  return request({
    url: "/teacher/getListByIndexSet",
    method: Method.POST,
    data
  });
}