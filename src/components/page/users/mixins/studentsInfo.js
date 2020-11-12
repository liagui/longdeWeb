export const studentsInfo = {
  data() {
    return {
      stuStatus: [
        { label: "全部", value: 0 },
        { label: "启用", value: 1 },
        { label: "禁用", value: 2 }
      ],
      signupStatus: [
        { label: "全部", value: 0 },
        { label: "已报名", value: 1 },
        { label: "未报名", value: 2 }
      ],
      state_statusArr: [
        { label: "全部", value: 3 },
        { label: "均未开课", value: 0 },
        { label: "部分开课", value: 1 },
        { label: "全部开课", value: 2 }
      ],
     
    }
  }
}