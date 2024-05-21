import Vue from 'vue'
import store from '../store/index'
import VueRouter from 'vue-router'
import SideBar from '@/components/sideBar/index.vue'
import dash from '@/views/dash/index.vue'
import LogIn from "@/views/User/Login.vue"
import register from "@/views/User/register.vue"
import forget from "@/views/User/forget.vue"
import userManage from "@/components/tab/manager/userManage.vue"
import inform from "@/components/tab/manager/inform.vue"
import unauthorized from "@/views/404.vue"
import TaskManage from "@/components/tab/TaskManage.vue";
import dataManage from "@/components/tab/dataManage.vue";
import DisFactor from "@/components/tab/DisFactor.vue"
import F_Factor from "@/components/tab/F_Factor.vue";
import FactorDis from "@/components/tab/FactorDis.vue";
import tableManage from "@/components/tab/tableManage.vue";
// import userManage from "@/components/tab/userManage.vue"; 老的用户管理，整合完新的后可删除
import TaskResult from "@/components/tab/subcomponents/TaskResult.vue";
import AdminDataManage from "@/components/tab/manager/AdminDataManage.vue";
import DisSetting from "@/components/tab/manager/DisSetting.vue";
import LogManage from "@/components/tab/manager/LogManage.vue";
import SoftwareIntro from "@/components/tab/SoftwareIntro.vue";
import Operation from "@/components/tab/Operation.vue";
import updatePassword from "@/components/tab/updatePassword.vue";
import userCenter from "@/components/tab/userCenter.vue";
import { getRequest } from '@/api/user'
Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    // name: "LogIn",
    // component: LogIn,
    redirect: "/sideBar",
  },
  {
    path: "/register",
    name: "register",
    component: register,
  },
  // {
  //   path: "/register",
  //   name: "Register",
  //   component: Register,
  // },
  {
    path: '/forget',
    name: 'forget',
    component: forget
  },
  {
     path: "/sideBar",
    //path: "/SoftwareIntro",
    name: "SideBar",
    redirect: "/SoftwareIntro",
    component: SideBar,
    meta: { roles: ['1', '0'] }, // 只允许管理员0和普通用户1访问
    children: [
      {
        path: '/unauthorized',
        name: 'unauthorized',
        component: unauthorized,
        meta: { roles: ['1', '0'] },
      },
      {
        path: "/dash",
        name: "dash",
        component: dash,
        meta: { roles: ['1', '0'] },
      },
      {
        path: "/tableManage",
        name: "tableManage",
        component: tableManage,
        // meta: { roles: ['1', '0'] },
      },
      {
        path: "/dataManage",
        name: "dataManage",
        component: dataManage,
        meta: { roles: ['1', '0'] },
      },
      {
        path: "/updatePassword",
        name: "updatePassword",
        component: updatePassword,
        meta: { roles: ['0'] },
      },
      {
        path: "/userCenter",
        name: "userCenter",
        component: userCenter,
        meta: { roles: ['0'] },
      },
      {
        path: "/AdminDataManage",
        name: "AdminDataManage",
        component: AdminDataManage,
        meta: { roles: ['0'] },
      },
      {
        path: "/userManage",
        name: "userManage",
        component: userManage,
        meta: { roles: ['0'] },
      },
      {
        path: "/SoftwareIntro",
        name: "SoftwareIntro",
        component: SoftwareIntro,
        meta: { roles: ['1', '0'] },
      },
      {
        path: "/Operation",
        name: "Operation",
        component: Operation,
        meta: { roles: ['1', '0'] },
      },
      {
        path: "/TaskManage",
        name: "TaskManage",
        component: TaskManage,
        meta: { roles: ['1', '0'] },
      },
      {
        path: "/TaskResult",
        name: "TaskResult",
        component: TaskResult,
        meta: { roles: ['1', '0'] },
      },
      {
        path: "/DisFactor",
        name: "DisFactor",
        component: DisFactor,
        meta: { roles: ['1', '0'] },
      },
      {
        path: "/F_Factor",
        name: "F_Factor",
        component: F_Factor,
        meta: { roles: ['1', '0'] },
      },
      {
        path: "/FactorDis",
        name: "FactorDis",
        component: FactorDis,
        meta: { roles: ['1', '0'] },
      },
      {
        path: "/DisSetting",
        name: "DisSetting",
        component: DisSetting,
        meta: { roles: ['0'] },
      },
      {
        path: "/LogManage",
        name: "LogManage",
        component: LogManage,
        meta: { roles: ['0'] },
      },
      {
        path: "/inform",
        name: "inform",
        component: inform,
        meta: { roles: ['0'] },
      },
    ],
  },
];

const router = new VueRouter({
  routes
})

const whiteList = ['/logIn', '/register', '/unauthorized', '/forget'];

router.beforeEach(async (to, from, next) => {
  try {
    //无权限页面不需要判断用户信息就放行
    if(to.path == '/unauthorized'){
      return next();
    }

    // 检查 session 里的用户信息
    const username = sessionStorage.getItem('username');
    // 如果没有用户信息
    if (!username) {
      // 检查 URL 参数
      const repKey = to.query?.repKey;
      console.log("repKey:", repKey);
      if (repKey) {
        // 绵阳单点登录
        const resp = await getRequest(`/login?repKey=${repKey}`);
        if (resp) {
          console.log("后台回复的code", resp.code);
          console.log("后台回复的UserName", resp.data.username);
          console.log("后台回复的UserCode", resp.data.uid);
          if (resp.code == "200") {
            sessionStorage.setItem("username", resp.data.username);
            sessionStorage.setItem("userid", resp.data.uid);
            sessionStorage.setItem("userrole", resp.data.role);
            return next('/SoftwareIntro'); // 跳转到 SoftwareIntro 页面
          } else {
            return next('/unauthorized');
          }
        } else {
          return next('/unauthorized');
        }
      } else {
        // 跳转到未授权页面
        return next({ path: '/unauthorized' });
      }
    } else {
      // 如果有用户信息
      //修正侧边栏高亮
      if (to.path === "/TaskResult") {
        store.commit("SetSideBarPath", "/taskManage");
      } else {
        store.commit("SetSideBarPath", to.path);
      }
      const userRoles = sessionStorage.getItem('userrole'); // 从 sessionStorage 获取用户角色信息
      let record = to.matched[to.matched.length - 1]; // 获取当前匹配路由的最右侧路由

      if (record.meta.roles) {
        // 检查用户角色是否在路由允许的角色列表中
        if (record.meta.roles.includes(userRoles)) {
          return next(); // 如果找到匹配的角色，设置权限标志为 true
        }else{
          return next('/unauthorized'); // 用户无权限，重定向到未授权页面
        }
      }else{
        return next(); // 如果没有定义 roles 元数据，允许所有用户访问
      }
    }
  } catch (error) {
    // 如果代码有问题，可以在这里捕获并处理错误
    console.error('导航守卫出错:', error);
    // 跳转到未授权页面
    return next({ path: '/unauthorized' });
  }
});


export default router
